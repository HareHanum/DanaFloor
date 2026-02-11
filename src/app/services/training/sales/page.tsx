"use client";

import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { BadgeDollarSign } from "lucide-react";

export default function SalesTrainingPage() {
  return (
    <ServicePageLayout
      navMode="trainings"
      heroVideo="/media/training-courses-video.mp4"
      icon={BadgeDollarSign}
      title="הדרכת מכירה"
      subtitle="הדרכות לצוותים"
      heroDescription="הדרכה שמלמדת את הצוות למכור בצורה אלגנטית, טבעית ולא דוחפת – כחלק בלתי נפרד מהשירות."
      problemTitle="מה כוללת ההדרכה"
      problemDescription="הדרכה פרקטית המשלבת הבנת פסיכולוגיית מכירה במסעדנות, זיהוי נקודות מכירה לאורך הסרוויס, תרגול משפטי מכירה טבעיים וסימולציות בזמן אמת המותאמות לסוג המקום ולתפריט."
      solutionTitle="מה לומדים"
      solutionDescription="זיהוי הזדמנויות מכירה לאורך שלבי השירות. הצעת שדרוגים ותוספות בצורה אלגנטית שאינה נתפסת כלחץ. בניית משפטי מכירה קצרים וברורים לפי סוגי אורחים."
      includesTitle="מה לומדים"
      includesList={[
        "זיהוי הזדמנויות מכירה לאורך שלבי השירות",
        "הצעת שדרוגים ותוספות בצורה אלגנטית שאינה נתפסת כלחץ",
        "בניית משפטי מכירה קצרים וברורים לפי סוגי אורחים",
        "הגדלת ממוצע לסועד באמצעות התאמות מדויקות",
        "חיבור בין מכירה לחוויית שירות ולא כפעולה נפרדת",
      ]}
      processSteps={[
        {
          number: "1",
          title: "מיפוי הזדמנויות",
          description:
            "בודקים את התפריט, מזהים מוצרים עם פוטנציאל, ומבינים איפה הכסף נמצא.",
        },
        {
          number: "2",
          title: "שינוי תפיסה",
          description:
            "הצוות מבין למה מכירה זה דבר טוב – ללקוח, לעסק ולטיפ שלהם.",
        },
        {
          number: "3",
          title: "למידת טכניקות",
          description:
            "לומדים איך להציע, מתי להציע, איך לתאר מנה ואיך להתמודד עם 'לא'.",
        },
        {
          number: "4",
          title: "יישום בשטח",
          description:
            "מתרגלים במשמרת אמיתית – אני צופה, נותנת פידבק ועוזרת לשפר בזמן אמת.",
        },
      ]}
      ctaTitle="רוצים להגדיל את התיק הממוצע?"
      ctaDescription="הדרכת מכירה שמשנה את התוצאות – כבר מהערב הראשון."
    />
  );
}
