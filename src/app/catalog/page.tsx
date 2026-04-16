import { createClient } from "@/lib/supabase/server";
import { Header, Footer } from "@/components/layout";
import CourseCard from "@/components/course/CourseCard";
import { GraduationCap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "קורסים דיגיטליים",
  description:
    "קורסים דיגיטליים בנושאי שירות, מכירות ואירוח מבית FLOOR D.a.N.A",
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("sort_order");

  // Get lesson counts per course
  const courseLessonCounts: Record<string, number> = {};
  if (courses && courses.length > 0) {
    for (const course of courses) {
      const { count } = await supabase
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
      courseLessonCounts[course.id] = count ?? 0;
    }
  }

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-[var(--foreground)] to-[#2a2a2a] text-white pt-32 md:pt-40 pb-16 md:pb-24">
          <div className="container-custom text-center">
            <div className="w-16 h-16 bg-[var(--accent)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap size={32} className="text-[var(--accent)]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              קורסים דיגיטליים
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              למד בקצב שלך את כל מה שצריך לדעת על שירות, מכירות ואירוח מצוין
              בעולם המסעדנות
            </p>
          </div>
        </section>

        {/* Course grid */}
        <section className="section-padding">
          <div className="container-custom">
            {!courses || courses.length === 0 ? (
              <div className="text-center py-16">
                <GraduationCap
                  size={64}
                  className="text-[var(--border-light)] mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  קורסים בקרוב
                </h2>
                <p className="text-[var(--text-secondary)]">
                  אנחנו עובדים על קורסים חדשים. הישארו מעודכנים!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    lessonCount={courseLessonCounts[course.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
