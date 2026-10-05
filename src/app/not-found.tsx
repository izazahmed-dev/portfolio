import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Not found.
 * Set in the same specimen book as everything else, so a broken link feels
 * like the press it came from rather than a browser default.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center">
      <div className="shell">
        <div className="max-w-[34ch]">
          <svg className="ink-404" viewBox="0 0 600 200" aria-hidden>
            <text x="300" y="176" textAnchor="middle">
              404
            </text>
          </svg>
          <p className="t-label">No such sheet</p>
          <h1 className="t-h2 mt-5" style={{ color: "var(--ink)" }}>
            That page is not in the cabinet.
          </h1>
          <p className="t-body mt-6">
            The address has no plate behind it. Everything that does exist
            sits on the front page, openable.
          </p>
          <Link href="/" className="btn mt-10 inline-flex">
            Back to the top
            <ArrowUpRight size={13} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </main>
  );
}
