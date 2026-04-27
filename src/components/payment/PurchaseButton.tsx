"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";

interface PurchaseButtonProps {
  courseId: string;
  priceLabel: string;
}

export default function PurchaseButton({
  courseId,
  priceLabel,
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  async function handlePurchase() {
    if (!accepted) {
      setError("יש לאשר את תנאי השימוש ומדיניות הביטולים לפני הרכישה");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Already enrolled") {
          setError("כבר רשום לקורס זה");
        } else {
          setError("שגיאה ביצירת התשלום. נסה שנית.");
        }
        setLoading(false);
        return;
      }

      window.location.href = data.paymentUrl;
    } catch {
      setError("שגיאה בחיבור לשרת. נסה שנית.");
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="flex items-start gap-2 mb-3 cursor-pointer text-xs text-[var(--text-secondary)]">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => {
            setAccepted(e.target.checked);
            if (e.target.checked) setError("");
          }}
          className="mt-0.5 w-4 h-4 shrink-0 accent-[var(--accent)] cursor-pointer"
        />
        <span className="leading-snug">
          קראתי ואני מסכים/ה ל
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            תקנון האתר
          </a>
          , ל
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            מדיניות הפרטיות
          </a>
          {" "}ול
          <a
            href="/refund"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            מדיניות הביטולים
          </a>
          . אני מבין/ה כי לאחר השלמת הרכישה לא ניתן יהיה לבטל את העסקה ולקבל החזר, למעט במקרים המפורטים במדיניות.
        </span>
      </label>

      <button
        onClick={handlePurchase}
        disabled={loading || !accepted}
        className="w-full btn btn-accent py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin mx-auto" />
        ) : (
          <span className="flex items-center justify-center gap-2">
            <CreditCard size={18} />
            רכוש קורס — {priceLabel}
          </span>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-600 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
