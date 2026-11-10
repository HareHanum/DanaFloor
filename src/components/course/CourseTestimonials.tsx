"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Play, Quote, User, X } from "lucide-react";
import type { CourseTestimonial } from "@/types/database";

/**
 * Testimonials block on the course sales page. Each card shows the person's
 * face photo (or a person icon when there's no photo); when a video exists the
 * photo gets a play badge and clicking the card opens the video in a popup.
 */
export default function CourseTestimonials({
  testimonials,
}: {
  testimonials: CourseTestimonial[];
}) {
  const [playing, setPlaying] = useState<CourseTestimonial | null>(null);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [playing]);

  if (testimonials.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">מה אומרים עלינו</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => {
          const hasVideo = !!t.mux_playback_id;
          const body = (
            <>
              <div className="flex items-center gap-4">
                <Avatar testimonial={t} hasVideo={hasVideo} />
                <div className="min-w-0 text-right">
                  <div className="font-bold text-[var(--foreground)]">
                    {t.author_name}
                  </div>
                  {t.author_role && (
                    <div className="text-sm text-[var(--text-secondary)]">
                      {t.author_role}
                    </div>
                  )}
                  {hasVideo && (
                    <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
                      <Play size={12} className="fill-current" />
                      צפו בעדות
                    </div>
                  )}
                </div>
              </div>
              {t.quote && (
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-primary)] text-right">
                  <Quote
                    size={16}
                    className="inline-block ml-1 -mt-1 text-[var(--accent)] rotate-180"
                  />
                  {t.quote}
                </p>
              )}
            </>
          );

          const cardClass =
            "block w-full bg-white rounded-xl border border-[var(--border-light)] p-5 transition-shadow";

          return hasVideo ? (
            <button
              key={t.id}
              type="button"
              onClick={() => setPlaying(t)}
              className={`${cardClass} hover:shadow-md cursor-pointer group`}
              aria-label={`צפייה בעדות של ${t.author_name}`}
            >
              {body}
            </button>
          ) : (
            <div key={t.id} className={cardClass}>
              {body}
            </div>
          );
        })}
      </div>

      {playing?.mux_playback_id && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPlaying(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`עדות של ${playing.author_name}`}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPlaying(null)}
              className="absolute -top-11 left-0 p-2 text-white/80 hover:text-white"
              aria-label="סגירה"
            >
              <X size={26} />
            </button>
            <div className="rounded-xl overflow-hidden bg-black">
              <MuxPlayer
                playbackId={playing.mux_playback_id}
                autoPlay
                accentColor="#f69a62"
                metadata={{ video_title: `עדות — ${playing.author_name}` }}
                style={{ aspectRatio: "16 / 9", width: "100%" }}
              />
            </div>
            <div className="mt-3 flex items-center gap-3 text-white">
              <div className="w-10 h-10 shrink-0">
                <AvatarImage testimonial={playing} />
              </div>
              <div>
                <div className="font-semibold">{playing.author_name}</div>
                {playing.author_role && (
                  <div className="text-sm text-white/70">
                    {playing.author_role}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Avatar({
  testimonial,
  hasVideo,
}: {
  testimonial: CourseTestimonial;
  hasVideo: boolean;
}) {
  return (
    <div className="relative w-20 h-20 shrink-0">
      <AvatarImage testimonial={testimonial} />
      {hasVideo && (
        <span className="absolute inset-0 rounded-full flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition-colors">
          <span className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md">
            <Play size={16} className="fill-current -mr-0.5" />
          </span>
        </span>
      )}
    </div>
  );
}

function AvatarImage({ testimonial }: { testimonial: CourseTestimonial }) {
  return testimonial.photo_url ? (
    // eslint-disable-next-line @next/next/no-img-element -- Supabase storage URL, not in next/image config
    <img
      src={testimonial.photo_url}
      alt={testimonial.author_name}
      className="w-full h-full rounded-full object-cover border-2 border-white shadow"
    />
  ) : (
    <div className="w-full h-full rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
      <User size={28} />
    </div>
  );
}
