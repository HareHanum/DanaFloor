import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimitOr429 } from "@/lib/security/rate-limit";
import { addMarketingContact } from "@/lib/resend/contacts";

export async function POST(request: Request) {
  const rl = await rateLimitOr429(request, "subscribe", 5, 60 * 10);
  if (rl) return rl;

  try {
    const { email, name } = await request.json();

    if (!email || !process.env.RESEND_API_KEY) {
      if (email) console.error("subscribe: RESEND_API_KEY not set");
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    // Signup must not be blocked by marketing, so we still answer ok — but
    // failures are now logged instead of swallowed.
    await addMarketingContact(resend, { email, firstName: name });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("subscribe error:", e);
    return NextResponse.json({ ok: true });
  }
}
