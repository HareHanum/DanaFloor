import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPaymentPage } from "@/lib/payplus/client";

export async function POST(request: Request) {
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

  // Create PayPlus payment page
  const { pageUrl, pageUid } = await createPaymentPage({
    amount: course.price_ils,
    currency: "ILS",
    description: course.title,
    customer: {
      name: profile?.full_name || "לקוח",
      email: user.email!,
      phone: profile?.phone || undefined,
    },
    more_info: JSON.stringify({
      user_id: user.id,
      course_id: courseId,
      payment_type: course.payment_type,
    }),
    charge_method: course.payment_type === "subscription" ? 2 : 1,
    success_url: `${appUrl}/catalog/${course.slug}?payment=success`,
    failure_url: `${appUrl}/catalog/${course.slug}?payment=failed`,
    cancel_url: `${appUrl}/catalog/${course.slug}`,
  });

  // Create pending payment record
  await supabase.from("payments").insert({
    user_id: user.id,
    course_id: courseId,
    amount_ils: course.price_ils,
    status: "pending",
    payplus_payment_page_uid: pageUid,
  });

  return NextResponse.json({ paymentUrl: pageUrl });
}
