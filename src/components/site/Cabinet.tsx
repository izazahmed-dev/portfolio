"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Info,
  ScanLine,
  X,
} from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import {
  ProseReveal,
  Scramble,
  Squeegee,
  useDirectionalWipe,
  useProximityWeight,
  useSpotlight,
} from "@/components/motion/Kinetic";
import { DOCS, type SourceDoc } from "@/lib/records";

/**
 * The cabinet.
 * An index of every document the sheet cites, and a plate that resolves the
 * highlighted row into the actual scan. Two motions earn their place here:
 * the plate crossfade confirms which row the pointer is on, and the drawer
 * transition carries the row into a full reading of the same document, so the
 * user never loses track of what they clicked.
 */
export function Cabinet() {
  const [activeId, setActiveId] = useState(DOCS[0].id);
  const [openId, setOpenId] = useState<string | null>(null);

  const active = DOCS.find((d) => d.id === activeId) ?? DOCS[0];
  const opened = openId ? DOCS.find((d) => d.id === openId) ?? null : null;

  return (
    <section
      id="cabinet"
      className="relative scroll-mt-[68px] py-24 md:py-32"
      style={{ borderTop: "1px solid var(--rule-strong)" }}
    >
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Squeegee as="h2" className="t-h2">
              Pick a row. The original opens.
            </Squeegee>
            <ProseReveal as="p" className="t-body mt-6">
              Certificates, board memoranda and semester sheets, stored on this site rather than summarised on it. Where a document carries no reference number, the row says so instead of inventing one.
            </ProseReveal>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Index
              activeId={activeId}
              onActivate={setActiveId}
              onOpen={setOpenId}
            />
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <Plate doc={active} onOpen={() => setOpenId(active.id)} />
          </div>
        </div>
      </div>

      <Drawer doc={opened} onClose={() => setOpenId(null)} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Index({
  activeId,
  onActivate,
  onOpen,
}: {
  activeId: string;
  onActivate: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  // Cursor pressure on the row titles: characters near the pointer gain weight.
  const prox = useProximityWeight<HTMLUListElement>("[data-row]", "[data-prox]");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".cab-row", {
        y: 26,
        opacity: 0,
        duration: 0.85,
        stagger: 0.045,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <div
        className="grid grid-cols-[30px_1fr_auto] gap-x-5 pb-3"
        style={{ borderBottom: "1px solid var(--rule-strong)" }}
      >
        <span className="t-label">No</span>
        <span className="t-label">Document and issuer</span>
        <span className="t-label text-right">Reference</span>
      </div>

      <ul ref={prox}>
        {DOCS.map((doc, i) => (
          <Row
            key={doc.id}
            doc={doc}
            n={i + 1}
            active={doc.id === activeId}
            onActivate={() => onActivate(doc.id)}
            onOpen={() => onOpen(doc.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function Row({
  doc,
  n,
  active,
  onActivate,
  onOpen,
}: {
  doc: SourceDoc;
  n: number;
  active: boolean;
  onActivate: () => void;
  onOpen: () => void;
}) {
  return (
    <li className="cab-row" data-row style={{ borderBottom: "1px solid var(--rule)" }}>
      <button
        type="button"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={() => {
          onActivate();
          onOpen();
        }}
        aria-pressed={active}
        className="group relative grid w-full grid-cols-[30px_1fr_auto] items-baseline gap-x-5 py-[18px] text-left"
        style={{
          background: active ? "rgba(210,50,15,0.045)" : "transparent",
          paddingInline: active ? "12px" : "0px",
          marginInline: active ? "-12px" : "0px",
          transition:
            "background .38s var(--ease), padding-inline .38s var(--ease), margin-inline .38s var(--ease)",
          cursor: "pointer",
        }}
      >
        {/* Active marker: a printed rule that grows from the left edge */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[2px] origin-top"
          style={{
            background: "var(--red-500)",
            transform: `scaleY(${active ? 1 : 0})`,
            transition: "transform .42s var(--ease)",
          }}
        />

        <span
          className="t-data text-[0.6875rem]"
          style={{ color: active ? "var(--red-600)" : "var(--ink-400)" }}
        >
          {String(n).padStart(2, "0")}
        </span>

        <span className="min-w-0">
          <span
            data-prox
            className="block text-[1rem] font-medium leading-snug md:text-[1.0625rem]"
            style={{
              color: active ? "var(--ink-900)" : "var(--ink-700)",
              transition: "color .3s var(--ease)",
            }}
          >
            {doc.title}
          </span>
          <span
            className="t-data mt-1.5 block text-[0.625rem] uppercase tracking-[0.12em]"
            style={{ color: "var(--ink-400)" }}
          >
            {doc.issuer} <span aria-hidden>/</span> {doc.issued}
          </span>

          {/* Below lg the active row carries its own plate inline */}
          {active && (
            <span className="mt-4 block lg:hidden">
              <span className="plate impress block overflow-hidden">
                <Sheet doc={doc} />
                <span className="block p-4">
                  <span className="block text-[0.875rem] font-medium">{doc.headline}</span>
                  <span
                    className="t-data mt-3 block text-[0.625rem] uppercase tracking-[0.14em]"
                    style={{ color: "var(--red-600)" }}
                  >
                    Tap to read the full entry
                  </span>
                </span>
              </span>
            </span>
          )}
        </span>

        <span
          className="t-data whitespace-nowrap text-right text-[0.625rem]"
          style={{ color: active ? "var(--ink-700)" : "var(--ink-400)" }}
        >
          {doc.reference ?? "none printed"}
        </span>
      </button>
    </li>
  );
}

/* -------------------------------------------------------------------------- */

function Plate({ doc, onOpen }: { doc: SourceDoc; onOpen: () => void }) {
  const spot = useSpotlight<HTMLDivElement>();
  const wipe = useDirectionalWipe<HTMLButtonElement>();
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  // Crossfade the plate whenever the highlighted row changes.
  useEffect(() => {
    const el = sheetRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { opacity: 0, scale: 1.024, filter: "blur(6px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.62, ease: "power3.out" }
    );
  }, [doc.id]);

  useEffect(() => setCopied(false), [doc.id]);

  const copyRef = useCallback(() => {
    if (!doc.reference) return;
    void navigator.clipboard.writeText(doc.reference).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1700);
    });
  }, [doc.reference]);

  return (
    <div className="sticky" style={{ top: "calc(var(--chrome) + 1.5rem)" }}>
      <div ref={spot} className="spot plate impress overflow-hidden">
        <div ref={sheetRef}>
          <Sheet doc={doc} />
        </div>

        <div className="relative p-6" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="t-label">{doc.category}</p>
              <h3 className="t-h3 mt-2">{doc.title}</h3>
            </div>
            <span className="tag shrink-0">
              {doc.kind === "pdf" ? (
                <FileText size={10} strokeWidth={1.9} />
              ) : (
                <ScanLine size={10} strokeWidth={1.9} />
              )}
              {doc.kind === "pdf" ? "PDF" : "SCAN"}
            </span>
          </div>

          <p className="mt-4 text-[0.9375rem] font-medium leading-snug" style={{ color: "var(--red-600)" }}>
            {doc.headline}
          </p>

          <ul className="mt-5 space-y-2.5">
            {doc.facts.map((f) => (
              <li key={f} className="flex gap-3 text-[0.875rem] leading-relaxed" style={{ color: "var(--ink-700)" }}>
                <span
                  aria-hidden
                  className="mt-[10px] h-px w-3.5 shrink-0"
                  style={{ background: "var(--rule-strong)" }}
                />
                {f}
              </li>
            ))}
          </ul>

          {doc.caveat && (
            <div
              className="mt-5 flex gap-3 p-3.5"
              style={{ background: "var(--stock-sunk)", border: "1px solid var(--rule)" }}
            >
              <Info size={13} strokeWidth={1.9} className="mt-0.5 shrink-0" style={{ color: "var(--ink-400)" }} />
              <p className="text-[0.8125rem] leading-relaxed" style={{ color: "var(--ink-500)" }}>
                {doc.caveat}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button ref={wipe} type="button" onClick={onOpen} className="btn">
              Read the entry
              <ArrowUpRight size={13} strokeWidth={2.2} />
            </button>

            {doc.reference ? (
              <button type="button" onClick={copyRef} className="btn--quiet">
                {copied ? (
                  <Check size={12} strokeWidth={2.2} style={{ color: "var(--red-500)" }} />
                ) : (
                  <Copy size={12} strokeWidth={1.9} />
                )}
                {copied ? "Copied" : "Copy reference"}
              </button>
            ) : (
              <span className="t-data text-[0.625rem] uppercase tracking-[0.12em]" style={{ color: "var(--ink-400)" }}>
                No reference printed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Drawer.
 * A full reading of one document. Enters as a sheet pulled up from the foot of
 * the page, which is the same gesture as pulling a plate out of a cabinet.
 * Focus is trapped, Escape closes, and the trigger regains focus on exit.
 */
function Drawer({ doc, onClose }: { doc: SourceDoc | null; onClose: () => void }) {
  const panel = useRef<HTMLDivElement | null>(null);
  const scrim = useRef<HTMLButtonElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const wipe = useDirectionalWipe<HTMLAnchorElement>();

  useEffect(() => {
    if (!doc) return;

    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;

      const nodes = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);

    if (!prefersReducedMotion()) {
      gsap.fromTo(scrim.current, { opacity: 0 }, { opacity: 1, duration: 0.42, ease: "power2.out" });
      gsap.fromTo(
        panel.current,
        { yPercent: 8, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.72, ease: "power4.out" }
      );
      gsap.from(panel.current?.querySelectorAll(".drawer-line") ?? [], {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.16,
        stagger: 0.055,
        ease: "power3.out",
      });
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [doc, onClose]);

  if (!doc) return null;

  return (
    <div
      className="fixed inset-0 flex items-end justify-center p-0 md:items-center md:p-8"
      style={{ zIndex: "var(--z-sheet)" as unknown as number }}
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
    >
      <button
        ref={scrim}
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full"
        style={{ background: "rgba(20,18,15,0.62)", backdropFilter: "blur(3px)" }}
      />

      <div
        ref={panel}
        className="plate relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto"
        style={{ background: "var(--paper-000)", boxShadow: "0 40px 90px -40px rgba(20,18,15,.6)" }}
      >
        <div
          className="sticky top-0 flex items-center justify-between gap-4 px-6 py-4"
          style={{ background: "var(--paper-000)", borderBottom: "1px solid var(--rule)" }}
        >
          <div className="min-w-0">
            <p className="t-label">{doc.category}</p>
            <p className="t-h3 mt-1.5 truncate" style={{ fontSize: "1rem" }}>
              {doc.title}
            </p>
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
            style={{ border: "1px solid var(--rule-strong)" }}
          >
            <X size={15} strokeWidth={1.9} />
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative" style={{ background: "var(--stock-sunk)" }}>
            <div className="relative aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-[420px]">
              <Image
                src={doc.preview}
                alt={`Page one of ${doc.title}, issued by ${doc.issuer}`}
                fill
                sizes="(max-width: 767px) 100vw, 640px"
                className="object-contain"
              />
            </div>
          </div>

          <div className="p-6" style={{ borderLeft: "1px solid var(--rule)" }}>
            <p className="drawer-line t-label">Issued</p>
            <p className="drawer-line mt-1.5 text-[0.9375rem]">{doc.issued}</p>

            <p className="drawer-line t-label mt-6">Reference</p>
            <p className="drawer-line t-data mt-1.5 text-[0.875rem]">
              {doc.reference ? <Scramble>{doc.reference}</Scramble> : "none printed"}
            </p>

            <p className="drawer-line t-label mt-6">What it establishes</p>
            <p className="drawer-line mt-1.5 text-[0.9375rem] leading-snug" style={{ color: "var(--red-600)" }}>
              {doc.headline}
            </p>

            <ul className="mt-5 space-y-2.5">
              {doc.facts.map((f) => (
                <li
                  key={f}
                  className="drawer-line flex gap-3 text-[0.875rem] leading-relaxed"
                  style={{ color: "var(--ink-700)" }}
                >
                  <span
                    aria-hidden
                    className="mt-[10px] h-px w-3.5 shrink-0"
                    style={{ background: "var(--rule-strong)" }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            {doc.caveat && (
              <div
                className="drawer-line mt-6 flex gap-3 p-3.5"
                style={{ background: "var(--stock-sunk)", border: "1px solid var(--rule)" }}
              >
                <Info size={13} strokeWidth={1.9} className="mt-0.5 shrink-0" style={{ color: "var(--ink-400)" }} />
                <p className="text-[0.8125rem] leading-relaxed" style={{ color: "var(--ink-500)" }}>
                  {doc.caveat}
                </p>
              </div>
            )}

            <a
              ref={wipe}
              href={doc.file}
              target="_blank"
              rel="noopener noreferrer"
              className="btn drawer-line mt-7 w-full"
            >
              Open original
              <ArrowUpRight size={13} strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Preview frame with the three states a real asset has. */
function Sheet({ doc }: { doc: SourceDoc }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => setState("loading"), [doc.preview]);

  return (
    <span
      className={`relative block aspect-[4/3] w-full overflow-hidden ${
        state === "loading" ? "skeleton" : ""
      }`}
      style={{ background: "var(--stock-sunk)" }}
    >
      {state === "error" ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <ScanLine size={18} strokeWidth={1.6} style={{ color: "var(--ink-400)" }} />
          <span className="t-label">Preview unavailable</span>
          <span className="t-small">The original still opens from the button below.</span>
        </span>
      ) : (
        <Image
          key={doc.preview}
          src={doc.preview}
          alt={`Page one of ${doc.title}, issued by ${doc.issuer}`}
          fill
          sizes="(max-width: 1023px) 92vw, 460px"
          className="object-cover object-top"
          style={{ opacity: state === "ready" ? 1 : 0, transition: "opacity .45s var(--ease)" }}
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
        />
      )}
    </span>
  );
}
