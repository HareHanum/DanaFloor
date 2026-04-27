"use client";

import { useState, useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock, AlertCircle } from "lucide-react";

interface LessonPlayerProps {
  lessonId: string;
  playbackId: string | null;
  isPreview?: boolean;
  viewerEmail?: string | null;
}

// Percent-based positions across the player area. Cycling between them means a
// cropped recording loses identifying info on most frames.
const WATERMARK_POSITIONS: { top: string; left: string }[] = [
  { top: "8%", left: "8%" },
  { top: "8%", left: "70%" },
  { top: "45%", left: "40%" },
  { top: "80%", left: "8%" },
  { top: "80%", left: "70%" },
  { top: "30%", left: "75%" },
  { top: "60%", left: "20%" },
  { top: "20%", left: "35%" },
];

export default function LessonPlayer({
  lessonId,
  playbackId,
  isPreview,
  viewerEmail,
}: LessonPlayerProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [watermarkPos, setWatermarkPos] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playbackId) {
      setLoading(false);
      return;
    }

    setToken(null);
    setError("");
    setLoading(true);

    async function fetchToken() {
      try {
        const res = await fetch("/api/video/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });

        if (!res.ok) {
          const data = await res.json();
          if (res.status === 403) {
            setError(
              data.error === "Subscription expired"
                ? "המנוי שלך פג תוקף"
                : "אין לך גישה לשיעור זה"
            );
          } else {
            setError("שגיאה בטעינת הוידאו");
          }
          return;
        }

        const { token } = await res.json();
        setToken(token);
      } catch {
        setError("שגיאה בטעינת הוידאו");
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, [lessonId, playbackId]);

  // Pause the video when the tab is hidden or window loses focus.
  // This is a deterrent — it blocks naive screen-recording setups where the
  // recorder is launched from another tab/app — it does NOT stop a determined
  // user. Real protection requires DRM (Mux Widevine/FairPlay).
  useEffect(() => {
    if (!token) return;

    function pausePlayer() {
      const el = wrapperRef.current?.querySelector("mux-player") as
        | (HTMLElement & { pause?: () => void })
        | null;
      el?.pause?.();
    }

    function onVisibilityChange() {
      if (document.hidden) pausePlayer();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", pausePlayer);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", pausePlayer);
    };
  }, [token]);

  // Cycle the watermark across the player so it can't be cropped out.
  useEffect(() => {
    if (!token || !viewerEmail) return;
    const id = setInterval(() => {
      setWatermarkPos((p) => (p + 1) % WATERMARK_POSITIONS.length);
    }, 6000);
    return () => clearInterval(id);
  }, [token, viewerEmail]);

  if (!playbackId) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-[var(--text-muted)]">וידאו עדיין לא הועלה</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-3 text-center px-4">
        {error.includes("גישה") || error.includes("פג") ? (
          <Lock size={32} className="text-[var(--text-muted)]" />
        ) : (
          <AlertCircle size={32} className="text-red-400" />
        )}
        <p className="text-[var(--text-secondary)]">{error}</p>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative aspect-video rounded-lg overflow-hidden bg-black select-none"
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
    >
      <MuxPlayer
        playbackId={playbackId}
        tokens={{ playback: token }}
        metadata={{
          video_title: lessonId,
          viewer_user_id: undefined,
        }}
        streamType="on-demand"
        disablePictureInPicture
        disableTracking={false}
        style={{ height: "100%", maxWidth: "100%" }}
      />

      {/* Watermark — moves around so it can't be cropped out, identifies the
          viewer if a recording leaks. */}
      {viewerEmail && (
        <div
          className="pointer-events-none absolute z-10 transition-all duration-700 ease-in-out"
          style={{
            top: WATERMARK_POSITIONS[watermarkPos].top,
            left: WATERMARK_POSITIONS[watermarkPos].left,
          }}
        >
          <span
            className="text-sm md:text-base font-semibold text-white/60 font-mono px-3 py-1.5 rounded bg-black/30 backdrop-blur-sm whitespace-nowrap drop-shadow-lg"
            dir="ltr"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
          >
            {viewerEmail}
          </span>
        </div>
      )}
    </div>
  );
}
