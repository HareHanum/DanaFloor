"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Trash2,
  Loader2,
  ChevronUp,
  ChevronDown,
  Upload,
  CheckCircle,
  AlertCircle,
  Save,
  Video,
  RefreshCw,
} from "lucide-react";
import type { CourseTestimonial } from "@/types/database";
import ImageUploader from "./ImageUploader";

interface TestimonialManagerProps {
  courseId: string;
  initialTestimonials: CourseTestimonial[];
}

/**
 * Admin editor for the testimonials shown on a course's sales page. Each
 * testimonial has a face photo, name, role, optional quote and optional video
 * (uploaded to Mux, plays in a popup on the sales page).
 */
export default function TestimonialManager({
  courseId,
  initialTestimonials,
}: TestimonialManagerProps) {
  const supabase = createClient();
  const [items, setItems] = useState(initialTestimonials);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  async function addTestimonial() {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    const { data, error } = await supabase
      .from("course_testimonials")
      .insert({
        course_id: courseId,
        author_name: name,
        sort_order: items.length,
      })
      .select()
      .single();
    setAdding(false);
    if (error || !data) {
      alert("שגיאה בהוספת העדות");
      return;
    }
    setItems([...items, data]);
    setNewName("");
  }

  async function remove(id: string) {
    if (!confirm("למחוק את העדות?")) return;
    const { error } = await supabase
      .from("course_testimonials")
      .delete()
      .eq("id", id);
    if (error) {
      alert("שגיאה במחיקה");
      return;
    }
    setItems(items.filter((t) => t.id !== id));
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await Promise.all(
      next.map((t, i) =>
        supabase.from("course_testimonials").update({ sort_order: i }).eq("id", t.id)
      )
    );
  }

  function replace(updated: CourseTestimonial) {
    setItems((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">
        העדויות יופיעו בדף המכירה של הקורס. לכל עדות אפשר להוסיף תמונת פנים,
        ציטוט קצר וסרטון שנפתח בחלון קופץ.
      </p>

      {items.length === 0 && (
        <div className="text-center text-sm text-[var(--text-muted)] py-6 border border-dashed border-[var(--border-light)] rounded-lg">
          עדיין אין עדויות לקורס הזה
        </div>
      )}

      {items.map((t, i) => (
        <TestimonialCard
          key={t.id}
          testimonial={t}
          isFirst={i === 0}
          isLast={i === items.length - 1}
          onMoveUp={() => move(i, -1)}
          onMoveDown={() => move(i, 1)}
          onDelete={() => remove(t.id)}
          onChange={replace}
        />
      ))}

      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTestimonial()}
          placeholder="שם הממליץ/ה (למשל: הודיה, מנהלת מסעדת בזיליקה)"
          className="flex-1 px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          onClick={addTestimonial}
          disabled={adding || !newName.trim()}
          className="btn btn-accent py-2 px-4 text-sm disabled:opacity-50"
        >
          {adding ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Plus size={16} className="ml-1" />
              הוסף עדות
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
  onChange,
}: {
  testimonial: CourseTestimonial;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onChange: (t: CourseTestimonial) => void;
}) {
  const supabase = createClient();
  const [name, setName] = useState(testimonial.author_name);
  const [role, setRole] = useState(testimonial.author_role ?? "");
  const [quote, setQuote] = useState(testimonial.quote ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty =
    name !== testimonial.author_name ||
    role !== (testimonial.author_role ?? "") ||
    quote !== (testimonial.quote ?? "");

  async function update(fields: Partial<CourseTestimonial>) {
    const { data, error } = await supabase
      .from("course_testimonials")
      .update(fields)
      .eq("id", testimonial.id)
      .select()
      .single();
    if (error || !data) {
      alert("שגיאה בשמירה");
      return false;
    }
    onChange(data);
    return true;
  }

  async function saveText() {
    if (!name.trim()) {
      alert("נדרש שם");
      return;
    }
    setSaving(true);
    const ok = await update({
      author_name: name.trim(),
      author_role: role.trim() || null,
      quote: quote.trim() || null,
    });
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="border border-[var(--border-light)] rounded-lg p-4 bg-[var(--background)]">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Photo */}
        <div className="shrink-0">
          <ImageUploader
            bucket="course-thumbnails"
            label="תמונת פנים"
            variant="avatar"
            currentUrl={testimonial.photo_url}
            onUpload={(url) => update({ photo_url: url })}
            onRemove={() => update({ photo_url: null })}
          />
        </div>

        {/* Text fields */}
        <div className="flex-1 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">שם</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                תפקיד / עסק
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="למשל: מנהלת סניף ג'ורנו ת״א"
                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              ציטוט (לא חובה)
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={3}
              placeholder="משפט או שניים מתוך ההמלצה"
              className="w-full px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <TestimonialVideoUploader
            testimonial={testimonial}
            onChange={onChange}
          />
        </div>

        {/* Actions */}
        <div className="flex md:flex-col items-center gap-1 shrink-0">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            title="הזז למעלה"
            className="p-1.5 rounded hover:bg-white disabled:opacity-30"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            title="הזז למטה"
            className="p-1.5 rounded hover:bg-white disabled:opacity-30"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={onDelete}
            title="מחק עדות"
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-3">
        {saved && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle size={14} />
            נשמר
          </span>
        )}
        <button
          onClick={saveText}
          disabled={!dirty || saving}
          className="btn btn-accent py-1.5 px-4 text-xs inline-flex items-center gap-1 disabled:opacity-40"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          שמור עדות
        </button>
      </div>
    </div>
  );
}

function TestimonialVideoUploader({
  testimonial,
  onChange,
}: {
  testimonial: CourseTestimonial;
  onChange: (t: CourseTestimonial) => void;
}) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [checking, setChecking] = useState(false);
  // Set after an upload in this session, until a refresh shows a new playback
  // id — covers replacing a video (the old one stays live meanwhile).
  const [pendingSince, setPendingSince] = useState<string | null>(null);

  // An upload id without a playback id means Mux is still processing.
  const processing =
    (!!testimonial.mux_upload_id && !testimonial.mux_playback_id) ||
    (pendingSince !== null && testimonial.mux_playback_id === pendingSince);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setStatus("uploading");
    setProgress(0);

    try {
      const res = await fetch("/api/admin/testimonials/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId: testimonial.id }),
      });
      if (!res.ok) throw new Error("upload url");
      const { uploadUrl, uploadId } = await res.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable)
            setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(String(xhr.status)));
        xhr.onerror = () => reject(new Error("network"));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setPendingSince(testimonial.mux_playback_id);
      onChange({ ...testimonial, mux_upload_id: uploadId });
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  async function refresh() {
    setChecking(true);
    const { data } = await supabase
      .from("course_testimonials")
      .select("*")
      .eq("id", testimonial.id)
      .single();
    setChecking(false);
    if (data) {
      if (data.mux_playback_id !== pendingSince) setPendingSince(null);
      onChange(data);
    }
  }

  async function removeVideo() {
    if (!confirm("להסיר את הסרטון מהעדות?")) return;
    const { data } = await supabase
      .from("course_testimonials")
      .update({ mux_playback_id: null, mux_upload_id: null })
      .eq("id", testimonial.id)
      .select()
      .single();
    if (data) {
      setPendingSince(null);
      onChange(data);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="flex items-center gap-1 text-xs font-medium">
        <Video size={14} />
        סרטון:
      </span>

      {status === "uploading" ? (
        <span className="flex items-center gap-2 text-blue-600 text-xs">
          <Loader2 size={14} className="animate-spin" />
          מעלה... {progress}%
        </span>
      ) : status === "error" ? (
        <span className="flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle size={14} />
          ההעלאה נכשלה, נסי שוב
        </span>
      ) : processing ? (
        <span className="flex items-center gap-2 text-yellow-600 text-xs">
          <Loader2 size={14} className="animate-spin" />
          הסרטון בעיבוד (כמה דקות)
          <button
            onClick={refresh}
            disabled={checking}
            className="inline-flex items-center gap-1 underline"
          >
            <RefreshCw size={12} className={checking ? "animate-spin" : ""} />
            בדוק שוב
          </button>
        </span>
      ) : testimonial.mux_playback_id ? (
        <span className="flex items-center gap-1 text-green-600 text-xs">
          <CheckCircle size={14} />
          סרטון מוכן
        </span>
      ) : (
        <span className="text-xs text-[var(--text-muted)]">אין סרטון</span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
        className="inline-flex items-center gap-1 btn btn-outline py-1.5 px-3 text-xs disabled:opacity-50"
      >
        <Upload size={13} />
        {testimonial.mux_playback_id ? "החלף סרטון" : "העלה סרטון"}
      </button>
      {testimonial.mux_playback_id && (
        <button
          onClick={removeVideo}
          className="text-xs text-red-500 hover:underline"
        >
          הסר סרטון
        </button>
      )}
    </div>
  );
}

