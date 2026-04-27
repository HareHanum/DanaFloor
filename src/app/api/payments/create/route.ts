import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPaymentPage } from "@/lib/payplus/client";
import { assertSameOrigin } from "@/lib/security/origin";
import { rateLimitOr429 } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const rl = await rateLimitOr429(request, "payments-create", 10, 60);
  if (rl) return rl;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();

  if (!courseId) {
    return NextResponse.json(
      { error: "courseId is required" },
      { status: 400 }
    );
  }

  // Get course details
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .eq("status", "published")
    .single();

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("status", "active")
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Already enrolled" },
      { status: 400 }
    );
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Create PayPlus payment page. We deliberately keep more_info short and
  // user-friendly because PayPlus prints it on the customer receipt — no IDs,
  // no JSON. The webhook + verify path identifies the buyer by looking up our
  // own `payments` row by payplus_payment_page_uid, so we don't need IDs in
  // the PayPlus-side metadata.
  const { pageUrl, pageUid } = await createPaymentPage({
    amount: course.price_ils,
    currency: "ILS",
    description: course.title,
    customer: {
      name: profile?.full_name || "לקוח",
      email: user.email!,
      phone: profile?.phone || undefined,
    },
    more_info: course.title,
    charge_method: course.payment_type === "subscription" ? 2 : 1,
    success_url: `${appUrl}/api/payments/success?slug=${encodeURIComponent(course.slug)}`,
    failure_url: `${appUrl}/catalog/${course.slug}?payment=failed`,
    cancel_url: `${appUrl}/catalog/${course.slug}`,
    callback_url: `${appUrl}/api/webhooks/payplus`,
  });

  // Insert the pending payment using the admin (service role) client. The
  // payments table RLS only permits admin role to insert, and the buyer is
  // not an admin. Without this, the insert was silently rejected and every
  // purchase landed at PayPlus with no DB record to verify against — which
  // is why webhooks + success redirects all failed with "no payment record".
  const admin = createAdminClient();
  const { error: insertErr } = await admin.from("payments").insert({
    user_id: user.id,
    course_id: courseId,
    amount_ils: course.price_ils,
    status: "pending",
    payplus_payment_page_uid: pageUid,
  });

  if (insertErr) {
    console.error("payments insert failed:", insertErr);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }

  return NextResponse.json({ paymentUrl: pageUrl });
}
