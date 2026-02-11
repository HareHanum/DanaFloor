"use client";

import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { ShieldCheck } from "lucide-react";

export default function ShiftManagersTrainingPage() {
  return (
    <ServicePageLayout
      navMode="trainings"
      icon={ShieldCheck}
      title='הדרכת אחמ"שים ומנהלי משמרת'
      subtitle="הדרכות לצוותים"
      heroDescription="כלים לניהול משמרת בזמן אמת, קבלת החלטות תחת לחץ והובלת צוות בצורה ברורה ובטוחה."
      problemTitle="מה כוללת ההדרכה"
      problemDescription="הקניית כלים לניהול משמרת בזמן אמת, קבלת החלטות תחת לחץ, הובלת צוותים ושליטה מלאה בהתנהלות הסרוויס."
      solutionTitle="מה לומדים"
      solutionDescription="ניהול קצב המשמרת ותעדוף משימות. הובלת צוות והנעת עובדים. פתרון תקלות בזמן אמת."
      includesTitle="מה לומדים"
      includesList={[
        "ניהול קצב המשמרת ותעדוף משימות",
        "הובלת צוות והנעת עובדים",
        "פתרון תקלות בזמן אמת",
        "שליטה בתקשורת בין המחלקות",
        "בניית נוכחות ניהולית יציבה בפלור",
      ]}
      processSteps={[
        {
          number: "1",
          title: "הבנת התפקיד",
          description:
            "מיפוי אחריות מנהל המשמרת והגדרת ציפיות ברורות.",
        },
        {
          number: "2",
          title: "כלי ניהול",
          description:
            "לימוד כלים לניהול קצב, תעדוף משימות ותקשורת בין מחלקות.",
        },
        {
          number: "3",
          title: "הובלת צוות",
          description:
            "תרגול הנעת עובדים, מתן פידבק ובניית סמכות ניהולית.",
        },
        {
          number: "4",
          title: "סימולציות לחץ",
          description:
            "תרגול קבלת החלטות ופתרון תקלות בתנאי לחץ ועומס.",
        },
      ]}
      ctaTitle="רוצים מנהלי משמרת שמחזיקים את הרצפה?"
      ctaDescription="הדרכה שמעניקה ביטחון וכלים לניהול משמרת מקצועי."
    />
  );
}
