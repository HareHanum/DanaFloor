"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Building2,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

const services = [
  {
    icon: Search,
    title: "ייעוץ למסעדות",
    description:
      "אבחון תהליכי עבודה, ניתוח חוויית לקוח ובניית תשתית מקצועית. מבט חיצוני שמזהה מה צריך לשפר.",
    href: "/services/consulting",
    features: ["אבחון יום מלא", "דוח מפורט", "המלצות ליישום"],
  },
  {
    icon: Users,
    title: "הדרכות לצוותים",
    description:
      "הדרכות שירות, מכירה ותפקיד. הצוות שלכם הוא הפנים של העסק – נעניק להם ביטחון וכלים.",
    href: "/services/training",
    features: ["הדרכת שירות", "הדרכת מכירה", "הדרכת מנהלים"],
  },
  {
    icon: Building2,
    title: "הקמה וליווי",
    description:
      "ליווי מסעדות חדשות מההקמה ועד הפתיחה. בניית צוות, נהלים, ספר מסעדה וסטנדרט שירות.",
    href: "/services/establishment",
    features: ["ספר מסעדה", "הדרכות פתיחה", "ליווי צמוד"],
  },
  {
    icon: TrendingUp,
    title: "שיפור תוצאות",
    description:
      "יום שטח עם שיפור בלייב או דוח אבחון מקיף. רואים את השינוי כבר באותו הערב.",
    href: "/services/results",
    features: ["יום שטח", "שיפור בלייב", "תוצאות מידיות"],
  },
];

export default function ServicesPage() {
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
        className="relative pt-32 pb-20 bg-gradient-to-b from-[var(--foreground)] to-[#2a2a2a]"
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container-custom text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
              השירותים שלנו
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 leading-relaxed">
              מייעוץ וליווי ועד הדרכות צוות – כל מה שהעסק שלכם צריך כדי לתת
              שירות, מכירה ואירוח ברמה אחרת.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--background)] to-transparent hidden" />
      </section>

      {/* Services Grid */}
      <section ref={gridRef} className="section-padding bg-[var(--background)]">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={service.href}
                  className="group block p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center group-hover:bg-[var(--accent)] transition-colors">
                      <service.icon
                        size={28}
                        className="text-[var(--accent)] group-hover:text-white transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-xs px-3 py-1 bg-[var(--background)] rounded-full text-[var(--text-secondary)]"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
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
              לא בטוחים מה מתאים לכם?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              בואו נדבר. בשיחה קצרה נבין יחד מה הדרך הנכונה לעסק שלכם.
            </p>
            <Link href="/contact" className="btn btn-accent text-lg px-8 py-4">
              לתיאום שיחת היכרות
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
