import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAndGrantPaymentByPageUid } from "@/lib/payplus/verify";

// Landing target after a successful PayPlus payment.
//
// PayPlus sends this as POST with a form-encoded body containing the IPN
// data (page_request_uid, transaction_uid, status_code, etc). The slug we
// added to the URL is in the query string. We have to read both.
//
// We then 303-redirect (NOT 307) to the catalog page so the browser switches
// to GET, preserving the auth cookie on the navigation.

const PARAM_KEYS_PAGE_UID = [
  "page_request_uid",
  "payment_request_uid",
  "payment_page_request_uid",
  "uid",
];

export async function GET(request: Request) {
  return handle(request, {});
}

export async function POST(request: Request) {
  const body = await readPostBody(request);
  return handle(request, body);
}

async function handle(request: Request, body: Record<string, unknown>) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") || "";
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || `${url.protocol}//${url.host}`;

  // Combine query and body, body takes precedence (PayPlus IPN data lives
  // there). Log everything for diagnostics.
  const merged: Record<string, unknown> = {};
  url.searchParams.forEach((v, k) => {
    merged[k] = v;
  });
  for (const [k, v] of Object.entries(body)) {
    merged[k] = v;
  }

  console.log("payments/success received:", {
    method: request.method,
    slug,
    keys: Object.keys(merged),
    payload: maskSensitive(merged),
  });

  const pageRequestUid = extractPageRequestUid(merged);

  if (pageRequestUid) {
    try {
      const supabase = createAdminClient();
      const result = await verifyAndGrantPaymentByPageUid(
        supabase,
        pageRequestUid
      );
      if (!result.ok) {
        console.error("payments/success verify failed:", result.reason, {
          pageRequestUid,
          slug,
        });
      } else {
        console.log("payments/success granted:", {
          pageRequestUid,
          slug,
          alreadyCompleted: !!result.alreadyCompleted,
        });
      }
    } catch (e) {
      console.error("payments/success threw:", e);
    }
  } else {
    console.warn("payments/success: no page_request_uid found", {
      method: request.method,
      query: Object.fromEntries(url.searchParams),
      bodyKeys: Object.keys(body),
    });
  }

  // 303 forces the browser to switch to GET on the redirect — without this,
  // a POST redirect would re-POST to the catalog page and many browsers strip
  // cookies on cross-method navigation. Pass the page UID through so the
  // catalog page can run a fallback verification if needed.
  const target = new URL(
    slug ? `${appUrl}/catalog/${slug}` : `${appUrl}/courses`
  );
  target.searchParams.set("payment", "success");
  if (pageRequestUid) target.searchParams.set("pid", pageRequestUid);

  return NextResponse.redirect(target.toString(), { status: 303 });
}

async function readPostBody(request: Request): Promise<Record<string, unknown>> {
  const ct = request.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      return (await request.json()) as Record<string, unknown>;
    }
    if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      const out: Record<string, unknown> = {};
      form.forEach((v, k) => {
        out[k] = typeof v === "string" ? v : "";
      });
      return out;
    }
    // Unknown content type — try text and parse as either JSON or querystring.
    const text = await request.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      const out: Record<string, unknown> = {};
      new URLSearchParams(text).forEach((v, k) => {
        out[k] = v;
      });
      return out;
    }
  } catch (e) {
    console.error("payments/success: body read failed:", e);
    return {};
  }
}

function extractPageRequestUid(payload: Record<string, unknown>): string | null {
  // Top-level keys
  for (const key of PARAM_KEYS_PAGE_UID) {
    const v = payload[key];
    if (typeof v === "string" && v.length > 0) return v;
  }

  // Nested under transaction.* (PayPlus sometimes nests the IPN payload).
  const txn = payload.transaction as Record<string, unknown> | undefined;
  if (txn && typeof txn === "object") {
    for (const key of PARAM_KEYS_PAGE_UID) {
      const v = txn[key];
      if (typeof v === "string" && v.length > 0) return v;
    }
  }

  // Form-style flattened (e.g., "transaction[page_request_uid]")
  for (const key of PARAM_KEYS_PAGE_UID) {
    for (const flatKey of [
      `transaction[${key}]`,
      `data[${key}]`,
      `data[transaction][${key}]`,
    ]) {
      const v = payload[flatKey];
      if (typeof v === "string" && v.length > 0) return v;
    }
  }

  return null;
}

function maskSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (/credit|card|cvv|pan|token/i.test(k)) {
      out[k] = "***";
    } else if (typeof v === "string" && v.length > 200) {
      out[k] = v.slice(0, 200) + "...";
    } else {
      out[k] = v;
    }
  }
  return out;
}
