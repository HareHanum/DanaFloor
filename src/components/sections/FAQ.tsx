"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "מה קורה אם אני לא בטוח שזה מה שהמקום צריך?",
    answer:
      "זו בדיוק הסיבה שמתחילים בשיחה. אנחנו בודקים יחד אם יש התאמה ואם זה נכון עכשיו. אם לא, אני אומרת את זה בצורה פתוחה.",
  },
  {
    question: "איך מתחילים?",
    answer:
      "בדרך כלל מתחילים בשיחה. מבינים איפה המקום עומד, מה האתגר המרכזי ומה באמת צריך. משם בודקים יחד אם ואיך נכון לעבוד. לא כל מקום חייב תהליך, ואם זה לא מדויק אני אומרת את זה.",
  },
  {
    question: "האם השירות מתאים גם למקומות קטנים?",
    answer:
      "כן. גם מקומות קטנים עובדים בעומס, מתמודדים עם צוות, שירות ומכירה. לפעמים דווקא מקום קטן מרוויח יותר מסדר נכון והחלטות ברורות, כי כל שינוי קטן מורגש מיד בשטח.",
  },
  {
    question: "למי השירותים שלי מתאימים?",
    answer:
      "השירותים שלי מתאימים לבעלי מסעדות וברים, מנהלים ומנהלי משמרת, וגם לצוותים בכירים שרוצים שהמקום יעבוד טוב יותר ביומיום. זה יכול להיות בר קטן או מסעדה גדולה, מקום חדש או עסק ותיק. כל מקום שיש בו שירות, מכירה ועבודה בצוות, ומרגיש שיש פוטנציאל שאפשר לממש בצורה מדויקת יותר.",
  },
  {
    question: "האם את מתאימה גם למקומות שכבר עובדים חזק?",
    answer:
      "כן. הרבה מהעבודה שלי היא דווקא עם מקומות שעובדים חזק, אבל מרגישים שיש שחיקה, בלגן בעומס או חוסר עקביות. במקומות כאלה דיוקים קטנים עושים הבדל גדול.",
  },
];

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="section-padding bg-[var(--background)]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[var(--accent)] font-medium mb-4 block">
            שאלות ותשובות
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            שאלות שעולות הרבה
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-[var(--border-light)] overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 text-right cursor-pointer"
              >
                <span className="text-lg font-bold text-[var(--text-primary)] leading-relaxed">
                  {faq.question}
                </span>
                <ChevronDown
                  size={22}
                  className={`text-[var(--accent)] shrink-0 mr-4 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-[var(--text-secondary)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
