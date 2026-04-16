"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, Search, Building2, TrendingUp,
  HandHelping, BadgeDollarSign, UtensilsCrossed, Wine,
  Heart, DoorOpen, Beer, ShieldCheck, Coffee, Users,
  GraduationCap, User, LogOut,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const serviceItems = [
  { href: "/services/consulting", label: "ייעוץ למסעדות", icon: Search },
  { href: "/services/establishment", label: "הקמה וליווי", icon: Building2 },
];

const trainingItems = [
  { href: "/services/training/service", label: "הדרכת שירות", icon: HandHelping },
  { href: "/services/training/sales", label: "הדרכת מכירה", icon: BadgeDollarSign },
  { href: "/services/training/menu", label: "הדרכת תפריט", icon: UtensilsCrossed },
  { href: "/services/training/wine", label: "הדרכת יין ואלכוהול", icon: Wine },
  { href: "/services/training/hospitality", label: "הדרכת אירוח", icon: Heart },
  { href: "/services/training/hostess", label: "הדרכת מארחות", icon: DoorOpen },
  { href: "/services/training/bar", label: "הדרכת ברמנים ושירות בר", icon: Beer },
  { href: "/services/training/shift-managers", label: 'הדרכת אחמ"שים ומנהלי משמרת', icon: ShieldCheck },
  { href: "/services/training/coffee", label: "הדרכת קפה", icon: Coffee },
];

