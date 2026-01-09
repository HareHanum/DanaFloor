import { NextRequest, NextResponse } from "next/server";

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

    // TODO: Integrate with email service (Resend/SendGrid)
    // Example with Resend:
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from: 'D.A.N.A FLOOR <noreply@danafloor.co.il>',
    //   to: 'danashimroni@gmail.com',
    //   subject: `פנייה חדשה מ${data.name}`,
    //   html: `
    //     <div dir="rtl" style="font-family: Arial, sans-serif;">
    //       <h2>פנייה חדשה מהאתר</h2>
    //       <p><strong>שם:</strong> ${leadData.name}</p>
    //       <p><strong>טלפון:</strong> ${leadData.phone}</p>
    //       <p><strong>אימייל:</strong> ${leadData.email}</p>
    //       <p><strong>סוג עסק:</strong> ${leadData.businessType}</p>
    //       <p><strong>תחום עניין:</strong> ${leadData.serviceInterest}</p>
    //       <p><strong>הודעה:</strong> ${leadData.message}</p>
    //     </div>
    //   `,
    // });

    // TODO: Optional - Save to CRM/Database
    // await saveLeadToDatabase(leadData);

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
