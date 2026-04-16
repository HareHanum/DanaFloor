import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

export async function POST(request: Request) {
  const body = await request.text();

  // PayPlus sends webhook data as JSON
  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const transaction = event.transaction as Record<string, unknown> | undefined;

  if (!transaction) {
    return NextResponse.json({ error: "No transaction data" }, { status: 400 });
  }

  const statusCode = transaction.status_code as string;
  const transactionUid = transaction.uid as string;
  const moreInfoStr = (event.more_info as string) || "{}";

  let metadata: { user_id?: string; course_id?: string; payment_type?: string };
  try {
    metadata = JSON.parse(moreInfoStr);
  } catch {
    metadata = {};
  }

  const { user_id, course_id, payment_type } = metadata;

  if (!user_id || !course_id) {
    console.error("PayPlus webhook: missing user_id or course_id in more_info");
    return NextResponse.json({ received: true });
  }

  // Successful payment
  if (statusCode === "000") {
    // Update payment record
    await supabase
      .from("payments")
      .update({
        status: "completed",
        payplus_transaction_id: transactionUid,
        payment_method: (transaction.type as string) || "credit_card",
      })
      .eq("user_id", user_id)
      .eq("course_id", course_id)
      .eq("status", "pending");

    // Create or update enrollment
    await supabase.from("enrollments").upsert(
      {
        user_id,
        course_id,
        status: "active",
        payment_type: payment_type || "one_time",
        payplus_transaction_id: transactionUid,
        payplus_subscription_id:
          (transaction.recurring_id as string) ?? null,
        expires_at:
          payment_type === "subscription"
            ? new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString()
            : null,
      },
      { onConflict: "user_id,course_id" }
    );

    // Send welcome email
    try {
      const { data: user } = await supabase.auth.admin.getUserById(user_id);
      const { data: course } = await supabase
        .from("courses")
        .select("title, slug")
        .eq("id", course_id)
        .single();

      if (user?.user?.email && course && process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "https://floor-dana.com";

        await resend.emails.send({
          from: "FLOOR D.a.N.A <courses@mail.floor-dana.com>",
          to: user.user.email,
          subject: `ברוכים הבאים לקורס: ${course.title}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #1a1a1a; padding: 20px; border-radius: 8px 8px 0 0;">
                <h1 style="color: #f69a62; margin: 0; font-size: 24px;">FLOOR D.a.N.A</h1>
              </div>
              <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #1a1a1a; margin-top: 0;">הרכישה בוצעה בהצלחה! 🎉</h2>
                <p>שלום, תודה שרכשת את הקורס <strong>${course.title}</strong>.</p>
                <p>אתה יכול להתחיל ללמוד כבר עכשיו:</p>
                <a href="${appUrl}/courses/${course.slug}"
                   style="display: inline-block; background: #f69a62; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                  התחל ללמוד
                </a>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  אם יש לך שאלות, אל תהסס ליצור קשר.
                </p>
              </div>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    console.log(
      `PayPlus: Payment successful for user=${user_id}, course=${course_id}`
    );
  }

  // Failed payment
  if (statusCode !== "000" && statusCode) {
    await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("user_id", user_id)
      .eq("course_id", course_id)
      .eq("status", "pending");

    console.log(
      `PayPlus: Payment failed for user=${user_id}, course=${course_id}, status=${statusCode}`
    );
  }

  // Subscription cancellation
  if (event.type === "recurring_cancelled" || event.type === "recurring_failed") {
    const recurringId = transaction.recurring_id as string;
    if (recurringId) {
      await supabase
        .from("enrollments")
        .update({ status: "expired" })
        .eq("payplus_subscription_id", recurringId);

      console.log(
        `PayPlus: Subscription ${event.type} for recurring_id=${recurringId}`
      );
    }
  }

  // Subscription renewal
  if (event.type === "recurring_success" && statusCode === "000") {
    const recurringId = transaction.recurring_id as string;
    if (recurringId) {
      await supabase
        .from("enrollments")
        .update({
          status: "active",
          expires_at: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .eq("payplus_subscription_id", recurringId);

      console.log(
        `PayPlus: Subscription renewed for recurring_id=${recurringId}`
      );
    }
  }

  return NextResponse.json({ received: true });
}
