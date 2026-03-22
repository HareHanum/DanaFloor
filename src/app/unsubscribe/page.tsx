"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MailX, CheckCircle, AlertCircle, Send } from "lucide-react";

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("נא להזין כתובת אימייל");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("כתובת אימייל לא תקינה");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <main id="main-content">
      <section className="pt-32 lg:pt-40 pb-20 lg:pb-28 section-padding">
        <div className="container-custom max-w-lg mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <MailX className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-6" />
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-3xl lg:text-4xl font-bold mb-4">
              הסרה מרשימת הדיוור
            </motion.h1>

            <motion.p variants={itemVariants} className="text-[var(--text-muted)] mb-10">
              הזינו את כתובת האימייל שלכם כדי להסיר אותה מרשימת הדיוור שלנו.
            </motion.p>

            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  key="success"
                  role="alert"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-green-800 mb-2">
                    הבקשה התקבלה
                  </h2>
                  <p className="text-green-700">
                    אם כתובת האימייל קיימת ברשימת הדיוור שלנו, היא תוסר בהקדם.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6 text-right"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  variants={containerVariants}
                >
                  {submitStatus === "error" && (
                    <motion.div
                      role="alert"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 text-sm">
                        אירעה שגיאה. אנא נסו שוב.
                      </p>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      כתובת אימייל
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      aria-required="true"
                      aria-invalid={!!error}
                      aria-describedby={error ? "email-error" : undefined}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                        error ? "border-red-500" : "border-[var(--border-light)]"
                      }`}
                      placeholder="your@email.com"
                      dir="ltr"
                    />
                    {error && (
                      <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                        {error}
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-accent w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          מסיר...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          הסרה מהרשימה
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeForm />
    </Suspense>
  );
}
