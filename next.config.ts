import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Images are pre-built to AVIF/WebP and shipped next to their source, so the
  // optimizer stays off. That also keeps the sharp/libheif image pipeline out
  // of the build entirely, which matters: sharp has a live RCE advisory
  // (GHSA-2xp9-vwfh-vxw4) and an optimizer we never call is an optimizer we
  // never have to patch.
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,

  // Documents and previews are served by route handlers that check a signed,
  // expiring token before touching the filesystem. They are NEVER public
  // static assets, so they must not receive the long-lived immutable cache
  // header below -- a cached copy at a CDN edge is a permanently public copy.
  async headers() {
    return [
      // Baseline hardening applied to every response.
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // Public photographic assets. These never change under the same name, so
      // an immutable year is correct.
      //
      // The extension list is written as a plain capturing alternation, not a
      // non-capturing group: Next validates `source` with path-to-regexp and
      // rejects a pattern that can start with "?", which "(?:" does at the
      // colon position. The previous ':all*(svg|jpg|...)' source was worse --
      // it parsed, but matched nothing, so the header silently never applied.
      {
        source: "/:path*.(svg|jpg|jpeg|png|webp|avif|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // PDFs are NOT in the pattern above on purpose. A result sheet is
      // replaced when the next semester is published, so it must revalidate
      // rather than being pinned immutable for a year.
      {
        source: "/:path*.pdf",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
