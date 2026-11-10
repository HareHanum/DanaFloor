"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  PlayCircle,
  FileText,
  Download,
  Lock,
  Eye,
} from "lucide-react";
import type { Module, Lesson } from "@/types/database";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

interface ModuleAccordionProps {
  modules: ModuleWithLessons[];
  courseSlug?: string;
  showPreviewBadge?: boolean;
}

const lessonTypeIcons: Record<string, React.ReactNode> = {
  video: <PlayCircle size={18} />,
  text: <FileText size={18} />,
  download: <Download size={18} />,
  quiz: <FileText size={18} />,
};

export default function ModuleAccordion({
  modules,
  courseSlug,
  showPreviewBadge = true,
}: ModuleAccordionProps) {
  // All chapters start open so visitors immediately see every lesson name.
  const [openModules, setOpenModules] = useState<Set<string>>(
    () => new Set(modules.map((m) => m.id))
  );
  const allOpen = openModules.size === modules.length;

  function toggleAll() {
    setOpenModules(allOpen ? new Set() : new Set(modules.map((m) => m.id)));
  }

  function toggle(id: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
    {modules.length > 1 && (
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          {allOpen ? "סגור את כל הפרקים" : "פתח את כל הפרקים"}
        </button>
      </div>
    )}
    <div className="border border-[var(--border-light)] rounded-xl overflow-hidden divide-y divide-[var(--border-light)]">
      {modules.map((mod, i) => {
        const isOpen = openModules.has(mod.id);
        return (
          <div key={mod.id}>
            {/* Module header */}
            <button
              type="button"
              onClick={() => toggle(mod.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-white hover:bg-[var(--background)] transition-colors text-right"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-base font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-[var(--accent)]">
                    פרק {i + 1}
                  </span>
                  <h3 className="font-bold text-[var(--foreground)] text-lg leading-snug">
                    {mod.title}
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    {mod.lessons.length === 1
                      ? "שיעור אחד"
                      : `${mod.lessons.length} שיעורים`}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`shrink-0 text-[var(--text-muted)] transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Lessons list */}
            {isOpen && (
              <ul className="bg-[var(--background)]">
                {mod.lessons.length === 0 && (
                  <li className="border-t border-[var(--border-light)] px-5 py-3 text-sm text-[var(--text-muted)]">
                    השיעורים בפרק זה יעלו בקרוב
                  </li>
                )}
                {mod.lessons.map((lesson, j) => {
                  const canPreview = lesson.is_preview && courseSlug;

                  const content = (
                    <>
                      <span className="text-[var(--accent)] shrink-0">
                        {lessonTypeIcons[lesson.lesson_type] || (
                          <FileText size={18} />
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs text-[var(--text-muted)]">
                          שיעור {i + 1}.{j + 1}
                        </span>
                        <span className="block text-base font-medium text-[var(--foreground)] leading-snug">
                          {lesson.title}
                        </span>
                      </span>
                      {lesson.is_preview && showPreviewBadge ? (
                        <span className="flex items-center gap-1 text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
                          <Eye size={12} />
                          {canPreview ? "צפה בחינם" : "תצוגה מקדימה"}
                        </span>
                      ) : (
                        !lesson.is_preview && (
                          <Lock
                            size={14}
                            className="text-[var(--text-muted)]"
                          />
                        )
                      )}
                      {lesson.duration_seconds && (
                        <span className="text-xs text-[var(--text-muted)] shrink-0">
                          {Math.ceil(lesson.duration_seconds / 60)} דק׳
                        </span>
                      )}
                    </>
                  );

                  return (
                    <li key={lesson.id} className="border-t border-[var(--border-light)]">
                      {canPreview ? (
                        <Link
                          href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                          className="flex items-center gap-3 px-5 py-3.5 pr-8 hover:bg-[var(--accent)]/5 transition-colors"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 px-5 py-3.5 pr-8">
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
    </div>
  );
}
