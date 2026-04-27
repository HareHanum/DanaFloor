import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertSameOrigin } from "@/lib/security/origin";
import {
  COURSE_BUNDLE_VERSION,
  isCourseBundle,
  type CourseBundle,
} from "@/lib/courses/export-schema";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

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

  // Read JSON either from body or multipart upload.
  let bundle: CourseBundle;
  try {
    const ct = request.headers.get("content-type") || "";
    let raw: unknown;
    if (ct.includes("application/json")) {
      raw = await request.json();
    } else if (ct.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) throw new Error("missing file");
      raw = JSON.parse(await file.text());
    } else {
      raw = JSON.parse(await request.text());
    }
    if (!isCourseBundle(raw)) throw new Error("invalid bundle shape");
    if (raw.version !== COURSE_BUNDLE_VERSION) {
      return NextResponse.json(
        {
          error: `unsupported bundle version ${raw.version} (expected ${COURSE_BUNDLE_VERSION})`,
        },
        { status: 400 }
      );
    }
    bundle = raw;
  } catch (e) {
    return NextResponse.json(
      { error: `invalid bundle: ${(e as Error).message}` },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Resolve a non-conflicting slug. If the original slug is taken, append a
  // timestamp suffix so the import never fails on uniqueness alone.
  let slug = bundle.course.slug;
  {
    const { data: existing } = await admin
      .from("courses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      slug = `${slug}-imported-${Math.floor(Date.now() / 1000)}`;
    }
  }

  // Insert the course.
  const { data: courseRow, error: courseErr } = await admin
    .from("courses")
    .insert({
      title: bundle.course.title,
      slug,
      description: bundle.course.description,
      short_description: bundle.course.short_description,
      thumbnail_url: bundle.course.thumbnail_url,
      price_ils: bundle.course.price_ils,
      subscription_price_ils: bundle.course.subscription_price_ils,
      payment_type: bundle.course.payment_type,
      // Always import as draft so the admin can review before publishing.
      status: "draft",
      sort_order: bundle.course.sort_order,
      comments_enabled: bundle.course.comments_enabled,
    })
    .select("id")
    .single();
  if (courseErr || !courseRow) {
    console.error("import: course insert failed", courseErr);
    return NextResponse.json(
      { error: `course insert failed: ${courseErr?.message ?? "unknown"}` },
      { status: 500 }
    );
  }
  const courseId = courseRow.id;

  // Insert modules + lessons + content + attachments. We don't wrap this in a
  // transaction (Supabase JS client doesn't support one across multiple
  // .insert calls), but the DB trigger to clean up partial imports would be
  // overkill — admin can just delete the half-imported course and retry.
  let totalLessons = 0;
  let totalAttachments = 0;

  for (const mod of bundle.modules) {
    const { data: modRow, error: modErr } = await admin
      .from("modules")
      .insert({
        course_id: courseId,
        title: mod.title,
        description: mod.description,
        sort_order: mod.sort_order,
      })
      .select("id")
      .single();
    if (modErr || !modRow) {
      console.error("import: module insert failed", modErr);
      return partialFailureResponse(admin, courseId, modErr?.message);
    }

    for (const lesson of mod.lessons) {
      const { data: lessonRow, error: lessonErr } = await admin
        .from("lessons")
        .insert({
          module_id: modRow.id,
          title: lesson.title,
          description: lesson.description,
          lesson_type: lesson.lesson_type,
          mux_playback_id: lesson.mux_playback_id,
          mux_asset_id: lesson.mux_asset_id,
          duration_seconds: lesson.duration_seconds,
          sort_order: lesson.sort_order,
          is_preview: lesson.is_preview,
        })
        .select("id")
        .single();
      if (lessonErr || !lessonRow) {
        console.error("import: lesson insert failed", lessonErr);
        return partialFailureResponse(admin, courseId, lessonErr?.message);
      }
      totalLessons++;

      if (
        lesson.content &&
        (lesson.content.content_html || lesson.content.download_url)
      ) {
        await admin.from("lesson_content").insert({
          lesson_id: lessonRow.id,
          content_html: lesson.content.content_html,
          download_url: lesson.content.download_url,
        });
      }

      for (const att of lesson.attachments) {
        await admin.from("lesson_attachments").insert({
          lesson_id: lessonRow.id,
          title: att.title,
          attachment_type: att.attachment_type,
          file_url: att.file_url,
          link_url: att.link_url,
          file_name: att.file_name,
          file_size: att.file_size,
          sort_order: att.sort_order,
        });
        totalAttachments++;
      }
    }
  }

  return NextResponse.json({
    ok: true,
    course_id: courseId,
    slug,
    modules: bundle.modules.length,
    lessons: totalLessons,
    attachments: totalAttachments,
  });
}

// On a partial failure, delete the half-imported course so admin doesn't end
// up with a broken row. The deletion trigger from migration 007 only blocks
// when there are enrollments/payments, which a fresh import won't have.
async function partialFailureResponse(
  admin: ReturnType<typeof createAdminClient>,
  courseId: string,
  message: string | undefined
) {
  await admin.from("courses").delete().eq("id", courseId);
  return NextResponse.json(
    { error: `import failed: ${message ?? "unknown"} (rolled back)` },
    { status: 500 }
  );
}
