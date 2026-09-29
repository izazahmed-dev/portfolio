# izazahmed.dev

A portfolio rendered as a letterpress specimen book: a title page, two shipped
projects, an evidence cabinet of ten source documents, a transcribed academic
register, and a contact colophon.

The governing rule of the content: **every claim on the page resolves to a
document you can open.** Nothing is estimated, rounded up, or asserted without
a reference number or an honest caveat printed beside it.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind 3 · GSAP 3 ·
Lenis · lucide-react

## Getting started

```bash
npm install
cp .env.example .env.local   # then set DOC_SIGNING_SECRET
npm run dev
```

Generate a signing secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## Scripts

| command | does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run start` | serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint 9 flat config |
| `npm run check` | typecheck + lint + build |

---

## How the document cabinet works

The ten source documents are **not** public assets. They live in `/secured`,
which is git-ignored, and are streamed by two route handlers that refuse to
touch the filesystem without a valid signature.

```
src/lib/records.ts          the transcript. Bare paths, never published.
src/lib/signing.ts          HMAC sign/verify + the /secured path resolver
src/lib/rateLimit.ts        fixed-window limiter and access logging
src/app/api/doc/[id]        serves an original, 30-minute signed token
src/app/api/preview/[id]    serves a watermarked WebP preview
```

### The security model, and what it is not

This is **access control, not DRM.** Once a browser renders a file the visitor
has the bytes; no scheme on the web prevents that, and any product claiming
otherwise is selling something. What this design actually achieves:

- **No permanent public URL.** Every link is HMAC-signed and expires in 30
  minutes, so a leaked link rots instead of living forever.
- **Nothing crawlable.** No bare path into `/secured` is ever written into the
  HTML, and `/api/` is disallowed in `robots.txt`.
- **The secret stays server-side.** Links are minted in `src/app/page.tsx`, a
  server component. The client bundle contains no `createHmac` and no secret —
  this is asserted in the README's test notes below.
- **Per-request controls.** Rate limits, `no-store` caching, and a structured
  access log make bulk harvesting slow and visible.
- **Provenance.** Previews carry a viewer token and date, so a copy that leaves
  the site carries a receipt. This is a deterrent, not a control.

Right-click is suppressed site-wide by an inline head script in
`src/app/layout.tsx` (before hydration, so there is no window where it still
opens). Images additionally refuse drag-to-desktop.

**What this is worth, plainly:** it is friction, not protection. `curl`, F12 →
Network, and Ctrl+S all still work, because `curl` never runs JavaScript. It
stops the casual right-click → "Save image as". The load-bearing control is
the signed expiring URLs above.

Two deliberate carve-outs, both verified in a real browser:

- **Keyboard users keep the menu.** Shift+F10 and the Menu key still open it,
  detected via the `shiftKey` modifier. Blocking those would be a genuine
  WCAG 2.1.1 failure, and this is a portfolio you want usable.
- **Text fields keep the menu**, so cut/copy/paste survives.
- **`user-select` is untouched**, so text selection and copying still work.

To make it absolute for everyone, delete the `openForKeyboard` early-return
and the `t.closest('input, textarea...')` line in the guard. You lose
keyboard access to the context menu, which is a real accessibility cost.

### The path-traversal guard

Order matters and is the thing most often got wrong:

1. verify the token
2. check the requested id against the `DOCS` allowlist
3. check the id inside the token matches the requested id
4. resolve the record's own path through `resolveSecuredPath`, which allows
   only `/documents/<name>` or `/previews/<name>`
5. only then `readFile`

A request like `/api/doc/..%2F..%2F.env` fails at step 2 and never becomes a
path. Swapping a valid token onto a different document fails at step 3.

### Deployment

This site **requires a Node server** (Vercel, or any Node host). Static export
is fundamentally incompatible with the access control above — a static build
has no server to check a token.

Set `DOC_SIGNING_SECRET` in the host's environment. The app throws on boot in
production without it, rather than falling back to a guessable default.

---

## Verified behaviour

Checked against a production build (Next 15.5.26):

| check | result |
|---|---|
| `/documents/*.pdf` (old public path) | 404 |
| unsigned `/api/doc/<id>` | 403 |
| path traversal attempts | 403 |
| valid signed document link | 200 `application/pdf` |
| valid signed preview link | 200 `image/webp` |
| valid token replayed on another document | 403 |
| file token used on the preview route | 403 |
| tampered MAC / empty signature | 403 |
| 34 rapid requests | 200s then 429 after the limit |
| signing secret or `createHmac` in any client chunk | absent |
| bare `/documents/` paths in HTML | 0 |
| odometer digit strips in HTML | 0 |

Context-menu guard, checked by dispatching real `contextmenu` events in
Chrome and reading back `defaultPrevented`:

| check | result |
|---|---|
| right-click on page body | blocked |
| right-click on hero heading | blocked |
| right-click on an image | blocked |
| image drag-to-desktop | blocked |
| Shift+F10 (keyboard) | still opens, by design |
| Menu key (keyboard) | still opens, by design |
| text selection | still enabled (`user-select: auto`) |

---

## Content

All figures in `src/lib/records.ts` are transcribed from the documents in
`/secured`. To add or update one, drop the file in `secured/documents`, add the
preview in `secured/previews`, and add a matching `DOCS` entry. The path
resolver only accepts the `documents` and `previews` subdirectories.

## License

Code: MIT.
