import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { DOCS } from "@/lib/records";
import { verifyToken, resolveSecuredPath } from "@/lib/signing";
import { rateLimit, clientKey, logAccess } from "@/lib/rateLimit";

/**
 * /api/preview/[id]
 *
 * Streams the watermarked WebP preview for a document. Separate from /api/doc
 * on purpose: previews are the thing visitors see, so they are the thing that
 * gets screenshotted, and keeping them on their own route means the preview
 * policy can be tightened without touching access to originals.
 *
 * Same security ordering as the document route: verify, then allowlist, then
 * path. The route parameter never reaches path.join().
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const ip = clientKey(req.headers, "preview");

  // Previews are lighter and more numerous, so the ceiling is higher.
  const limit = rateLimit(ip, 120, 60_000);
  if (!limit.ok) {
    logAccess("deny", id, ip);
    return NextResponse.json(
      { error: "Too many preview requests." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
    );
  }

  const token = req.nextUrl.searchParams.get("t") ?? "";
  const verified = verifyToken(token);

  if (!verified || verified.docId !== id || verified.variant !== "preview") {
    logAccess("bad-token", id, ip);
    return NextResponse.json(
      { error: "This preview link is invalid or has expired." },
      { status: 403 }
    );
  }

  const doc = DOCS.find((d) => d.id === id);
  if (!doc) {
    logAccess("not-found", id, ip);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const target = resolveSecuredPath(doc.preview);
  if (!target) {
    logAccess("not-found", id, ip);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const buf = await readFile(target);
    if (buf.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "Preview too large" }, { status: 413 });
    }

    logAccess("allow", id, ip);

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        Vary: "Cookie",
      },
    });
  } catch {
    logAccess("not-found", id, ip);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
