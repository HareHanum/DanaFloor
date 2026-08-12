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
