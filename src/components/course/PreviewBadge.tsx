import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

/**
 * Floating "you are previewing as a customer" indicator.
 *
 * Rendered on the customer-facing course pages (sales page, course overview,
 * lesson player) ONLY when the course is not published — i.e. an admin is
 * previewing a draft. RLS guarantees a non-published course can only be loaded
 * by an admin, so this badge never reaches a real customer.
 *
 * A fixed floating pill (rather than a top banner) so it drops into the three
 * different page layouts without fighting their headers/offsets.
 */
export default function PreviewBadge({ courseId }: { courseId: string }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white shadow-lg">
      <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
        <Eye size={15} />
        תצוגה מקדימה — מצב מנהל
      </span>
      <span className="opacity-50">·</span>
      <Link
        href={`/admin/courses/${courseId}`}
        className="flex items-center gap-1 whitespace-nowrap underline-offset-2 hover:underline"
      >
        <Pencil size={13} />
        חזרה לעריכה
      </Link>
    </div>
  );
}
