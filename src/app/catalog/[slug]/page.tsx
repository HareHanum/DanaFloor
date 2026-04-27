import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Header, Footer } from "@/components/layout";
import ModuleAccordion from "@/components/course/ModuleAccordion";
import PricingCard from "@/components/course/PricingCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Award } from "lucide-react";
import type { Metadata } from "next";
import type { Module, Lesson } from "@/types/database";
import PurchaseButton from "@/components/payment/PurchaseButton";
import {
  verifyPendingPaymentsForUser,
  verifyAndGrantPaymentByPageUid,
} from "@/lib/payplus/verify";

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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pid?: string; payment?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const supabase = await createClient();

  // Fallback verify path: if the success endpoint passed a page UID through
  // the URL, run verification here too — this works even when the user
  // appears logged out (admin client bypasses auth).
  if (search.pid) {
    try {
      await verifyAndGrantPaymentByPageUid(createAdminClient(), search.pid);
    } catch (e) {
      console.error("catalog pid recovery failed:", e);
    }
  }

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
      // After migration 006, sensitive content (content_html, download_url)
      // lives in lesson_content with strict RLS. The lessons table itself is
      // safe to read for any published-course visitor.
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
      // Recovery path: if the user has any pending payment for this course,
      // verify it via the PayPlus API and grant enrollment if approved. This
      // catches cases where the webhook never fired or arrived out of order.
      try {
        await verifyPendingPaymentsForUser(
          createAdminClient(),
          user.id,
          course.id
        );
      } catch (e) {
        console.error("payment recovery failed:", e);
      }

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
