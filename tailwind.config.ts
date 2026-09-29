import type { Config } from "tailwindcss";

/**
 * Tailwind is used for layout primitives only. Colour, type and radius live in
 * CSS custom properties in globals.css, so there is one source of truth for the
 * design tokens and no chance of a section drifting to a different palette.
 */
const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        rail: "1320px",
      },
    },
  },
  plugins: [],
};

export default config;
