import type { MetadataRoute } from "next";

/**
 * Web app manifest.
 *
 * Without this, iOS screenshots the page for the home-screen icon and Android
 * shows a generic globe. Both are avoidable with one small file.
 *
 * Colours come from the same two press runs the stylesheet defines: the dark
 * sheet is the default, and theme_color drives the browser chrome in standalone
 * mode.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${"Izaz Ahmed"}, document cabinet`,
    short_name: "Izaz Ahmed",
    description:
      "Portfolio and document cabinet of Peddapalem Izaz Ahmed. Two shipped projects and ten source documents, each one openable.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    categories: ["portfolio", "education", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        // Maskable needs the mark inset inside the safe zone, otherwise Android
        // crops the registration cross. The 512 sheet is generated from the
        // same SVG with generous padding, so it doubles as the maskable asset.
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
