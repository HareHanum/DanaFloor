"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  HandHelping,
  TrendingUp,
  UserCog,
  ClipboardList,
  ArrowLeft,
  UtensilsCrossed,
  Wine,
  Heart,
  DoorOpen,
  Beer,
  ShieldCheck,
  Coffee,
} from "lucide-react";
import ServiceNav from "@/components/ui/ServiceNav";

const trainingTypes: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    icon: HandHelping,
    title: "הדרכת שירות",
    description:
      "תסריטי שירות בכל שלבי חוויית הלקוח, התאמת תקשורת לסוגי לקוחות שונים, טיפול בתלונות ושחזור חוויה – והתנהלות מקצועית גם בשעות העומס.",
    href: "/services/training/service",
  },
  {
    icon: TrendingUp,
    title: "הדרכת מכירה",
    description:
      "הדרכה שמלמדת את הצוות למכור בצורה אלגנטית, טבעית ולא דוחפת – כחלק בלתי נפרד מהשירות. זיהוי הזדמנויות בזמן אמת, הגדלת ממוצע לסועד והצעת ערך מדויקת.",
    href: "/services/training/sales",
  },
  {
    icon: UtensilsCrossed,
    title: "הדרכת תפריט",
    description:
      "העמקת היכרות הצוות עם התפריט וחיזוק הביטחון בהצגת מנות, משקאות והתאמות לאורחים שונים. לספר את הסיפור שמאחורי המנה וליצור חוויה מקצועית מההזמנה ועד ההגשה.",
    href: "/services/training/menu",
  },
  {
    icon: Wine,
    title: "הדרכת יין ואלכוהול",
    description:
      "ידע מעשי וביטחון בעולם היין והאלכוהול, לצד יכולת להמליץ ולמכור בצורה מקצועית ונעימה. חיבור בין ידע, טקס הגשה וחוויית שירות – גם בשגרה וגם בעומס.",
    href: "/services/training/wine",
  },
  {
    icon: Heart,
    title: "הדרכת אירוח",
    description:
      "יצירת חוויית אירוח אנושית, חמה וזכירה – מעבר לביצוע טכני של שירות. לראות את האורח, לנהל תקשורת אמפתית וליצור \"רגעים קטנים\" שמשאירים רושם גדול.",
    href: "/services/training/hospitality",
  },
  {
    icon: DoorOpen,
    title: "הדרכת מארחות",
    description:
      "חיזוק עמדת הקבלה כנקודת מפתח בחוויית האורח ובניהול הזרימה במסעדה. שליטה בעומסים, תיאום עם הפלור והמטבח, ויצירת פתיחה מקצועית ונעימה לכל ביקור.",
    href: "/services/training/hostess",
  },
  {
    icon: Beer,
    title: "הדרכת ברמנים ושירות בר",
    description:
      "ייעול העבודה בבר, חיזוק נוכחות מקצועית ושיפור איכות השירות גם בשעות שיא. עבודה נקייה, מדויקת ובקצב נכון – תוך שמירה על קשר עם האורח.",
    href: "/services/training/bar",
  },
  {
    icon: ShieldCheck,
    title: "הדרכת אחמ\"שים ומנהלי משמרת",
    description:
      "כלים לניהול משמרת בזמן אמת, קבלת החלטות תחת לחץ והובלת צוות בצורה ברורה ובטוחה. מנהלי משמרת שיודעים לשלוט בקצב, לפתור תקלות ולהחזיק את הרצפה.",
    href: "/services/training/shift-managers",
  },
  {
    icon: Coffee,
    title: "הדרכת קפה",
    description:
      "הדרכה מקצועית שמעלה את רמת הקפה, הדיוק והאחידות – מהאספרסו ועד ההגשה ללקוח. עבודה נכונה עם הציוד, שמירה על איכות תחת לחץ וחוויית קפה שמחזקת את המותג.",
    href: "/services/training/coffee",
  },
];

export default function TrainingPage() {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const ctaRef = useRef(null);

  const gridInView = useInView(gridRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 min-h-[60vh] flex items-center overflow-hidden"
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/media/training-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container-custom text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-[var(--accent)] font-bold text-[2rem] mb-6 block">
                הדרכות מקצועיות
              </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
              הדרכות לצוותים
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 leading-relaxed max-w-2xl">
              הצוות שלכם הוא הפנים של העסק. אני נותנת להם את הביטחון, הכלים
              והידע לתת שירות יוצא מן הכלל ולמכור בלי להתאמץ.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--background)] to-transparent hidden" />
      </section>

      {/* Service Navigation */}
      <ServiceNav />

      {/* Intro Section */}
      <section className="section-padding bg-[var(--background)]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                למה הדרכה עושה את ההבדל?
              </h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                עובד שמרגיש בטוח בתפקיד שלו נותן שירות טוב יותר, מוכר יותר ונשאר
                יותר זמן. ההדרכות שלי בנויות מניסיון אמיתי בשטח – לא תיאוריה,
                אלא כלים שעובדים.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Training Types Grid */}
      <section ref={gridRef} className="section-padding bg-white">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            סוגי הדרכות
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {trainingTypes.map((training, index) => (
              <motion.div
                key={training.title}
                initial={{ opacity: 0, y: 30 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={training.href}
                  className="group block p-8 bg-[var(--background)] rounded-lg hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--accent)] transition-colors">
                      <training.icon
                        size={24}
                        className="text-[var(--accent)] group-hover:text-white transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {training.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                        {training.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
                        למידע נוסף
                        <ArrowLeft
                          size={16}
                          className="group-hover:-translate-x-1 transition-transform"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Me Section */}
      <section className="section-padding bg-[var(--background)]">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "ניסיון אמיתי",
                description:
                  "15+ שנים בשטח, מהפלור ועד ניהול. אני יודעת מה עובד כי עשיתי את זה.",
              },
              {
                title: "התאמה אישית",
                description:
                  "כל הדרכה נבנית לפי העסק שלכם, הצוות שלכם והאתגרים שלכם.",
              },
              {
                title: "תוצאות מדידות",
                description:
                  "רואים את ההבדל כבר באותו ערב. לא רק תיאוריה – כלים ליישום מיידי.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[var(--text-secondary)]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="section-padding bg-[var(--foreground)] text-white"
      >
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              רוצים צוות שעובד אחרת?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              בואו נדבר על הדרכה שתעשה את ההבדל.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn btn-accent text-lg px-8 py-4">
                לתיאום שיחת היכרות
              </Link>
              <Link
                href="/services"
                className="btn border-2 border-white text-white hover:bg-white hover:text-[var(--foreground)] text-lg px-8 py-4 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  לכל השירותים
                  <ArrowLeft size={18} />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
