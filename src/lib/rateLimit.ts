/**
 * rateLimit.ts
 *
 * A fixed-window limiter held in process memory. The intent is not to defeat a
 * determined attacker -- nothing in-process can -- but to make bulk harvesting
 * of ten documents obvious and slow, and to leave a log trail when it
 * happens.
 *
 * Limitation worth stating plainly: this state is per-instance. On a serverless
 * host with N instances, the effective ceiling is limit x N. Swap the store
 * for Redis (Upstash) before relying on it under real load; the interface here
 * is deliberately narrow so that swap is a single-file change.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Keep the map from growing without bound under a spray of unique keys. */
const MAX_TRACKED_KEYS = 10_000;

function sweep(now: number): void {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [k, v] of buckets) {
    if (v.resetAt < now) buckets.delete(k);
  }
  // If the map is still oversized (every key live at once), drop oldest
  // insertions. Map preserves insertion order, so this is a cheap FIFO.
  while (buckets.size >= MAX_TRACKED_KEYS) {
    const oldest = buckets.keys().next();
    if (oldest.done) break;
    buckets.delete(oldest.value);
  }
}

export interface LimitResult {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets. Present when ok is false. */
  retryAfter?: number;
}

/**
 * Count one hit against `key`.
 *
 * @param key     identifies the caller, normally IP plus route
 * @param limit   hits allowed per window
 * @param windowMs window length in milliseconds
 */
export function rateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): LimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { ok: true, remaining: limit - existing.count };
}

/**
 * Best-effort client address. Trusts x-forwarded-for because the site is
 * expected to sit behind a proxy or CDN; on a bare host the header is
 * attacker-controlled, which at worst lets someone move their own counter.
 */
export function clientKey(headers: Headers, route: string): string {
  // Prefer the proxy-normalised address. A caller can prepend arbitrary values
  // to x-forwarded-for on some hosts; using that first would let one attacker
  // rotate through unlimited buckets. Only trust x-forwarded-for as fallback
  // when the hosting proxy does not provide a canonical address header.
  const ip =
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return `${route}:${ip}`;
}

export type AccessEvent = "allow" | "deny" | "bad-token" | "not-found";

/**
 * Structured access log. One line per denied or unusual request. Sinks to
 * stdout, which is where a serverless host collects it; point this at a real
 * log store if you ever need to alert on it.
 */
export function logAccess(
  event: AccessEvent,
  docId: string | null,
  ip: string
): void {
  const line = JSON.stringify({
    t: new Date().toISOString(),
    event,
    doc: docId,
    ip,
  });

  if (event === "allow") return; // keep stdout for signal, not noise
  if (event === "not-found" || event === "bad-token") {
    console.warn(`[doc-access] ${line}`);
  } else {
    console.error(`[doc-access] ${line}`);
  }
}
