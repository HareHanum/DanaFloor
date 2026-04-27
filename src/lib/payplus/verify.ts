import type { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { fetchTransactionByPageRequestUid } from "./client";
import { escapeHtml } from "@/lib/security/escape";

const DANA_NOTIFICATION_EMAIL = "dana@floor-dana.com";

type AnySupabase = SupabaseClient<any, any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type VerifyResult =
  | { ok: true; alreadyCompleted?: boolean }
  | { ok: false; reason: string };

// Verifies a pending payment by asking PayPlus for the real transaction
// status, then grants enrollment if approved. The supabase client passed in
// MUST have permission to write to payments + enrollments — use the admin
// client (service role) for webhooks, or a server client for user-triggered
// recovery (relies on RLS allowing the user's own enrollment creation).
//
// The webhook body is never trusted — we only believe the PayPlus API
// response, since that's authenticated with our secret key.
export async function verifyAndGrantPaymentByPageUid(
  supabase: AnySupabase,
  pageRequestUid: string
): Promise<VerifyResult> {
  const tag = `[payplus.verify ${pageRequestUid}]`;

  // 1. Find the pending payment record we wrote when creating the page.
  //    user_id + course_id + amount here come from our DB, not from PayPlus.
  const { data: payment, error: paymentErr } = await supabase
    .from("payments")
    .select("id, user_id, course_id, amount_ils, status")
    .eq("payplus_payment_page_uid", pageRequestUid)
    .maybeSingle();

  if (paymentErr) {
    console.error(`${tag} db lookup error:`, paymentErr);
    return { ok: false, reason: `db error: ${paymentErr.message}` };
  }

  if (!payment) {
    console.warn(`${tag} no payments row matched`);
    return { ok: false, reason: "no payment record" };
  }
  if (payment.status === "completed") {
    console.log(`${tag} already completed`);
    return { ok: true, alreadyCompleted: true };
  }

  // 2. Confirm the transaction is real by querying PayPlus directly.
  const txn = await fetchTransactionByPageRequestUid(pageRequestUid);
  if (!txn) {
    console.error(`${tag} IPN lookup returned null — see PayPlus error log`);
    return { ok: false, reason: "ipn lookup failed" };
  }
  console.log(`${tag} IPN response`, {
    status_code: txn.status_code,
    amount: txn.amount,
    type: txn.type,
    uid: txn.uid || txn.transaction_uid,
  });

  if (txn.status_code !== "000") {
    await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("id", payment.id);
    console.warn(`${tag} not approved status_code=${txn.status_code}`);
    return { ok: false, reason: `status_code=${txn.status_code}` };
  }

  // 3. Cross-check the amount. PayPlus returns shekels (we send shekels),
  //    our DB stores agorot.
  const expectedShekels = payment.amount_ils / 100;
  const paidAmount =
    typeof txn.amount === "string" ? parseFloat(txn.amount) : Number(txn.amount);
  if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - expectedShekels) > 0.01) {
    console.error(
      `${tag} amount mismatch: paid=${paidAmount} expected=${expectedShekels}`
    );
    return {
      ok: false,
      reason: `amount mismatch: paid=${paidAmount} expected=${expectedShekels}`,
    };
  }

  const transactionUid = txn.uid || txn.transaction_uid || null;

  // 4. Mark payment completed.
  const { error: payUpdateErr } = await supabase
    .from("payments")
    .update({
      status: "completed",
      payplus_transaction_id: transactionUid,
      payment_method: txn.type || "credit_card",
    })
    .eq("id", payment.id);
  if (payUpdateErr) {
    console.error(`${tag} payment update failed:`, payUpdateErr);
  }

  // 5. Create or refresh enrollment.
  const { error: enrollErr } = await supabase.from("enrollments").upsert(
    {
      user_id: payment.user_id,
      course_id: payment.course_id,
      status: "active",
      payment_type: "one_time",
      payplus_transaction_id: transactionUid,
      payplus_subscription_id: txn.recurring_id ?? null,
    },
    { onConflict: "user_id,course_id" }
  );
  if (enrollErr) {
    console.error(`${tag} enrollment upsert failed:`, enrollErr);
    return { ok: false, reason: `enrollment error: ${enrollErr.message}` };
  }

  console.log(
    `${tag} granted: user=${payment.user_id} course=${payment.course_id}`
  );

  // 6. Send purchase emails (welcome to customer + notification to Dana).
  //    Best effort — never fail enrollment on a mail error.
  await sendPurchaseEmails(
    supabase,
    payment.user_id,
    payment.course_id,
    paidAmount
  ).catch((e) => console.error(`${tag} purchase emails failed:`, e));

  return { ok: true };
}

