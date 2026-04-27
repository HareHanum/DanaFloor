import { createAdminClient } from "@/lib/supabase/admin";
import { CreditCard, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PaymentRow {
  id: string;
  amount_ils: number;
  status: string;
  payment_method: string | null;
  payplus_transaction_id: string | null;
  created_at: string;
  user_email: string;
  user_name: string;
  course_title: string;
  course_slug: string;
}

const STATUS_FILTERS = ["completed", "pending", "failed", "refunded"] as const;

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const filter = (params.status ?? "completed") as
    | (typeof STATUS_FILTERS)[number]
    | "all";

  const admin = createAdminClient();

  let query = admin
    .from("payments")
    .select(
      `id, user_id, course_id, amount_ils, status, payment_method,
       payplus_transaction_id, created_at,
       courses!inner(title, slug)`
    )
    .order("created_at", { ascending: false });

  if (filter !== "all") query = query.eq("status", filter);

  const { data: payments } = await query;

  const rows: PaymentRow[] = [];
  let totalRevenueAgorot = 0;

  if (payments && payments.length > 0) {
    const userIds = [...new Set(payments.map((p) => p.user_id))];

    const { data: profiles } = await admin
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);
    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p.full_name])
    );

    const emailMap = new Map<string, string>();
    for (const id of userIds) {
      try {
        const { data } = await admin.auth.admin.getUserById(id);
        if (data?.user?.email) emailMap.set(id, data.user.email);
      } catch {
        /* ignore */
      }
    }

    for (const p of payments) {
      const courseRel = p.courses as
        | { title: string; slug: string }
        | { title: string; slug: string }[]
        | null;
      const course = Array.isArray(courseRel) ? courseRel[0] : courseRel;
      rows.push({
        id: p.id,
        amount_ils: p.amount_ils,
        status: p.status,
        payment_method: p.payment_method,
        payplus_transaction_id: p.payplus_transaction_id,
        created_at: p.created_at,
        user_email: emailMap.get(p.user_id) ?? "—",
        user_name: profileMap.get(p.user_id) ?? "—",
        course_title: course?.title ?? "—",
        course_slug: course?.slug ?? "",
      });
      if (p.status === "completed") totalRevenueAgorot += p.amount_ils;
    }
  }

  const totalRevenueShekels = totalRevenueAgorot / 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">תשלומים</h1>
        <div className="text-left">
          <div className="text-xs text-[var(--text-secondary)]">סה&quot;כ הכנסות</div>
          <div className="text-lg font-bold text-[var(--accent)]">
            ₪{totalRevenueShekels.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterTab href="/admin/payments?status=completed" active={filter === "completed"}>
          הושלמו
        </FilterTab>
        <FilterTab href="/admin/payments?status=pending" active={filter === "pending"}>
          ממתינים
        </FilterTab>
        <FilterTab href="/admin/payments?status=failed" active={filter === "failed"}>
          נכשלו
        </FilterTab>
        <FilterTab href="/admin/payments?status=refunded" active={filter === "refunded"}>
          הוחזרו
        </FilterTab>
        <FilterTab href="/admin/payments?status=all" active={filter === "all"}>
          הכל
        </FilterTab>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border-light)] p-12 text-center">
          <CreditCard size={48} className="text-[var(--border-light)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">
            אין תשלומים בקטגוריה זו
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border-light)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--background)] text-right text-xs uppercase text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3 font-medium">תאריך</th>
                <th className="px-4 py-3 font-medium">לקוח</th>
                <th className="px-4 py-3 font-medium">קורס</th>
                <th className="px-4 py-3 font-medium">סכום</th>
                <th className="px-4 py-3 font-medium">סטטוס</th>
                <th className="px-4 py-3 font-medium">מזהה עסקה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--background)]">
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(r.created_at).toLocaleString("he-IL", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.user_name}</div>
                    <div className="text-xs text-[var(--text-secondary)]" dir="ltr">
                      {r.user_email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/catalog/${r.course_slug}`}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {r.course_title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₪{(r.amount_ils / 100).toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] font-mono" dir="ltr">
                    {r.payplus_transaction_id?.slice(0, 12) ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FilterTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
        active
          ? "bg-[var(--accent)] text-white"
          : "bg-white border border-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--accent)]"
      }`}
    >
      {children}
    </Link>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    completed: { label: "שולם", cls: "bg-green-50 text-green-600" },
    pending: { label: "ממתין", cls: "bg-yellow-50 text-yellow-700" },
    failed: { label: "נכשל", cls: "bg-red-50 text-red-600" },
    refunded: { label: "הוחזר", cls: "bg-gray-100 text-gray-700" },
  };
  const m = map[status] ?? { label: status, cls: "bg-gray-50 text-gray-600" };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${m.cls}`}>
      {m.label}
    </span>
  );
}
