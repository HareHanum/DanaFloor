export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight">
          D.A.N.A <span className="text-[var(--accent)]">FLOOR</span>
        </div>

        {/* Loading spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-3 border-[var(--border-light)] rounded-full" />
          <div className="absolute inset-0 border-3 border-transparent border-t-[var(--accent)] rounded-full animate-spin" />
        </div>

        {/* Loading text */}
        <p className="text-sm text-[var(--text-muted)]">טוען...</p>
      </div>
    </div>
  );
}
