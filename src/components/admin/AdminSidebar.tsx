"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  ArrowRight,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "דשבורד", icon: LayoutDashboard },
  { href: "/admin/courses", label: "קורסים", icon: BookOpen },
  { href: "/admin/students", label: "תלמידים", icon: Users },
  { href: "/admin/payments", label: "תשלומים", icon: CreditCard },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 bg-[var(--foreground)] text-white min-h-screen p-4 shrink-0">
      <div className="mb-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          FLOOR <span className="text-[var(--accent)]">D.a.N.A</span>
        </Link>
        <p className="text-xs text-gray-400 mt-1">ניהול קורסים</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[var(--accent)] text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Link
          href="/catalog"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowRight size={14} className="rotate-180" />
          צפה באתר
        </Link>
      </div>
    </aside>
  );
}
