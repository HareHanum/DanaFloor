"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  UtensilsCrossed,
  Coffee,
  Hotel,
  Warehouse,
  ChefHat,
  Wine,
} from "lucide-react";
import Link from "next/link";

const businessTypes = [
  {
    icon: UtensilsCrossed,
    title: "מסעדות",
    description:
      "ממסעדות שכונתיות ועד מסעדות יוקרה. ליווי בשירות, מכירה וניהול צוות.",
    examples: ["מסעדות גורמה", "מסעדות שכונתיות", "רשתות מסעדות"],
  },
  {
    icon: Coffee,
    title: "בתי קפה",
    description:
      "בניית חוויית שירות ייחודית, הגדלת מכירות וניהול משמרות יעיל.",
    examples: ["בתי קפה עצמאיים", "רשתות קפה", "בתי קפה בוטיק"],
  },
  {
    icon: Hotel,
    title: "מלונות",
    description:
      "הדרכת צוותי לובי, מסעדה ובר. שיפור חוויית האורח מהכניסה ועד היציאה.",
    examples: ["מלונות בוטיק", "מלונות נופש", "מלונות עסקים"],
  },
  {
    icon: Warehouse,
    title: "קייטרינג ואירועים",
    description:
      "בניית צוותים לאירועים, הדרכת שירות באירועים גדולים וניהול לחץ.",
    examples: ["חברות קייטרינג", "אולמות אירועים", "גני אירועים"],
  },
  {
    icon: ChefHat,
    title: "עגלות קפה ומזון",
    description:
      "שירות מהיר ויעיל, מכירה אפקטיבית ובניית חוויית לקוח בזמן קצר.",
    examples: ["עגלות קפה", "עגלות מזון", "דוכני שוק"],
  },
  {
    icon: Wine,
    title: "ברים ופאבים",
    description:
      "אווירה נכונה, שירות מהיר ומקצועי, והגדלת מכירות משקאות ומנות.",
    examples: ["ברים", "פאבים", "יקבים"],
  },
];

export default function ForWhom() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-[var(--background)]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[var(--accent)] font-bold mb-4 block text-[2rem]">
            למי זה מתאים?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            עסקי אירוח שרוצים להתקדם
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            אני עובדת עם כל סוגי עסקי האירוח – מעגלת קפה קטנה ועד רשת מלונות.
            המשותף לכולם: הרצון להשתפר ולהצליח.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessTypes.map((business, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-xl p-6 border border-[var(--border-light)] hover:border-[var(--accent)] hover:shadow-lg transition-all duration-300"
            >
              <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--accent)] transition-colors duration-300">
                <business.icon
                  size={42}
                  className="text-[var(--accent)] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="text-3xl font-bold mb-2">{business.title}</h3>
              <p className="text-[var(--text-secondary)] text-xl mb-4 leading-relaxed">
                {business.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {business.examples.map((example, i) => (
                  <span
                    key={i}
                    className="text-base px-2 py-1 bg-[var(--background)] rounded-full text-[var(--text-muted)]"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-[var(--text-secondary)] mb-4">
            לא בטוחים אם זה מתאים לכם?
          </p>
          <Link
            href="/contact"
            className="btn btn-accent inline-flex items-center gap-2"
          >
            בואו נבדוק ביחד
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
