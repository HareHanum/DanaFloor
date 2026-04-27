"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";

export default function ImportCourseButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch("/api/admin/courses/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const body = (await res.json()) as {
        ok?: boolean;
        course_id?: string;
        slug?: string;
        error?: string;
      };

      if (!res.ok || !body.ok) {
        setError(body.error || "ייבוא נכשל");
        setBusy(false);
        return;
      }

      router.push(`/admin/courses/${body.course_id}`);
      router.refresh();
    } catch (err) {
      setError(`שגיאה בקריאת הקובץ: ${(err as Error).message}`);
      setBusy(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={busy}
        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[var(--border-light)] rounded-lg hover:bg-[var(--background)] disabled:opacity-50 transition-colors"
        title="ייבוא קורס מקובץ JSON"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        ייבוא JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFile}
        className="hidden"
      />
      {error && (
        <p className="text-xs text-red-600 mt-1 max-w-md" dir="ltr">
          {error}
        </p>
      )}
    </>
  );
}
