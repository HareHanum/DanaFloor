"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

interface StickyPurchaseBarProps {
  title: string;
  priceLabel: string;
  /** id of the element holding the purchase form (the pricing card). */
  targetId: string;
}

/**
 * Floating bottom bar that follows the visitor down the course sales page with
 * a "קורס לרכישה" button that scrolls straight to the purchase form.
 *
 * It stays hidden over the hero (the visitor hasn't scrolled yet) and while the
 * purchase form itself is on screen, so it never sits on top of the form it
 * points to.
 */
export default function StickyPurchaseBar({
  title,
  priceLabel,
  targetId,
}: StickyPurchaseBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const target = document.getElementById(targetId);
    let observer: IntersectionObserver | undefined;
    if (target) {
      observer = new IntersectionObserver(
        ([entry]) => setTargetVisible(entry.isIntersecting),
        { threshold: 0.3 }
      );
      observer.observe(target);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, [targetId]);

  const visible = scrolled && !targetVisible;

  function goToPurchase() {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-[var(--border-light)] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Left padding keeps the accessibility button (fixed bottom-left) clear
          until the viewport is wide enough for it to sit outside the container. */}
      <div className="container-custom">
      <div className="flex items-center justify-between gap-4 py-3 pl-20 2xl:pl-0">
        <div className="min-w-0">
          <div className="font-semibold text-[var(--foreground)] truncate text-sm md:text-base">
            {title}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            {priceLabel}
          </div>
        </div>
        <button
          type="button"
          onClick={goToPurchase}
          tabIndex={visible ? 0 : -1}
          className="btn btn-accent shrink-0 py-2.5 px-5 text-sm md:text-base inline-flex items-center gap-2"
        >
          <ShoppingCart size={18} />
          קורס לרכישה
        </button>
      </div>
      </div>
    </div>
  );
}
