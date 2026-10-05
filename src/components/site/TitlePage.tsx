"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import {
  Odometer,
  InkStrike,
  ProseReveal,
  useDirectionalWipe,
  useFitToMeasure,
} from "@/components/motion/Kinetic";
import { PROFILE } from "@/lib/records";

/**
 * Title page.
 *
 * Composition: the name is optically justified to a common measure, so both
 * lines end on the same right gutter and read as one solid mass rather than
 * an accidental rag. Fit is done on the real wdth axis of the variable face,
 * not with scaleX, so counters stay the designer's.
 *
 * The type block is top-anchored against the running head instead of centred
 * in the column, which removes the dead band that used to open above it. The
 * portrait hangs as an off-axis counterweight in the upper right, deliberately
 * smaller than the name, because the name is already the identity statement.
 *
 * The figures at the foot lead with what was built, not with what was
 * graded. The academic record is one scroll away and fully transcribed, so
 * the hero does not need to spend its four columns on it.
 *
 * Motion here, once each: INK STRIKE on the name, a drawn rule, a plate that
 * rises then drifts, and the figures settling in sequence.
 */
export function TitlePage() {
  const root = useRef<HTMLElement | null>(null);
  const plate = useRef<HTMLDivElement | null>(null);
  const wipe = useDirectionalWipe<HTMLAnchorElement>();

  const line1 = useFitToMeasure<HTMLSpanElement>(PROFILE.statement[0]);
  const line2 = useFitToMeasure<HTMLSpanElement>(PROFILE.statement[1]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(plate.current, {
        yPercent: 10,
        opacity: 0,
        duration: 1.35,
        delay: 0.28,
        ease: "power3.out",
      });

      gsap.to(plate.current, {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.from(".hero-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.3,
        delay: 0.6,
        ease: "power4.out",
      });

      gsap.from(".hero-reading", {
        y: 20,
        opacity: 0,
        duration: 0.85,
        delay: 0.82,
        stagger: 0.085,
        ease: "power3.out",
      });
    },
    { scope: root }
  );

  return (
    <section
      id="top"
      ref={root as React.RefObject<HTMLElement>}
      className="relative flex min-h-[100dvh] flex-col"
      data-water-zone
      style={{ paddingTop: "calc(var(--chrome) + var(--step-2))" }}
    >
      <div className="shell flex-1">
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          {/* Eyebrow spans the full measure, so it agrees with the rule below */}
          <div className="lg:col-span-12">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="t-label">{PROFILE.programme}</span>
              <span aria-hidden className="h-[9px] w-px" style={{ background: "var(--rule-strong)" }} />
              <span className="t-label">{PROFILE.batch}</span>
              <span aria-hidden className="h-[9px] w-px" style={{ background: "var(--rule-strong)" }} />
              <span className="t-label">Open for a 2027 internship</span>
            </div>
          </div>

          {/* The name: justified to columns 1 to 8 */}
          <div className="lg:col-span-8">
            <h1 className="t-hero" style={{ color: "var(--ink)", marginTop: "var(--step-1)" }}>
              <span ref={line1} className="fit-line">
                <InkStrike as="span" className="block">
                  {PROFILE.statement[0]}
                </InkStrike>
              </span>
              <span ref={line2} className="fit-line">
                <InkStrike as="span" className="block" delay={0.18}>
                  {PROFILE.statement[1]}
                </InkStrike>
              </span>
            </h1>

            <ProseReveal
              as="p"
              className="t-lead"
              delay={0.7}
              stagger={0.085}
              immediate
              style={{ marginTop: "var(--step-2)" }}
            >
              {PROFILE.subtext}
            </ProseReveal>

            <div
              className="flex flex-wrap items-center gap-3"
              style={{ marginTop: "var(--step-2)" }}
            >
              <a ref={wipe} href="#dossier" className="btn">
                See the work
                <ArrowDown size={13} strokeWidth={2.2} />
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--line"
              >
                GitHub
                <ArrowUpRight size={13} strokeWidth={2.2} />
              </a>
            </div>
            <div
              className="mt-6 inline-flex items-center gap-2.5"
              style={{ color: "var(--ink-mut)" }}
              role="status"
              aria-label="Available for summer 2027 AI and machine learning internships"
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ background: "var(--accent)", boxShadow: "0 0 0 4px var(--wash)" }}
              />
              <span className="t-data text-[0.625rem] uppercase tracking-[0.14em]">
                Available for summer 2027 AI / ML internships
              </span>
            </div>
          </div>

          {/* Portrait: columns 10 to 12, a counterweight rather than a hero image */}
          <div className="lg:col-span-3 lg:col-start-10">
            <div
              ref={plate}
              className="relative mx-auto w-full max-w-[300px] lg:ml-auto lg:mr-0"
              style={{ marginTop: "var(--step-1)" }}
            >
              <span className="reg-mark" style={{ top: -7, left: -7 }} aria-hidden />
              <span className="reg-mark" style={{ top: -7, right: -7 }} aria-hidden />
              <span className="reg-mark" style={{ bottom: -7, left: -7 }} aria-hidden />
              <span className="reg-mark" style={{ bottom: -7, right: -7 }} aria-hidden />

              <div data-water-plate className="plate impress relative overflow-hidden">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/portrait.webp"
                    alt={`${PROFILE.legalName}, portrait`}
                    fill
                    priority
                    sizes="(max-width: 1023px) 82vw, 300px"
                    className="object-cover object-top"
                  />
                </div>

                <div
                  className="flex items-end justify-between gap-3 px-3.5 py-3"
                  style={{ borderTop: "1px solid var(--rule)" }}
                >
                  <p className="t-data text-[0.5938rem] uppercase leading-tight tracking-[0.14em]" style={{ color: "var(--ink-lbl)" }}>
                    R.M.D. Engineering
                    <br />
                    Kavaraipettai
                  </p>
                  <p
                    className="t-data text-right text-[0.5938rem] leading-tight"
                    style={{ color: "var(--accent-ink)" }}
                  >
                    PLATE
                    <br />
                    01
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Figures: full measure, on the same right gutter as the eyebrow.
          Two of the four are shipped work, because that is what the page
          is for. The record is in the register, one scroll away. */}
      <div className="shell" style={{ paddingBottom: "var(--step-2)" }}>
        <div
          className="hero-rule h-px w-full"
          style={{ background: "var(--rule-strong)", marginBottom: "var(--step-1)" }}
        />
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
          {[
            { v: "2", k: "Projects shipped, MIT licensed and public" },
            { v: "11", k: "Languages in the CivicPulse interface" },
            { v: "9.375", k: "Semester two GPA, as printed" },
            { v: "10", k: "Documents openable here" },
          ].map((r) => (
            <div key={r.k} className="hero-reading">
              <Odometer
                value={r.v}
                className="t-figure block"
                style={{ fontSize: "clamp(1.35rem,2.1vw,1.85rem)" }}
              />
              <p className="t-small mt-2" style={{ color: "var(--ink-mut)" }}>
                {r.k}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
