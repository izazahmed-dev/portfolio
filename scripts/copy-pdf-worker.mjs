/**
 * Copy the PDF.js worker out of node_modules into /public.
 *
 * The worker has to be a real fetchable file: pointing workerSrc at a CDN
 * would send every document view to a third party, and the page is otherwise
 * entirely self-hosted. Running it as a prebuild hook means a fresh clone
 * cannot ship a broken reader, which is otherwise an easy mistake -- the
 * import succeeds, the file 404s, and the viewer fails only at runtime.
 *
 * Copies only when the source is newer, so an incremental build stays fast.
 */
import { copyFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const from = join(
  root,
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.mjs"
);
const to = join(root, "public", "pdf.worker.min.mjs");

if (!existsSync(from)) {
  console.error(
    `[pdf-worker] not found at ${from}\n` +
      `[pdf-worker] run "npm install" first.`
  );
  process.exit(1);
}

if (existsSync(to) && statSync(to).size === statSync(from).size) {
  console.log("[pdf-worker] already up to date");
} else {
  copyFileSync(from, to);
  console.log(
    `[pdf-worker] copied ${(statSync(to).size / 1024).toFixed(0)}KB -> public/`
  );
}
