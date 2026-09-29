import type { MetadataRoute } from "next";

/**
 * robots.txt
 *
 * The disallow is not hiding anything -- the page is meant to be found and a
 * portfolio that cannot be indexed cannot do its job. It exists so that
 * crawlers do not walk the document API: those routes are per-request signed,
 * they are meaningless without a token, and letting a crawler enumerate them
 * is pure noise in your logs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
      rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://izazahmed.dev/sitemap.xml",
    host: "https://izazahmed.dev",
  };
}
