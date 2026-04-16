"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Check } from "lucide-react";
import type { Lesson, LessonAttachment } from "@/types/database";
import VideoUploader from "./VideoUploader";
import AttachmentManager from "./AttachmentManager";

interface LessonEditorProps {
  lesson: Lesson;
  attachments?: LessonAttachment[];
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

export default function LessonEditor({
  lesson,
  attachments = [],
  onSave,
  onCancel,
}: LessonEditorProps) {
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description ?? "");
  const [lessonType, setLessonType] = useState(lesson.lesson_type);
  const [contentHtml, setContentHtml] = useState(lesson.content_html ?? "");
  // download type removed — attachments handle files
  const [isPreview, setIsPreview] = useState(lesson.is_preview);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  // Auto-save with debounce
  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);

    const updates = {
      title: title.trim() || lesson.title,
      description: description.trim() || null,
      lesson_type: lessonType,
      content_html: lessonType === "text" ? contentHtml : lesson.content_html,
      is_preview: isPreview,
    };

    const { data } = await supabase
      .from("lessons")
      .update(updates)
      .eq("id", lesson.id)
      .select()
      .single();

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    if (data) onSave(data);
  }, [title, description, lessonType, contentHtml, isPreview, lesson, supabase, onSave]);

  // Auto-save on blur from any field
  function handleBlur() {
    save();
  }

  return (
    <div className="px-4 py-4 bg-blue-50/50 space-y-3">
      {/* Save indicator */}
      <div className="flex items-center justify-end h-5">
        {saving && (
          <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
            <Loader2 size={10} className="animate-spin" />
            שומר...
          </span>
        )}
        {saved && (
          <span className="flex items-center gap-1 text-[10px] text-green-600">
            <Check size={10} />
            נשמר
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">שם השיעור</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">סוג שיעור</label>
          <select
            value={lessonType}
            onChange={(e) => {
              setLessonType(e.target.value as Lesson["lesson_type"]);
              setTimeout(save, 100);
            }}
            className="w-full px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="video">וידאו</option>
            <option value="text">טקסט</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">תיאור</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          placeholder="תיאור קצר (אופציונלי)"
        />
      </div>

      {lessonType === "text" && (
        <div>
          <label className="block text-xs font-medium mb-1">תוכן השיעור</label>
          <textarea
            value={contentHtml}
            onChange={(e) => setContentHtml(e.target.value)}
            onBlur={handleBlur}
            rows={8}
            className="w-full px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] leading-relaxed"
            placeholder="כתוב כאן את תוכן השיעור..."
          />
          <p className="text-[10px] text-[var(--text-muted)] mt-1">
            ניתן להשתמש ב-HTML לעיצוב מתקדם
          </p>
        </div>
      )}

      {lessonType === "video" && (
        <VideoUploader
          lessonId={lesson.id}
          currentPlaybackId={lesson.mux_playback_id}
        />
      )}

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isPreview}
            onChange={(e) => {
              setIsPreview(e.target.checked);
              setTimeout(save, 100);
            }}
            className="rounded border-gray-300"
          />
          תצוגה מקדימה (חינם)
        </label>
      </div>

      <AttachmentManager lessonId={lesson.id} initialAttachments={attachments} />
    </div>
  );
}
