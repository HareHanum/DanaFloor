import { CreditCard } from "lucide-react";

export default function AdminPaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">תשלומים</h1>
      <div className="bg-white rounded-xl border border-[var(--border-light)] p-12 text-center">
        <CreditCard
          size={48}
          className="text-[var(--border-light)] mx-auto mb-4"
        />
        <p className="text-[var(--text-secondary)]">
          היסטוריית תשלומים תהיה זמינה לאחר חיבור מערכת התשלומים
        </p>
      </div>
    </div>
  );
}
