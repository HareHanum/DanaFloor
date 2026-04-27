import { createAdminClient } from "@/lib/supabase/admin";
import { Users, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface StudentRow {
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  enrolled_at: string;
  course_title: string;
  course_slug: string;
  payment_status: string | null;
}

export default async function AdminStudentsPage() {
  // Use admin client to read auth.users emails (RLS would otherwise hide them)
  const admin = createAdminClient();

  const { data: enrollments } = await admin
    .from("enrollments")
    .select(
      `id, user_id, course_id, enrolled_at, status,
       courses!inner(title, slug)`
    )
    .eq("status", "active")
    .order("enrolled_at", { ascending: false });

  const rows: StudentRow[] = [];

  if (enrollments && enrollments.length > 0) {
    const userIds = [...new Set(enrollments.map((e) => e.user_id))];

    // Fetch profile rows in one query
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, full_name, phone")
      .in("id", userIds);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );

    // Fetch emails from auth.users one at a time (Supabase admin SDK doesn't
    // expose a bulk query; this is fine for small student counts)
    const emailMap = new Map<string, string>();
    for (const id of userIds) {
      try {
        const { data } = await admin.auth.admin.getUserById(id);
        if (data?.user?.email) emailMap.set(id, data.user.email);
      } catch {
        /* ignore */
      }
    }

    // Latest payment per (user, course) for badge
    const { data: payments } = await admin
      .from("payments")
      .select("user_id, course_id, status, created_at")
      .in("user_id", userIds)
      .order("created_at", { ascending: false });

    const paymentMap = new Map<string, string>();
    for (const p of payments ?? []) {
      const key = `${p.user_id}|${p.course_id}`;
      if (!paymentMap.has(key)) paymentMap.set(key, p.status);
    }

    for (const e of enrollments) {
      const profile = profileMap.get(e.user_id);
      const courseRel = e.courses as
        | { title: string; slug: string }
        | { title: string; slug: string }[]
        | null;
      const course = Array.isArray(courseRel) ? courseRel[0] : courseRel;
      rows.push({
        user_id: e.user_id,
        email: emailMap.get(e.user_id) ?? "—",
        full_name: profile?.full_name ?? "—",
        phone: profile?.phone ?? null,
        enrolled_at: e.enrolled_at,
        course_title: course?.title ?? "—",
        course_slug: course?.slug ?? "",
        payment_status:
          paymentMap.get(`${e.user_id}|${e.course_id}`) ?? null,
      });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">תלמידים</h1>
        <span className="text-sm text-[var(--text-secondary)]">
          {rows.length} {rows.length === 1 ? "תלמיד" : "תלמידים"}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border-light)] p-12 text-center">
          <Users size={48} className="text-[var(--border-light)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">עדיין אין תלמידים רשומים</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border-light)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--background)] text-right text-xs uppercase text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3 font-medium">שם</th>
                <th className="px-4 py-3 font-medium">קורס</th>
                <th className="px-4 py-3 font-medium">פרטי קשר</th>
                <th className="px-4 py-3 font-medium">תאריך הרשמה</th>
                <th className="px-4 py-3 font-medium">תשלום</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {rows.map((r) => (
                <tr key={`${r.user_id}-${r.course_slug}`} className="hover:bg-[var(--background)]">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.full_name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/catalog/${r.course_slug}`}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {r.course_title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 text-xs">
                      <a
                        href={`mailto:${r.email}`}
                        className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)]"
                      >
                        <Mail size={12} />
                        <span dir="ltr">{r.email}</span>
                      </a>
                      {r.phone && (
                        <a
                          href={`tel:${r.phone}`}
                          className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)]"
                        >
                          <Phone size={12} />
                          <span dir="ltr">{r.phone}</span>
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(r.enrolled_at).toLocaleDateString("he-IL")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={r.payment_status} />
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

function PaymentBadge({ status }: { status: string | null }) {
  if (status === "completed") {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-green-50 text-green-600 text-xs font-medium">
        שולם
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs font-medium">
        ממתין
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-600 text-xs font-medium">
        נכשל
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-xs">
      —
    </span>
  );
}
