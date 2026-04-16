"use client";

import { useState, useEffect } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock, AlertCircle } from "lucide-react";

interface LessonPlayerProps {
  lessonId: string;
  playbackId: string | null;
  isPreview?: boolean;
}

export default function LessonPlayer({
  lessonId,
  playbackId,
  isPreview,
}: LessonPlayerProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <MuxPlayer
        playbackId={playbackId}
        tokens={{ playback: token }}
        metadata={{
          video_title: lessonId,
          viewer_user_id: undefined,
        }}
        streamType="on-demand"
        style={{ height: "100%", maxWidth: "100%" }}
      />
    </div>
  );
}
