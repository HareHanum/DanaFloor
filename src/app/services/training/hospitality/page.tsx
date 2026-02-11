"use client";

import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { Heart } from "lucide-react";

export default function HospitalityTrainingPage() {
  return (
    <ServicePageLayout
      navMode="trainings"
      icon={Heart}
      title="הדרכת אירוח"
      subtitle="הדרכות לצוותים"
      heroDescription="יצירת חוויית אירוח אנושית, חמה וזכירה – מעבר לביצוע טכני של שירות."
      problemTitle="מה כוללת ההדרכה"
      problemDescription="העמקה בתפיסת האירוח כמרכיב מרכזי בחוויית המקום, פיתוח מודעות שירותית, תרגול תקשורת אמפתית ויצירת חוויות אישיות לאורחים."
      solutionTitle="מה לומדים"
      solutionDescription="קריאת סיטואציות והתאמת השירות לסוג האורח. יצירת קשר אישי מהיר ואותנטי. ניהול תקשורת שירותית גם בסיטואציות מורכבות."
      includesTitle="מה לומדים"
      includesList={[
        "קריאת סיטואציות והתאמת השירות לסוג האורח",
        "יצירת קשר אישי מהיר ואותנטי",
        "ניהול תקשורת שירותית גם בסיטואציות מורכבות",
        "יצירת 'רגעי חוויה' קטנים שמבדלים את המקום",
        "חיזוק שפת אירוח אחידה לצוות",
      ]}
      processSteps={[
        {
          number: "1",
          title: "הבנת תפיסת האירוח",
          description:
            "מה ההבדל בין שירות לאירוח, ואיך זה משפיע על חוויית האורח.",
        },
        {
          number: "2",
          title: "פיתוח מודעות",
          description:
            "לימוד קריאת אורחים, זיהוי צרכים ובניית תקשורת אמפתית.",
        },
        {
          number: "3",
          title: "תרגול מעשי",
          description:
            "סימולציות ותרגולים ליצירת רגעי חוויה אישיים ובלתי נשכחים.",
        },
        {
          number: "4",
          title: "הטמעה בצוות",
          description:
            "בניית שפת אירוח אחידה והטמעתה בעבודה היומיומית.",
        },
      ]}
      ctaTitle="רוצים ליצור חוויית אירוח שזוכרים?"
      ctaDescription="הדרכת אירוח שהופכת כל ביקור לחוויה אישית ומיוחדת."
    />
  );
}
