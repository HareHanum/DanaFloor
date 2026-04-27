// Versioned schema for course export/import bundles. Bump COURSE_BUNDLE_VERSION
// when fields change incompatibly so old bundles can be detected and refused.
export const COURSE_BUNDLE_VERSION = 1;

export interface CourseBundle {
  version: number;
  exported_at: string;
  source_course_id: string;
  course: {
    title: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    thumbnail_url: string | null;
    price_ils: number;
    subscription_price_ils: number | null;
    payment_type: "one_time" | "subscription";
    status: "draft" | "published" | "archived";
    sort_order: number;
    comments_enabled: boolean;
  };
  modules: Array<{
    title: string;
    description: string | null;
    sort_order: number;
    lessons: Array<{
      title: string;
      description: string | null;
      lesson_type: "video" | "text" | "quiz" | "download";
      mux_playback_id: string | null;
      mux_asset_id: string | null;
      duration_seconds: number | null;
      sort_order: number;
      is_preview: boolean;
      content: {
        content_html: string | null;
        download_url: string | null;
      } | null;
      attachments: Array<{
        title: string;
        attachment_type: "file" | "link";
        file_url: string | null;
        link_url: string | null;
        file_name: string | null;
        file_size: number | null;
        sort_order: number;
      }>;
    }>;
  }>;
}

export function isCourseBundle(value: unknown): value is CourseBundle {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.version !== "number") return false;
  if (!v.course || typeof v.course !== "object") return false;
  if (!Array.isArray(v.modules)) return false;
  return true;
}
