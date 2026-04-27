import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Upstash Redis-backed rate limiter when env vars are present, otherwise an
// in-memory fallback that works on a single Lambda instance. The fallback is
// best-effort — on a serverless platform with many warm instances each gets
// its own counter, so the effective ceiling is N×limit. Still better than
// nothing for spam protection. For real abuse-resistance, set:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// in Vercel env (free tier at upstash.com is plenty).

type LimitResult = { success: boolean; remaining: number };

const upstashAvailable = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

// Cache constructed limiters per (limit, windowSec) so we don't recreate them.
const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(limit: number, windowSec: number): Ratelimit {
  const key = `${limit}:${windowSec}`;
  let l = upstashLimiters.get(key);
  if (!l) {
    l = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      analytics: false,
      prefix: "rl:floor-dana",
    });
    upstashLimiters.set(key, l);
  }
  return l;
}

// In-memory fallback. Map<key, { count, resetAt }>.
const memBuckets = new Map<string, { count: number; resetAt: number }>();

function memCheck(key: string, limit: number, windowSec: number): LimitResult {
  const now = Date.now();
  const bucket = memBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    memBuckets.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { success: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { success: false, remaining: 0 };
  }
  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

// Periodic cleanup of expired in-memory buckets so the map doesn't grow
// unbounded. Runs at most once per minute.
let lastSweep = 0;
function sweepMem() {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of memBuckets) {
    if (v.resetAt < now) memBuckets.delete(k);
  }
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function checkRateLimit(
  request: Request,
  bucket: string,
  limit: number,
  windowSec: number
): Promise<LimitResult> {
  const ip = getClientIp(request);
  const key = `${bucket}:${ip}`;

  if (upstashAvailable) {
    try {
      const r = await getUpstashLimiter(limit, windowSec).limit(key);
      return { success: r.success, remaining: r.remaining };
    } catch (e) {
      console.error("rate limit (upstash) failed, allowing:", e);
      return { success: true, remaining: limit };
    }
  }

  sweepMem();
  return memCheck(key, limit, windowSec);
}

// Helper: returns 429 NextResponse if blocked, else null.
export async function rateLimitOr429(
  request: Request,
  bucket: string,
  limit: number,
  windowSec: number
): Promise<NextResponse | null> {
  const r = await checkRateLimit(request, bucket, limit, windowSec);
  if (!r.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(windowSec),
        },
      }
    );
  }
  return null;
}
