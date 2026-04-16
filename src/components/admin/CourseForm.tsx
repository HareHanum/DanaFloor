"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import type { Course } from "@/types/database";
import ImageUploader from "./ImageUploader";

interface CourseFormProps {
  course?: Course;
  formId?: string;
}

export default function CourseForm({ course, formId }: CourseFormProps) {
  const isEdit = !!course;
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(course?.title ?? "");
  const [slug, setSlug] = useState(course?.slug ?? "");
  const [shortDescription, setShortDescription] = useState(
    course?.short_description ?? ""
  );
  const [description, setDescription] = useState(course?.description ?? "");
  const [priceIls, setPriceIls] = useState(
    course ? (course.price_ils / 100).toString() : ""
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    course?.thumbnail_url ?? ""
  );
  const [commentsEnabled, setCommentsEnabled] = useState(
    course?.comments_enabled ?? true
  );
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    course?.status ?? "draft"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function generateSlug(text: string) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0590-\u05FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      short_description: shortDescription.trim() || null,
      description: description.trim() || null,
      thumbnail_url: thumbnailUrl.trim() || null,
      price_ils: Math.round(parseFloat(priceIls || "0") * 100),
      payment_type: "one_time" as const,
      comments_enabled: commentsEnabled,
      status,
    };

    if (!data.title) {
      setError("נדרש שם קורס");
      setLoading(false);
      return;
    }

    if (!data.slug) {
      setError("נדרש slug");
      setLoading(false);
      return;
    }

    if (isEdit) {
      const { error: updateError } = await supabase
        .from("courses")
        .update(data)
        .eq("id", course.id);

      if (updateError) {
        setError(
          updateError.message.includes("duplicate")
            ? "Slug כבר קיים"
            : "שגיאה בעדכון הקורס"
        );
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("courses")
        .insert(data);

      if (insertError) {
        setError(
          insertError.message.includes("duplicate")
            ? "Slug כבר קיים"
            : "שגיאה ביצירת הקורס"
        );
        setLoading(false);
        return;
      }
    }

    router.push("/admin/courses");
    router.refresh();
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">שם הקורס</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!isEdit && !slug) setSlug(generateSlug(e.target.value));
          }}
          className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
          placeholder="שם הקורס"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Slug (כתובת URL)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)]">/catalog/</span>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="flex-1 px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
            dir="ltr"
            placeholder="course-slug"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">תיאור קצר</label>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
          placeholder="תיאור בשורה אחת (מופיע בקטלוג)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">תיאור מלא</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base resize-y"
          placeholder="תיאור מפורט של הקורס (מופיע בדף המכירה)"
        />
      </div>

      <ImageUploader
        bucket="course-thumbnails"
        currentUrl={thumbnailUrl || null}
        onUpload={(url) => setThumbnailUrl(url)}
        onRemove={() => setThumbnailUrl("")}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">מחיר (₪)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={priceIls}
            onChange={(e) => setPriceIls(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
            dir="ltr"
            placeholder="0"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setCommentsEnabled(!commentsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                commentsEnabled ? "bg-[var(--accent)]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${
                  commentsEnabled ? "left-0.5" : "left-[22px]"
                }`}
              />
            </div>
            <span className="text-sm font-medium">אפשר תגובות</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">סטטוס</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "draft" | "published" | "archived")
          }
          className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base bg-white"
        >
          <option value="draft">טיוטה</option>
          <option value="published">מפורסם</option>
          <option value="archived">בארכיון</option>
        </select>
      </div>

      {!formId && (
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-accent py-2.5 px-6 text-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isEdit ? (
              "עדכן קורס"
            ) : (
              "צור קורס"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline py-2.5 px-6 text-sm"
          >
            ביטול
          </button>
        </div>
      )}
    </form>
  );
}
