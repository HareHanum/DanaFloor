"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, LucideIcon } from "lucide-react";
import ServiceNav from "@/components/ui/ServiceNav";

interface ServicePageLayoutProps {
  // Hero section
  icon: LucideIcon;
  title: string;
  subtitle: string;
  heroDescription: string;
  heroVideo?: string;
  backLink?: string;
  backText?: string;

  // Problem/Solution
  problemTitle: string;
  problemDescription: string;
  solutionTitle: string;
  solutionDescription: string;

  // What's included
  includesTitle?: string;
  includesList: string[];

  // Process
  processTitle?: string;
  processSteps: {
    number: string;
    title: string;
    description: string;
  }[];

  // FAQ
  faqs?: { question: string; answer: string }[];

  // CTA
  ctaTitle?: string;
  ctaDescription?: string;

  // Navigation mode
  navMode?: "services" | "trainings";

  // Optional: Additional content
  children?: ReactNode;
}

export default function ServicePageLayout({
  title,
  subtitle,
  heroDescription,
  heroVideo,
  backLink,
  backText,
  problemTitle,
  problemDescription,
  solutionTitle,
  solutionDescription,
  includesTitle = "מה כולל השירות?",
  includesList,
  processTitle = "איך זה עובד?",
  processSteps,
  faqs,
  ctaTitle = "מרגישים שזה מה שאתם צריכים?",
  ctaDescription = "בואו נדבר ונבין יחד מה הדרך הנכונה לעסק שלכם.",
  navMode = "services",
  children,
}: ServicePageLayoutProps) {
  const problemRef = useRef(null);
  const includesRef = useRef(null);
  const processRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  const problemInView = useInView(problemRef, { once: true, margin: "-100px" });
  const includesInView = useInView(includesRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-[60vh] flex items-center overflow-hidden">
        {/* Video Background */}
        {heroVideo ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--foreground)] to-[#2a2a2a]" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container-custom text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {backLink && backText && (
              <Link
                href={backLink}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium"
              >
                <ArrowRight size={16} aria-hidden="true" />
                <span>{backText}</span>
              </Link>
            )}
            <span className="text-[var(--accent)] font-bold text-[2rem] mb-6 block">{subtitle}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
              {title}
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 leading-relaxed max-w-2xl">
              {heroDescription}
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--background)] to-transparent hidden" />
      </section>

      {/* Service Navigation */}
      <ServiceNav mode={navMode} />

      {/* What's Included Intro */}
      <section ref={problemRef} className="section-padding bg-[var(--background)]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {problemTitle}
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed text-2xl">
              {problemDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Included Section */}
      <section ref={includesRef} className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={includesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              {includesTitle}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {includesList.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={includesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-[var(--background)] rounded-lg"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <span className="text-[var(--text-primary)]">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="section-padding bg-[var(--background)]">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            {processTitle}
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={processInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {step.number}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Optional Children Content */}
      {children}

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section ref={faqRef} className="section-padding bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-[var(--accent)] font-bold mb-4 block text-[2rem]">
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
                  animate={faqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[var(--background)] rounded-xl border border-[var(--border-light)] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-right cursor-pointer"
                    aria-expanded={openFaqIndex === index}
                    aria-controls={`service-faq-${index}`}
                  >
                    <span className="text-lg font-bold text-[var(--text-primary)] leading-relaxed">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={22}
                      aria-hidden="true"
                      className={`text-[var(--accent)] shrink-0 mr-4 transition-transform duration-300 ${
                        openFaqIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    id={`service-faq-${index}`}
                    role="region"
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaqIndex === index
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
      )}

      {/* CTA Section */}
      <section ref={ctaRef} className="section-padding bg-[var(--foreground)] text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaTitle}</h2>
            <p className="text-white/70 text-lg mb-8">{ctaDescription}</p>
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
    </main>
  );
}
