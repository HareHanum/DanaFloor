"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Quote, ChevronRight, ChevronLeft } from "lucide-react";

const testimonials = [
  {
    quote:
      "דנה הגיעה אלינו בתקופה קשה. תוך חודשיים הצוות שלנו התחיל לעבוד אחרת לגמרי – יותר רגוע, יותר מקצועי, ועם תוצאות שמדברות בעד עצמן.",
    author: "רון כהן",
    role: "בעלים, מסעדת ארומה",
    location: "תל אביב",
  },
  {
    quote:
      "היא לא באה עם תיאוריות – היא באה עם כלים פרקטיים שאפשר ליישם מיד. הצוות שלנו אימץ את השיטות תוך ימים.",
    author: "מירב לוי",
    role: "מנהלת תפעול, רשת בתי קפה",
    location: "ירושלים",
  },
  {
    quote:
      "ההדרכה של דנה שינתה את הגישה שלנו למכירה לחלוטין. הממוצע לסועד עלה ב-25% תוך חודש, בלי שום לחץ על האורחים.",
    author: "יוסי אברהם",
    role: "מנכ״ל, מלון בוטיק",
    location: "אילת",
  },
  {
    quote:
      "מה שאהבתי בדנה זה שהיא מבינה את השטח. היא לא מדברת מלמעלה – היא יודעת מה זה לעמוד במשמרת קשה.",
    author: "שירה מזרחי",
    role: "מנהלת מסעדה",
    location: "חיפה",
  },
  {
    quote:
      "הליווי של דנה בהקמת המסעדה החדשה שלנו היה קריטי. היא עזרה לנו לבנות תהליכים נכונים מההתחלה.",
    author: "דוד ישראלי",
    role: "שותף, קבוצת מסעדות",
    location: "רמת גן",
  },
];

interface TestimonialsProps {
  variant?: "light" | "dark";
}

export default function Testimonials({ variant = "light" }: TestimonialsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const bgColor = variant === "dark" ? "bg-[var(--foreground)]" : "bg-white";
  const textColor = variant === "dark" ? "text-white" : "text-[var(--foreground)]";
  const subtextColor = variant === "dark" ? "text-white/70" : "text-[var(--text-secondary)]";

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section ref={ref} className={`section-padding ${bgColor}`} aria-label="המלצות לקוחות" aria-roledescription="קרוסלה">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[var(--accent)] font-bold mb-4 block text-[2rem]">
            המלצות
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold ${textColor}`}>
            מה אומרים הלקוחות
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Main Testimonial Card */}
          <div id="carousel-content" className="relative overflow-hidden" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className={`${variant === "dark" ? "bg-white/10" : "bg-[var(--background)]"} rounded-xl p-8 md:p-12`}
              >
                <Quote size={40} className="text-[var(--accent)] mb-6" />
                <blockquote className={`text-xl md:text-2xl leading-relaxed mb-8 ${textColor}`}>
                  &ldquo;{testimonials[currentIndex].quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                    <span className="text-[var(--accent)] font-bold text-lg">
                      {testimonials[currentIndex].author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className={`font-bold ${textColor}`}>
                      {testimonials[currentIndex].author}
                    </div>
                    <div className={`text-sm ${subtextColor}`}>
                      {testimonials[currentIndex].role}, {testimonials[currentIndex].location}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className={`absolute top-1/2 -translate-y-1/2 -right-4 md:-right-16 w-12 h-12 rounded-full ${
              variant === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-[var(--background)]"
            } shadow-lg flex items-center justify-center transition-colors`}
            aria-label="הקודם"
            aria-controls="carousel-content"
          >
            <ChevronRight size={24} className={textColor} />
          </button>
          <button
            onClick={handleNext}
            className={`absolute top-1/2 -translate-y-1/2 -left-4 md:-left-16 w-12 h-12 rounded-full ${
              variant === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-[var(--background)]"
            } shadow-lg flex items-center justify-center transition-colors`}
            aria-label="הבא"
            aria-controls="carousel-content"
          >
            <ChevronLeft size={24} className={textColor} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[var(--accent)] w-8"
                    : variant === "dark"
                    ? "bg-white/30 hover:bg-white/50"
                    : "bg-[var(--border-light)] hover:bg-[var(--text-muted)]"
                }`}
                aria-label={`עבור להמלצה ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
