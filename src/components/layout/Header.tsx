"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "בית" },
  { href: "/services/consulting", label: "ייעוץ למסעדות" },
  { href: "/services/training", label: "הדרכות לצוותים" },
  { href: "/services/establishment", label: "הקמה" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = isScrolled ? "#1a1a1a" : "#ffffff";

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <nav
          className="flex items-center justify-between h-20"
          style={{ color: textColor }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-2xl font-bold tracking-tight transition-colors duration-300"
              style={{ color: textColor }}
            >
              D.A.N.A <span style={{ color: "#d4a574" }}>FLOOR</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium hover:!text-[#d4a574] transition-colors duration-300 relative group"
                  style={{ color: textColor }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#d4a574] transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button - Desktop */}
          <Link
            href="/contact"
            className={`hidden lg:inline-flex btn text-sm ${
              isScrolled
                ? "btn-primary"
                : "bg-white text-[#1a1a1a] hover:bg-white/90"
            }`}
          >
            לתיאום שיחה
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 transition-colors duration-300"
            style={{ color: textColor }}
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
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-lg font-medium text-[#1a1a1a] hover:text-[#d4a574] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn btn-primary w-full text-center"
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
