"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BookOpen,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Shield,
} from "lucide-react";

interface PlatformHeaderProps {
  userName: string;
  userEmail: string;
  isAdmin: boolean;
}

export default function PlatformHeader({
  userName,
  userEmail,
  isAdmin,
}: PlatformHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white border-b border-[var(--border-light)] h-16">
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-bold text-[var(--foreground)]"
          >
            FLOOR <span className="text-[var(--accent)]">D.a.N.A</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/courses"
              className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <BookOpen size={16} />
              הקורסים שלי
            </Link>
            <Link
              href="/catalog"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              קטלוג קורסים
            </Link>
          </nav>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
              <User size={16} className="text-[var(--accent)]" />
            </div>
            <span className="hidden md:inline">{userName}</span>
            <ChevronDown size={14} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-[var(--border-light)] z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border-light)]">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-[var(--text-muted)]" dir="ltr">
                    {userEmail}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/courses"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <BookOpen size={14} />
                    הקורסים שלי
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings size={14} />
                    הגדרות
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--accent)] hover:bg-[var(--background)] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Shield size={14} />
                      ניהול
                    </Link>
                  )}
                </div>

                <div className="border-t border-[var(--border-light)] py-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
                  >
                    <LogOut size={14} />
                    התנתק
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
