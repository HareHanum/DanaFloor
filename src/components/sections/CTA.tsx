"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="section-padding bg-[var(--foreground)] text-white"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Main Question */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            מרגישים שהפלור יכול לעבוד
            <br />
            <span className="text-[var(--accent)]">טוב יותר?</span>
          </h2>

          {/* Supporting Text */}
          <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
            שיחה אחת יכולה לעשות סדר, לדייק כיוון
            <br />
            ולהראות מה באמת אפשר לשפר – כבר עכשיו.
          </p>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="btn btn-accent text-lg px-10 py-4 inline-flex"
          >
            לתיאום שיחת היכרות
          </Link>

          {/* Trust Indicators */}
          <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-white/50 text-sm mb-6">מתאים ל:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "מסעדות",
                "בתי קפה",
                "ברים",
                "מלונות",
                "עגלות קפה",
                "בתי הארחה",
              ].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-white/5 rounded-full text-sm text-white/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
