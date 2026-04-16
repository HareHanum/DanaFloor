"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2, Save, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSaved(false);

    await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
      })
      .eq("id", user.id);

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-6">הגדרות חשבון</h1>

      <div className="max-w-lg bg-white rounded-xl border border-[var(--border-light)] p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">אימייל</label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg bg-[var(--background)] text-[var(--text-muted)] text-base"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">שם מלא</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">טלפון</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
              dir="ltr"
              placeholder="050-1234567"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-accent py-2.5 px-6 text-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : saved ? (
              <span className="flex items-center gap-1">
                <CheckCircle size={16} />
                נשמר
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Save size={16} />
                שמור שינויים
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
