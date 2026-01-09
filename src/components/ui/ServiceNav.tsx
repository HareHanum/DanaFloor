"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Search, Users, Building2, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "ייעוץ",
    fullTitle: "ייעוץ למסעדות",
    href: "/services/consulting",
  },
  {
    icon: Users,
    title: "הדרכות",
    fullTitle: "הדרכות לצוותים",
    href: "/services/training",
  },
  {
    icon: Building2,
    title: "הקמה",
    fullTitle: "הקמה וליווי",
    href: "/services/establishment",
  },
  {
    icon: TrendingUp,
    title: "שיפור תוצאות",
    fullTitle: "שיפור תוצאות",
    href: "/services/results",
  },
];

export default function ServiceNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const isActive = (href: string) => {
    if (href === "/services/training") {
      return pathname.startsWith("/services/training");
    }
    return pathname === href;
  };

  // Find the active service href
  const getActiveHref = () => {
    for (const service of services) {
      if (isActive(service.href)) {
        return service.href;
      }
    }
    return null;
  };

  // Scroll active item into view
  useEffect(() => {
    const activeHref = getActiveHref();
    if (activeHref && navRef.current) {
      const activeElement = itemRefs.current.get(activeHref);
      if (activeElement) {
        // Use scrollIntoView with inline: 'center' to center the active item
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [pathname]);

  return (
    <nav className="bg-white border-b border-[var(--border-light)] sticky top-20 z-40">
      <div className="container-custom">
        <div
          ref={navRef}
          className="flex items-center justify-start gap-2 md:gap-4 overflow-x-auto py-3 px-4 scrollbar-hide"
        >
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              ref={(el) => {
                if (el) itemRefs.current.set(service.href, el);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                isActive(service.href)
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              }`}
            >
              <service.icon size={18} />
              <span className="hidden sm:inline">{service.fullTitle}</span>
              <span className="sm:hidden">{service.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