const navItems = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  { href: "/war-guide", label: "מדריך ניהול בזמן מלחמה" },
  { href: "/contact", label: "צור קשר" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isTrainingsOpen, setIsTrainingsOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const trainingsRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const { user, profile, loading: authLoading, signOut } = useAuth();

  const isServicePage = pathname.startsWith("/services") && !pathname.startsWith("/services/training");
  const isTrainingPage = pathname.startsWith("/services/training");

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
      if (trainingsRef.current && !trainingsRef.current.contains(event.target as Node)) {
        setIsTrainingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsServicesOpen(false);
        setIsTrainingsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 text-xl transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center relative h-20">
            <Image
              src="/logo-light.png"
              alt="FLOOR D.a.N.A"
              width={150}
              height={80}
              className={`h-20 w-auto absolute transition-opacity duration-300 ${isScrolled ? "opacity-0" : "opacity-100"}`}
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="FLOOR D.a.N.A"
              width={150}
              height={80}
              className={`h-20 w-auto transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0"}`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {/* Home */}
            <li>
              <Link
                href="/"
                className="text-xl font-medium hover:text-[var(--accent)] transition-colors duration-300 relative group"
                style={{ color: isScrolled ? "#1a1a1a" : "#ffffff" }}
                {...(pathname === "/" ? { "aria-current": "page" as const } : {})}
              >
                בית
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[var(--accent)] transition-all group-hover:w-full" />
              </Link>
            </li>

            {/* Services Dropdown */}
            <li className="relative flex items-center" ref={servicesRef}>
              <div className="relative group flex items-center leading-none">
                <Link
                  href="/services"
                  className="text-xl font-medium hover:text-[var(--accent)] transition-colors duration-300"
                  style={{ color: isServicePage ? "var(--accent)" : isScrolled ? "#1a1a1a" : "#ffffff" }}
                >
                  שירותים
                </Link>
                <button
                  onClick={() => { setIsServicesOpen(!isServicesOpen); setIsTrainingsOpen(false); }}
                  className="mr-1 text-xl hover:text-[var(--accent)] transition-colors duration-300"
                  style={{ color: isServicePage ? "var(--accent)" : isScrolled ? "#1a1a1a" : "#ffffff" }}
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                  aria-label="פתח תפריט שירותים"
                >
                  <ChevronDown
                    size={24}
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[var(--accent)] transition-all group-hover:w-full" />
              </div>
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[var(--border-light)] overflow-hidden"
                    role="menu"
                  >
                    {serviceItems.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={() => setIsServicesOpen(false)}
                        role="menuitem"
                        className={`flex items-center gap-4 px-5 py-4 hover:bg-[var(--background)] transition-colors ${
                          pathname === service.href
                            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "text-[var(--text-primary)]"
                        }`}
                      >
                        <service.icon size={27} aria-hidden="true" />
                        <span className="text-xl font-medium">{service.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Trainings Dropdown */}
            <li className="relative flex items-center" ref={trainingsRef}>
              <div className="relative group flex items-center leading-none">
                <Link
                  href="/services/training"
                  className="text-xl font-medium hover:text-[var(--accent)] transition-colors duration-300"
                  style={{ color: isTrainingPage ? "var(--accent)" : isScrolled ? "#1a1a1a" : "#ffffff" }}
                >
                  הדרכות
                </Link>
                <button
                  onClick={() => { setIsTrainingsOpen(!isTrainingsOpen); setIsServicesOpen(false); }}
                  className="mr-1 text-xl hover:text-[var(--accent)] transition-colors duration-300"
                  style={{ color: isTrainingPage ? "var(--accent)" : isScrolled ? "#1a1a1a" : "#ffffff" }}
                  aria-expanded={isTrainingsOpen}
                  aria-haspopup="true"
                  aria-label="פתח תפריט הדרכות"
                >
                  <ChevronDown
                    size={24}
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${isTrainingsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[var(--accent)] transition-all group-hover:w-full" />
              </div>
              <AnimatePresence>
                {isTrainingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-[var(--border-light)] overflow-hidden"
                    role="menu"
                  >
                    {trainingItems.map((training) => (
                      <Link
                        key={training.label}
                        href={training.href}
                        onClick={() => setIsTrainingsOpen(false)}
                        role="menuitem"
                        className={`flex items-center gap-4 px-5 py-4 hover:bg-[var(--background)] transition-colors ${
                          pathname === training.href
                            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "text-[var(--text-primary)]"
                        }`}
                      >
                        <training.icon size={27} aria-hidden="true" />
                        <span className="text-xl font-medium">{training.label}</span>
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
                  className="text-xl font-medium hover:text-[var(--accent)] transition-colors duration-300 relative group"
                  style={{ color: isScrolled ? "#1a1a1a" : "#ffffff" }}
                  {...(pathname === item.href ? { "aria-current": "page" as const } : {})}
                >
                  {item.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[var(--accent)] transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}

            {/* Courses link */}
            <li>
              <Link
                href="/catalog"
                className="text-xl font-medium hover:text-[var(--accent)] transition-colors duration-300 relative group flex items-center gap-1"
                style={{ color: pathname.startsWith("/catalog") ? "var(--accent)" : isScrolled ? "#1a1a1a" : "#ffffff" }}
              >
                <GraduationCap size={20} />
                קורסים
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[var(--accent)] transition-all group-hover:w-full" />
              </Link>
            </li>

            {/* Auth button */}
            {!authLoading && (
              <li>
                {user ? (
                  <Link
                    href="/courses"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: isScrolled ? "var(--foreground)" : "white",
                      color: isScrolled ? "white" : "var(--foreground)",
                    }}
                  >
                    <User size={16} />
                    האזור שלי
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: isScrolled ? "var(--foreground)" : "white",
                      color: isScrolled ? "white" : "var(--foreground)",
                    }}
                  >
                    התחבר
                  </Link>
                )}
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 transition-colors duration-300"
            style={{ color: isScrolled ? "#1a1a1a" : "#ffffff" }}
            aria-label="תפריט"
            aria-expanded={isMobileMenuOpen}
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
            className="lg:hidden bg-white border-t max-h-[calc(100vh-6rem)] overflow-y-auto"
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
                            pathname === service.href
                              ? "text-[var(--accent)]"
                              : "hover:text-[var(--accent)]"
                          }`}
                        >
                          <service.icon size={18} aria-hidden="true" />
                          {service.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Trainings Section */}
                <li className="pt-2">
                  <span className="block py-2 text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    הדרכות
                  </span>
                  <ul className="flex flex-col gap-1 pr-4 border-r-2 border-[var(--border-light)]">
                    {trainingItems.map((training) => (
                      <li key={training.label}>
                        <Link
                          href={training.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 py-2 text-base font-medium transition-colors ${
                            pathname === training.href
                              ? "text-[var(--accent)]"
                              : "hover:text-[var(--accent)]"
                          }`}
                        >
                          <training.icon size={18} aria-hidden="true" />
                          {training.label}
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

                {/* Courses */}
                <li className="pt-2">
                  <Link
                    href="/catalog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-lg font-medium text-[var(--accent)]"
                  >
                    <GraduationCap size={20} />
                    קורסים דיגיטליים
                  </Link>
                </li>

                <li className="pt-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link
                        href="/courses"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center text-xs py-2 px-3 bg-[var(--accent)] text-white rounded font-medium"
                      >
                        הקורסים שלי
                      </Link>
                      <button
                        onClick={() => { setIsMobileMenuOpen(false); signOut(); }}
                        className="block w-full text-center text-xs py-2 px-3 border border-[var(--border-light)] rounded font-medium text-[var(--text-secondary)]"
                      >
                        התנתק
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center text-xs py-2 px-3 bg-[var(--foreground)] text-[var(--background)] rounded font-medium"
                    >
                      התחבר
                    </Link>
                  )}
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
