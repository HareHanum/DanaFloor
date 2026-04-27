"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || undefined,
        },
      },
    });

    if (error) {
      // Don't differentiate between "already registered" and other errors —
      // that would let an attacker enumerate which emails have accounts.
      // Server-side details still go to logs for our own debugging.
      console.error("Signup error:", error);
      setError(
        "ההרשמה נכשלה. ייתכן שהאימייל כבר רשום או שהפרטים אינם תקינים. אם כבר יש לך חשבון, נסה להתחבר."
      );
      setLoading(false);
      return;
    }

    // Subscribe to marketing emails if consented
    if (marketingConsent && email) {
      try {
        await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name: fullName }),
        });
      } catch {
        // Don't block signup if marketing subscription fails
      }
    }

    router.push("/courses");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">הרשמה</h1>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
          >
            שם מלא
          </label>
          <div className="relative">
            <User
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="השם המלא שלך"
              className="w-full pr-10 pl-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
          >
            אימייל
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pr-10 pl-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
          >
            טלפון{" "}
            <span className="text-[var(--text-muted)] font-normal">
              (לא חובה)
            </span>
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="050-1234567"
              className="w-full pr-10 pl-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
          >
            סיסמה
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="לפחות 6 תווים"
              className="w-full pr-10 pl-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
              dir="ltr"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-1 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <span className="text-sm text-[var(--text-secondary)]">
            אני מאשר/ת קבלת עדכונים, טיפים ומבצעים במייל
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-accent py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin mx-auto" />
          ) : (
            "הרשמה"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        כבר יש לך חשבון?{" "}
        <Link
          href="/login"
          className="text-[var(--accent)] font-medium hover:underline"
        >
          התחבר
        </Link>
      </p>
    </div>
  );
}
