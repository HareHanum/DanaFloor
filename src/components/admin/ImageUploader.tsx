"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  bucket: string;
  currentUrl: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUploader({
  bucket,
  currentUrl,
  onUpload,
  onRemove,
}: ImageUploaderProps) {
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
      <label className="block text-sm font-medium mb-1">תמונת קורס</label>

      {currentUrl ? (
        <div className="relative w-full max-w-sm">
          <img
            src={currentUrl}
            alt="תמונת קורס"
            className="w-full aspect-video object-cover rounded-lg border border-[var(--border-light)]"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-sm aspect-video border-2 border-dashed border-[var(--border-light)] rounded-lg flex flex-col items-center justify-center gap-2 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          ) : (
            <>
              <ImageIcon size={24} className="text-[var(--text-muted)]" />
              <span className="text-sm text-[var(--text-muted)]">
                לחץ להעלאת תמונה
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
