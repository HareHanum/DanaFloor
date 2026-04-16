"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות לא תואמות");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("שגיאה באיפוס הסיסמה. נסה שנית.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/courses");
    }, 2000);
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">הסיסמה עודכנה!</h1>
        <p className="text-[var(--text-secondary)]">
          מעביר אותך לאזור הקורסים...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">סיסמה חדשה</h1>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
          >
            סיסמה חדשה
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1 text-[var(--text-primary)]"
          >
            אימות סיסמה
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="הכנס שוב את הסיסמה"
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
            "עדכן סיסמה"
          )}
        </button>
      </form>
    </div>
  );
}
