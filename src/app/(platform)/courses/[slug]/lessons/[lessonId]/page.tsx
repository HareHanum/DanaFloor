import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import LessonPlayer from "@/components/course/LessonPlayer";
import LessonSidebar from "@/components/course/LessonSidebar";
import LessonComments from "@/components/course/LessonComments";
import LessonFooterBar from "@/components/course/LessonFooterBar";
import { ArrowRight, ArrowLeft, Download, FileIcon, Link2, ExternalLink, Download as DownloadIcon } from "lucide-react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get course
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) notFound();

  // Get current lesson
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  // Non-preview lessons require login + enrollment
  if (!lesson.is_preview && !user) {
    redirect(`/login?next=/courses/${slug}/lessons/${lessonId}`);
  }

  // Check enrollment for non-preview, non-admin
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";

    if (!lesson.is_preview && !isAdmin) {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("status")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .eq("status", "active")
        .single();

      if (!enrollment) redirect(`/catalog/${slug}`);
    }
  }

  // Now that access is verified, fetch the sensitive content (text body /
  // download URL). RLS on lesson_content will return null for non-enrolled
  // non-admin viewers anyway — fetching after the gate keeps the page logic
  // tidy and avoids leaking via a row check.
  const { data: lessonContent } = await supabase
    .from("lesson_content")
    .select("content_html, download_url")
    .eq("lesson_id", lessonId)
    .maybeSingle();

  // Get attachments for this lesson
  const { data: attachments } = await supabase
    .from("lesson_attachments")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("sort_order");

  // Get all modules and lessons for sidebar + navigation
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", course.id)
    .order("sort_order");

  const { data: progressData } = user
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id, status")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
    : { data: [] };

  const progressMap = new Map(
    (progressData ?? []).map((p) => [p.lesson_id, p.status])
  );

  // Build flat list of ALL lessons across ALL modules (for prev/next navigation)
  const allLessons: { id: string; title: string; moduleTitle: string }[] = [];
  if (modules) {
    for (const mod of modules) {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title")
        .eq("module_id", mod.id)
        .order("sort_order");

      for (const l of lessons ?? []) {
        allLessons.push({ ...l, moduleTitle: mod.title });
      }
    }
  }

  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const isCompleted = progressMap.get(lessonId) === "completed";
  const isLoggedIn = !!user;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <LessonSidebar
        courseSlug={slug}
        courseTitle={course.title}
        modules={modules ?? []}
        currentLessonId={lessonId}
        progressMap={Object.fromEntries(progressMap)}
        courseId={course.id}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          {/* Breadcrumb */}
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-4 transition-colors"
          >
            <ArrowRight size={16} className="rotate-180" />
            {course.title}
          </Link>

          <h1 className="text-xl md:text-2xl font-bold mb-6">
            {lesson.title}
          </h1>

          {/* Video player */}
          {lesson.lesson_type === "video" && (
            <div className="mb-6">
              <LessonPlayer
                lessonId={lesson.id}
                playbackId={lesson.mux_playback_id}
                isPreview={lesson.is_preview}
                viewerEmail={user?.email ?? null}
              />
            </div>
          )}

          {/* Text content */}
          {lesson.lesson_type === "text" && lessonContent?.content_html && (
            <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 md:p-8 mb-6">
              {lessonContent.content_html.includes("<") ? (
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: lessonContent.content_html }}
                />
              ) : (
                <div className="text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                  {lessonContent.content_html}
                </div>
              )}
            </div>
          )}

          {/* Download */}
          {lesson.lesson_type === "download" && lessonContent?.download_url && (
            <div className="bg-[var(--background)] rounded-lg p-6 mb-6 text-center">
              <Download
                size={32}
                className="text-[var(--accent)] mx-auto mb-3"
              />
              <a
                href={lessonContent.download_url}
                download
                className="btn btn-accent py-2 px-6 text-sm"
              >
                הורד קובץ
              </a>
            </div>
          )}

          {/* Description */}
          {lesson.description && (
            <p className="text-[var(--text-secondary)] mb-6">
              {lesson.description}
            </p>
          )}

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className="mb-6 bg-[var(--background)] rounded-lg p-5">
              <h3 className="text-sm font-semibold mb-3">חומרים נלווים</h3>
              <ul className="space-y-2">
                {attachments.map((att) => (
                  <li key={att.id}>
                    {att.attachment_type === "file" ? (
                      <a
                        href={`/api/attachments/${att.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[var(--border-light)] hover:border-[var(--accent)] transition-colors"
                      >
                        <FileIcon size={18} className="text-blue-500 shrink-0" />
                        <span className="flex-1 text-sm font-medium">
                          {att.title}
                        </span>
                        <DownloadIcon size={14} className="text-[var(--text-muted)]" />
                      </a>
                    ) : (
                      <a
                        href={`/api/attachments/${att.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[var(--border-light)] hover:border-[var(--accent)] transition-colors"
                      >
                        <Link2 size={18} className="text-green-500 shrink-0" />
                        <span className="flex-1 text-sm font-medium">
                          {att.title}
                        </span>
                        <ExternalLink size={14} className="text-[var(--text-muted)]" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Comments */}
          {isLoggedIn && course.comments_enabled && (
            <LessonComments lessonId={lessonId} />
          )}

          {/* Spacer for sticky footer */}
          <div className="h-24" />
        </div>

        {/* Sticky footer bar */}
        <LessonFooterBar
          courseSlug={slug}
          lessonId={lessonId}
          courseId={course.id}
          prevLessonId={prevLesson?.id ?? null}
          prevLessonTitle={prevLesson?.title ?? null}
          nextLessonId={nextLesson?.id ?? null}
          nextLessonTitle={nextLesson?.title ?? null}
          initialCompleted={isCompleted}
          showMarkAsWatched={isLoggedIn && !lesson.is_preview}
        />
      </div>
    </div>
  );
}
