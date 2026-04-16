import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff, Archive } from "lucide-react";

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: "טיוטה", color: "bg-gray-100 text-gray-600" },
  published: { label: "מפורסם", color: "bg-green-100 text-green-700" },
  archived: { label: "בארכיון", color: "bg-yellow-100 text-yellow-700" },
};

const statusIcons: Record<string, React.ReactNode> = {
  draft: <EyeOff size={14} />,
  published: <Eye size={14} />,
  archived: <Archive size={14} />,
};

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">קורסים</h1>
        <Link href="/admin/courses/new" className="btn btn-accent text-sm py-2">
          <Plus size={18} className="ml-1" />
          קורס חדש
        </Link>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border-light)] p-12 text-center">
          <p className="text-[var(--text-secondary)] mb-4">
            אין קורסים עדיין
          </p>
          <Link
            href="/admin/courses/new"
            className="btn btn-accent text-sm py-2"
          >
            צור את הקורס הראשון
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border-light)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--background)]">
                <th className="text-right px-5 py-3 text-sm font-medium text-[var(--text-secondary)]">
                  שם הקורס
                </th>
                <th className="text-right px-5 py-3 text-sm font-medium text-[var(--text-secondary)]">
                  סטטוס
                </th>
                <th className="text-right px-5 py-3 text-sm font-medium text-[var(--text-secondary)]">
                  מחיר
                </th>
                <th className="text-right px-5 py-3 text-sm font-medium text-[var(--text-secondary)]">
                  סוג
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {courses.map((course) => {
                const status = statusLabels[course.status] ?? statusLabels.draft;
                return (
                  <tr key={course.id} className="hover:bg-[var(--background)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-[var(--foreground)]">
                        {course.title}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        /{course.slug}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {statusIcons[course.status]}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {course.price_ils > 0
                        ? `₪${(course.price_ils / 100).toLocaleString("he-IL")}`
                        : "חינם"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                      {course.payment_type === "subscription"
                        ? "מנוי חודשי"
                        : "תשלום חד-פעמי"}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
                      >
                        <Pencil size={14} />
                        עריכה
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
