import Link from "next/link";
import { LogIn } from "lucide-react";

export default function GuestLessonHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white border-b border-[var(--border-light)] h-16">
      <div className="container-custom h-full flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold text-[var(--foreground)]"
        >
          FLOOR <span className="text-[var(--accent)]">D.a.N.A</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/catalog"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            קטלוג קורסים
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition-colors"
          >
            <LogIn size={16} />
            התחבר
          </Link>
        </div>
      </div>
    </header>
  );
}
