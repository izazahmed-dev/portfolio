"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Error boundary.
 * A press run that fails still prints a sheet. The reader gets the single
 * thing they can act on: a way back to the top, and a note that says what
 * happened in plain language rather than a stack identifier.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[100dvh] items-center">
      <div className="shell">
        <div className="max-w-[34ch]">
          <p className="t-label">Press fault</p>
          <h1 className="t-h2 mt-5" style={{ color: "var(--ink)" }}>
            The sheet did not print.
          </h1>
          <p className="t-body mt-6">
            Something on this page stopped responding. Nothing you did caused
            it, and the rest of the site is unaffected.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button type="button" onClick={reset} className="btn">
              Try the sheet again
              <ArrowUpRight size={13} strokeWidth={2.2} />
            </button>
            <Link href="/" className="btn btn--line">
              Back to the top
              <ArrowUpRight size={13} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
