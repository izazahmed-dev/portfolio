"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useDirectionalWipe } from "@/components/motion/Kinetic";
import { PROFILE } from "@/lib/records";

const SECTIONS = [
  { href: "#cabinet", label: "Specimens" },
  { href: "#dossier", label: "Work" },
  { href: "#register", label: "Register" },
  { href: "#colophon", label: "Contact" },
];

/**
 * Running head.
 * 68px, single line at desktop. A drawn progress rule under the bar reports
 * read position, which is why it earns its pixels: it is instrumentation, not
 * decoration. Progress is read from ScrollTrigger rather than a scroll listener.
 */
export function RunningHead() {
  const [open, setOpen] = useState(false);
  const [inked, setInked] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const wipeRef = useDirectionalWipe<HTMLAnchorElement>();

  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

    if (prefersReducedMotion()) return;

    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        onUpdate: (self) => setInked(self.progress > 0.008),
      },
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className="no-print fixed inset-x-0 top-0"
        style={{
          zIndex: "var(--z-chrome)" as unknown as number,
          height: "var(--chrome)",
          background: inked ? "rgba(236,233,225,0.9)" : "transparent",
          backdropFilter: inked ? "blur(12px) saturate(140%)" : "none",
          WebkitBackdropFilter: inked ? "blur(12px) saturate(140%)" : "none",
          borderBottom: `1px solid ${inked ? "var(--rule)" : "transparent"}`,
          transition:
            "background .4s var(--ease), border-color .4s var(--ease), backdrop-filter .4s var(--ease)",
        }}
      >
        <div className="shell flex h-full items-center justify-between gap-8">
          <a href="#top" className="group flex items-baseline gap-3">
            <span
              className="t-h3"
              style={{ fontSize: "0.9375rem", letterSpacing: "-0.01em" }}
            >
              {PROFILE.shortName}
            </span>
            <span className="t-data hidden text-[0.625rem] sm:inline" style={{ color: "var(--ink-400)" }}>
              AI and ML, Tirupati
            </span>
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Sections">
            {SECTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="rule-link t-data flex items-center text-[0.6875rem] uppercase leading-none tracking-[0.14em]"
                style={{ color: "var(--ink-500)" }}
              >
                {s.label}
              </a>
            ))}

            <a
              ref={wipeRef}
              href={`mailto:${PROFILE.email}`}
              className="btn"
              style={{ paddingBlock: "11px" }}
            >
              Email me
              <ArrowUpRight size={13} strokeWidth={2.2} />
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn btn--line lg:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
          >
            <Menu size={14} strokeWidth={1.9} />
            Index
          </button>
        </div>

        <div
          ref={barRef}
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
          style={{ background: "var(--red-500)" }}
        />
      </header>

      {open && (
        <div
          className="no-print fixed inset-0 lg:hidden"
          style={{ zIndex: "var(--z-sheet)" as unknown as number }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full"
            style={{ background: "rgba(20,18,15,0.55)" }}
          />
          <div
            className="relative ml-auto flex h-full w-[88%] max-w-sm flex-col justify-between p-7"
            style={{ background: "var(--paper-000)", borderLeft: "1px solid var(--rule-strong)" }}
          >
            <div>
              <div className="mb-10 flex items-center justify-between">
                <span className="t-label">Index</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                  className="grid h-9 w-9 place-items-center rounded-full"
                  style={{ border: "1px solid var(--rule-strong)" }}
                >
                  <X size={16} strokeWidth={1.9} />
                </button>
              </div>

              <ul>
                {SECTIONS.map((s, i) => (
                  <li key={s.href} style={{ borderTop: "1px solid var(--rule)" }}>
                    <a
                      href={s.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-4"
                    >
                      <span className="t-data text-[0.625rem]" style={{ color: "var(--red-600)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="t-h3">{s.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`mailto:${PROFILE.email}`}
              onClick={() => setOpen(false)}
              className="btn w-full"
            >
              Email me
              <ArrowUpRight size={13} strokeWidth={2.2} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/** Colophon rule at the foot of the press sheet. */
export function Imprint() {
  return (
    <footer
      className="no-print"
      style={{ borderTop: "1px solid var(--rule-strong)", background: "var(--stock-sunk)" }}
    >
      <div className="shell flex flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between">
        <p className="t-data text-[0.625rem] uppercase tracking-[0.16em]" style={{ color: "var(--ink-400)" }}>
          {PROFILE.legalName}, {PROFILE.institution}, {PROFILE.batch}
        </p>
        <p className="t-data text-[0.625rem] uppercase tracking-[0.16em]" style={{ color: "var(--ink-400)" }}>
          College result sheets are marked provisional by the issuer
        </p>
      </div>
    </footer>
  );
}
