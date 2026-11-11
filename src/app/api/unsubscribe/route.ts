import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimitOr429 } from "@/lib/security/rate-limit";
import { unsubscribeContact } from "@/lib/resend/contacts";

export async function POST(request: NextRequest) {
  const rl = await rateLimitOr429(request, "unsubscribe", 10, 60 * 10);
  if (rl) return rl;

  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "כתובת אימייל לא תקינה" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY");
      // Return success to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Global unsubscribe (all broadcasts). Errors are logged inside but not
    // exposed to the user, to prevent email enumeration.
    await unsubscribeContact(resend, email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "אירעה שגיאה. אנא נסו שוב." },
      { status: 500 }
    );
  }
}
