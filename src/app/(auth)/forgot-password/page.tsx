"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Mail, Loader2, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError("שגיאה בשליחת הקישור. נסה שנית.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={32} className="text-[var(--accent)]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">בדוק את האימייל</h1>
        <p className="text-[var(--text-secondary)]">
          אם החשבון קיים, שלחנו קישור לאיפוס סיסמה ל-
          <strong className="text-[var(--foreground)]">{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold mb-2 text-center">שכחת סיסמה?</h1>
      <p className="text-[var(--text-secondary)] text-sm text-center mb-6">
        הכנס את האימייל שלך ונשלח לך קישור לאיפוס הסיסמה
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-accent py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin mx-auto" />
          ) : (
            "שלח קישור איפוס"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        <Link
          href="/login"
          className="text-[var(--accent)] font-medium hover:underline"
        >
          חזרה להתחברות
        </Link>
      </p>
    </div>
  );
}
