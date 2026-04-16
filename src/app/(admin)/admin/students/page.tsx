import { Users } from "lucide-react";

export default function AdminStudentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">תלמידים</h1>
      <div className="bg-white rounded-xl border border-[var(--border-light)] p-12 text-center">
        <Users size={48} className="text-[var(--border-light)] mx-auto mb-4" />
        <p className="text-[var(--text-secondary)]">
          ניהול תלמידים יהיה זמין לאחר ההרשמות הראשונות
        </p>
      </div>
    </div>
  );
}
