import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "_archive/**",
      "secured/**",
      "next-env.d.ts",
      // Vendored PDF.js worker, copied verbatim out of node_modules by
      // scripts/copy-pdf-worker.mjs. Minified third-party build output: not
      // ours to lint, and 1450 findings in it drowns out real ones.
      "public/pdf.worker.min.mjs",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],

      /*
       * next/image wants a static src it can fingerprint at build time, and
       * our document previews are signed per request by design -- there is no
       * stable URL for the optimizer to reason about, and the optimizer is
       * disabled in next.config anyway. A plain <img> is the correct tool here,
       * so the rule is off for this file rather than silenced inline twice.
       */
      "@next/next/no-img-element": "off",
    },
  },
  {
    // Build and tooling scripts report progress on stdout, which is the whole
    // point of them. The app itself still gets the stricter no-console rule.
    files: ["scripts/**/*.mjs"],
    rules: {
      "no-console": "off",
    },
  },
];

export default eslintConfig;
