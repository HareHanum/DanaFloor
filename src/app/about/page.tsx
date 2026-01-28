"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { ArrowLeft, Quote } from "lucide-react";

export default function AboutPage() {
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });

  return (
    <>
      <Header />
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
                מומחית לשירות, תפעול וחווית לקוח בענף המסעדנות והאירוח - מומחית ביצירת D.N.A של הצלחה לפלור
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
                <div className="aspect-[4/5] rounded-lg overflow-hidden relative">
                  <Image
                    src="/media/dana-hero.png"
                    alt="דנה שימרוני - יועצת אירוח"
                    fill
                    className="object-cover object-top"
                  />
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
                  אני דנה שימרוני
                </h2>
                <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                  <p className="text-lg">
                    אני מלווה מסעדות, בתי קפה ומלונות בבניית שירות מדויק, ניהול רגוע ומכירה טבעית. אני יודעת לאבחן במהירות את מצב הפלור, להדריך מנהלים וצוותים, ומתרגמת ניסיון מעשי לשיטה ברורה שעובדת יום־יום, משפרת את חווית הלקוח ומגדילה הכנסות.
                  </p>
                  <p>
                    הסיפור שלי התחיל בפלור הרבה לפני שידעתי לקרוא לזה מקצוע. בגיל 15 התחלתי למלצר. לא הייתי &quot;כוכבת&quot;. להפך – קראו לי לשיחת שימוע. אמרו לי שאני מרחפת, עובדת לאט, לא מספיק מחוברת. השיחה הזו הייתה נקודת מפנה. לא שיניתי אישיות – שיניתי הסתכלות. באותו רגע הבנתי שאני יכולה לבחור קצב, לבחור נוכחות, לבחור דיוק. ומשם – פשוט לא עצרתי.
                  </p>
                  <p>
                    עבדתי בקפה ג׳ו בקניון יהוד, התקדמתי בין תפקידים, נכנסתי לבר ולקפה, למדתי מה זה פלור מבפנים. המשכתי לברים ומסעדות ביהוד והסביבה – כמארחת, מלצרית, ברמנית ואחראית משמרת – עד שהבנתי לעומק את כל נקודות המפגש: בין צוות לאורח, בין שירות למטבח, בין עומס לשקט.
                  </p>
                  <p>
                    במקביל שירתי כמש&quot;קית חינוך בתותחנים, תפקיד שחיזק אצלי יכולת הובלה, אחריות וקריאת אנשים. אחרי השחרור המשכתי לעולם המסעדנות במלוא העוצמה: מסעדות בשרים, ברים שכונתיים, בתי קפה, ניהול פלור וניהול ברים, פתיחת מסעדות מאפס, עבודה במלונות, וליווי צוותים בתקופות עומס ושינוי.
                  </p>
                  <p>
                    לא הסתפקתי בעשייה – רציתי להבין לעומק. למדתי מסעדנות בשנקר, טבחות, קונדיטוריה, ברמנות. עבדתי כטבחית, כקונדיטורית, ניהלתי ויטרינות, לוביים, ברים ופלורים – מהמרכז ועד אילת. כל תפקיד הוסיף עוד שכבה להבנה שלי: איך שירות נראה באמת, ואיך ניהול משפיע ישירות על החוויה – ועל התוצאות.
                  </p>
                  <p>
                    לאורך השנים גיבשתי שיטה. לא כתובה על מצגות – אלא בנויה מהשטח. שיטה שמחברת בין אנשים, קצב, תנועה, שפה והתנהלות – ויוצרת פלור שעובד. בחמש השנים האחרונות אני מעבירה הדרכות וליווי למאות מלצרים, אחמ&quot;שים, מארחות ומנהלים. אני נכנסת למשמרות, עומדת ליד הצוות, מתקנת בלייב, מחדדת שפה, ומחזירה שקט וביטחון לעבודה היומיומית.
                  </p>
                  <p>
                    FLOOR D.a.N.A נולדה מתוך כל זה. אני יודעת לבנות לכל פלור את ה-ד.נ.א הנכון עבורו כדי להביא אותו למקסימום - גישה שמבוססת על ניסיון אמיתי, הבנה אנושית, ויכולת לתרגם כאוס למערכת שעובדת.
                  </p>
                  <p>
                    אני חיה ונושמת אירוח. אוהבת את הפלור, מבינה אותו לעומק, ויודעת לזהות בדיוק איפה הדברים נתקעים – ואיך משחררים אותם.
                  </p>
                  <p className="text-[var(--foreground)] font-medium">
                    אשמח לסייע לכם בייעוץ, הדרכות ובהקמה עם נוכחות, דיוק ותוצאות שמורגשים מהרגע הראשון!
                  </p>
                </div>

                {/* Quote */}
                <div className="mt-8 p-6 bg-white rounded-lg border-r-4 border-[var(--accent)]">
                  <Quote size={24} className="text-[var(--accent)] mb-3" />
                  <p className="text-lg font-medium text-[var(--foreground)]">
                    D.N.A של שירות, ניהול ואנשים. שמביא לחוויה ומגדיל רווח.
                  </p>
                </div>
              </motion.div>
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
                  50+
                </div>
                <div className="text-white/70">עסקים שליוויתי</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">
                  400+
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
      <Footer />
    </>
  );
}
