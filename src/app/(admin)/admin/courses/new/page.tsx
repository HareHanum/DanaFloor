import CourseForm from "@/components/admin/CourseForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NewCoursePage() {
  return (
    <div>
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-4 transition-colors"
      >
        <ArrowRight size={16} className="rotate-180" />
        חזרה לקורסים
      </Link>
      <h1 className="text-2xl font-bold mb-6">קורס חדש</h1>
      <CourseForm />
    </div>
  );
}
