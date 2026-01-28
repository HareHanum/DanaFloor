"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function Introduction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-[var(--background)]">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[var(--accent)] font-medium mb-4 block">
              היכרות
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              אני דנה שימרוני
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
              <p className="text-lg font-medium text-[var(--foreground)]">
                מומחית לשירות, תפעול וחווית לקוח בענף המסעדנות והאירוח - מומחית ביצירת D.N.A של הצלחה לפלור
              </p>
              <p>
                אני מלווה מסעדות, בתי קפה ומלונות בבניית שירות מדויק, ניהול רגוע ומכירה טבעית. אני יודעת לאבחן במהירות את מצב הפלור, להדריך מנהלים וצוותים, ומתרגמת ניסיון מעשי לשיטה ברורה שעובדת יום־יום, משפרת את חווית הלקוח ומגדילה הכנסות.
              </p>
              <p>
                השיטה שלי עובדת כי היא מגיעה מהשטח! צמחתי מהפלור. התחלתי בגיל צעיר ועבדתי בכל תפקיד אפשרי ממלצרות, ברמנית, בריסטה, ניהול משמרות וניהול פלור. למדתי מבפנים מה גורם למקום לעבוד טוב באמת.
              </p>
              <p>
                לא מתיאוריה, אלא ממשמרות, עומסים, אנשים וקצב.
              </p>
              <p className="font-medium text-[var(--foreground)]">
                אני שמחה להביא את הידע שלי דרך ייעוץ, ליווי והדרכות בשיטתיות, דיוק ותוצאות שמורגשים מהרגע הראשון!
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-[var(--border-light)]">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--accent)]">
                  15+
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  שנות ניסיון
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--accent)]">
                  50+
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  עסקים שליוויתי
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--accent)]">
                  400+
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  אנשי צוות הודרכו
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden relative">
              <Image
                src="/media/dana-hero.png"
                alt="דנה שימרוני - יועצת אירוח"
                fill
                className="object-cover object-top"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--accent)]/10 rounded-lg -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
