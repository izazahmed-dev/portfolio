import type { MetadataRoute } from "next";
import { PROFILE } from "@/lib/records";

/**
 * Sitemap.
 *
 * A one-page site still deserves one: it is the cleanest way to state a
 * canonical home for the domain, and it is the only machine-readable place
 * that says "this is the whole site".
 *
 * The document routes are deliberately absent. They carry per-request signed
 * tokens, they are not crawlable, and listing them would be an invitation.
 */
const BASE = "https://izazahmed.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE,
      lastModified,
      changeFrequency: "monthly",
      // The page is rebuilt whenever the record changes, not on a schedule.
      priority: 1,
    },
  ];
}

export { PROFILE };
