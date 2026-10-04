import { Redis } from "@upstash/redis";

/**
 * Shared fixed-window limiter. Upstash is used in production so limits apply
 * across Vercel/serverless instances. Local development may use the in-memory
 * fallback; production fails closed if the shared credentials are absent.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

export function isSharedRateLimitConfigured(): boolean {
  return redis !== null;
}

const MAX_TRACKED_KEYS = 10_000;

function sweep(now: number): void {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
  while (buckets.size >= MAX_TRACKED_KEYS) {
    const oldest = buckets.keys().next();
    if (oldest.done) break;
    buckets.delete(oldest.value);
  }
}

export interface LimitResult {
  ok: boolean;
  remaining: number;
  retryAfter?: number;
}

export async function rateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): Promise<LimitResult> {
  if (redis) {
    const redisKey = `portfolio:ratelimit:${key}`;
    const count = await redis.incr(redisKey);
    if (count === 1) await redis.expire(redisKey, Math.ceil(windowMs / 1000));
    return count > limit
      ? { ok: false, remaining: 0, retryAfter: Math.ceil(windowMs / 1000) }
      : { ok: true, remaining: limit - count };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production."
    );
  }

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

/** Prefer proxy-normalized addresses; forwarded headers are fallback only. */
export function clientKey(headers: Headers, route: string): string {
  const ip =
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return `${route}:${ip}`;
}

export type AccessEvent = "allow" | "deny" | "bad-token" | "not-found";

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
  if (event === "allow") return;
  if (event === "not-found" || event === "bad-token") {
    console.warn(`[doc-access] ${line}`);
  } else {
    console.error(`[doc-access] ${line}`);
  }
}