async function sendPurchaseEmails(
  supabase: AnySupabase,
  userId: string,
  courseId: string,
  amountShekels: number
) {
  if (!process.env.RESEND_API_KEY) return;

  const { data: course } = await supabase
    .from("courses")
    .select("title, slug")
    .eq("id", courseId)
    .maybeSingle();
  if (!course) return;

  // Resolve customer email + name + phone. The verify path runs with the
  // admin client (service role), which exposes auth.admin.getUserById.
  // NOTE: do not destructure the method off auth.admin — that detaches it
  // from its `this` and the SDK call throws. Call it through the object.
  let email: string | null = null;
  const adminAuth = (
    supabase.auth as unknown as {
      admin?: {
        getUserById: (
          id: string
        ) => Promise<{
          data: { user?: { email?: string } | null } | null;
          error: unknown;
        }>;
      };
    }
  ).admin;
  if (adminAuth?.getUserById) {
    try {
      const result = await adminAuth.getUserById(userId);
      email = result?.data?.user?.email ?? null;
    } catch (e) {
      console.error("verify: auth.admin.getUserById threw:", e);
    }
  }
  if (!email) {
    // Fallback when caller used a non-admin client. Only resolves the email
    // if the currently logged-in user matches the buyer.
    const { data: user } = await supabase.auth.getUser();
    if (user?.user?.id === userId) email = user.user.email ?? null;
  }
  if (!email) {
    console.error(
      "verify: could not resolve customer email — emails skipped",
      { userId, hasAdminAuth: !!adminAuth }
    );
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", userId)
    .maybeSingle();
  const fullName = profile?.full_name?.trim() || "";
  const phone = profile?.phone?.trim() || "";
  const firstName = fullName.split(" ")[0] || "";

  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://floor-dana.com";

  // Run both sends in parallel; each catches its own error so the other still
  // goes out.
  await Promise.all([
    sendCustomerWelcome({
      resend,
      to: email,
      firstName,
      courseTitle: course.title,
      courseSlug: course.slug,
      appUrl,
    }).catch((e) => console.error("customer welcome email failed:", e)),

    sendDanaPurchaseNotification({
      resend,
      customerEmail: email,
      customerName: fullName || "(ללא שם)",
      customerPhone: phone || "(ללא טלפון)",
      courseTitle: course.title,
      amountShekels,
    }).catch((e) =>
      console.error("dana purchase notification failed:", e)
    ),
  ]);
}

async function sendCustomerWelcome(args: {
  resend: Resend;
  to: string;
  firstName: string;
  courseTitle: string;
  courseSlug: string;
  appUrl: string;
}) {
  const greeting = args.firstName ? `${escapeHtml(args.firstName)},` : "שלום,";
  const courseTitle = escapeHtml(args.courseTitle);
  const courseLink = `${args.appUrl}/courses/${encodeURIComponent(args.courseSlug)}`;

  await args.resend.emails.send({
    from: "דנה שמרוני - FLOOR D.a.N.A <courses@mail.floor-dana.com>",
    to: args.to,
    subject: `ברוכים הבאים לקורס: ${args.courseTitle}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #f69a62; margin: 0; font-size: 24px;">FLOOR D.a.N.A</h1>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; line-height: 1.8;">
          <p style="font-size: 18px; color: #1a1a1a; margin: 0 0 16px;">${greeting}</p>

          <p style="font-size: 16px; color: #333; margin: 0 0 16px;">
            ברוכים הבאים לקורס <strong>${courseTitle}</strong>!<br>
            שמחה שהצטרפת.
          </p>

          <p style="font-size: 16px; color: #333; margin: 0 0 16px;">
            הקורס כבר מחכה לך<br>
            התחל מהשיעור הראשון<br>
            ולך לפי הסדר.
          </p>

          <p style="font-size: 16px; color: #333; margin: 0 0 24px;">
            אם תיתקל בקושי או תרצה להתייעץ בנקודה כלשהי,<br>
            אני כאן.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${courseLink}"
               style="display: inline-block; background: #f69a62; color: white; padding: 14px 32px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 16px;">
              התחל ללמוד עכשיו
            </a>
          </div>

          <p style="font-size: 14px; color: #666; margin: 24px 0 0;">
            הקישור לקורס שמור גם באזור האישי שלך באתר תחת &quot;הקורסים שלי&quot;.
          </p>

          <p style="font-size: 16px; color: #1a1a1a; margin: 32px 0 0; font-weight: 500;">
            בהצלחה,<br>
            דנה
          </p>
        </div>
      </div>
    `,
  });
}

async function sendDanaPurchaseNotification(args: {
  resend: Resend;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  courseTitle: string;
  amountShekels: number;
}) {
  const safe = {
    name: escapeHtml(args.customerName),
    email: escapeHtml(args.customerEmail),
    emailAttr: encodeURIComponent(args.customerEmail),
    phone: escapeHtml(args.customerPhone),
    phoneAttr: encodeURIComponent(args.customerPhone),
    course: escapeHtml(args.courseTitle),
    amount: args.amountShekels.toLocaleString("he-IL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };

  await args.resend.emails.send({
    from: "FLOOR D.a.N.A <courses@mail.floor-dana.com>",
    to: DANA_NOTIFICATION_EMAIL,
    subject: `רכישה חדשה: ${args.courseTitle} - ${args.customerName}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #f69a62; margin: 0; font-size: 24px;">FLOOR D.a.N.A</h1>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">רכישה חדשה התקבלה 🎉</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 130px;">קורס:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${safe.course}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">סכום ששולם:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">₪${safe.amount}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">שם לקוח:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${safe.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">אימייל:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><a href="mailto:${safe.emailAttr}" style="color: #f69a62;">${safe.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">טלפון:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><a href="tel:${safe.phoneAttr}" style="color: #f69a62;">${safe.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">תאריך:</td>
              <td style="padding: 10px 0;">${new Date().toLocaleDateString("he-IL")} ${new Date().toLocaleTimeString("he-IL")}</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  });
}

// Verify all pending payments for a user — used as a recovery path on the
// catalog/courses pages so a stuck payment auto-completes on the next visit.
export async function verifyPendingPaymentsForUser(
  supabase: AnySupabase,
  userId: string,
  courseId?: string
): Promise<number> {
  let query = supabase
    .from("payments")
    .select("payplus_payment_page_uid")
    .eq("user_id", userId)
    .eq("status", "pending")
    .not("payplus_payment_page_uid", "is", null);

  if (courseId) query = query.eq("course_id", courseId);

  const { data: pending } = await query;
  if (!pending || pending.length === 0) return 0;

  let granted = 0;
  for (const row of pending) {
    if (!row.payplus_payment_page_uid) continue;
    const result = await verifyAndGrantPaymentByPageUid(
      supabase,
      row.payplus_payment_page_uid
    );
    if (result.ok && !result.alreadyCompleted) granted++;
  }
  return granted;
}
