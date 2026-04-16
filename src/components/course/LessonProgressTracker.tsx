"use client";

import { useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

interface LessonProgressTrackerProps {
  lessonId: string;
  courseId: string;
  totalDuration?: number | null;
}

export default function LessonProgressTracker({
  lessonId,
  courseId,
  totalDuration,
}: LessonProgressTrackerProps) {
  const lastSaved = useRef(0);

  const saveProgress = useDebouncedCallback(
    async (seconds: number) => {
      // Don't save if less than 5 seconds since last save
      if (Math.abs(seconds - lastSaved.current) < 5) return;

      lastSaved.current = seconds;

      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId,
          progressSeconds: seconds,
          totalDuration: totalDuration ?? undefined,
        }),
      });
    },
    30000 // Save every 30 seconds max
  );

  // This component is invisible — it's mounted alongside the LessonPlayer
  // The LessonPlayer calls onTimeUpdate which triggers this
  // We expose a global handler via a custom event
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__saveProgress = (
      seconds: number
    ) => saveProgress(seconds);
  }

  return null;
}
