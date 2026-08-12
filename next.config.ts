import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS for two years; "preload" makes the site eligible for the
  // browser-baked HSTS preload list. Only enable preload once you're sure
  // every subdomain is HTTPS-only.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Disallow framing entirely — no clickjacking, no embedding the site in
  // another origin's iframe.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from MIME-sniffing responses.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL on same-origin navigations, only the origin
  // cross-origin, and nothing on downgrade.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser features the site doesn't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // The site is reachable on several domains, but floor-dana.com is the
  // canonical one — it's what NEXT_PUBLIC_APP_URL, the sitemap/metadata, and
  // the PayPlus payment callbacks all use. Auth cookies are per-domain, so a
  // visitor split across domains gets "randomly logged out" (e.g. paying on
  // www.dana-floor.com and returning to floor-dana.com without a session).
  // Permanently redirect every alternate domain to the canonical host.
  async redirects() {
    const altHosts = ["www.dana-floor.com", "dana-floor.com"];
    return altHosts.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://floor-dana.com/:path*",
      permanent: true,
    }));
  },
};

export default nextConfig;
