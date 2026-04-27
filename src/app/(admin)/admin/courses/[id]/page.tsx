import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CourseForm from "@/components/admin/CourseForm";
import ModuleManager from "@/components/admin/ModuleManager";
import Link from "next/link";
import { ArrowRight, Save, Download } from "lucide-react";
import DeleteCourseButton from "@/components/admin/DeleteCourseButton";
import type { Module, Lesson } from "@/types/database";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (!course) notFound();

  // How many students are enrolled — used to lock the delete button.
  const { count: enrollmentCount } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", id);

  // Get modules with lessons
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", id)
    .order("sort_order");

  const modulesWithLessons: ModuleWithLessons[] = [];
  if (modules) {
    for (const mod of modules) {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", mod.id)
        .order("sort_order");
      modulesWithLessons.push({ ...mod, lessons: lessons ?? [] });
    }
  }

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky -top-6 md:-top-8 z-10 bg-[var(--background)] -mx-6 md:-mx-8 -mt-6 md:-mt-8 px-6 md:px-8 pt-6 md:pt-8 pb-4 mb-4 border-b border-[var(--border-light)]">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              חזרה לקורסים
            </Link>
            <h1 className="text-xl font-bold">{course.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/api/admin/courses/${course.id}/export`}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--text-secondary)] border border-[var(--border-light)] rounded-lg hover:bg-[var(--background)] transition-colors"
              title="הורד JSON של הקורס לגיבוי"
            >
              <Download size={14} />
              ייצוא JSON
            </a>
            <DeleteCourseButton
              courseId={course.id}
              courseTitle={course.title}
              enrollmentCount={enrollmentCount ?? 0}
            />
            <button
              type="submit"
              form="course-form"
              className="btn btn-accent py-2 px-5 text-sm flex items-center gap-2"
            >
              <Save size={16} />
              שמור קורס
            </button>
          </div>
        </div>
      </div>

      {/* Course details form */}
      <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">פרטי הקורס</h2>
        <CourseForm course={course} formId="course-form" />
      </div>

      {/* Module & Lesson management */}
      <div className="bg-white rounded-xl border border-[var(--border-light)] p-6">
        <h2 className="text-lg font-semibold mb-4">מודולים ושיעורים</h2>
        <ModuleManager
          courseId={course.id}
          initialModules={modulesWithLessons}
        />
      </div>
    </div>
  );
}
