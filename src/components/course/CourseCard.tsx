import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import type { Course } from "@/types/database";

interface CourseCardProps {
  course: Course;
  lessonCount?: number;
}

export default function CourseCard({ course, lessonCount }: CourseCardProps) {
  const priceFormatted =
    course.price_ils > 0
      ? `₪${(course.price_ils / 100).toLocaleString("he-IL")}`
      : "חינם";

  return (
    <Link
      href={`/catalog/${course.slug}`}
      className="group block bg-white rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
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

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors mb-2 line-clamp-2">
          {course.title}
        </h3>

        {course.short_description && (
          <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
            {course.short_description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[var(--accent)]">
            {priceFormatted}
            {course.payment_type === "subscription" && (
              <span className="text-xs font-normal text-[var(--text-muted)]">
                {" "}
                / חודש
              </span>
            )}
          </span>

          {lessonCount !== undefined && (
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock size={14} />
              {lessonCount} שיעורים
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
