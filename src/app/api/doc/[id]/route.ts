import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { DOCS } from "@/lib/records";
import { verifyToken } from "@/lib/signing";
import { rateLimit, clientKey, logAccess } from "@/lib/rateLimit";
import { readPrivateAsset } from "@/lib/privateStorage";

/**
 * /api/doc/[id]
 *
 * Streams one original document from /secured, but only to a caller holding a
 * valid unexpired signature for that exact document.
 *
 * The security property that matters most here is the ORDER of operations:
 *
 *   1. verify the token   (proves the caller was issued this link)
 *   2. look the id up in the DOCS allowlist  (the ONLY place a path is built)
 *   3. basename() the result  (defence in depth, not the primary guard)
 *   4. read the file
 *
 * The route parameter is never passed to path.join(). A request for
 * /api/doc/..%2F..%2F.env cannot reach the filesystem because it fails the
 * DOCS lookup at step 2 and never becomes a path at all. Getting this order
 * backwards is the single most common way to build a file-read vulnerability,
 * so the lookup is what does the work and basename is only a belt on top.
 *
 * This route must never be statically rendered: it is per-request and
 * permissioned. The `dynamic` and `revalidate` settings below make that
 * explicit rather than relying on a default that could change.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

/** Sensible ceiling so a signed link cannot be used to pull a huge file. */
const MAX_BYTES = 12 * 1024 * 1024;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const ip = clientKey(req.headers, "doc");

  let limit;
  try {
    limit = await rateLimit(ip, 30, 60_000);
  } catch {
    logAccess("deny", id, ip);
    return NextResponse.json(
      { error: "Protected document service is not configured." },
      { status: 503, headers: { "Retry-After": "60" } }
    );
  }
  if (!limit.ok) {
    logAccess("deny", id, ip);
    return NextResponse.json(
      { error: "Too many document requests. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter ?? 60) },
      }
    );
  }

  const token = req.nextUrl.searchParams.get("t") ?? "";
  const verified = verifyToken(token);

  // A valid token for the WRONG document is as useless as no token. Reject on
  // the id mismatch, not just on the signature, or a preview link would open
  // the original.
  if (!verified || verified.docId !== id || verified.variant !== "file") {
    logAccess("bad-token", id, ip);
    return NextResponse.json(
      { error: "This link is invalid or has expired. Reload the page for a fresh one." },
      { status: 403 }
    );
  }

  // Allowlist lookup. An unknown id stops here, before any path is built.
  const doc = DOCS.find((d) => d.id === id);
  if (!doc) {
    logAccess("not-found", id, ip);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const buf = await readPrivateAsset(doc.file, MAX_BYTES);
    if (buf.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "Document too large" }, { status: 413 });
    }

    logAccess("allow", id, ip);

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type":
          doc.kind === "pdf" ? "application/pdf" : "image/jpeg",
        // "inline" so it renders in the tab. "attachment" would be a download.
        "Content-Disposition": `inline; filename="${path.basename(doc.file)}"`,
        // Never store. A cached copy at a CDN edge is a permanent public copy,
        // which is precisely what the signing exists to prevent.
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        Vary: "Cookie",
      },
    });
  } catch {
    // Do not distinguish "missing on disk" from "unreadable" in the response.
    logAccess("not-found", id, ip);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
