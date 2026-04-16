import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const text = await request.text();
  const { lessonId, courseId, progressSeconds, totalDuration, markAs } =
    JSON.parse(text);

  if (!lessonId || !courseId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Manual mark (from "סמן כנצפה" button)
  if (markAs) {
    if (markAs === "completed") {
      await supabase.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          progress_seconds: progressSeconds ?? 0,
          status: "completed",
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );
    } else {
      // Reset to not_started
      await supabase
        .from("lesson_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);
    }
    return NextResponse.json({ ok: true });
  }

  // Auto progress (from video playback)
  const isCompleted = totalDuration && progressSeconds >= totalDuration * 0.9;

  await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
      progress_seconds: progressSeconds ?? 0,
      status: isCompleted ? "completed" : "in_progress",
      completed_at: isCompleted ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,lesson_id" }
  );

  return NextResponse.json({ ok: true });
}
