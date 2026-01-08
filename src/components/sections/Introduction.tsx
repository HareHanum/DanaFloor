"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

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
              <p className="text-lg">
                גדלתי בפלור, עבדתי בכל תפקיד – ואני יודעת בדיוק מה גורם למקום
                לעבוד טוב באמת.
              </p>
              <p>
                אני מלווה מסעדות וצוותים בבניית שירות מדויק, ניהול רגוע ומכירה
                טבעית.
              </p>
              <p className="font-medium text-[var(--foreground)]">
                בלי רעש. בלי סיסמאות.
                <br />
                רק מה שעובד במשמרת – ומה שנראה בסוף במספרים.
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
                  100+
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  עסקים שליוויתי
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--accent)]">
                  500+
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
            <div className="aspect-[4/5] bg-[var(--border-light)] rounded-lg overflow-hidden">
              {/* Placeholder for Dana's image */}
              <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]">
                <span className="text-sm">תמונה של דנה</span>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--accent)]/10 rounded-lg -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
