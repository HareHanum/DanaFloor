"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  CheckCircle,
  PlayCircle,
  Circle,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Module } from "@/types/database";

interface LessonSidebarProps {
  courseSlug: string;
  courseTitle: string;
  modules: Module[];
  currentLessonId: string;
  progressMap: Record<string, string>;
  courseId?: string;
}

export default function LessonSidebar({
  courseSlug,
  courseTitle,
  modules,
  currentLessonId,
  progressMap: initialProgressMap,
  courseId,
}: LessonSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lessonsPerModule, setLessonsPerModule] = useState<
    Record<string, { id: string; title: string; sort_order: number }[]>
  >({});
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  );
  const [loaded, setLoaded] = useState(false);
  const [progressMap, setProgressMap] = useState(initialProgressMap);
  const supabase = createClient();
  const router = useRouter();

  // Lazy-load lessons for all modules
  if (!loaded && modules.length > 0) {
    setLoaded(true);
    modules.forEach(async (mod) => {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title, sort_order")
        .eq("module_id", mod.id)
        .order("sort_order");
      setLessonsPerModule((prev) => ({
        ...prev,
        [mod.id]: lessons ?? [],
      }));
    });
  }

  function toggleModule(id: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function toggleLessonProgress(lessonId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!courseId) return;

    const isCompleted = progressMap[lessonId] === "completed";
    const newStatus = isCompleted ? "not_started" : "completed";

    // Optimistic update
    setProgressMap((prev) => {
      const next = { ...prev };
      if (newStatus === "completed") {
        next[lessonId] = "completed";
      } else {
        delete next[lessonId];
      }
      return next;
    });

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId,
          progressSeconds: 0,
          markAs: newStatus === "completed" ? "completed" : "reset",
        }),
      });
      await res.json(); // Wait for response to complete
    } catch {
      // Revert on error
      setProgressMap((prev) => {
        const next = { ...prev };
        if (isCompleted) {
          next[lessonId] = "completed";
        } else {
          delete next[lessonId];
        }
        return next;
      });
    }
  }

  // Compute progress stats
  const allSidebarLessons = Object.values(lessonsPerModule).flat();
  const totalForProgress = allSidebarLessons.length;
  const completedLessons = Object.values(progressMap).filter(
    (s) => s === "completed"
  ).length;
  const progressPercent =
    totalForProgress > 0
      ? Math.round((completedLessons / totalForProgress) * 100)
      : 0;

  const sidebar = (
    <div className="w-72 bg-white border-l border-[var(--border-light)] h-full overflow-y-auto">
      <div className="p-4 border-b border-[var(--border-light)]">
        <Link
          href={`/courses/${courseSlug}`}
          className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          {courseTitle}
        </Link>
        {/* Progress bar */}
        {totalForProgress > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
              <span>{progressPercent}% הושלם</span>
              <span>
                {completedLessons}/{totalForProgress}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <nav className="py-2">
        {modules.map((mod, i) => (
          <div key={mod.id}>
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-right hover:bg-[var(--background)] transition-colors"
            >
              <span className="text-xs font-bold text-[var(--accent)]">
                {i + 1}
              </span>
              <span className="flex-1 text-xs font-medium text-[var(--text-primary)] truncate">
                {mod.title}
              </span>
              <ChevronDown
                size={14}
                className={`text-[var(--text-muted)] transition-transform ${
                  expandedModules.has(mod.id) ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedModules.has(mod.id) && (
              <ul>
                {(lessonsPerModule[mod.id] ?? []).map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  const isCompleted =
                    progressMap[lesson.id] === "completed";
                  return (
                    <li key={lesson.id}>
                      <div
                        className={`flex items-center gap-1.5 pr-5 pl-2 py-2 text-xs transition-colors ${
                          isCurrent
                            ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                            : "text-[var(--text-secondary)] hover:bg-[var(--background)]"
                        }`}
                      >
                        {/* Lesson type icon */}
                        {isCurrent ? (
                          <PlayCircle
                            size={14}
                            className="text-[var(--accent)] shrink-0"
                          />
                        ) : (
                          <PlayCircle
                            size={14}
                            className="text-[var(--text-muted)] shrink-0"
                          />
                        )}
                        <Link
                          href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex-1 truncate"
                        >
                          {lesson.title}
                        </Link>
                        {/* Watch status toggle at the end */}
                        <button
                          onClick={(e) =>
                            toggleLessonProgress(lesson.id, e)
                          }
                          className="shrink-0 p-0.5 hover:scale-110 transition-transform"
                          title={
                            isCompleted ? "סמן כלא נצפה" : "סמן כנצפה"
                          }
                        >
                          {isCompleted ? (
                            <CheckCircle
                              size={14}
                              className="text-green-500"
                            />
                          ) : (
                            <Circle
                              size={14}
                              className="text-[var(--border-dark)] hover:text-green-400 transition-colors"
                            />
                          )}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-[calc(100vh-80px)] sticky top-20">
        {sidebar}
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 w-12 h-12 bg-[var(--accent)] text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 right-0 z-50 w-80">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 p-1 text-[var(--text-muted)]"
            >
              <X size={20} />
            </button>
            {sidebar}
          </div>
        </>
      )}
    </>
  );
}
