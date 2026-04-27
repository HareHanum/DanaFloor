"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Trash2,
  Loader2,
  FileIcon,
  Link2,
  Upload,
  ExternalLink,
  Download,
} from "lucide-react";
import type { LessonAttachment } from "@/types/database";

interface AttachmentManagerProps {
  lessonId: string;
  initialAttachments: LessonAttachment[];
}

export default function AttachmentManager({
  lessonId,
  initialAttachments,
}: AttachmentManagerProps) {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [mode, setMode] = useState<"idle" | "file" | "link">("idle");

  // Sync with parent when initialAttachments changes (e.g., after re-fetch)
  useEffect(() => {
    setAttachments(initialAttachments);
  }, [initialAttachments]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${lessonId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("lesson-attachments")
      .upload(fileName, file);

    if (uploadError) {
      alert("שגיאה בהעלאת הקובץ");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("lesson-attachments").getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("lesson_attachments")
      .insert({
        lesson_id: lessonId,
        title: file.name,
        attachment_type: "file",
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        sort_order: attachments.length,
      })
      .select()
      .single();

    if (!error && data) {
      setAttachments([...attachments, data]);
    }

    setUploading(false);
    setMode("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAddLink() {
    if (!linkTitle.trim() || !linkUrl.trim()) return;

    // Ensure URL has protocol
    let url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const { data, error } = await supabase
      .from("lesson_attachments")
      .insert({
        lesson_id: lessonId,
        title: linkTitle.trim(),
        attachment_type: "link",
        link_url: url,
        sort_order: attachments.length,
      })
      .select()
      .single();

    if (!error && data) {
      setAttachments([...attachments, data]);
    }

    setLinkTitle("");
    setLinkUrl("");
    setMode("idle");
  }

  async function handleDelete(id: string) {
    const attachment = attachments.find((a) => a.id === id);
    if (!attachment) return;

    // Delete from storage if it's a file
    if (attachment.file_url && attachment.attachment_type === "file") {
      const path = attachment.file_url.split("/lesson-attachments/")[1];
      if (path) {
        await supabase.storage.from("lesson-attachments").remove([path]);
      }
    }

    const { error } = await supabase
      .from("lesson_attachments")
      .delete()
      .eq("id", id);

    if (!error) {
      setAttachments(attachments.filter((a) => a.id !== id));
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium">
        קבצים מצורפים וקישורים
      </label>

      {/* Existing attachments */}
      {attachments.length > 0 && (
        <ul className="space-y-1">
          {attachments.map((att) => (
            <li
              key={att.id}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[var(--border-light)] rounded-lg text-xs"
            >
              {att.attachment_type === "file" ? (
                <FileIcon size={14} className="text-blue-500 shrink-0" />
              ) : (
                <Link2 size={14} className="text-green-500 shrink-0" />
              )}
              <span className="flex-1 truncate">{att.title}</span>
              {att.file_size && (
                <span className="text-[var(--text-muted)]">
                  {formatFileSize(att.file_size)}
                </span>
              )}
              {att.attachment_type === "file" && att.file_url && (
                <a
                  href={`/api/attachments/${att.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                  title="הורד"
                >
                  <Download size={12} />
                </a>
              )}
              {att.attachment_type === "link" && att.link_url && (
                <a
                  href={att.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                  title="פתח קישור"
                >
                  <ExternalLink size={12} />
                </a>
              )}
              <button
                onClick={() => handleDelete(att.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add buttons */}
      {mode === "idle" && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("file");
              setTimeout(() => fileInputRef.current?.click(), 100);
            }}
            className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
          >
            <Upload size={12} />
            העלה קובץ
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
          >
            <Link2 size={12} />
            הוסף קישור
          </button>
        </div>
      )}

      {/* File upload */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
      />
      {mode === "file" && uploading && (
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <Loader2 size={12} className="animate-spin" />
          מעלה קובץ...
        </div>
      )}

      {/* Link form */}
      {mode === "link" && (
        <div className="space-y-2 p-3 bg-white border border-[var(--border-light)] rounded-lg">
          <input
            type="text"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            placeholder="שם הקישור (לדוגמה: טופס שיעורי בית)"
            className="w-full px-3 py-1.5 border border-[var(--border-light)] rounded text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://forms.google.com/..."
            className="w-full px-3 py-1.5 border border-[var(--border-light)] rounded text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            dir="ltr"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddLink}
              disabled={!linkTitle.trim() || !linkUrl.trim()}
              className="inline-flex items-center gap-1 btn btn-accent py-1 px-3 text-xs disabled:opacity-50"
            >
              <Plus size={12} />
              הוסף
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("idle");
                setLinkTitle("");
                setLinkUrl("");
              }}
              className="text-xs text-[var(--text-muted)] hover:underline"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
