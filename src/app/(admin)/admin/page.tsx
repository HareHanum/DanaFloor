import { createClient } from "@/lib/supabase/server";
import { BookOpen, Users, CreditCard, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: courseCount },
    { count: enrollmentCount },
    { count: paymentCount },
  ] = await Promise.all([
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed"),
  ]);

  const stats = [
    {
      label: "קורסים",
      value: courseCount ?? 0,
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "הרשמות פעילות",
      value: enrollmentCount ?? 0,
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "תשלומים",
      value: paymentCount ?? 0,
      icon: CreditCard,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "הכנסות (בקרוב)",
      value: "—",
      icon: TrendingUp,
      color: "text-[var(--accent)]",
      bg: "bg-[var(--accent)]/10",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">דשבורד</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-[var(--border-light)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[var(--text-secondary)]">
                  {stat.label}
                </span>
                <div
                  className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}
                >
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <div className="text-2xl font-bold text-[var(--foreground)]">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
