"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import {
  Justify,
  Odometer,
  PlateFlip,
  ProseReveal,
  Scramble,
  useDirectionalWipe,
} from "@/components/motion/Kinetic";
import { DOCS, TRANSCRIPTS } from "@/lib/records";
import { useDocLink } from "@/components/site/DocumentAccess";
import { useOpenDocument } from "@/components/site/DocumentViewerProvider";

/**
 * Register.
 * Three transcripts behind one tab set. Switching tabs re-inks the rows in
 * sequence, which reads as a page being set rather than a state flip, and makes
 * it obvious that the whole table changed and not just a heading. Roving
 * tabindex: arrows move, Home and End jump.
 */
export function Register() {
  const [active, setActive] = useState(TRANSCRIPTS[0].id);
  const body = useRef<HTMLDivElement | null>(null);
  const wipe = useDirectionalWipe<HTMLButtonElement>();

  const current = TRANSCRIPTS.find((t) => t.id === active) ?? TRANSCRIPTS[0];
  const source = DOCS.find((d) => d.id === current.docId);
  // Signed, expiring link. doc.file is a bare path into /secured and must never
  // be written into the DOM. Used only to confirm a link exists for this row.
  const sourceLink = useDocLink(current.docId);
  const openDocument = useOpenDocument();
  const twoCol = Boolean(current.columns[1]);
  const grid = twoCol ? "minmax(0,1fr) 116px 116px" : "minmax(0,1fr) 116px";

  // Re-ink on tab change: rows sweep in, figure counts back up.
  useEffect(() => {
    const el = body.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(".reg-row", {
        x: -14,
        opacity: 0,
        duration: 0.5,
        stagger: 0.032,
        ease: "power3.out",
      });
      gsap.from(".reg-meta", {
        y: 12,
        opacity: 0,
        duration: 0.55,
        stagger: 0.045,
        ease: "power2.out",
      });
    }, el);

    return () => ctx.revert();
  }, [active]);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(".reg-tab", {
      y: 16,
      opacity: 0,
      duration: 0.7,
      stagger: 0.06,
      ease: "power3.out",
      scrollTrigger: { trigger: ".reg-tabs", start: "top 88%", once: true },
    });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = TRANSCRIPTS.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % TRANSCRIPTS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (i - 1 + TRANSCRIPTS.length) % TRANSCRIPTS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TRANSCRIPTS.length - 1;
    else return;

    e.preventDefault();
    setActive(TRANSCRIPTS[next].id);
    document.getElementById(`reg-tab-${TRANSCRIPTS[next].id}`)?.focus();
  };

  return (
    <section
      id="register"
      className="relative scroll-mt-[var(--chrome)] py-24 md:py-32"
      style={{ borderTop: "1px solid var(--rule-strong)" }}
    >
      <div className="shell">
        {/* Inverted header: the headline sits right, the prose left, because
            every other section on the sheet reads left-to-right and this one
            is a table the reader is about to work through horizontally. The
            tab set below is the real section header. */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-7 lg:pt-3">
            <ProseReveal as="p" className="t-body">
              Each tab mirrors one document in the cabinet. Where a sheet reports grades rather than marks, the grade is shown. Where a subject was not offered that term, the cell says so.
            </ProseReveal>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5">
            <Justify as="h2" className="t-h2 lg:text-right">
              The academic record
            </Justify>
          </div>
        </div>

        <div
          className="reg-tabs mt-14 flex flex-wrap gap-2.5"
          role="tablist"
          aria-label="Academic records"
          onKeyDown={onKeyDown}
        >
          {TRANSCRIPTS.map((t) => {
            const on = t.id === active;
            return (
              <button
                key={t.id}
                id={`reg-tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls={`reg-panel-${t.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(t.id)}
                className={`reg-tab btn ${on ? "" : "btn--line"}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          ref={body}
          id={`reg-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`reg-tab-${current.id}`}
          className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14"
        >
          {/* Summary figure: the plate flips like a split-flap board on tab
              change, so the reading visibly replaces the previous one. */}
          <div className="lg:col-span-4">
            <PlateFlip flipKey={current.id}>
              <p
                className="t-figure leading-[0.86]"
                style={{ fontSize: "clamp(2.9rem,5.2vw,4.2rem)", color: "var(--accent-ink)" }}
              >
                {current.headline}
              </p>
            </PlateFlip>
            <p className="reg-meta t-small mt-3">{current.headlineNote}</p>

            <dl
              className="mt-9 grid gap-y-5 pt-7"
              style={{ borderTop: "1px solid var(--rule-strong)" }}
            >
              <Meta k="Awarding authority" v={current.authority} />
              <Meta k="Institution" v={`${current.institution}, ${current.place}`} />
              <Meta k="Session" v={current.session} />
              <Meta k="Identifier" v={current.identifier} scramble />
              <Meta k="Result as printed" v={current.result} />
            </dl>

            {/*
              A button, not a link. An <a href> to the file hands it to the
              browser's native PDF viewer, which brings its own download and
              print buttons that nothing here can reach.
            */}
            {source && sourceLink && (
              <button
                ref={wipe}
                type="button"
                onClick={() => openDocument(source.id)}
                className="btn btn--line reg-meta mt-8"
              >
                Open the sheet
                <ArrowUpRight size={13} strokeWidth={2.2} />
              </button>
            )}
          </div>

          {/* Marks, grouped rather than hairlined on every row */}
          <div className="lg:col-span-8">
            <div
              className="reg-head grid gap-x-6 pb-3"
              style={{ gridTemplateColumns: grid, borderBottom: "1px solid var(--rule-strong)" }}
            >
              <span className="t-label">Subject</span>
              <span className="t-label text-right">{current.columns[0]}</span>
              {twoCol && <span className="t-label text-right">{current.columns[1]}</span>}
            </div>

            <ul>
              {current.rows.map((r, i) => (
                <li
                  key={r.subject}
                  className="reg-row grid items-baseline gap-x-6 py-[13px]"
                  style={{
                    gridTemplateColumns: grid,
                    background: i % 2 === 1 ? "var(--band)" : "transparent",
                    paddingInline: "12px",
                    marginInline: "-12px",
                  }}
                >
                  <span className="text-[0.9375rem]" style={{ color: "var(--ink-sub)" }}>
                    {r.subject}
                  </span>
                  <Cell value={r.a} />
                  {twoCol && <Cell value={r.b ?? ""} />}
                </li>
              ))}
            </ul>

            <div
              className="mt-3 grid items-baseline gap-x-6 pt-4"
              style={{
                gridTemplateColumns: twoCol ? "minmax(0,1fr) 232px" : "minmax(0,1fr) 116px",
                borderTop: "1px solid var(--rule-strong)",
              }}
            >
              <span className="t-label">{current.totalLabel}</span>
              <Odometer
                value={current.totalValue}
                className="t-figure text-right"
                style={{ fontSize: "1.0625rem", justifySelf: "end" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Meta({ k, v, scramble }: { k: string; v: string; scramble?: boolean }) {
  return (
    <div className="reg-meta">
      <dt className="t-label">{k}</dt>
      <dd className={`mt-1.5 text-[0.9375rem] leading-snug ${scramble ? "t-data" : ""}`}>
        {scramble ? <Scramble>{v}</Scramble> : v}
      </dd>
    </div>
  );
}

function Cell({ value }: { value: string }) {
  const idle = value === "not offered" || value === "not held" || value === "";
  return (
    <span
      className={`text-right text-[0.875rem] ${idle ? "" : "t-data"}`}
      style={{ color: idle ? "var(--ink-lbl)" : "var(--ink)" }}
    >
      {value || "not held"}
    </span>
  );
}
