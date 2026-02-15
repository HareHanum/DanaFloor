"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Search, Building2, TrendingUp,
  HandHelping, BadgeDollarSign, UtensilsCrossed, Wine,
  Heart, DoorOpen, Beer, ShieldCheck, Coffee,
} from "lucide-react";

const services = [
  {
    icon: Search,
    title: "ייעוץ",
    fullTitle: "ייעוץ למסעדות",
    href: "/services/consulting",
  },
  {
    icon: Building2,
    title: "הקמה",
    fullTitle: "הקמה וליווי",
    href: "/services/establishment",
  },
];

const trainings = [
  { icon: HandHelping, title: "שירות", fullTitle: "הדרכת שירות", href: "/services/training/service" },
  { icon: BadgeDollarSign, title: "מכירה", fullTitle: "הדרכת מכירה", href: "/services/training/sales" },
  { icon: UtensilsCrossed, title: "תפריט", fullTitle: "הדרכת תפריט", href: "/services/training/menu" },
  { icon: Wine, title: "יין ואלכוהול", fullTitle: "הדרכת יין ואלכוהול", href: "/services/training/wine" },
  { icon: Heart, title: "אירוח", fullTitle: "הדרכת אירוח", href: "/services/training/hospitality" },
  { icon: DoorOpen, title: "מארחות", fullTitle: "הדרכת מארחות", href: "/services/training/hostess" },
  { icon: Beer, title: "ברמנים ובר", fullTitle: "הדרכת ברמנים ושירות בר", href: "/services/training/bar" },
  { icon: ShieldCheck, title: 'אחמ"שים', fullTitle: 'הדרכת אחמ"שים ומנהלי משמרת', href: "/services/training/shift-managers" },
  { icon: Coffee, title: "קפה", fullTitle: "הדרכת קפה", href: "/services/training/coffee" },
];

interface ServiceNavProps {
  mode?: "services" | "trainings";
}

export default function ServiceNav({ mode = "services" }: ServiceNavProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const items = mode === "trainings" ? trainings : services;

  const isActive = (href: string) => {
    return pathname === href;
  };

  useEffect(() => {
    const activeHref = items.find((item) => isActive(item.href))?.href;
    if (activeHref && navRef.current) {
      const activeElement = itemRefs.current.get(activeHref);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [pathname]);

  return (
    <nav className="bg-white border-b border-[var(--border-light)] sticky top-20 z-40" aria-label="ניווט שירותים">
      <div className="container-custom">
        <div
          ref={navRef}
          className="flex items-center justify-start gap-2 md:gap-4 overflow-x-auto py-3 px-4 scrollbar-hide"
        >
          {items.map((item) => (
            <Link
              key={item.fullTitle}
              href={item.href}
              scroll={false}
              ref={(el) => {
                if (el) itemRefs.current.set(item.href, el);
              }}
              {...(isActive(item.href) ? { "aria-current": "page" as const } : {})}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xl font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                isActive(item.href)
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              }`}
            >
              <item.icon size={27} aria-hidden="true" />
              <span className="hidden sm:inline">{item.fullTitle}</span>
              <span className="sm:hidden">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
