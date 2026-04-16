import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowLeft, GraduationCap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הקורסים שלי",
};

export default async function MyCoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if admin
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isAdmin = userProfile?.role === "admin";

  // Admins see all published courses, students see their enrollments
  let enrollments: Array<{ id: string; course: unknown }> | null = null;

  if (isAdmin) {
    const { data: allCourses } = await supabase
      .from("courses")
      .select("*")
      .eq("status", "published")
      .order("sort_order");

    enrollments = (allCourses ?? []).map((c) => ({
      id: `admin-${c.id}`,
      course: c,
    }));
  } else {
    const { data } = await supabase
      .from("enrollments")
      .select("*, course:courses(*)")
      .eq("user_id", user.id)
      .eq("status", "active");
    enrollments = data;
  }

  // Get progress per course
  const courseProgress: Record<
    string,
    { completed: number; total: number }
  > = {};

  if (enrollments) {
    for (const enrollment of enrollments) {
      const course = enrollment.course as unknown as {
        id: string;
        slug: string;
        title: string;
      };
      if (!course) continue;

      // Count total lessons
      const { count: totalLessons } = await supabase
        .from("lessons")
        .select("id", { count: "exact", head: true })
        .in(
          "module_id",
          (
            await supabase
              .from("modules")
              .select("id")
              .eq("course_id", course.id)
          ).data?.map((m) => m.id) ?? []
        );

      // Count completed lessons
      const { count: completedLessons } = await supabase
        .from("lesson_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .eq("status", "completed");

      courseProgress[course.id] = {
        completed: completedLessons ?? 0,
        total: totalLessons ?? 0,
      };
    }
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-6">הקורסים שלי</h1>

      {!enrollments || enrollments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[var(--border-light)]">
          <GraduationCap
            size={48}
            className="text-[var(--border-light)] mx-auto mb-4"
          />
          <h2 className="text-lg font-semibold mb-2">עוד לא נרשמת לקורסים</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            בדוק את הקטלוג שלנו ומצא את הקורס שמתאים לך
          </p>
          <Link href="/catalog" className="btn btn-accent py-2 px-6 text-sm">
            לקטלוג הקורסים
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            const course = enrollment.course as unknown as {
              id: string;
              slug: string;
              title: string;
              short_description: string | null;
              thumbnail_url: string | null;
            };
            if (!course) return null;

            const progress = courseProgress[course.id];
            const percentage =
              progress && progress.total > 0
                ? Math.round((progress.completed / progress.total) * 100)
                : 0;

            return (
              <Link
                key={enrollment.id}
                href={`/courses/${course.slug}`}
                className="group block bg-white rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 flex items-center justify-center">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen
                      size={48}
                      className="text-[var(--accent)] opacity-50"
                    />
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors mb-2">
                    {course.title}
                  </h3>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                      <span>{percentage}% הושלם</span>
                      <span>
                        {progress?.completed ?? 0}/{progress?.total ?? 0}{" "}
                        שיעורים
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[var(--accent)] h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-sm text-[var(--accent)]">
                    המשך ללמוד
                    <ArrowLeft size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
