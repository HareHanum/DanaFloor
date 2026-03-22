"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header, Footer } from "@/components/layout";
import { Download, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
  firstName: string;
  businessName: string;
  role: string;
  email: string;
  phone: string;
  marketingConsent: boolean;
}

interface FormErrors {
  firstName?: string;
  email?: string;
  phone?: string;
}

export default function WarGuidePage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    businessName: "",
    role: "",
    email: "",
    phone: "",
    marketingConsent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "נא להזין שם פרטי";
    }

    if (!formData.email.trim()) {
      newErrors.email = "נא להזין כתובת אימייל";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "נא להזין מספר טלפון";
    } else if (!/^0[0-9]{8,9}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "מספר טלפון לא תקין";
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
      const response = await fetch("/api/war-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 min-h-[50vh] flex items-center overflow-hidden bg-[var(--foreground)]">
          <div className="relative z-10 container-custom text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-[var(--accent)] font-bold mb-4 block text-[2.25rem]">
                מדריך חינמי
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
                ניהול מסעדה בזמן מלחמה
              </h1>
              <p className="text-2xl md:text-3xl text-white/80 leading-relaxed">
                מדריך קצר, ממוקד ופרקטי לתקופה הזאת
              </p>
            </motion.div>
          </div>
        </section>

        {/* Opening Text */}
        <section className="section-padding bg-[var(--background)]">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="prose prose-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
                <p className="text-3xl text-[var(--foreground)] font-medium">
                  טוב… כולנו מבינים שהתקופה הזאת שוב קצת אחרת.
                </p>
                <p>
                  מסעדות עובדות אחרת.<br />
                  הצוותים עובדים אחרת.<br />
                  וגם האורחים שמגיעים – מגיעים בשביל רגע לנשום.
                </p>
                <p className="text-[var(--text-primary)]">
                  אז הכנתי לכם משהו קטן.<br />
                  מדריך קצר מאוד לניהול מסעדה בזמן מלחמה.<br />
                  ממש קצר… ברמה שאפשר לקרוא אותו גם בזמן שמחכים במקלט.
                </p>
                <p>
                  יש שם כמה דברים באמת פשוטים שאפשר פשוט לעשות:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-[var(--text-primary)]">
                  <li>איך לשמור על הצוות</li>
                  <li>איך לעבוד עם תפריט יותר מדויק</li>
                  <li>איך להחזיק פלור טוב גם כשהקצב משתנה</li>
                </ul>
                <p className="text-[var(--text-primary)]">
                  השארתי אותו חינמי לגמרי כי הרגשתי שזה בדיוק הזמן לשתף.
                </p>
                <p>
                  תוכלו לקבל אותו לאחר מילוי הטופס בחינם.
                </p>
                <p>
                  ואם אתם מרגישים שהצוות צריך רגע של רענון<br />
                  או איזה חיזוק בתקופה הזאת –<br />
                  אפשר גם לעשות הדרכה בזום כדי להישאר בלופ.<br />
                  <a href="/contact" className="text-[var(--accent)] font-medium hover:underline">דברו איתי</a>
                </p>
                <p className="text-[var(--foreground)] font-medium">
                  באהבה,<br />
                  דנה
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="section-padding bg-[var(--foreground)]">
          <div className="container-custom">
            <div className="max-w-xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  אני רוצה לקבל את המדריך
                </h2>
                <p className="text-white/70">
                  השאירו פרטים והמדריך יישלח אליכם מיד
                </p>
              </motion.div>

              {submitStatus === "success" ? (
                <motion.div
                  key="success"
                  role="alert"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    המדריך נשלח למייל!
                  </h3>
                  <p className="text-green-700 mb-4">
                    תודה על הפרטים. המדריך נשלח לכתובת המייל שהזנת.
                  </p>
                  <p className="text-green-600 text-sm">
                    לא קיבלת? בדקו בתיקיית הספאם או <a href="/guides/war-management-guide.pdf" target="_blank" className="underline">לחצו כאן להורדה ישירה</a>
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5 bg-white p-8 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
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

                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      שם פרטי <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                        errors.firstName ? "border-red-500" : "border-[var(--border-light)]"
                      }`}
                      placeholder="השם שלך"
                    />
                    {errors.firstName && (
                      <p id="firstName-error" className="mt-1 text-sm text-red-500" role="alert">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium mb-2">
                      שם העסק
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      placeholder="שם המסעדה או העסק"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium mb-2">
                      תפקיד
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      placeholder="בעלים / מנהל / אחמ״ש"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      אימייל <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "guide-email-error" : undefined}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                        errors.email ? "border-red-500" : "border-[var(--border-light)]"
                      }`}
                      placeholder="your@email.com"
                      dir="ltr"
                    />
                    {errors.email && (
                      <p id="guide-email-error" className="mt-1 text-sm text-red-500" role="alert">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      טלפון <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "guide-phone-error" : undefined}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                        errors.phone ? "border-red-500" : "border-[var(--border-light)]"
                      }`}
                      placeholder="050-000-0000"
                      dir="ltr"
                    />
                    {errors.phone && (
                      <p id="guide-phone-error" className="mt-1 text-sm text-red-500" role="alert">{errors.phone}</p>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="marketingConsent"
                      name="marketingConsent"
                      checked={formData.marketingConsent}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 accent-[var(--accent)]"
                    />
                    <label htmlFor="marketingConsent" className="text-sm text-[var(--text-secondary)]">
                      אני מאשר/ת קבלת עדכונים ותכנים מקצועיים מ-FLOOR D.a.N.A
                    </label>
                  </div>

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
                        <Download size={18} />
                        להורדת המדריך
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-[var(--text-muted)]">
                    הפרטים ישמשו לשליחת המדריך ועדכונים מקצועיים בלבד
                  </p>
                </motion.form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
