"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Play, X, AlertCircle } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface LessonVideoPreviewProps {
  lessonId: string;
  lessonTitle: string;
  playbackId: string;
  // Signed token for the still image; absent for a video that became ready
  // after the page loaded (the still appears after a refresh).
  thumbnailToken?: string;
  durationSeconds?: number | null;
  size?: "sm" | "lg";
}

// A still image of the lesson's video in the course builder. A click opens the
// video in a small player, so the admin can see which file was uploaded where.
export default function LessonVideoPreview({
  lessonId,
  lessonTitle,
  playbackId,
  thumbnailToken,
  durationSeconds,
  size = "sm",
}: LessonVideoPreviewProps) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Fetch a playback token when the player opens (admins get one for any lesson).
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/video/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
        if (!res.ok) throw new Error("token");
        const data = await res.json();
        if (!cancelled) setToken(data.token);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, lessonId]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setToken(null);
    setError(false);
  }

  const showImage = thumbnailToken && !imageFailed;
  const box = size === "lg" ? "w-48" : "w-24";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative ${box} aspect-video shrink-0 rounded-md overflow-hidden bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]`}
        title="הצג את הסרטון"
        aria-label={`הצג את הסרטון של השיעור ${lessonTitle}`}
      >
        {showImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://image.mux.com/${playbackId}/thumbnail.jpg?token=${thumbnailToken}`}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
          <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
            <Play size={12} className="text-gray-900 fill-gray-900" />
          </span>
        </span>
        {!!durationSeconds && (
          <span
            className="absolute bottom-0.5 left-0.5 px-1 rounded bg-black/70 text-white text-[10px] leading-4"
            dir="ltr"
          >
            {formatDuration(durationSeconds)}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={lessonTitle}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)]">
              <span className="text-sm font-medium truncate">{lessonTitle}</span>
              <button
                type="button"
                onClick={close}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="סגור"
              >
                <X size={18} />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              {error ? (
                <p className="flex items-center gap-2 text-sm text-white">
                  <AlertCircle size={16} />
                  שגיאה בטעינת הוידאו
                </p>
              ) : token ? (
                <MuxPlayer
                  playbackId={playbackId}
                  tokens={{ playback: token }}
                  streamType="on-demand"
                  autoPlay
                  disableTracking
                  style={{ height: "100%", width: "100%" }}
                />
              ) : (
                <Loader2 size={28} className="animate-spin text-white" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
