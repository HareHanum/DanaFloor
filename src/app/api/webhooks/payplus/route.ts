import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAndGrantPaymentByPageUid } from "@/lib/payplus/verify";

// PayPlus IPN. The incoming payload is UNTRUSTED — anyone could hit this URL.
// We use it only as a hint ("a payment may have completed for this page UID");
// the real trust check is made by calling PayPlus's authenticated API in the
// verify helper. Forging this webhook just causes us to re-verify a real
// payment, which is harmless.
//
// PayPlus is inconsistent about delivery method depending on the dashboard
// setting (get/post) and event type. We accept both POST (body or form) and
// GET (query string) and look up the page_request_uid from any of them.

export async function POST(request: Request) {
  const event = await readBody(request);
  return handle(event);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const event: Record<string, unknown> = {};
  url.searchParams.forEach((v, k) => {
    event[k] = v;
  });
  return handle(event);
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      return (await request.json()) as Record<string, unknown>;
    }
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      const out: Record<string, unknown> = {};
      form.forEach((v, k) => {
        out[k] = typeof v === "string" ? v : "";
      });
      return out;
    }
    // Fallback: try JSON on raw text
    const text = await request.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      // Last-ditch: parse as querystring
      const out: Record<string, unknown> = {};
      new URLSearchParams(text).forEach((v, k) => {
        out[k] = v;
      });
      return out;
    }
  } catch {
    return {};
  }
}

async function handle(event: Record<string, unknown>) {
  const pageRequestUid = extractPageRequestUid(event);
  if (!pageRequestUid) {
    console.warn("PayPlus webhook: no page_request_uid in payload", event);
    return NextResponse.json({ received: true });
  }

  // Subscription lifecycle events (cancel/fail) — separate path; no pending
  // payment to grant.
  const eventType = (event.type as string) || "";
  if (
    eventType === "recurring_cancelled" ||
    eventType === "recurring_failed"
  ) {
    const supabase = createAdminClient();
    const transaction = event.transaction as { recurring_id?: string } | undefined;
    if (transaction?.recurring_id) {
      await supabase
        .from("enrollments")
        .update({ status: "expired" })
        .eq("payplus_subscription_id", transaction.recurring_id);
    }
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();
  const result = await verifyAndGrantPaymentByPageUid(supabase, pageRequestUid);

  if (!result.ok) {
    console.error("PayPlus webhook verification failed:", result.reason);
  }

  return NextResponse.json({ received: true });
}

function extractPageRequestUid(event: Record<string, unknown>): string | null {
  // PayPlus sends the page UID under different keys depending on event /
  // version / delivery method.
  const candidates: unknown[] = [
    event.page_request_uid,
    event.payment_request_uid,
    event.payment_page_request_uid,
    (event.data as Record<string, unknown> | undefined)?.page_request_uid,
    (event.data as Record<string, unknown> | undefined)?.payment_page_request_uid,
    (event.transaction as Record<string, unknown> | undefined)
      ?.payment_page_request_uid,
    (event.transaction as Record<string, unknown> | undefined)
      ?.page_request_uid,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c;
  }
  return null;
}
