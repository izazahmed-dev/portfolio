import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import path from "node:path";

/**
 * Path resolution for the private /secured tree.
 *
 * Kept beside the signing helpers so both route handlers and any future
 * consumer resolve identically. See resolveSecuredPath below for the guard.
 */

/**
 * Absolute path to the private directory, resolved once at module load.
 * process.cwd() is the app root on every mainstream host; SECURED_DIR allows
 * an override for hosts that stage files somewhere else.
 */
export const SECURED_ROOT = path.resolve(
  process.cwd(),
  process.env.SECURED_DIR ?? "secured"
);

/**
 * The only two subdirectories under /secured this site uses. Anything else is
 * rejected outright.
 */
const ALLOWED_SUBDIRS = new Set(["documents", "previews"]);

/**
 * Resolve a record's declared path to a real file inside SECURED_ROOT, or null.
 *
 * The record stores paths like "/documents/oracle-agentic-ai-associate.pdf" to
 * mirror the layout the files used to have in /public, but on disk they live at
 * secured/documents/oracle-agentic-ai-associate.pdf. The leading directory has
 * to be preserved, and it cannot simply be trusted: that would let a crafted
 * record point anywhere on the filesystem.
 *
 * posix.normalize collapses every ".." segment before anything is joined, then
 * the result must be exactly "/<allowed>/<filename>". A value such as
 * "/../../../etc/passwd" collapses to a shape that fails both checks and
 * returns null, so it never becomes a path at all.
 */
export function resolveSecuredPath(declared: string): string | null {
  const normalised = path.posix.normalize(declared);
  if (!path.posix.isAbsolute(normalised)) return null;

  const parts = normalised.split("/").filter(Boolean);
  if (parts.length !== 2) return null;

  const [dir, name] = parts;
  if (!ALLOWED_SUBDIRS.has(dir)) return null;
  // Nothing may survive inside the filename component.
  if (name !== path.basename(name)) return null;

  const target = path.join(SECURED_ROOT, dir, name);

  // Belt and braces: prove containment even if the checks above are ever
  // weakened by a future edit.
  const rel = path.relative(SECURED_ROOT, target);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;

  return target;
}


/**
 * signing.ts
 *
 * Document URLs are HMAC-signed and time-limited. The reason this exists: a
 * bare path like /documents/x.pdf in the HTML is a permanent public link that
 * can be copied, shared, and re-fetched forever. Signing means a URL that
 * stops working on its own, so a leaked link rots within the window instead
 * of living forever.
 *
 * WHAT THIS IS NOT: this is access control, not DRM. Once a file is rendered
 * in a browser the visitor has the bytes, and no scheme prevents that. What
 * this does buy is (a) no permanent public URL, (b) per-request rate limits
 * and logging, (c) a revocation point if a token needs to die early, and
 * (d) the ability to swap in a session check later without touching callers.
 */

/** How long a freshly minted document link stays valid. */
export const LINK_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * The signing secret. Read from the environment so it never lands in the
 * repository or the client bundle. In development only, fall back to a
 * process-scoped random value: that is fine locally (links reset on restart)
 * and deliberately fails closed in production rather than shipping a known
 * constant that would let anyone forge a link.
 */
let cachedSecret: string | null = null;

function getSecret(): string {
  if (cachedSecret) return cachedSecret;

  const fromEnv = process.env.DOC_SIGNING_SECRET;
  if (fromEnv && fromEnv.length >= 32) {
    cachedSecret = fromEnv;
    return cachedSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DOC_SIGNING_SECRET must be set to at least 32 characters in production."
    );
  }

  // Dev only: ephemeral, so nobody can hardcode it into a client.
  cachedSecret = randomBytes(48).toString("base64url");
  return cachedSecret;
}

export function isSigningConfigured(): boolean {
  return Boolean(
    process.env.DOC_SIGNING_SECRET && process.env.DOC_SIGNING_SECRET.length >= 32
  );
}

/**
 * Mint a token for one document and one variant ("file" or "preview").
 *
 * The variant is inside the signed payload, not appended afterwards. If it
 * were appended, a valid preview token would be trivially editable into a
 * file token -- the signature would still check out.
 */
function mint(docId: string, variant: "file" | "preview"): string {
  const expires = Date.now() + LINK_TTL_MS;
  const payload = `${variant}:${docId}:${expires}`;
  const mac = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${mac}`;
}

/**
 * Verify a token. Returns the docId on success, null on any failure --
 * malformed, tampered, or expired are deliberately indistinguishable to the
 * caller, because distinguishing them tells an attacker which half of the
 * guess was right.
 */
function check(token: string): { docId: string; variant: "file" | "preview" } | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const payloadB64 = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  if (!payloadB64 || !mac) return null;

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const expected = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);

  // timingSafeEqual throws on length mismatch, so guard first. Length is not
  // secret information -- the MAC length is fixed by the algorithm.
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  const [variant, docId, expiresRaw] = payload.split(":");
  if (variant !== "file" && variant !== "preview") return null;
  if (!docId) return null;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return null;

  return { docId, variant };
}

export function signFile(docId: string): string {
  return mint(docId, "file");
}

export function signPreview(docId: string): string {
  return mint(docId, "preview");
}

/** Build a ready-to-use route URL for a document variant. */
export function fileUrl(docId: string): string {
  return `/api/doc/${encodeURIComponent(docId)}?t=${signFile(docId)}`;
}

export function previewUrl(docId: string): string {
  return `/api/preview/${encodeURIComponent(docId)}?t=${signPreview(docId)}`;
}

export { check as verifyToken };
export const __internal = { mint, check };
