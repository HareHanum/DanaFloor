import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  COURSE_BUNDLE_VERSION,
  type CourseBundle,
} from "@/lib/courses/export-schema";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth: caller must be an admin.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Use admin client so we can read everything regardless of RLS.
  const admin = createAdminClient();

  const { data: course, error: courseErr } = await admin
    .from("courses")
    .select(
      "id, title, slug, description, short_description, thumbnail_url, price_ils, subscription_price_ils, payment_type, status, sort_order, comments_enabled"
    )
    .eq("id", id)
    .single();
  if (courseErr || !course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const { data: modules } = await admin
    .from("modules")
    .select("id, title, description, sort_order")
    .eq("course_id", id)
    .order("sort_order");

  const moduleIds = (modules ?? []).map((m) => m.id);

  const lessonsByModule = new Map<
    string,
    Array<{
      id: string;
      title: string;
      description: string | null;
      lesson_type: "video" | "text" | "quiz" | "download";
      mux_playback_id: string | null;
      mux_asset_id: string | null;
      duration_seconds: number | null;
      sort_order: number;
      is_preview: boolean;
    }>
  >();

  if (moduleIds.length > 0) {
    const { data: lessons } = await admin
      .from("lessons")
      .select(
        "id, module_id, title, description, lesson_type, mux_playback_id, mux_asset_id, duration_seconds, sort_order, is_preview"
      )
      .in("module_id", moduleIds)
      .order("sort_order");

    for (const l of lessons ?? []) {
      const arr = lessonsByModule.get(l.module_id) ?? [];
      arr.push(l);
      lessonsByModule.set(l.module_id, arr);
    }
  }

  // Collect all lesson IDs for content + attachments lookup
  const lessonIds: string[] = [];
  for (const arr of lessonsByModule.values()) {
    for (const l of arr) lessonIds.push(l.id);
  }

  const contentByLesson = new Map<
    string,
    { content_html: string | null; download_url: string | null }
  >();
  const attachmentsByLesson = new Map<
    string,
    Array<{
      title: string;
      attachment_type: "file" | "link";
      file_url: string | null;
      link_url: string | null;
      file_name: string | null;
      file_size: number | null;
      sort_order: number;
    }>
  >();

  if (lessonIds.length > 0) {
    const [{ data: contents }, { data: attachments }] = await Promise.all([
      admin
        .from("lesson_content")
        .select("lesson_id, content_html, download_url")
        .in("lesson_id", lessonIds),
      admin
        .from("lesson_attachments")
        .select(
          "lesson_id, title, attachment_type, file_url, link_url, file_name, file_size, sort_order"
        )
        .in("lesson_id", lessonIds)
        .order("sort_order"),
    ]);

    for (const c of contents ?? []) {
      contentByLesson.set(c.lesson_id, {
        content_html: c.content_html,
        download_url: c.download_url,
      });
    }
    for (const a of attachments ?? []) {
      const arr = attachmentsByLesson.get(a.lesson_id) ?? [];
      arr.push({
        title: a.title,
        attachment_type: a.attachment_type as "file" | "link",
        file_url: a.file_url,
        link_url: a.link_url,
        file_name: a.file_name,
        file_size: a.file_size,
        sort_order: a.sort_order,
      });
      attachmentsByLesson.set(a.lesson_id, arr);
    }
  }

  const bundle: CourseBundle = {
    version: COURSE_BUNDLE_VERSION,
    exported_at: new Date().toISOString(),
    source_course_id: course.id,
    course: {
      title: course.title,
      slug: course.slug,
      description: course.description,
      short_description: course.short_description,
      thumbnail_url: course.thumbnail_url,
      price_ils: course.price_ils,
      subscription_price_ils: course.subscription_price_ils,
      payment_type: course.payment_type as "one_time" | "subscription",
      status: course.status as "draft" | "published" | "archived",
      sort_order: course.sort_order,
      comments_enabled: course.comments_enabled,
    },
    modules: (modules ?? []).map((m) => ({
      title: m.title,
      description: m.description,
      sort_order: m.sort_order,
      lessons: (lessonsByModule.get(m.id) ?? []).map((l) => ({
        title: l.title,
        description: l.description,
        lesson_type: l.lesson_type as
          | "video"
          | "text"
          | "quiz"
          | "download",
        mux_playback_id: l.mux_playback_id,
        mux_asset_id: l.mux_asset_id,
        duration_seconds: l.duration_seconds,
        sort_order: l.sort_order,
        is_preview: l.is_preview,
        content: contentByLesson.get(l.id) ?? null,
        attachments: attachmentsByLesson.get(l.id) ?? [],
      })),
    })),
  };

  const filename = `${course.slug || "course"}-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(bundle, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
