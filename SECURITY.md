# Security audit — portfolio

Date: 2026-10-04

## Executive conclusion

A website **cannot reliably prevent screenshots, screen recording, photographs of the screen, browser developer-tools access, or copying of bytes already delivered to a visitor**. JavaScript can block a few casual UI actions, but it cannot control the visitor's operating system, browser extensions, another device, or a camera.

The strongest practical goal is to keep sensitive files out of public artifacts, authorize every file response, use short-lived scoped links, watermark displayed content, harden the browser and server, and minimize the sensitive information shown in the first place.

## Critical finding: evidence files were public

The repository previously contained 20 personal evidence files under `secured/` in a public repository and public Git history. HMAC-protected routes cannot protect material already downloadable from GitHub.

The current repository tip no longer contains those files. The `secured/` directory is ignored, the reachable history was rewritten, and the cleaned `master` branch was force-pushed. GitHub may temporarily resolve unreachable old commit objects while garbage collection completes.

### Remaining production actions

- Put originals and previews in private object storage or a private mounted volume.
- Set `SECURED_DIR` in production; the app refuses to boot when it is missing.
- Rotate any exposed credentials or identifiers contained in the old files.
- Rotate `DOC_SIGNING_SECRET` before production so old signed links are invalid.
- Do not include the private directory in Next output tracing or a static export.

History rewriting and force-pushing a public repository was destructive; it was performed only after confirmation and a local mirror backup was created.

## What the application does well

- HMAC tokens are server-generated and never minted in the browser.
- Tokens bind the document ID and variant (`file` versus `preview`) into the signed payload.
- Links expire after 30 minutes.
- IDs are checked against a fixed allowlist before a filesystem path is built.
- The path resolver only accepts the `documents` and `previews` directories and rejects traversal shapes.
- Protected responses use `private, no-store`, `nosniff`, and `X-Robots-Tag: noindex, nofollow, noarchive`.
- Originals are rendered in an in-page canvas reader instead of handing a PDF to the browser's native download/print toolbar.
- Previews include a provenance watermark.
- The application does not rely on `user-select: none`, which would harm accessibility.
- Robots and sitemap files exclude the document API.
- Production fails closed when `DOC_SIGNING_SECRET` or `SECURED_DIR` is missing.
- CSP, HSTS, frame, referrer, permissions, and MIME security headers are included.
- The rate limiter prefers proxy-normalized client address headers.

## What these controls do not prevent

- screenshots, screen recording, phone-camera capture, or OCR;
- copying a response from the Network panel or using `curl` with a valid token;
- a visitor extracting a signed URL from the rendered HTML or browser memory during its TTL;
- a malicious browser extension or malware on the visitor's device;
- a determined user photographing a watermarked canvas;
- denial of service against a public endpoint.

The context-menu guard is only friction. It does not provide security and must not be described as screenshot protection.

## Security headers

`next.config.ts` sends `nosniff`, strict referrer policy, frame restrictions, HSTS, permissions restrictions, and a CSP. The CSP intentionally contains `unsafe-inline` because the current layout uses inline boot scripts and inline JSON-LD. A later improvement would generate a per-request nonce and remove `unsafe-inline` from `script-src`.

## Rate limiting limitation

The current limiter is process-local. On a multi-instance/serverless deployment, each instance has its own counter. Before treating it as an anti-harvesting control, replace it with a shared store such as Redis/Upstash, and configure the hosting proxy so the canonical client IP header cannot be forged by the caller.

## Privacy findings

The portfolio exposes sensitive personal data in page metadata and transcript content, including a register number, phone number, school identifiers, marks, and document references. This is a privacy decision rather than a technical security control. Consider publishing redacted previews and using a private verification flow for full records.

## Recommended production checklist

- [x] Purge `secured/` from public Git history and remove it from the repository tip.
- [ ] Configure private storage and `SECURED_DIR`.
- [ ] Set a random `DOC_SIGNING_SECRET` of at least 32 characters and rotate it before production.
- [ ] Rotate any credentials or identifiers exposed in the old evidence files.
- [ ] Use shared rate limiting and verified proxy IP headers in multi-instance production.
- [ ] Deploy only behind HTTPS; keep HSTS only when every subdomain is HTTPS-ready.
- [x] Update the vulnerable runtime PostCSS chain with a pinned 8.5.28 override.
- [ ] Upgrade Tailwind to v4 in a separate compatibility change if a clean development-only `npm audit` result is required.
- [ ] Test traversal, token swapping, expiry, cache headers, and missing-storage behavior in production.
- [ ] Do not promise “screenshot-proof” or “unhackable” behavior to visitors.
