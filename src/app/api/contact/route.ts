import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  businessType: string;
  serviceInterest: string;
  message?: string;
}

const businessTypeLabels: Record<string, string> = {
  restaurant: "מסעדה",
  cafe: "בית קפה",
  hotel: "מלון / בוטיק",
  catering: "קייטרינג / אירועים",
  bar: "בר / פאב",
  "coffee-cart": "עגלת קפה / דוכן",
  other: "אחר",
};

const serviceLabels: Record<string, string> = {
  consulting: "ייעוץ למסעדות",
  training: "הדרכות לצוותים",
  establishment: "הקמה וליווי",
  results: "שיפור תוצאות",
  general: "שיחת ייעוץ כללית",
};

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.phone || !data.businessType || !data.serviceInterest) {
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

    // Validate email if provided
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Format the lead data for logging/email
    const leadData = {
      name: data.name,
      phone: data.phone,
      email: data.email || "לא צוין",
      businessType: businessTypeLabels[data.businessType] || data.businessType,
      serviceInterest: serviceLabels[data.serviceInterest] || data.serviceInterest,
      message: data.message || "לא צוין",
      submittedAt: new Date().toISOString(),
    };

    // Log the lead (for development)
    console.log("New lead received:", leadData);

    // Send email notification to Dana
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not set - skipping email");
        throw new Error("RESEND_API_KEY not configured");
      }
      const resend = new Resend(process.env.RESEND_API_KEY);
      const emailResult = await resend.emails.send({
        from: "FLOOR D.a.N.A <contact@floor-dana.com>",
        to: "danashimroni@gmail.com",
        subject: `פנייה חדשה מ${data.name}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #f69a62; margin: 0; font-size: 24px;">FLOOR D.a.N.A</h1>
            </div>
            <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1a1a1a; margin-top: 0;">פנייה חדשה מהאתר</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">שם:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${leadData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">טלפון:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><a href="tel:${data.phone}" style="color: #f69a62;">${leadData.phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">אימייל:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.email ? `<a href="mailto:${data.email}" style="color: #f69a62;">${leadData.email}</a>` : leadData.email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">סוג עסק:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${leadData.businessType}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">תחום עניין:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${leadData.serviceInterest}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">הודעה:</td>
                  <td style="padding: 10px 0;">${leadData.message}</td>
                </tr>
              </table>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">נשלח בתאריך: ${new Date().toLocaleDateString("he-IL")} בשעה ${new Date().toLocaleTimeString("he-IL")}</p>
            </div>
          </div>
        `,
      });
      console.log("Email sent successfully:", emailResult);
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
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
