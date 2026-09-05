"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Odometer, LockUp, ProseReveal, TypeSlug, useDirectionalWipe, useSpotlight } from "@/components/motion/Kinetic";
import { PROFILE, REPOS, type Repo } from "@/lib/records";

/**
 * Dossier.
 * Two projects, each set as a full-width case rather than a card in a grid.
 * A single SVG rule draws down the left margin as the engineering decisions
 * reveal in sequence, so the motion narrates the order of the argument. That
 * is its whole justification; nothing here animates for its own sake.
 */
export function Dossier() {
  return (
    <section
      id="dossier"
      className="relative scroll-mt-[68px] py-24 md:py-32"
      style={{ borderTop: "1px solid var(--rule-strong)", background: "var(--stock-raised)" }}
    >
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <TypeSlug as="h2" className="t-h2">
              Two things I built and can defend line by line.
            </TypeSlug>
            <ProseReveal as="p" className="t-body mt-6">
              Both repositories are public and MIT licensed. Every figure below comes from the code or the GitHub API, never from a pitch deck.
            </ProseReveal>
          </div>
        </div>

        <div className="mt-20 space-y-28 md:space-y-36">
          {REPOS.map((repo) => (
            <Case key={repo.id} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Case({ repo }: { repo: Repo }) {
  const root = useRef<HTMLElement | null>(null);
  const line = useRef<SVGPathElement | null>(null);
  const spot = useSpotlight<HTMLAnchorElement>();
  const wipe = useDirectionalWipe<HTMLAnchorElement>();

  const total = repo.languages.reduce((s, l) => s + l.bytes, 0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // The margin rule draws itself as the decisions scroll past.
      if (line.current) {
        gsap.fromTo(
          line.current,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: ".case-decisions",
              start: "top 76%",
              end: "bottom 62%",
              scrub: 0.5,
            },
          }
        );
      }

      // Each decision rises as its own rule is reached.
      gsap.from(".case-decision", {
        y: 30,
        opacity: 0,
        duration: 0.95,
        stagger: 0.11,
        ease: "power3.out",
        scrollTrigger: { trigger: ".case-decisions", start: "top 78%", once: true },
      });

      // The readings strip settles left to right.
      gsap.from(".case-reading", {
        y: 24,
        opacity: 0,
        duration: 0.85,
        stagger: 0.075,
        ease: "power3.out",
        scrollTrigger: { trigger: ".case-readings", start: "top 88%", once: true },
      });

      // The repository plate lifts slightly against the paper.
      gsap.to(".case-plate", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: ".case-plate",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: root }
  );

  return (
    <article ref={root as React.RefObject<HTMLElement>}>
      {/* Title block */}
      <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10">
        <span
          className="t-figure leading-none"
          style={{ fontSize: "clamp(2.6rem,5.4vw,4.6rem)", color: "var(--paper-300)" }}
        >
          {repo.index}
        </span>

        <div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <LockUp as="h3" className="t-statement">
              {repo.name}
            </LockUp>
            <span className="tag">{repo.license} licensed</span>
          </div>

          <ProseReveal
            as="p"
            stagger={0.06}
            className="mt-4 max-w-[52ch] text-[1.0625rem] font-medium leading-snug md:text-[1.1875rem]"
          >
            {repo.tagline}
          </ProseReveal>

          <ProseReveal as="p" className="t-body mt-6">
            {repo.premise}
          </ProseReveal>

          <a
            ref={wipe}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--line mt-8"
          >
            Read the source
            <ArrowUpRight size={13} strokeWidth={2.2} />
          </a>
        </div>
      </div>

      {/* Readings: counted figures, no card boxes */}
      <div
        className="case-readings mt-16 grid grid-cols-2 gap-x-8 gap-y-9 pt-8 md:grid-cols-4 md:gap-x-10"
        style={{ borderTop: "1px solid var(--rule-strong)" }}
      >
        {repo.readings.map((r) => (
          <div key={r.label} className="case-reading">
            <p className="t-label">{r.label}</p>
            <Reading value={r.value} />
            <p className="t-small mt-2.5" style={{ color: "var(--ink-500)" }}>
              {r.note}
            </p>
          </div>
        ))}
      </div>

      {/* Decisions beside the repository plate */}
      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="case-decisions relative lg:col-span-7">
          {/* Drawn margin rule: the spine of the argument */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-[9px] top-0 hidden h-full w-[2px] md:block"
            viewBox="0 0 2 1000"
            preserveAspectRatio="none"
          >
            <path
              ref={line}
              d="M1 0 L1 1000"
              stroke="var(--red-500)"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          <ol>
            {repo.decisions.map((d, i) => (
              <li
                key={d.head}
                className="case-decision grid grid-cols-[28px_minmax(0,1fr)] gap-x-5 py-6"
                style={{
                  borderTop: i === 0 ? "1px solid var(--rule)" : "none",
                  borderBottom: "1px solid var(--rule)",
                }}
              >
                <span className="t-data pt-1 text-[0.625rem]" style={{ color: "var(--ink-400)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="t-h3">{d.head}</h4>
                  <p className="t-body mt-2.5">{d.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5">
          <div className="case-plate lg:sticky" style={{ top: "calc(var(--chrome) + 1.5rem)" }}>
            {/* Repository card: the real GitHub social preview, kept because
                it is the artefact GitHub itself publishes for this repo. */}
            <a
              ref={spot}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="spot plate impress block overflow-hidden"
            >
              <span
                className="flex items-center justify-between gap-3 px-4 py-2.5"
                style={{ borderBottom: "1px solid var(--rule)", background: "var(--stock-sunk)" }}
              >
                <span className="t-label">Specimen {repo.index}</span>
                <span
                  className="t-data text-[0.5938rem] uppercase tracking-[0.14em]"
                  style={{ color: "var(--ink-500)" }}
                >
                  {repo.license}
                </span>
              </span>

              <span className="relative block aspect-[2/1] w-full" style={{ background: "var(--stock-sunk)" }}>
                <Image
                  src={repo.preview}
                  alt={repo.previewAlt}
                  fill
                  sizes="(max-width: 1023px) 92vw, 430px"
                  className="object-cover"
                />
              </span>

              <span
                className="flex items-center justify-between gap-3 px-4 py-3"
                style={{ borderTop: "1px solid var(--rule)" }}
              >
                <span className="t-data text-[0.625rem]" style={{ color: "var(--ink-500)" }}>
                  github.com/{PROFILE.githubHandle}
                </span>
                <ArrowUpRight size={14} strokeWidth={2.2} style={{ color: "var(--red-600)" }} />
              </span>
            </a>

            {/* Language mix, measured in bytes */}
            <div className="mt-9">
              <p className="t-label mb-3">Language mix, by bytes</p>
              <div
                className="flex h-2 w-full overflow-hidden"
                style={{ background: "var(--stock-sunk)", border: "1px solid var(--rule)" }}
                role="img"
                aria-label={repo.languages
                  .map((l) => `${l.name} ${Math.round((l.bytes / total) * 100)} percent`)
                  .join(", ")}
              >
                {repo.languages.map((l, i) => (
                  <span
                    key={l.name}
                    style={{
                      width: `${(l.bytes / total) * 100}%`,
                      background:
                        i === 0
                          ? "var(--red-500)"
                          : i === 1
                          ? "var(--ink-700)"
                          : i === 2
                          ? "var(--ink-400)"
                          : "var(--paper-300)",
                    }}
                  />
                ))}
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {repo.languages.map((l) => (
                  <li key={l.name} className="t-data text-[0.625rem]" style={{ color: "var(--ink-500)" }}>
                    {l.name} {Math.round((l.bytes / total) * 100)}%
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9">
              <p className="t-label mb-3">Built with</p>
              <ul className="flex flex-wrap gap-1.5">
                {repo.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Renders a reading. Pure numeric values roll on the odometer; values that
 * carry an operator or unit string are set as printed, because animating them
 * would imply a precision the source does not have.
 */
function Reading({ value }: { value: string }) {
  const cls = "t-figure block mt-2.5";
  const style = { fontSize: "clamp(1.5rem,2.6vw,2.1rem)" } as const;

  // Anything that is only digits, separators and a short unit rolls.
  if (/^[\d\s./]+(\s?(KB|s))?$/.test(value)) {
    return <Odometer value={value} className={cls} style={style} />;
  }

  return (
    <span className={cls} style={style}>
      {value}
    </span>
  );
}
