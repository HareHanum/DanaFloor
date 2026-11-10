"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  bucket: string;
  currentUrl: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
  label?: string;
  /** "avatar" renders a small round preview (e.g. a testimonial face photo). */
  variant?: "cover" | "avatar";
}

export default function ImageUploader({
  bucket,
  currentUrl,
  onUpload,
  onRemove,
  label = "תמונת קורס",
  variant = "cover",
}: ImageUploaderProps) {
  const isAvatar = variant === "avatar";
  const frame = isAvatar
    ? "w-24 h-24 rounded-full"
    : "w-full max-w-sm aspect-video rounded-lg";
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("יש להעלות קובץ תמונה בלבד");
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert("שגיאה בהעלאת התמונה");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    onUpload(publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {currentUrl ? (
        <div className={`relative ${frame}`}>
          <img
            src={currentUrl}
            alt={label}
            className={`w-full h-full object-cover border border-[var(--border-light)] ${
              isAvatar ? "rounded-full" : "rounded-lg"
            }`}
          />
          <button
            type="button"
            onClick={onRemove}
            className={`absolute ${isAvatar ? "top-0 left-0" : "top-2 left-2"} p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors`}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`${frame} border-2 border-dashed border-[var(--border-light)] flex flex-col items-center justify-center gap-2 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors cursor-pointer disabled:opacity-50`}
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          ) : (
            <>
              <ImageIcon size={24} className="text-[var(--text-muted)]" />
              <span className={`text-[var(--text-muted)] ${isAvatar ? "text-xs" : "text-sm"}`}>
                {isAvatar ? "העלאת תמונה" : "לחץ להעלאת תמונה"}
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
