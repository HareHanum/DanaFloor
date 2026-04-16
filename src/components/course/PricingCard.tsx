import { Check } from "lucide-react";
import type { Course } from "@/types/database";

interface PricingCardProps {
  course: Course;
  totalLessons: number;
  enrolled?: boolean;
  children?: React.ReactNode; // slot for the purchase/CTA button
}

export default function PricingCard({
  course,
  totalLessons,
  enrolled,
  children,
}: PricingCardProps) {
  const priceFormatted =
    course.price_ils > 0
      ? `₪${(course.price_ils / 100).toLocaleString("he-IL")}`
      : "חינם";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--border-light)] p-6 sticky top-24">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-[var(--foreground)]">
          {priceFormatted}
        </div>
        {course.payment_type === "subscription" && (
          <span className="text-sm text-[var(--text-muted)]">לחודש</span>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        <li className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
          <Check size={16} className="text-green-500 shrink-0" />
          {totalLessons} שיעורים
        </li>
        {course.payment_type === "one_time" && (
          <li className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
            <Check size={16} className="text-green-500 shrink-0" />
            גישה לכל החיים
          </li>
        )}
        <li className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
          <Check size={16} className="text-green-500 shrink-0" />
          צפייה בכל מכשיר
        </li>
        <li className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
          <Check size={16} className="text-green-500 shrink-0" />
          תמיכה אישית
        </li>
      </ul>

      {enrolled ? (
        <div className="text-center text-green-600 font-medium bg-green-50 py-3 rounded-lg">
          כבר רשום לקורס זה
        </div>
      ) : (
        children
      )}
    </div>
  );
}
