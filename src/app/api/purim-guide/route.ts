import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";

interface GuideFormData {
  firstName: string;
  businessName: string;
  role: string;
  email: string;
  phone: string;
  marketingConsent: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: GuideFormData = await request.json();

    // Validate required fields
    if (!data.firstName || !data.businessName || !data.role || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate phone format (Israeli phone)
    const cleanPhone = data.phone.replace(/[-\s]/g, "");
    if (!/^0[0-9]{8,9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Format the lead data for logging/email
    const leadData = {
      firstName: data.firstName,
      businessName: data.businessName,
      role: data.role,
      email: data.email,
      phone: data.phone,
      marketingConsent: data.marketingConsent ? "כן" : "לא",
      submittedAt: new Date().toISOString(),
      source: "מדריך תפעול לפורים",
    };

    // Log the lead (for development)
    console.log("New Purim guide download:", leadData);

    // Send emails
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not set - skipping email");
        throw new Error("RESEND_API_KEY not configured");
      }
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Read the PDF file for attachment
      const pdfPath = join(process.cwd(), "public", "guides", "purim-bar-guide.pdf");
      const pdfBuffer = readFileSync(pdfPath);

      // Send welcome email to user with PDF attached
      const userEmailResult = await resend.emails.send({
        from: "דנה שמרוני - FLOOR D.a.N.A <contact@floor-dana.com>",
        to: data.email,
        subject: "המדריך לבר בפורים מחכה לך",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #f69a62; margin: 0; font-size: 24px;">FLOOR D.a.N.A</h1>
            </div>
            <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; color: #1a1a1a; margin-top: 0;">שלום,</p>
              <p style="font-size: 16px; color: #333; line-height: 1.8;">
                המדריך להגדלת הכנסות מהבר בפורים מצורף כאן למטה.
              </p>
              <p style="font-size: 16px; color: #333; line-height: 1.8;">
                הוא קצר, ממוקד<br>
                ונכתב בדיוק לערבים שבהם הבר עובד חזק<br>
                והטעויות עולות כסף מהר.
              </p>
              <p style="font-size: 16px; color: #333; line-height: 1.8;">
                מומלץ לעבור עליו<br>
                ואז לעצור רגע עם הצוות<br>
                ולבדוק מה מתוך זה כבר קיים אצלכם<br>
                ומה עוד צריך החלטה.
              </p>
              <p style="font-size: 16px; color: #333; line-height: 1.8;">
                בסוף המדריך צירפתי גם נקודת מחשבה<br>
                למי שמרגיש שזה "כמעט"<br>
                אבל לא תמיד מיושם בפועל.
              </p>
              <p style="font-size: 16px; color: #333; line-height: 1.8;">
                אם עולות שאלות<br>
                אפשר לפנות אליי.
              </p>
              <p style="font-size: 16px; color: #1a1a1a; margin-bottom: 0; font-weight: 500;">
                דנה
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: "מדריך-בר-בפורים.pdf",
            content: pdfBuffer,
          },
        ],
      });
      console.log("User email sent successfully:", userEmailResult);

      // Send notification email to Dana
      const danaEmailResult = await resend.emails.send({
        from: "FLOOR D.a.N.A <contact@floor-dana.com>",
        to: "dana@floor-dana.com",
        subject: `הורדת מדריך פורים - ${data.firstName} מ${data.businessName}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #f69a62; margin: 0; font-size: 24px;">FLOOR D.a.N.A</h1>
            </div>
            <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1a1a1a; margin-top: 0;">הורדת מדריך תפעול לפורים</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">שם פרטי:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${leadData.firstName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">שם העסק:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${leadData.businessName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">תפקיד:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${leadData.role}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">אימייל:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><a href="mailto:${data.email}" style="color: #f69a62;">${leadData.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">טלפון:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><a href="tel:${data.phone}" style="color: #f69a62;">${leadData.phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold;">אישור דיוור:</td>
                  <td style="padding: 10px 0;">${leadData.marketingConsent}</td>
                </tr>
              </table>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">נשלח בתאריך: ${new Date().toLocaleDateString("he-IL")} בשעה ${new Date().toLocaleTimeString("he-IL")}</p>
            </div>
          </div>
        `,
      });
      console.log("Dana notification email sent:", danaEmailResult);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't fail the request if email fails - the lead is still logged
    }

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
        data: leadData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Purim guide form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
