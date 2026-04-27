import { NextResponse } from "next/server";

// Returns null if origin is OK, or a 403 NextResponse if not.
// Allows requests with no Origin header (curl, server-to-server, same-origin
// fetches in some browsers) — Origin is only present on cross-origin requests.
export function assertSameOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const allowed = new Set<string>();
  if (appUrl) allowed.add(new URL(appUrl).origin);

  // Always allow the request's own host (covers preview deployments, custom
  // domains, etc.) — derive from the Host header.
  const host = request.headers.get("host");
  if (host) {
    allowed.add(`https://${host}`);
    allowed.add(`http://${host}`);
  }

  if (!allowed.has(origin)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  return null;
}
