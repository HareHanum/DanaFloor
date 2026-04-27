import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Returns a short-lived signed URL for a lesson attachment after verifying
// the requester is enrolled in the course (or is an admin). The bucket is
// private — these signed URLs are the only way to fetch files.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch attachment + course context. Use the admin client because RLS would
  // otherwise hide non-enrolled users from rows we still need to authorize on.
  const admin = createAdminClient();
  const { data: attachment } = await admin
    .from("lesson_attachments")
    .select(
      "id, file_url, link_url, attachment_type, lesson:lessons!inner(module_id, modules!inner(course_id))"
    )
    .eq("id", id)
    .maybeSingle();

  if (!attachment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // External link attachments — just redirect, no signing needed.
  if (attachment.attachment_type === "link" && attachment.link_url) {
    return NextResponse.redirect(attachment.link_url);
  }

  if (!attachment.file_url) {
    return NextResponse.json({ error: "No file" }, { status: 404 });
  }

  // Authorization check: admin or active enrollment for the course.
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = profile?.role === "admin";

  if (!isAdmin) {
    const lessonRel = attachment.lesson as
      | { modules?: { course_id?: string } | { course_id?: string }[] }
      | null;
    const modules = lessonRel?.modules;
    const courseId = Array.isArray(modules) ? modules[0]?.course_id : modules?.course_id;
    if (!courseId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: enrollment } = await admin
      .from("enrollments")
      .select("status, expires_at")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("status", "active")
      .maybeSingle();

    if (!enrollment) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (enrollment.expires_at && new Date(enrollment.expires_at) < new Date()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Extract the storage path from the file_url.
  const match = attachment.file_url.match(/\/lesson-attachments\/(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Bad file path" }, { status: 500 });
  }
  const path = decodeURIComponent(match[1].split("?")[0]);

  const { data: signed, error } = await admin.storage
    .from("lesson-attachments")
    .createSignedUrl(path, 60 * 5); // 5 minutes

  if (error || !signed) {
    console.error("createSignedUrl failed:", error);
    return NextResponse.json({ error: "Sign failed" }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
