"use client";

import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { Beer } from "lucide-react";

export default function BarTrainingPage() {
  return (
    <ServicePageLayout
      navMode="trainings"
      icon={Beer}
      title="הדרכת ברמנים ושירות בר"
      subtitle="הדרכות לצוותים"
      heroDescription="ייעול העבודה בבר, חיזוק נוכחות מקצועית ושיפור איכות השירות גם בשעות שיא."
      problemTitle="מה כוללת ההדרכה"
      problemDescription="שיפור שיטות העבודה בבר, קצב ביצוע, סדר עבודה, תקשורת עם אורחים ושיפור חוויית השירות בעמדת הבר."
      solutionTitle="מה לומדים"
      solutionDescription="עבודה נקייה, מדויקת ומהירה. ניהול עומסים ושעות שיא. יצירת אינטראקציה שירותית מקצועית עם אורחי הבר."
      includesTitle="מה לומדים"
      includesList={[
        "עבודה נקייה, מדויקת ומהירה",
        "ניהול עומסים ושעות שיא",
        "יצירת אינטראקציה שירותית מקצועית עם אורחי הבר",
        "הגדלת מכירות דרך המלצות נכונות",
        "שמירה על אחידות ואיכות הגשה",
      ]}
      processSteps={[
        {
          number: "1",
          title: "צפייה וניתוח",
          description:
            "מיפוי שיטות העבודה הקיימות, זיהוי צווארי בקבוק ונקודות לשיפור.",
        },
        {
          number: "2",
          title: "סדר ושיטה",
          description:
            "בניית שיטת עבודה נקייה ומדויקת – סידור עמדה, קצב ביצוע ותעדוף.",
        },
        {
          number: "3",
          title: "שירות ומכירה",
          description:
            "תרגול תקשורת עם אורחי הבר, המלצות מדויקות והגדלת מכירות.",
        },
        {
          number: "4",
          title: "עבודה תחת לחץ",
          description:
            "סימולציות ותרגול ניהול שעות שיא תוך שמירה על איכות.",
        },
      ]}
      ctaTitle="רוצים בר שעובד חלק גם בשיא?"
      ctaDescription="הדרכת ברמנים שמשדרגת את העבודה ואת חוויית האורח."
    />
  );
}
