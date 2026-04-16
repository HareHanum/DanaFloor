import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePlaybackToken } from "@/lib/mux/tokens";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { lessonId } = await request.json();

  if (!lessonId) {
    return NextResponse.json(
      { error: "lessonId is required" },
      { status: 400 }
    );
  }

  // Get lesson and its course via module
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, mux_playback_id, is_preview, module_id")
    .eq("id", lessonId)
    .single();

  if (!lesson || !lesson.mux_playback_id) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Preview lessons — anyone can watch (no auth required)
  if (lesson.is_preview) {
    const token = await generatePlaybackToken(
      lesson.mux_playback_id,
      user?.id ?? "anonymous"
    );
    return NextResponse.json({ token });
  }

  // Non-preview lessons require authentication
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get course_id via module
  const { data: mod } = await supabase
    .from("modules")
    .select("course_id")
    .eq("id", lesson.module_id)
    .single();

  if (!mod) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  // Check if user is admin (admins can access all content)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    const token = await generatePlaybackToken(
      lesson.mux_playback_id,
      user.id
    );
    return NextResponse.json({ token });
  }

  // Verify enrollment for non-admin users
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("status, expires_at")
    .eq("user_id", user.id)
    .eq("course_id", mod.course_id)
    .eq("status", "active")
    .single();

  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  // Check subscription expiry
  if (
    enrollment.expires_at &&
    new Date(enrollment.expires_at) < new Date()
  ) {
    return NextResponse.json(
      { error: "Subscription expired" },
      { status: 403 }
    );
  }

  const token = await generatePlaybackToken(
    lesson.mux_playback_id,
    user.id
  );

  return NextResponse.json({ token });
}
