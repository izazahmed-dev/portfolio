# Sentinel Security Journal

## 2025-05-20 - Lazy Secret Evaluation for Next.js Route Build Analysis
**Vulnerability:** Immediate IIFE execution of `process.env` checks for `DOC_SIGNING_SECRET` threw errors during `next build` page data collection when build environments lacked runtime secrets.
**Learning:** Next.js imports API route modules during static build analysis (`next build`). Top-level IIFEs that throw when env vars are missing fail the build phase, even for `force-dynamic` routes.
**Prevention:** Lazily evaluate production environment secrets on access (e.g. inside a `getSecret()` getter) so module evaluation during build time succeeds while runtime execution still fails closed securely.
