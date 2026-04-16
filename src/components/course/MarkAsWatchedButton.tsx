"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface MarkAsWatchedButtonProps {
  lessonId: string;
  courseId: string;
  initialCompleted: boolean;
}

export default function MarkAsWatchedButton({
  lessonId,
  courseId,
  initialCompleted,
}: MarkAsWatchedButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);

    const newStatus = !completed;

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId,
        courseId,
        progressSeconds: 0,
        markAs: newStatus ? "completed" : "not_started",
      }),
    });

    setCompleted(newStatus);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-base font-medium transition-all disabled:opacity-70 ${
        completed
          ? "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
          : "bg-white text-[var(--text-primary)] border-2 border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
      }`}
    >
      {loading ? (
        <Loader2 size={22} className="animate-spin" />
      ) : completed ? (
        <CheckCircle size={22} className="text-green-500" />
      ) : (
        <Circle size={22} className="text-[var(--text-muted)]" />
      )}
      {completed ? "נצפה ✓" : "סמן כנצפה"}
    </button>
  );
}
