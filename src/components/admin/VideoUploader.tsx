"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface VideoUploaderProps {
  lessonId: string;
  currentPlaybackId?: string | null;
  onUploadComplete?: () => void;
}

export default function VideoUploader({
  lessonId,
  currentPlaybackId,
  onUploadComplete,
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "done" | "error"
  >("idle");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus("uploading");
    setError("");
    setProgress(0);

    try {
      // 1. Get upload URL from our API
      const res = await fetch("/api/mux/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create upload URL");
      }

      const { uploadUrl, uploadId } = await res.json();

      // 2. Store the upload ID in the lesson's mux_asset_id so webhook can find it
      await supabase
        .from("lessons")
        .update({ mux_asset_id: uploadId })
        .eq("id", lessonId);

      // 3. Upload directly to Mux
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setStatus("processing");
      // Mux will send a webhook when processing is complete
      // For now, show processing status
      setTimeout(() => {
        setStatus("done");
        onUploadComplete?.();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בהעלאת הוידאו");
      setStatus("error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {currentPlaybackId && status === "idle" && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle size={14} />
          וידאו קיים (ניתן להעלות חדש)
        </div>
      )}

      {status === "uploading" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 size={14} className="animate-spin" />
            מעלה וידאו... {progress}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[var(--accent)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="flex items-center gap-2 text-sm text-yellow-600">
          <Loader2 size={14} className="animate-spin" />
          Mux מעבד את הוידאו... זה יכול לקחת כמה דקות
        </div>
      )}

      {status === "done" && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle size={14} />
          הוידאו הועלה בהצלחה! Mux יעבד אותו בדקות הקרובות.
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleUpload}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 btn btn-outline py-2 px-4 text-xs disabled:opacity-50"
      >
        <Upload size={14} />
        {currentPlaybackId ? "החלף וידאו" : "העלה וידאו"}
      </button>
    </div>
  );
}
