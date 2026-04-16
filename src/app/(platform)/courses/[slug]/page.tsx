import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  FileText,
  Download,
  CheckCircle,
  Lock,
  ArrowRight,
} from "lucide-react";
import type { Module, Lesson, LessonProgress } from "@/types/database";

interface ModuleWithLessons extends Module {
  lessons: (Lesson & { progress?: LessonProgress })[];
}

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) notFound();

  // Check admin status
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isAdmin = userProfile?.role === "admin";

  // Get enrollment (admins bypass)
  if (!isAdmin) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("status")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "active")
      .single();

    if (!enrollment) redirect(`/catalog/${slug}`);
  }

  // Get modules and lessons
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", course.id)
    .order("sort_order");

  // Get user's progress
  const { data: progressData } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", course.id);

  const progressMap = new Map(
    (progressData ?? []).map((p) => [p.lesson_id, p])
  );

  const modulesWithLessons: ModuleWithLessons[] = [];
  let totalLessons = 0;
  let completedLessons = 0;

  if (modules) {
    for (const mod of modules) {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", mod.id)
        .order("sort_order");

      const enriched =
        (lessons ?? []).map((l) => ({
          ...l,
          progress: progressMap.get(l.id),
        }));

      totalLessons += enriched.length;
      completedLessons += enriched.filter(
        (l) => l.progress?.status === "completed"
      ).length;

      modulesWithLessons.push({ ...mod, lessons: enriched });
    }
  }

  const percentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find the first uncompleted lesson for "continue" button
  let continueLesson: { id: string } | null = null;
  for (const mod of modulesWithLessons) {
    for (const lesson of mod.lessons) {
      if (lesson.progress?.status !== "completed") {
        continueLesson = lesson;
        break;
      }
    }
    if (continueLesson) break;
  }

  const lessonTypeIcons: Record<string, React.ReactNode> = {
    video: <PlayCircle size={16} />,
    text: <FileText size={16} />,
    download: <Download size={16} />,
    quiz: <FileText size={16} />,
  };

  return (
    <div className="container-custom py-8">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-4 transition-colors"
      >
        <ArrowRight size={16} className="rotate-180" />
        חזרה לקורסים שלי
      </Link>

      {/* Course header */}
      <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{course.title}</h1>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-[var(--text-secondary)] mb-2">
            <span>{percentage}% הושלם</span>
            <span>
              {completedLessons}/{totalLessons} שיעורים
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[var(--accent)] h-3 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {continueLesson && (
          <Link
            href={`/courses/${slug}/lessons/${continueLesson.id}`}
            className="btn btn-accent py-2 px-6 text-sm"
          >
            המשך ללמוד
          </Link>
        )}
      </div>

      {/* Modules list */}
      <div className="space-y-4">
        {modulesWithLessons.map((mod, i) => (
          <div
            key={mod.id}
            className="bg-white rounded-xl border border-[var(--border-light)] overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[var(--border-light)] bg-[var(--background)]">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                {mod.title}
              </h3>
            </div>

            <ul className="divide-y divide-[var(--border-light)]">
              {mod.lessons.map((lesson, j) => {
                const isCompleted = lesson.progress?.status === "completed";
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/courses/${slug}/lessons/${lesson.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--background)] transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle
                          size={18}
                          className="text-green-500 shrink-0"
                        />
                      ) : (
                        <span className="text-[var(--text-muted)] shrink-0">
                          {lessonTypeIcons[lesson.lesson_type]}
                        </span>
                      )}
                      <span
                        className={`flex-1 text-sm ${
                          isCompleted
                            ? "text-[var(--text-muted)]"
                            : "text-[var(--text-primary)]"
                        }`}
                      >
                        {j + 1}. {lesson.title}
                      </span>
                      {lesson.duration_seconds && (
                        <span className="text-xs text-[var(--text-muted)]">
                          {Math.ceil(lesson.duration_seconds / 60)} דק׳
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
