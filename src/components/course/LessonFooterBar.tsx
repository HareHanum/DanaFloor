"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle, Circle, Loader2 } from "lucide-react";

interface LessonFooterBarProps {
  courseSlug: string;
  lessonId: string;
  courseId: string;
  prevLessonId: string | null;
  prevLessonTitle: string | null;
  nextLessonId: string | null;
  nextLessonTitle: string | null;
  initialCompleted: boolean;
  showMarkAsWatched: boolean;
}

export default function LessonFooterBar({
  courseSlug,
  lessonId,
  courseId,
  prevLessonId,
  prevLessonTitle,
  nextLessonId,
  nextLessonTitle,
  initialCompleted,
  showMarkAsWatched,
}: LessonFooterBarProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleWatched() {
    setLoading(true);
    const newStatus = !completed;

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId,
        courseId,
        progressSeconds: 0,
        markAs: newStatus ? "completed" : "reset",
      }),
    });

    setCompleted(newStatus);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border-light)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-30">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
        {/* Previous */}
        {prevLessonId ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${prevLessonId}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors text-sm"
            title={prevLessonTitle || "שיעור קודם"}
          >
            <ArrowRight size={16} className="text-[var(--accent)]" />
            <span className="hidden sm:inline truncate max-w-[120px]">
              {prevLessonTitle}
            </span>
            <span className="sm:hidden">הקודם</span>
          </Link>
        ) : (
          <div />
        )}

        {/* Mark as watched — center */}
        {showMarkAsWatched && (
          <button
            onClick={toggleWatched}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              completed
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border-light)] hover:border-[var(--accent)]"
            }`}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : completed ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <Circle size={16} className="text-[var(--text-muted)]" />
            )}
            {completed ? "נצפה" : "סמן כנצפה"}
          </button>
        )}

        {/* Next */}
        {nextLessonId ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${nextLessonId}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors text-sm"
            title={nextLessonTitle || "שיעור הבא"}
          >
            <span className="hidden sm:inline truncate max-w-[120px]">
              {nextLessonTitle}
            </span>
            <span className="sm:hidden">הבא</span>
            <ArrowLeft size={16} />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
