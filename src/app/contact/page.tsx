"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Send, CheckCircle, AlertCircle, MapPin, Clock } from "lucide-react";

const businessTypes = [
  { value: "", label: "בחר/י סוג עסק" },
  { value: "restaurant", label: "מסעדה" },
  { value: "cafe", label: "בית קפה" },
  { value: "hotel", label: "מלון / בוטיק" },
  { value: "catering", label: "קייטרינג / אירועים" },
  { value: "bar", label: "בר / פאב" },
  { value: "coffee-cart", label: "עגלת קפה / דוכן" },
  { value: "other", label: "אחר" },
];

const serviceInterests = [
  { value: "", label: "במה אפשר לעזור?" },
  { value: "consulting", label: "ייעוץ למסעדות" },
  { value: "training", label: "הדרכות לצוותים" },
  { value: "establishment", label: "הקמה וליווי" },
  { value: "results", label: "שיפור תוצאות" },
  { value: "general", label: "שיחת ייעוץ כללית" },
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  businessType: string;
  serviceInterest: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  businessType?: string;
  serviceInterest?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    businessType: "",
    serviceInterest: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "נא להזין שם";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "נא להזין מספר טלפון";
    } else if (!/^0[0-9]{8,9}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "מספר טלפון לא תקין";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }

    if (!formData.businessType) {
      newErrors.businessType = "נא לבחור סוג עסק";
    }

    if (!formData.serviceInterest) {
      newErrors.serviceInterest = "נא לבחור תחום עניין";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          phone: "",
          email: "",
          businessType: "",
          serviceInterest: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
    <main>
      {/* Hero Section */}
      <section className="bg-[var(--foreground)] text-white pt-32 lg:pt-40 pb-20 lg:pb-28">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              בואו נדבר
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              מרגישים שהפלור יכול לעבוד טוב יותר? השאירו פרטים ואחזור אליכם תוך 24 שעות
              לשיחת היכרות קצרה - בלי התחייבות.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-8">
                השאירו פרטים
              </motion.h2>

              {submitStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    הפנייה נשלחה בהצלחה!
                  </h3>
                  <p className="text-green-700">
                    תודה על פנייתך. אחזור אליך תוך 24 שעות.
                  </p>
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="mt-6 text-green-700 underline hover:no-underline"
                  >
                    שליחת פנייה נוספת
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 text-sm">
                        אירעה שגיאה בשליחת הטופס. אנא נסו שוב או צרו קשר ישירות.
                      </p>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      שם מלא <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                        errors.name ? "border-red-500" : "border-[var(--border-light)]"
                      }`}
                      placeholder="איך קוראים לך?"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      טלפון <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                        errors.phone ? "border-red-500" : "border-[var(--border-light)]"
                      }`}
                      placeholder="050-000-0000"
                      dir="ltr"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      אימייל
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                        errors.email ? "border-red-500" : "border-[var(--border-light)]"
                      }`}
                      placeholder="your@email.com"
                      dir="ltr"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="businessType" className="block text-sm font-medium mb-2">
                      סוג העסק <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-white ${
                        errors.businessType ? "border-red-500" : "border-[var(--border-light)]"
                      }`}
                    >
                      {businessTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.businessType && (
                      <p className="mt-1 text-sm text-red-500">{errors.businessType}</p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="serviceInterest" className="block text-sm font-medium mb-2">
                      תחום עניין <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="serviceInterest"
                      name="serviceInterest"
                      value={formData.serviceInterest}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-white ${
                        errors.serviceInterest ? "border-red-500" : "border-[var(--border-light)]"
                      }`}
                    >
                      {serviceInterests.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                    {errors.serviceInterest && (
                      <p className="mt-1 text-sm text-red-500">{errors.serviceInterest}</p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      ספרו לי קצת על העסק והאתגר
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                      placeholder="מה הייתם רוצים לשפר? מה האתגר הכי גדול שלכם היום?"
                    />
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
                          שולח...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          שליחת פנייה
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:pr-8"
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-8">
                או פשוט התקשרו
              </motion.h2>

              <div className="space-y-6">
                {/* Phone */}
                <motion.a
                  variants={itemVariants}
                  href="tel:+972526589291"
                  className="flex items-center gap-4 p-5 bg-[var(--background)] border border-[var(--border-light)] rounded-xl hover:border-[var(--accent)] transition-colors group"
                >
                  <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-colors">
                    <Phone className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] mb-1">טלפון</p>
                    <p className="font-medium text-lg" dir="ltr">052-658-9291</p>
                  </div>
                </motion.a>

                {/* WhatsApp */}
                <motion.a
                  variants={itemVariants}
                  href="https://wa.me/972526589291?text=היי%20דנה%2C%20הגעתי%20מהאתר%20ואשמח%20לשיחת%20ייעוץ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 mb-1">WhatsApp</p>
                    <p className="font-medium text-lg text-green-800">שלחו הודעה עכשיו</p>
                  </div>
                </motion.a>

                {/* Email */}
                <motion.a
                  variants={itemVariants}
                  href="mailto:danashimroni@gmail.com"
                  className="flex items-center gap-4 p-5 bg-[var(--background)] border border-[var(--border-light)] rounded-xl hover:border-[var(--accent)] transition-colors group"
                >
                  <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] mb-1">אימייל</p>
                    <p className="font-medium" dir="ltr">danashimroni@gmail.com</p>
                  </div>
                </motion.a>

                {/* Location */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-4 p-5 bg-[var(--background)] border border-[var(--border-light)] rounded-xl"
                >
                  <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] mb-1">אזור פעילות</p>
                    <p className="font-medium">כל הארץ - הגעה לעסק שלכם</p>
                  </div>
                </motion.div>

                {/* Response Time */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-4 p-5 bg-[var(--background)] border border-[var(--border-light)] rounded-xl"
                >
                  <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] mb-1">זמן תגובה</p>
                    <p className="font-medium">תוך 24 שעות</p>
                  </div>
                </motion.div>
              </div>

              {/* Additional Info */}
              <motion.div
                variants={itemVariants}
                className="mt-10 p-6 bg-[var(--foreground)] text-white rounded-xl"
              >
                <h3 className="text-lg font-bold mb-3">מה קורה בשיחה הראשונה?</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    סיפור קצר על העסק והאתגרים
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    הבנת הצרכים והמטרות שלכם
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    המלצה ראשונית על הכיוון הנכון
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    ללא התחייבות - רק לשמוע ולהבין
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
