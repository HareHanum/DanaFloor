import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Next.js delivers dynamic route params to *pages* percent-encoded, so a
// Hebrew course slug like "טסט" arrives as "%D7%98%D7%A1%D7%98" and DB
// lookups silently miss. Always decode slug params through this helper.
export function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// Course slugs become part of the URL (/catalog/<slug>, /courses/<slug>), so
// they may hold only letters (Latin or Hebrew), digits, "-" and "_". Anything
// else (":", "/", "?", "#", "." ...) breaks the route: a pasted URL saved as a
// slug made both customer-view links return 404.
export function sanitizeSlug(text: string) {
  // No trim here: the slug field runs this on every keystroke, and trimming
  // would swallow the space the admin is typing between two words. Edge
  // dashes are removed when the form is saved.
  return text
    .toLowerCase()
    .replace(/[^\w\u0590-\u05FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function isValidSlug(slug: string) {
  return /^[\w\u0590-\u05FF-]+$/.test(slug) && !/^-|-$/.test(slug);
}
