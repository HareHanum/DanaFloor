import { createClient } from "@/lib/supabase/server";
import { Header, Footer } from "@/components/layout";
import ModuleAccordion from "@/components/course/ModuleAccordion";
import PricingCard from "@/components/course/PricingCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Award } from "lucide-react";
import type { Metadata } from "next";
import type { Module, Lesson } from "@/types/database";
import PurchaseButton from "@/components/payment/PurchaseButton";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title, short_description")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!course) return { title: "קורס לא נמצא" };

  return {
    title: course.title,
    description: course.short_description ?? undefined,
  };
}

export default async function CourseSalesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!course) notFound();

  // Get modules with lessons
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", course.id)
    .order("sort_order");

  const modulesWithLessons: ModuleWithLessons[] = [];
  let totalLessons = 0;
  let totalDuration = 0;

  if (modules) {
    for (const mod of modules) {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", mod.id)
        .order("sort_order");

      const modLessons = lessons ?? [];
      totalLessons += modLessons.length;
      totalDuration += modLessons.reduce(
        (sum, l) => sum + (l.duration_seconds ?? 0),
        0
      );
      modulesWithLessons.push({ ...mod, lessons: modLessons });
    }
  }

  // Check if user is enrolled
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isEnrolled = false;
  let isAdmin = false;
  if (user) {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = userProfile?.role === "admin";

    if (isAdmin) {
      isEnrolled = true; // Admins have free access to all courses
    } else {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .eq("status", "active")
        .single();
      isEnrolled = !!enrollment;
    }
  }

  const priceFormatted =
    course.price_ils > 0
      ? `₪${(course.price_ils / 100).toLocaleString("he-IL")}`
      : "חינם";

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[var(--foreground)] to-[#2a2a2a] text-white pt-32 md:pt-40 pb-12 md:pb-20">
          <div className="container-custom">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              חזרה לקטלוג
            </Link>
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {course.title}
              </h1>
              {course.short_description && (
                <p className="text-lg text-gray-300 mb-6">
                  {course.short_description}
                </p>
              )}
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <BookOpen size={16} />
                  {totalLessons} שיעורים
                </span>
                {totalDuration > 0 && (
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    {Math.ceil(totalDuration / 3600)} שעות תוכן
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Award size={16} />
                  {modules?.length ?? 0} מודולים
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                {course.description && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">על הקורס</h2>
                    <div className="prose prose-lg max-w-none text-[var(--text-secondary)] whitespace-pre-line">
                      {course.description}
                    </div>
                  </div>
                )}

                {/* Curriculum */}
                {modulesWithLessons.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">תוכן הקורס</h2>
                    <ModuleAccordion modules={modulesWithLessons} courseSlug={slug} />
                  </div>
                )}
              </div>

              {/* Sidebar — pricing */}
              <div>
                <PricingCard
                  course={course}
                  totalLessons={totalLessons}
                  enrolled={isEnrolled}
                >
                  {isEnrolled ? (
                    <Link
                      href={`/courses/${course.slug}`}
                      className="block w-full btn btn-accent text-center py-3"
                    >
                      המשך ללמוד
                    </Link>
                  ) : user ? (
                    <PurchaseButton
                      courseId={course.id}
                      priceLabel={priceFormatted}
                    />
                  ) : (
                    <Link
                      href={`/login?next=/catalog/${course.slug}`}
                      className="block w-full btn btn-accent text-center py-3"
                    >
                      התחבר כדי לרכוש
                    </Link>
                  )}
                </PricingCard>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
