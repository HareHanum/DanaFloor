import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="mb-8 text-3xl font-bold text-[var(--foreground)] tracking-tight"
      >
        FLOOR <span className="text-[var(--accent)]">D.a.N.A</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">
          חזרה לאתר הראשי
        </Link>
      </p>
    </div>
  );
}
