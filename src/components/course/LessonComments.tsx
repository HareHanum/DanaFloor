"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Send, Loader2, Trash2, User, MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: { full_name: string } | null;
}

interface LessonCommentsProps {
  lessonId: string;
}

export default function LessonComments({ lessonId }: LessonCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    loadComments();
  }, [lessonId]);

  async function loadComments() {
    setLoading(true);
    const { data } = await supabase
      .from("lesson_comments")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("created_at", { ascending: true });

    if (data) {
      // Fetch profiles for each comment
      const userIds = [...new Set(data.map((c) => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      const profileMap = new Map(
        (profiles ?? []).map((p) => [p.id, p])
      );

      setComments(
        data.map((c) => ({
          ...c,
          profile: profileMap.get(c.user_id) ?? null,
        }))
      );
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from("lesson_comments")
      .insert({
        lesson_id: lessonId,
        user_id: user.id,
        content: newComment.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setComments([
        ...comments,
        {
          ...data,
          profile: { full_name: profile?.full_name || "משתמש" },
        },
      ]);
      setNewComment("");
    }

    setSubmitting(false);
  }

  async function handleDelete(commentId: string) {
    const { error } = await supabase
      .from("lesson_comments")
      .delete()
      .eq("id", commentId);

    if (!error) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="mt-8 border-t border-[var(--border-light)] pt-8">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <MessageSquare size={20} />
        תגובות
        {comments.length > 0 && (
          <span className="text-sm font-normal text-[var(--text-muted)]">
            ({comments.length})
          </span>
        )}
      </h3>

      {/* Comment form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
              <User size={16} className="text-[var(--accent)]" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="כתוב תגובה..."
                rows={2}
                className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="mt-2 inline-flex items-center gap-1 btn btn-accent py-1.5 px-4 text-xs disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                שלח
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2
            size={24}
            className="animate-spin text-[var(--text-muted)] mx-auto"
          />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">
          אין תגובות עדיין. היה הראשון להגיב!
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--background)] flex items-center justify-center shrink-0">
                <User size={16} className="text-[var(--text-muted)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {comment.profile?.full_name || "משתמש"}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-primary)] whitespace-pre-line">
                  {comment.content}
                </p>
                {user &&
                  (user.id === comment.user_id ||
                    profile?.role === "admin") && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="mt-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={12} className="inline ml-1" />
                      מחק
                    </button>
                  )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
