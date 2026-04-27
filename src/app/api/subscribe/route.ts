import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimitOr429 } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const rl = await rateLimitOr429(request, "subscribe", 5, 60 * 10);
  if (rl) return rl;

  try {
    const { email, name } = await request.json();

    if (!email || !process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.contacts.create({
      email,
      firstName: name || undefined,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
