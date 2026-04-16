"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Send } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const router = useRouter();
  const supabase = createClient();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "אימייל או סיסמה שגויים"
          : "שגיאה בהתחברות. נסה שנית."
      );
      setLoading(false);
      return;
    }

    router.push("/courses");
    router.refresh();
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      setError("שגיאה בשליחת הקישור. נסה שנית.");
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  }

  if (magicLinkSent) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={32} className="text-[var(--accent)]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">בדוק את האימייל שלך</h1>
        <p className="text-[var(--text-secondary)] mb-4">
          שלחנו קישור התחברות ל-
          <strong className="text-[var(--foreground)]">{email}</strong>
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          לא קיבלת? בדוק את תיקיית הספאם או{" "}
          <button
            onClick={() => setMagicLinkSent(false)}
            className="text-[var(--accent)] hover:underline"
          >
            נסה שנית
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">התחברות</h1>

      {/* Mode toggle */}
      <div className="flex rounded-lg bg-[var(--background)] p-1 mb-6">
        <button
          onClick={() => setMode("password")}
          className={`flex-1 py-2 text-sm rounded-md transition-colors ${
            mode === "password"
              ? "bg-white shadow-sm font-medium"
              : "text-[var(--text-secondary)]"
          }`}
        >
          אימייל וסיסמה
        </button>
        <button
          onClick={() => setMode("magic")}
          className={`flex-1 py-2 text-sm rounded-md transition-colors ${
            mode === "magic"
              ? "bg-white shadow-sm font-medium"
              : "text-[var(--text-secondary)]"
          }`}
        >
          קישור קסם
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
        className="space-y-4"
      >
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

        {mode === "password" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text-primary)]"
              >
                סיסמה
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[var(--accent)] hover:underline"
              >
                שכחת סיסמה?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
                dir="ltr"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-accent py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin mx-auto" />
          ) : mode === "password" ? (
            "התחבר"
          ) : (
            "שלח קישור התחברות"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        אין לך חשבון?{" "}
        <Link
          href="/signup"
          className="text-[var(--accent)] font-medium hover:underline"
        >
          הרשמה
        </Link>
      </p>
    </div>
  );
}
