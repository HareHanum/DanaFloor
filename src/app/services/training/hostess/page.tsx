"use client";

import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { DoorOpen } from "lucide-react";

export default function HostessTrainingPage() {
  return (
    <ServicePageLayout
      navMode="trainings"
      icon={DoorOpen}
      title="הדרכת מארחות"
      subtitle="הדרכות לצוותים"
      heroDescription="חיזוק עמדת הקבלה כנקודת מפתח בחוויית האורח ובניהול הזרימה במסעדה."
      problemTitle="מה כוללת ההדרכה"
      problemDescription="בניית שליטה מקצועית בעמדת הקבלה, ניהול זרימת קהל, עבודה עם מערכות הושבה ותקשורת שוטפת עם צוות הפלור והמטבח."
      solutionTitle="מה לומדים"
      solutionDescription="ניהול הושבות חכם לפי קצב הסרוויס. יצירת חוויית פתיחה מקצועית ומזמינה. ניהול זמני המתנה בצורה שירותית."
      includesTitle="מה לומדים"
      includesList={[
        "ניהול הושבות חכם לפי קצב הסרוויס",
        "יצירת חוויית פתיחה מקצועית ומזמינה",
        "ניהול זמני המתנה בצורה שירותית",
        "עבודה מתואמת עם מנהלי המשמרת והפלור",
        "שליטה מלאה במערכות הזמנות והושבה",
      ]}
      processSteps={[
        {
          number: "1",
          title: "מיפוי העמדה",
          description:
            "הבנת תפקיד המארחת ומשמעותו בחוויה הכוללת של האורח.",
        },
        {
          number: "2",
          title: "ניהול זרימה",
          description:
            "לימוד ניהול הושבות, עומסים וזמני המתנה בצורה חכמה.",
        },
        {
          number: "3",
          title: "תקשורת ותיאום",
          description:
            "תרגול תקשורת שוטפת עם הפלור, המטבח ומנהלי המשמרת.",
        },
        {
          number: "4",
          title: "יישום ושליטה",
          description:
            "עבודה מעשית עם מערכות הזמנות ותרגול בתנאי שטח.",
        },
      ]}
      ctaTitle="רוצים עמדת קבלה שעושה רושם?"
      ctaDescription="הדרכת מארחות שמשדרגת את הרגע הראשון של כל ביקור."
    />
  );
}
