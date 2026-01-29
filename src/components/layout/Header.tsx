"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, Users, Building2, TrendingUp } from "lucide-react";

const serviceItems = [
  { href: "/services/consulting", label: "ייעוץ למסעדות", icon: Search },
  { href: "/services/training", label: "הדרכות לצוותים", icon: Users },
  { href: "/services/establishment", label: "הקמה וליווי", icon: Building2 },
  { href: "/services/results", label: "שיפור תוצאות", icon: TrendingUp },
];

const navItems = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  const isServicePage = pathname.startsWith("/services");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-[120px]">
          {/* Logo */}
          <Link href="/" className="flex items-center relative h-[86px] mt-1">
            <Image
              src="/logo-light-v4.png"
              alt="FLOOR D.a.N.A Consulting"
              width={127}
              height={85}
              className={`h-[86px] w-auto absolute transition-opacity duration-300 ${isScrolled ? "opacity-0" : "opacity-100"}`}
              priority
            />
            <Image
              src="/logo-dark-v4.png"
              alt="FLOOR D.a.N.A Consulting"
              width={127}
              height={85}
              className={`h-[86px] w-auto transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0"}`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {/* Home */}
            <li>
              <Link
                href="/"
                className="text-sm font-medium hover:text-[var(--accent)] transition-colors duration-300 relative group"
                style={{ color: isScrolled ? "#1a1a1a" : "#ffffff" }}
              >
                בית
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[var(--accent)] transition-all group-hover:w-full" />
              </Link>
            </li>

            {/* Services Dropdown */}
            <li className="relative" ref={servicesRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-1 text-sm font-medium hover:text-[var(--accent)] transition-colors duration-300"
                style={{ color: isServicePage ? "var(--accent)" : isScrolled ? "#1a1a1a" : "#ffffff" }}
              >
                שירותים
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[var(--border-light)] overflow-hidden"
                  >
                    {serviceItems.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={() => setIsServicesOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-[var(--background)] transition-colors ${
                          pathname === service.href || (service.href === "/services/training" && pathname.startsWith("/services/training"))
                            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "text-[var(--text-primary)]"
                        }`}
                      >
                        <service.icon size={18} />
                        <span className="text-sm font-medium">{service.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* About & Contact */}
            {navItems.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium hover:text-[var(--accent)] transition-colors duration-300 relative group"
                  style={{ color: isScrolled ? "#1a1a1a" : "#ffffff" }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[var(--accent)] transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 transition-colors duration-300"
            style={{ color: isScrolled ? "#1a1a1a" : "#ffffff" }}
            aria-label="תפריט"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container-custom py-6">
              <ul className="flex flex-col gap-2">
                {/* Home */}
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-lg font-medium hover:text-[var(--accent)] transition-colors"
                  >
                    בית
                  </Link>
                </li>

                {/* Services Section */}
                <li className="pt-2">
                  <span className="block py-2 text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    שירותים
                  </span>
                  <ul className="flex flex-col gap-1 pr-4 border-r-2 border-[var(--border-light)]">
                    {serviceItems.map((service) => (
                      <li key={service.href}>
                        <Link
                          href={service.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 py-2 text-base font-medium transition-colors ${
                            pathname === service.href || (service.href === "/services/training" && pathname.startsWith("/services/training"))
                              ? "text-[var(--accent)]"
                              : "hover:text-[var(--accent)]"
                          }`}
                        >
                          <service.icon size={18} />
                          {service.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* About & Contact */}
                {navItems.slice(1).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-lg font-medium hover:text-[var(--accent)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}

                <li className="pt-4">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center text-xs py-2 px-3 bg-[var(--foreground)] text-[var(--background)] rounded font-medium"
                  >
                    לתיאום שיחה
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
