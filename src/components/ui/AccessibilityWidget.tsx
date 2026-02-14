"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Type, Contrast, MousePointer2, Link2, RotateCcw } from "lucide-react";

interface AccessibilityState {
  fontSize: number;
  highContrast: boolean;
  highlightLinks: boolean;
  bigCursor: boolean;
  stopAnimations: boolean;
}

const defaultState: AccessibilityState = {
  fontSize: 0,
  highContrast: false,
  highlightLinks: false,
  bigCursor: false,
  stopAnimations: false,
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<AccessibilityState>(defaultState);

  useEffect(() => {
    const saved = localStorage.getItem("a11y-settings");
    if (saved) {
      const parsed = JSON.parse(saved) as AccessibilityState;
      setState(parsed);
      applySettings(parsed);
    }
  }, []);

  const applySettings = useCallback((s: AccessibilityState) => {
    const html = document.documentElement;

    // Font size
    html.style.fontSize = s.fontSize === 0 ? "" : `${100 + s.fontSize * 10}%`;

    // High contrast
    html.classList.toggle("a11y-high-contrast", s.highContrast);

    // Highlight links
    html.classList.toggle("a11y-highlight-links", s.highlightLinks);

    // Big cursor
    html.classList.toggle("a11y-big-cursor", s.bigCursor);

    // Stop animations
    html.classList.toggle("a11y-stop-animations", s.stopAnimations);
  }, []);

  const updateState = useCallback(
    (updates: Partial<AccessibilityState>) => {
      setState((prev) => {
        const next = { ...prev, ...updates };
        localStorage.setItem("a11y-settings", JSON.stringify(next));
        applySettings(next);
        return next;
      });
    },
    [applySettings]
  );

  const reset = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem("a11y-settings");
    applySettings(defaultState);
  }, [applySettings]);

  const isModified =
    state.fontSize !== 0 ||
    state.highContrast ||
    state.highlightLinks ||
    state.bigCursor ||
    state.stopAnimations;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[9999] w-14 h-14 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="הגדרות נגישות"
        aria-expanded={isOpen}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="4.5" r="2.5" />
          <path d="m4.5 9 3 1.5v4l-2 5" />
          <path d="m19.5 9-3 1.5v4l2 5" />
          <path d="M8 9h8" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998] bg-black/30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Widget Panel */}
          <div
            className="fixed bottom-24 left-6 z-[9999] w-80 bg-white rounded-2xl shadow-2xl border border-[var(--border-light)] overflow-hidden"
            role="dialog"
            aria-label="תפריט נגישות"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[var(--foreground)] text-white">
              <h2 className="text-lg font-bold">נגישות</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="סגור תפריט נגישות"
              >
                <X size={20} />
              </button>
            </div>

            {/* Options */}
            <div className="p-4 space-y-3">
              {/* Font Size */}
              <div className="flex items-center justify-between p-3 bg-[var(--background)] rounded-xl">
                <div className="flex items-center gap-3">
                  <Type size={20} className="text-[var(--accent)]" aria-hidden="true" />
                  <span className="text-sm font-medium">גודל טקסט</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateState({ fontSize: Math.max(-2, state.fontSize - 1) })
                    }
                    className="w-8 h-8 flex items-center justify-center bg-white border border-[var(--border-light)] rounded-lg text-lg font-bold hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-colors"
                    aria-label="הקטן טקסט"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-6 text-center">
                    {state.fontSize > 0 ? `+${state.fontSize}` : state.fontSize}
                  </span>
                  <button
                    onClick={() =>
                      updateState({ fontSize: Math.min(5, state.fontSize + 1) })
                    }
                    className="w-8 h-8 flex items-center justify-center bg-white border border-[var(--border-light)] rounded-lg text-lg font-bold hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-colors"
                    aria-label="הגדל טקסט"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* High Contrast */}
              <button
                onClick={() => updateState({ highContrast: !state.highContrast })}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  state.highContrast
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--background)] hover:bg-[var(--border-light)]"
                }`}
                aria-pressed={state.highContrast}
              >
                <Contrast size={20} aria-hidden="true" />
                <span className="text-sm font-medium">ניגודיות גבוהה</span>
              </button>

              {/* Highlight Links */}
              <button
                onClick={() => updateState({ highlightLinks: !state.highlightLinks })}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  state.highlightLinks
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--background)] hover:bg-[var(--border-light)]"
                }`}
                aria-pressed={state.highlightLinks}
              >
                <Link2 size={20} aria-hidden="true" />
                <span className="text-sm font-medium">הדגשת קישורים</span>
              </button>

              {/* Big Cursor */}
              <button
                onClick={() => updateState({ bigCursor: !state.bigCursor })}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  state.bigCursor
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--background)] hover:bg-[var(--border-light)]"
                }`}
                aria-pressed={state.bigCursor}
              >
                <MousePointer2 size={20} aria-hidden="true" />
                <span className="text-sm font-medium">סמן גדול</span>
              </button>

              {/* Stop Animations */}
              <button
                onClick={() => updateState({ stopAnimations: !state.stopAnimations })}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  state.stopAnimations
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--background)] hover:bg-[var(--border-light)]"
                }`}
                aria-pressed={state.stopAnimations}
              >
                <RotateCcw size={20} aria-hidden="true" />
                <span className="text-sm font-medium">עצירת אנימציות</span>
              </button>

              {/* Reset */}
              {isModified && (
                <button
                  onClick={reset}
                  className="w-full p-3 text-sm font-medium text-[var(--text-secondary)] hover:text-red-600 transition-colors text-center border border-dashed border-[var(--border-light)] rounded-xl"
                >
                  איפוס הגדרות
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
