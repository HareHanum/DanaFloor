"use client";

import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { Wine } from "lucide-react";

export default function WineTrainingPage() {
  return (
    <ServicePageLayout
      navMode="trainings"
      icon={Wine}
      title="הדרכת יין ואלכוהול"
      subtitle="הדרכות לצוותים"
      heroDescription="ידע מעשי וביטחון בעולם היין והאלכוהול, לצד יכולת להמליץ ולמכור בצורה מקצועית ונעימה."
      problemTitle="מה כוללת ההדרכה"
      problemDescription="הדרכה מעשית המעניקה ידע פרקטי בעולם היין והאלכוהול, התאמות אוכל-יין, תרגול המלצות לשולחן והטמעת טקסי הגשה נכונים."
      solutionTitle="מה לומדים"
      solutionDescription="מושגי יסוד בעולם היין והמשקאות. התאמות נכונות בין מנות למשקאות. הצגת יין לשולחן וטקס הגשה מקצועי."
      includesTitle="מה לומדים"
      includesList={[
        "מושגי יסוד בעולם היין והמשקאות",
        "התאמות נכונות בין מנות למשקאות",
        "הצגת יין לשולחן וטקס הגשה מקצועי",
        "המלצה ומכירה טבעית של משקאות",
        "עבודה מדויקת גם בשעות עומס",
      ]}
      processSteps={[
        {
          number: "1",
          title: "בסיס ידע",
          description:
            "לימוד מושגי יסוד בעולם היין והמשקאות – זנים, אזורים, וסגנונות.",
        },
        {
          number: "2",
          title: "התאמות וטעימות",
          description:
            "תרגול התאמות אוכל-יין עם התפריט הקיים וטעימות מעשיות.",
        },
        {
          number: "3",
          title: "טקסי הגשה",
          description:
            "לימוד ותרגול הצגת יין לשולחן, פתיחה והגשה מקצועית.",
        },
        {
          number: "4",
          title: "יישום בשטח",
          description:
            "תרגול המלצות ומכירה בזמן משמרת אמיתית.",
        },
      ]}
      ctaTitle="רוצים צוות שמוכר יין בביטחון?"
      ctaDescription="הדרכת יין ואלכוהול שמעלה את רמת השירות ואת המכירות."
    />
  );
}
