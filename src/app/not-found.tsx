"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <div className="relative mb-8">
            <span className="text-[150px] md:text-[200px] font-bold text-[var(--border-light)] leading-none select-none">
              404
            </span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Search size={64} className="text-[var(--accent)]" />
            </motion.div>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--foreground)]">
            העמוד לא נמצא
          </h1>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            נראה שהגעת לעמוד שלא קיים.
            <br />
            אולי הקישור שגוי או שהעמוד הוסר.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Home size={18} />
              חזרה לדף הבית
            </Link>
            <Link
              href="/contact"
              className="btn btn-outline inline-flex items-center gap-2"
            >
              צור קשר
              <ArrowRight size={18} className="rotate-180" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-[var(--border-light)]">
            <p className="text-sm text-[var(--text-muted)] mb-4">
              אולי חיפשת את אחד מהעמודים האלה?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                שירותים
              </Link>
              <Link
                href="/about"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                אודות
              </Link>
              <Link
                href="/services/training"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                הדרכות
              </Link>
              <Link
                href="/services/consulting"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                ייעוץ למסעדות
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
