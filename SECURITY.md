# Security audit — portfolio

Date: 2026-10-04

## Executive conclusion

A website **cannot reliably prevent screenshots, screen recording, photographs of the screen, browser developer-tools access, or copying of bytes already delivered to a visitor**. JavaScript can block a few casual UI actions, but it cannot control the visitor's operating system, browser extensions, another device, or a camera.

The strongest practical goal is therefore:

1. do not publish sensitive files in the repository or static build;
2. require authorization before every file response;
3. make links short-lived, scoped, and revocable;
4. watermark what is displayed;
5. harden the browser and server against common attacks;
6. minimize the sensitive information shown in the first place.

## Critical finding: evidence files were public

The repository is public and currently contains 20 files under `secured/` (original PDFs/JPGs and previews). They are therefore downloadable from GitHub's normal file/raw endpoints, regardless of the application's HMAC checks. The files also appear in commit `93c71b4` and public Git history.

This is the highest-priority issue. A signed route cannot protect a file that is already available in a public repository.

### Required remediation before production

- Remove `secured/` from the Git index and keep `/secured/` ignored.
- Purge the files from **all public Git history**; a normal delete commit is not enough.
- Rotate any exposed credentials or identifiers contained in the files.
- Make the repository private if the evidence must remain there temporarily.
- Put originals and previews in private object storage or a private mounted volume.
- Set `SECURED_DIR` in production. The app now refuses to boot in production when it is missing.
- Do not include the private directory in Next output tracing or a static export.
- Invalidate any old links by rotating `DOC_SIGNING_SECRET`.

History rewriting and force-pushing a public repository is destructive. Do it only after taking a backup and confirming that collaborators are ready for the new history.

## What the application already does well

- HMAC tokens are server-generated and are not minted in the browser.
- Tokens bind the document ID and variant (`file` versus `preview`) into the signed payload.
- Links expire after 30 minutes.
- IDs are checked against a fixed allowlist before a filesystem path is built.
- The path resolver only accepts the `documents` and `previews` directories and rejects traversal shapes.
- Protected responses use `private, no-store` and `nosniff`.
- Originals are rendered in an in-page canvas reader instead of handing a PDF to the browser's native download/print toolbar.
- Previews include a provenance watermark.
- The application does not rely on `user-select: none`, which would harm accessibility.
- Robots and sitemap files exclude the document API.
- The production secret already fails closed when absent; `SECURED_DIR` now does too.
- A CSP/security-header baseline, non-indexing response header, and safer proxy-address preference are now included.

## What these controls do not prevent

- screenshots, screen recording, phone-camera capture, or OCR;
- copying a response from the Network panel or using `curl` with a valid token;
- a visitor extracting a signed URL from the rendered HTML or browser memory during its TTL;
- a malicious browser extension or malware on the visitor's device;
- a determined user photographing a watermarked canvas;
- denial of service against a public endpoint.

The context-menu guard is only friction. It does not provide security and must not be described as screenshot protection.

## Security headers

`next.config.ts` now sends `nosniff`, strict referrer policy, frame restrictions, HSTS, permissions restrictions, and a CSP. The CSP intentionally contains `unsafe-inline` because the current layout uses inline boot scripts and inline JSON-LD; this is useful baseline protection but not a maximum-strength CSP. A later improvement would generate a per-request nonce and remove `unsafe-inline` from `script-src`.

## Rate limiting limitation

The current limiter is process-local. On a multi-instance/serverless deployment, each instance has its own counter. Before treating it as an anti-harvesting control, replace it with a shared store such as Redis/Upstash, and configure the hosting proxy so the canonical client IP header cannot be forged by the caller.

## Privacy findings

The portfolio exposes sensitive personal data in the page metadata and transcript, including a register number, phone number, school identifiers, marks, and other document references. This may be intentional, but it is a privacy decision—not a technical security control. Consider publishing redacted previews and using a private verification flow for full records.

## Recommended production checklist

- [ ] Purge `secured/` from public Git history.
- [ ] Configure private storage and `SECURED_DIR`.
- [ ] Set a random `DOC_SIGNING_SECRET` of at least 32 characters.
- [ ] Rotate the signing secret after any suspected link leak.
- [ ] Use shared rate limiting and verified proxy IP headers.
- [ ] Deploy only behind HTTPS; keep HSTS only when every subdomain is HTTPS-ready.
- [ ] Run dependency updates and review advisories; do not use `npm audit fix --force` blindly because it proposes breaking major upgrades.
- [ ] Test traversal, token swapping, expiry, cache headers, and missing-storage behavior in production.
- [ ] Do not promise “screenshot-proof” or “unhackable” behavior to visitors.
