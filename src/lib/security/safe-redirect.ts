// Validate a redirect path supplied via query string. Only same-origin paths
// are allowed, and they must start with a single '/' (block protocol-relative
// '//evil.com' and absolute 'https://...' targets).
export function safeNextPath(value: string | null | undefined, fallback = "/courses"): string {
  if (!value) return fallback;
  if (typeof value !== "string") return fallback;
  // Must start with exactly one slash, not two (// = protocol-relative)
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  // No backslashes (some browsers normalize \\ to // for redirects)
  if (value.includes("\\")) return fallback;
  // Block control chars / newlines that could be used for header injection
  if (/[\r\n\t]/.test(value)) return fallback;
  return value;
}
