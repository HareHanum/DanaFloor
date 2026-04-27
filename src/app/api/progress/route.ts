import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertSameOrigin } from "@/lib/security/origin";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    lessonId?: string;
    courseId?: string;
    progressSeconds?: number;
    totalDuration?: number;
    markAs?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { lessonId, courseId, progressSeconds, totalDuration, markAs } = body;

  if (!lessonId || !courseId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Require active enrollment (or admin) before recording progress.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = profile?.role === "admin";

  if (!isAdmin) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("status, expires_at")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("status", "active")
      .maybeSingle();

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }
    if (enrollment.expires_at && new Date(enrollment.expires_at) < new Date()) {
      return NextResponse.json({ error: "Subscription expired" }, { status: 403 });
    }
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
      await supabase
        .from("lesson_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);
    }
    return NextResponse.json({ ok: true });
  }

  // Auto progress (from video playback)
  const isCompleted =
    !!totalDuration && (progressSeconds ?? 0) >= totalDuration * 0.9;

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
