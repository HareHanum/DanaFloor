"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, X, Loader2 } from "lucide-react";

interface DeleteCourseButtonProps {
  courseId: string;
  courseTitle: string;
  enrollmentCount?: number;
}

export default function DeleteCourseButton({
  courseId,
  courseTitle,
  enrollmentCount = 0,
}: DeleteCourseButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const isLocked = enrollmentCount > 0;

  async function handleDelete() {
    if (confirmText !== "delete") return;
    setDeleting(true);
    setServerError(null);

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (!error) {
      router.push("/admin/courses");
      return;
    }

    setDeleting(false);
    // The DB trigger from migration 007 surfaces a Postgres exception with
    // a Hebrew-friendly explanation; show it to the admin verbatim.
    setServerError(error.message || "שגיאה במחיקת הקורס");
  }

  if (isLocked) {
    return (
      <button
        type="button"
        disabled
        title={`לא ניתן למחוק קורס שיש לו ${enrollmentCount} תלמידים. ארכב את הקורס במקום (סטטוס = בארכיון).`}
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
      >
        <Trash2 size={14} />
        מחק (נעול — {enrollmentCount} תלמידים)
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
      >
        <Trash2 size={14} />
        מחק
      </button>

      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-red-600">מחיקת קורס</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--foreground)]"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-2">
                פעולה זו תמחק לצמיתות את הקורס{" "}
                <strong className="text-[var(--foreground)]">
                  {courseTitle}
                </strong>{" "}
                כולל כל המודולים, השיעורים, הסרטונים וההרשמות.
              </p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                לא ניתן לבטל פעולה זו.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  הקלד <strong className="text-red-600">delete</strong> לאישור
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="delete"
                  dir="ltr"
                  className="w-full px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {serverError && (
                <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {serverError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== "delete" || deleting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
                >
                  {deleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  מחק לצמיתות
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setConfirmText("");
                  }}
                  className="flex-1 py-2.5 border border-[var(--border-light)] rounded-lg text-sm hover:bg-[var(--background)] transition-colors"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
