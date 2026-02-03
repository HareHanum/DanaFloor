"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";

const timelineEvents = [
  {
    year: "2008",
    title: "ההתחלה בשטח",
    description:
      "התחלתי כמלצרית צעירה במסעדה עמוסה בתל אביב. למדתי מה זה לחץ אמיתי, ואיך לשרוד משמרת בלי לאבד את החיוך.",
  },
  {
    year: "2011",
    title: "מנהלת משמרת",
    description:
      "קודמתי לניהול משמרות. גיליתי שהאתגר האמיתי הוא לא רק לעבוד קשה, אלא לגרום לאחרים לעבוד ביחד.",
  },
  {
    year: "2014",
    title: "מנהלת מסעדה",
    description:
      "לקחתי אחריות מלאה על מסעדה. שם הבנתי לעומק איך כל חלק בעסק משפיע על התוצאה הסופית.",
  },
  {
    year: "2017",
    title: "התחלתי ללוות עסקים",
    description:
      "הבנתי שיש לי משהו לתת. התחלתי ללוות מסעדות וצוותים, ולהעביר את מה שלמדתי בשטח.",
  },
  {
    year: "2020",
    title: "הקמת FLOOR D.A.N.A",
    description:
      "הקמתי את החברה שלי. המיקוד: להביא לכל עסק אירוח את הכלים והגישה שגורמים לפלור לעבוד באמת.",
  },
  {
    year: "היום",
    title: "ליווי עשרות עסקים",
    description:
      "מלווה מסעדות, בתי קפה, מלונות ועסקי אירוח בכל הארץ. משלבת הדרכות צוות, ייעוץ ניהולי ובניית תהליכים.",
  },
];

const philosophyPoints = [
  {
    title: "שירות זה לא נימוסים",
    description:
      "שירות אמיתי זה לא לחייך ולהגיד בבקשה. זה להבין מה האורח צריך עוד לפני שהוא מבקש, ולספק את זה בצורה טבעית.",
  },
  {
    title: "מכירה זה לא לחץ",
    description:
      "מכירה טובה היא המלצה כנה. כשהמלצר מאמין במה שהוא מציע, האורח מרגיש את זה ורוצה לנסות.",
  },
  {
    title: "ניהול זה לא פיקוח",
    description:
      "מנהל טוב יוצר סביבה שבה אנשים רוצים לעבוד טוב. לא צריך לעקוב אחרי כולם – צריך לתת להם סיבה להיות מצוינים.",
  },
  {
    title: "תוצאות בונים בשקט",
    description:
      "בלי סיסמאות, בלי הבטחות ריקות. עבודה יומיומית על הדברים הקטנים היא זו שבונה עסק מצליח לטווח ארוך.",
  },
];

export default function AboutPage() {
  const storyRef = useRef(null);
  const timelineRef = useRef(null);
  const philosophyRef = useRef(null);

  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });
  const philosophyInView = useInView(philosophyRef, { once: true, margin: "-100px" });

  return (
    <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-[var(--foreground)] to-[#2a2a2a]">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 container-custom text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-[var(--accent)] font-medium mb-4 block">
                אודות
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                דנה שימרוני
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                יועצת ומדריכה לעסקי אירוח. גדלתי בפלור, עבדתי בכל תפקיד – ואני יודעת
                בדיוק מה גורם למקום לעבוד טוב באמת.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent" />
        </section>

        {/* Story Section */}
        <section ref={storyRef} className="section-padding bg-[var(--background)]">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative order-2 lg:order-1"
              >
                <div className="aspect-[4/5] bg-[var(--border-light)] rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]">
                    <span className="text-sm">תמונה של דנה</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--accent)]/10 rounded-lg -z-10" />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--foreground)]/5 rounded-lg -z-10" />
              </motion.div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <span className="text-[var(--accent)] font-medium mb-4 block">
                  הסיפור שלי
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  מהפלור אל הליווי
                </h2>
                <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                  <p className="text-lg">
                    התחלתי לעבוד במסעדות בגיל 18. לא כי תכננתי קריירה בתחום – פשוט
                    הייתי צריכה לעבוד. אבל משהו בעולם הזה תפס אותי.
                  </p>
                  <p>
                    עברתי את כל השלבים: מלצרית, ברמנית, מנהלת משמרת, ולבסוף מנהלת
                    מסעדה. כל תפקיד לימד אותי משהו אחר – על אנשים, על לחץ, על מה
                    שבאמת חשוב כשהמסעדה מלאה והמטבח בוער.
                  </p>
                  <p>
                    הבנתי שאני לא רק אוהבת לעבוד בשטח – אני גם יודעת להסביר לאחרים
                    איך לעשות את זה נכון. התחלתי להדריך צוותים, ללוות מנהלים, ולעזור
                    לעסקים לבנות את עצמם מחדש.
                  </p>
                  <p className="text-[var(--foreground)] font-medium">
                    היום אני מלווה עסקי אירוח בכל הארץ. המטרה שלי פשוטה: לתת לכם את
                    הכלים והגישה שיגרמו לפלור שלכם לעבוד – בלי רעש, בלי סיסמאות, רק
                    מה שבאמת עובד בשטח.
                  </p>
                </div>

                {/* Quote */}
                <div className="mt-8 p-6 bg-white rounded-lg border-r-4 border-[var(--accent)]">
                  <Quote size={24} className="text-[var(--accent)] mb-3" />
                  <p className="text-lg font-medium text-[var(--foreground)]">
                    &ldquo;אני לא מאמינה בפתרונות קסם. אני מאמינה בעבודה, בהקשבה, ובהבנה
                    שכל עסק הוא סיפור אחר.&rdquo;
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section ref={timelineRef} className="section-padding bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={timelineInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-[var(--accent)] font-medium mb-4 block">
                המסע שלי
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">הדרך בשטח</h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-[var(--border-light)]" />

                {/* Timeline events */}
                <div className="space-y-8">
                  {timelineEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative flex gap-6"
                    >
                      {/* Year bubble */}
                      <div className="flex-shrink-0 w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                        {event.year}
                      </div>
                      {/* Content */}
                      <div className="flex-1 bg-[var(--background)] rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-[var(--text-secondary)]">
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section ref={philosophyRef} className="section-padding bg-[var(--background)]">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={philosophyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-[var(--accent)] font-medium mb-4 block">
                הגישה שלי
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">פילוסופיה</h2>
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                ארבעת העקרונות שמנחים אותי בעבודה עם כל עסק
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {philosophyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={philosophyInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 border border-[var(--border-light)] hover:border-[var(--accent)] transition-colors duration-300"
                >
                  <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-[var(--accent)] font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding bg-[var(--foreground)] text-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">
                  15+
                </div>
                <div className="text-white/70">שנות ניסיון</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">
                  100+
                </div>
                <div className="text-white/70">עסקים שליוויתי</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">
                  500+
                </div>
                <div className="text-white/70">אנשי צוות הודרכו</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">
                  95%
                </div>
                <div className="text-white/70">לקוחות ממליצים</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                בואו נדבר על העסק שלכם
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8">
                אשמח לשמוע על האתגרים שלכם ולבדוק איך אני יכולה לעזור.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn btn-accent text-lg px-8 py-4">
                  לתיאום שיחת היכרות
                </Link>
                <Link
                  href="/services"
                  className="btn btn-outline text-lg px-8 py-4"
                >
                  <span className="flex items-center gap-2">
                    לשירותים שלי
                    <ArrowLeft size={18} />
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
  );
}
