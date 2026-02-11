"use client";

import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { UtensilsCrossed } from "lucide-react";

export default function MenuTrainingPage() {
  return (
    <ServicePageLayout
      navMode="trainings"
      heroVideo="/media/training-courses-video.mp4"
      icon={UtensilsCrossed}
      title="הדרכת תפריט"
      subtitle="הדרכות לצוותים"
      heroDescription="העמקת היכרות הצוות עם התפריט וחיזוק הביטחון בהצגת מנות, משקאות והתאמות לאורחים שונים."
      problemTitle="מה כוללת ההדרכה"
      problemDescription="היכרות עומק עם התפריט, חומרי הגלם, שיטות ההכנה והסיפור שמאחורי המנות, לצד תרגול הצגת מנות לשולחן והכוונת אורחים בהתאם להעדפותיהם."
      solutionTitle="מה לומדים"
      solutionDescription="הצגה מקצועית, ברורה ומעוררת תיאבון של המנות. התאמת מנות לפי טעמים, מגבלות תזונתיות והעדפות. יצירת 'סיפור מנה' קצר שמחזק את החוויה."
      includesTitle="מה לומדים"
      includesList={[
        "הצגה מקצועית, ברורה ומעוררת תיאבון של המנות",
        "התאמת מנות לפי טעמים, מגבלות תזונתיות והעדפות",
        "יצירת 'סיפור מנה' קצר שמחזק את החוויה",
        "חיזוק הביטחון בשיח תפריט מלא",
        "חיבור בין ידע תפריט למכירה מדויקת",
      ]}
      processSteps={[
        {
          number: "1",
          title: "מיפוי התפריט",
          description:
            "סקירה מעמיקה של התפריט – חומרי גלם, שיטות הכנה, ומה הופך כל מנה למיוחדת.",
        },
        {
          number: "2",
          title: "בניית שפת תפריט",
          description:
            "יצירת תיאורים קצרים ומדויקים לכל מנה שהצוות יכול להשתמש בהם בקלות.",
        },
        {
          number: "3",
          title: "תרגול הצגה",
          description:
            "סימולציות של הצגת מנות לשולחן, התאמות לאורחים ומענה לשאלות.",
        },
        {
          number: "4",
          title: "יישום ומעקב",
          description:
            "יישום בשטח עם ליווי צמוד ופידבק לשיפור מתמיד.",
        },
      ]}
      ctaTitle="רוצים צוות שמכיר את התפריט לעומק?"
      ctaDescription="הדרכת תפריט שמעלה את הביטחון של הצוות ואת החוויה של האורח."
    />
  );
}
