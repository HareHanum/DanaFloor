"use client";

import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { Coffee } from "lucide-react";

export default function CoffeeTrainingPage() {
  return (
    <ServicePageLayout
      navMode="trainings"
      icon={Coffee}
      title="הדרכת קפה"
      subtitle="הדרכות לצוותים"
      heroDescription="הדרכה מקצועית שמעלה את רמת הקפה, הדיוק והאחידות – מהאספרסו ועד ההגשה ללקוח."
      problemTitle="מה כוללת ההדרכה"
      problemDescription="הדרכה מקצועית לעבודה נכונה עם ציוד הקפה, שמירה על אחידות ודיוק בהכנת משקאות והטמעת סטנדרט עבודה ברור."
      solutionTitle="מה לומדים"
      solutionDescription="כיוון מטחנה והפקת אספרסו מדויק. הקצפת חלב נכונה ושמירה על טמפרטורה. עבודה יעילה תחת עומס."
      includesTitle="מה לומדים"
      includesList={[
        "כיוון מטחנה והפקת אספרסו מדויק",
        "הקצפת חלב נכונה ושמירה על טמפרטורה",
        "עבודה יעילה תחת עומס",
        "שמירה על אחידות איכות לאורך היום",
        "יצירת חוויית קפה מקצועית ועקבית",
      ]}
      processSteps={[
        {
          number: "1",
          title: "הכרת הציוד",
          description:
            "הבנת מכונת הקפה, המטחנה והכלים – ואיך לעבוד איתם נכון.",
        },
        {
          number: "2",
          title: "טכניקה ודיוק",
          description:
            "לימוד כיוון מטחנה, הפקת אספרסו מדויק והקצפת חלב מקצועית.",
        },
        {
          number: "3",
          title: "אחידות ואיכות",
          description:
            "בניית סטנדרט עבודה שמבטיח תוצאה עקבית לאורך כל היום.",
        },
        {
          number: "4",
          title: "עבודה בשטח",
          description:
            "תרגול בתנאי עומס אמיתיים תוך שמירה על איכות ומהירות.",
        },
      ]}
      ctaTitle="רוצים קפה שמחזק את המותג?"
      ctaDescription="הדרכת קפה שמעלה את הרמה ואת החוויה של כל כוס."
    />
  );
}
