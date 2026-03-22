import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "כתובת אימייל לא תקינה" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
      console.error("Missing RESEND_API_KEY or RESEND_AUDIENCE_ID");
      // Return success to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.contacts.update({
        email,
        unsubscribed: true,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
      console.log("Contact unsubscribed:", email);
    } catch (contactError) {
      // Log but don't expose to user (prevents email enumeration)
      console.error("Failed to unsubscribe contact:", contactError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "אירעה שגיאה. אנא נסו שוב." },
      { status: 500 }
    );
  }
}
