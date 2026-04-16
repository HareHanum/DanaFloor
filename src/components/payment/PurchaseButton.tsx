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

  async function handlePurchase() {
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

      // Redirect to PayPlus payment page
      window.location.href = data.paymentUrl;
    } catch {
      setError("שגיאה בחיבור לשרת. נסה שנית.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handlePurchase}
        disabled={loading}
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
