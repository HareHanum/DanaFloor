import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
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
