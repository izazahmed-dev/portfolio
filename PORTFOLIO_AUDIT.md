# Portfolio audit — izazahmed.dev

## Executive read

The portfolio already has a rare point of view: a letterpress “evidence edition” instead of a generic developer template. Its strongest differentiator is the promise that claims resolve to source documents. The main opportunity is not adding more effects; it is making the first ten seconds more recruiter-efficient while preserving the editorial identity.

## Findings and fixes in this preview

| Area | Finding | Action in this preview | Priority |
|---|---|---|---|
| Production security | `src/lib/signing.ts` documented fail-closed behavior but actually used a predictable fallback key when `DOC_SIGNING_SECRET` was missing. | Production now throws unless the secret is at least 32 characters. | Critical |
| Mobile layout | Long certificate references could force the cabinet grid wider than a narrow viewport. | The document index now uses constrained grid tracks and wraps references below the small breakpoint. | High |
| Discoverability | Core metadata was good but could be more explicit for technology classification and mobile contact behavior. | Added `category: "technology"` and disabled automatic telephone detection. | Medium |
| Content strategy | The visual system is memorable, but the recruiter path is easy to miss if a visitor scans rather than reads. | Preserved the current order—hero, shipped work, evidence—because it already puts projects before records; the design brief now treats this as an explicit rule. | High |

## Award-level recommendations

1. **Make one project the unmistakable hero case.** Keep the two-case dossier, but give the strongest project a short “problem → decision → outcome” summary above the deeper engineering notes. Awards judges and recruiters should understand the value before reading the craft details.
2. **Add one real outcome per project.** Prefer measured behavior, adoption, latency, or a before/after workflow over generic “built with” language. If a number cannot be sourced, write the qualitative result instead of inventing one.
3. **Add a compact availability signal.** A small “Available for summer 2027 AI/ML internships” status line near the primary CTA would make the call to action unmissable without turning the site into a job-board template.
4. **Use motion as punctuation.** Keep the existing GSAP/Lenis system, but make sure every major reveal has a no-motion equivalent and that no effect delays project comprehension. The current reduced-motion path is a strong foundation.
5. **Keep evidence secondary but exceptional.** The cabinet is a compelling differentiator; label it as “verified record” in the section introduction so visitors understand why it is valuable, not just that it exists.
6. **Strengthen share previews.** Create a social image that features one project outcome rather than only identity and document counts. This is especially valuable when the portfolio is shared in a recruiter message.
7. **Production readiness before Vercel.** Set `DOC_SIGNING_SECRET` in Vercel Project Settings, verify the production domain, and run signed-document smoke tests after deployment. Do not deploy with the secret missing.

## Existing strengths worth preserving

- A consistent type, color, and registration-mark language across sections.
- Honest caveats around participation certificates and source documents.
- Server-rendered page content with canonical, Open Graph, Twitter, sitemap, and robots metadata.
- Keyboard focus management for navigation, the cabinet drawer, and the document reader.
- Reduced-motion support and a clear separation between public assets and signed private documents.

## Validation baseline

Before this revision, `npm run check` passed: TypeScript, ESLint, and `next build`. The dependency audit reported two advisories (one moderate, one high); this should be reviewed before production deployment rather than auto-fixing blindly because the project intentionally avoids runtime image optimization.

## Security status — 2026-10-04

The previous wording that described the evidence tree as private was inaccurate: the public repository tracked 20 files under `secured/`, and those files were present in public Git history at commit `93c71b4`. HMAC-protected routes cannot protect material that is already downloadable from GitHub. See [`SECURITY.md`](./SECURITY.md) for the full threat model and remediation plan.

This revision removes `secured/` from the Git index, ignores it for future commits, removes its Next output-tracing inclusion, requires `SECURED_DIR` in production, adds a CSP/security-header baseline, marks protected responses `noindex`, and prefers proxy-normalized client address headers for rate limiting. The public history has now been rewritten and the cleaned `master` branch force-pushed. GitHub may continue serving unreachable old commit objects temporarily while its garbage collection completes.
