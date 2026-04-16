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
  video: <PlayCircle size={16} />,
  text: <FileText size={16} />,
  download: <Download size={16} />,
  quiz: <FileText size={16} />,
};

export default function ModuleAccordion({
  modules,
  courseSlug,
  showPreviewBadge = true,
}: ModuleAccordionProps) {
  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set(modules[0] ? [modules[0].id] : [])
  );

  function toggle(id: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="border border-[var(--border-light)] rounded-xl overflow-hidden divide-y divide-[var(--border-light)]">
      {modules.map((mod, i) => {
        const isOpen = openModules.has(mod.id);
        return (
          <div key={mod.id}>
            {/* Module header */}
            <button
              onClick={() => toggle(mod.id)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-[var(--background)] transition-colors text-right"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] text-base">
                    {mod.title}
                  </h4>
                  <span className="text-xs text-[var(--text-muted)]">
                    {mod.lessons.length} שיעורים
                  </span>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`text-[var(--text-muted)] transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Lessons list */}
            {isOpen && (
              <ul className="bg-[var(--background)]">
                {mod.lessons.map((lesson, j) => {
                  const canPreview = lesson.is_preview && courseSlug;

                  const content = (
                    <>
                      <span className="text-[var(--text-muted)]">
                        {lessonTypeIcons[lesson.lesson_type] || (
                          <FileText size={16} />
                        )}
                      </span>
                      <span className="flex-1 text-sm text-[var(--text-primary)]">
                        {j + 1}. {lesson.title}
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
                        <span className="text-xs text-[var(--text-muted)]">
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
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--accent)]/5 transition-colors"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 px-5 py-3">
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
  );
}
