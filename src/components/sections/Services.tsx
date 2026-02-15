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
  },
  {
    icon: Users,
    title: "הדרכות לצוותים",
    description:
      "הדרכות שירות, מכירה ותפקיד. הצוות שלכם הוא הפנים של העסק – נעניק להם ביטחון וכלים.",
    href: "/services/training",
  },
  {
    icon: Building2,
    title: "הקמה וליווי",
    description:
      "ליווי מסעדות חדשות מההקמה ועד הפתיחה. בניית צוות, נהלים, ספר מסעדה וסטנדרט שירות.",
    href: "/services/establishment",
  },
  {
    icon: TrendingUp,
    title: "שיפור תוצאות",
    description:
      "יום שטח עם שיפור בלייב או דוח אבחון מקיף. רואים את השינוי כבר באותו הערב.",
    href: "/services/results",
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-[var(--accent)] font-bold mb-4 block text-[2rem]">
            השירותים שלנו
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            אז במה אני עוזרת?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg">
            להביא את פלור למקסימום
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={service.href}
                className="group block p-8 bg-[var(--background)] rounded-lg hover:shadow-lg transition-all duration-300 h-full"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--accent)] transition-colors">
                    <service.icon
                      size={24}
                      aria-hidden="true"
                      className="text-[var(--accent)] group-hover:text-white transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
                      למידע נוסף
                      <ArrowLeft
                        size={16}
                        aria-hidden="true"
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
  );
}
