"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  prefersReducedMotion,
  useReducedMotionLive,
} from "@/lib/gsap";

/* ==========================================================================
   MOTION LIBRARY

   Rule of the file: every primitive below appears EXACTLY ONCE on the page,
   and each one is a different physical mechanism, not the same tween with new
   numbers. The metaphor throughout is a printing shop, so each mechanism is
   borrowed from a real step in setting and pulling a page: inking a form,
   dragging a squeegee, dropping type slugs, locking a chase, justifying a
   line, pulling a proof.

   Everything degrades to static under prefers-reduced-motion and reverts its
   own DOM on unmount.
   ========================================================================== */

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

function useSplit(
  build: (
    self: SplitText,
    el: HTMLElement
  ) => gsap.core.Tween | gsap.core.Timeline | void,
  opts: {
    type: string;
    mask?: "words" | "lines" | "chars";
    charsClass?: string;
    wordsClass?: string;
    autoSplit?: boolean;
  },
  deps: unknown[]
) {
  const ref = useRef<HTMLElement | null>(null);
  // Rebuild every split when the reduced-motion setting changes, so a reader
  // who turns it on mid-session gets static text instead of waiting for a
  // reload. useGSAP's dependency array carries the live value.
  const reduced = useReducedMotionLive();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reduced) {
        gsap.set(el, { opacity: 1, clearProps: "all" });
        return;
      }

      const split = SplitText.create(el, {
        ...opts,
        aria: "auto",
        onSplit(self) {
          return build(self, el) as gsap.core.Tween;
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [...deps, reduced] }
  );

  return ref;
}

/* ==========================================================================
   1. INK STRIKE — hero name, once
   The press descends: characters land from above, oversized and soft, then
   the ink sets. Variable weight runs 240 -> 700 and width 132 -> 116 while
   the blur clears, so the glyph physically thickens as it prints. Ordered
   outward from the centre, the way pressure spreads from the middle of a
   platen.

   AXIS TRUTH: Bricolage Grotesque's real wdth range is 75-100; there is no
   width above 100, so the original 132 -> 116 travel was silently clamped to
   a constant and the width half of this animation did nothing. Weight does
   run 200-800, so that half was always real. Width now travels 75 -> 100,
   the genuine condensed-to-wide range, which is a larger visible morph than
   the old clamped values ever produced.
   ========================================================================== */

export function InkStrike({
  children,
  as: Tag = "span",
  className = "",
  delay = 0,
}: {
  children: string;
  as?: Tag;
  className?: string;
  delay?: number;
}) {
  const ref = useSplit(
    (self) => {
      const chars = self.chars as HTMLElement[];

      gsap.set(chars, {
        "--cw": 75,
        "--cwg": 240,
        yPercent: -34,
        scale: 1.08,
        opacity: 0,
        filter: "blur(11px)",
        transformOrigin: "50% 100%",
      });

      return gsap.to(chars, {
        "--cw": 100,
        "--cwg": 700,
        yPercent: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.15,
        delay,
        ease: "power4.out",
        stagger: {
          each: 0.032,
          from: "center",
        },
      });
    },
    { type: "words,chars", mask: "words", charsClass: "ink-char" },
    [children]
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className },
    children
  );
}

/* ==========================================================================
   2. SQUEEGEE — cabinet heading, once
   A clip edge drags across each line left to right with a red ink lip
   travelling on the wet edge. Mechanism is clip-path, not transform, so it
   reads as ink arriving on stationary paper rather than paper moving.
   ========================================================================== */

export function Squeegee({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: Tag;
  className?: string;
}) {
  const ref = useSplit(
    (self, el) => {
      const lines = self.lines as HTMLElement[];
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
      });

      lines.forEach((line, i) => {
        line.style.position = "relative";

        const lip = document.createElement("span");
        lip.setAttribute("aria-hidden", "true");
        lip.style.cssText =
          "position:absolute;top:-2%;bottom:-2%;width:3px;background:var(--red-500);pointer-events:none;";
        line.appendChild(lip);

        gsap.set(line, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(lip, { left: "0%", opacity: 0 });

        tl.to(
          line,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.92,
            ease: "power3.inOut",
          },
          i * 0.14
        )
          .to(lip, { opacity: 1, duration: 0.1 }, i * 0.14)
          .to(
            lip,
            { left: "100%", duration: 0.92, ease: "power3.inOut" },
            i * 0.14
          )
          .to(lip, { opacity: 0, duration: 0.18 }, i * 0.14 + 0.86);
      });

      return tl;
    },
    { type: "lines", autoSplit: true },
    [children]
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className },
    children
  );
}

/* ==========================================================================
   3. TYPE SLUG — dossier heading, once
   Words tip forward out of the vertical, hinged on their own baseline, the
   way a metal slug drops into a composing stick and rocks flat. Real 3D
   rotation with perspective, staggered left to right because that is the
   direction a compositor sets.
   ========================================================================== */

export function TypeSlug({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: Tag;
  className?: string;
}) {
  const ref = useSplit(
    (self, el) => {
      const words = self.words as HTMLElement[];

      gsap.set(words, {
        transformPerspective: 620,
        transformOrigin: "50% 100%",
        rotationX: -94,
        y: 14,
        opacity: 0,
      });

      return gsap.to(words, {
        rotationX: 0,
        y: 0,
        opacity: 1,
        duration: 1.05,
        ease: "back.out(1.35)",
        stagger: 0.062,
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
      });
    },
    { type: "words", mask: "words" },
    [children]
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className },
    children
  );
}

/* ==========================================================================
   4. LOCK UP — project names, once per project
   Letters start loose in the chase and are driven tight as the section is
   scrubbed, closing from +0.3em tracking to the design value. Scrubbed
   rather than triggered, so the reader is the one turning the quoin.
   ========================================================================== */

export function LockUp({
  children,
  as: Tag = "h3",
  className = "",
}: {
  children: string;
  as?: Tag;
  className?: string;
}) {
  const ref = useSplit(
    (self, el) => {
      const chars = self.chars as HTMLElement[];

      gsap.set(chars, { opacity: 0 });
      gsap.set(el, { letterSpacing: "0.3em" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });

      tl.to(chars, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.028,
        ease: "none",
      }).to(
        el,
        {
          letterSpacing: "-0.04em",
          duration: 1.25,
          ease: "power4.inOut",
        },
        0.1
      );

      return tl;
    },
    { type: "chars", charsClass: "lock-char" },
    [children]
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className },
    children
  );
}

/* ==========================================================================
   5. JUSTIFY — register heading, once
   The line arrives unjustified: characters sit on a sine wave of baselines
   and settle flat, the way a compositor evens a measure. Wave amplitude
   decays across the stagger so the last letters barely move.
   ========================================================================== */

export function Justify({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: Tag;
  className?: string;
}) {
  const ref = useSplit(
    (self, el) => {
      const chars = self.chars as HTMLElement[];
      const n = Math.max(1, chars.length - 1);

      chars.forEach((ch, i) => {
        const t = i / n;
        gsap.set(ch, {
          y: Math.sin(t * Math.PI * 3.1) * 26,
          rotate: Math.cos(t * Math.PI * 3.1) * 5,
          opacity: 0,
        });
      });

      return gsap.to(chars, {
        y: 0,
        rotate: 0,
        opacity: 1,
        duration: 1.1,
        ease: "elastic.out(1, 0.72)",
        stagger: { each: 0.022, from: "start" },
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
      });
    },
    { type: "words,chars", mask: "words" },
    [children]
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className },
    children
  );
}

/* ==========================================================================
   6. REGISTER SHIFT — warrant heading, once
   Two ink plates arriving out of register and snapping into alignment:
   odd characters drop from above, even characters rise from below, and both
   carry a horizontal misregistration that closes last. It is the visual joke
   of the section, where a claim and its evidence line up.
   ========================================================================== */

export function RegisterShift({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: Tag;
  className?: string;
}) {
  const ref = useSplit(
    (self, el) => {
      const chars = self.chars as HTMLElement[];

      chars.forEach((ch, i) => {
        const up = i % 2 === 0;
        gsap.set(ch, {
          yPercent: up ? 108 : -108,
          x: up ? -9 : 9,
          opacity: 0,
        });
      });

      return gsap.to(chars, {
        yPercent: 0,
        x: 0,
        opacity: 1,
        duration: 0.95,
        ease: "power4.out",
        stagger: { each: 0.024, from: "edges" },
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });
    },
    { type: "words,chars", mask: "words" },
    [children]
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className },
    children
  );
}

/* ==========================================================================
   7. LIFT OFF — closing statement, once
   The bookend to the ink strike. As the reader scrolls past the end, the
   type thins on its weight axis and lifts off the sheet: the proof being
   pulled. Scrubbed, so it is tied to the reader leaving rather than to a
   trigger firing.
   ========================================================================== */

export function LiftOff({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: Tag;
  className?: string;
}) {
  const ref = useSplit(
    (self, el) => {
      const words = self.words as HTMLElement[];

      // arrival
      gsap.from(words, {
        yPercent: 112,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.05,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });

      // departure, scrubbed
      return gsap.to(words, {
        "--cwg": 300,
        yPercent: -22,
        opacity: 0.16,
        filter: "blur(5px)",
        ease: "none",
        stagger: 0.035,
        scrollTrigger: {
          trigger: el,
          start: "top 18%",
          end: "bottom top",
          scrub: 0.9,
        },
      });
    },
    { type: "words", mask: "words", wordsClass: "ink-char" },
    [children]
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className },
    children
  );
}

/* ==========================================================================
   PROSE REVEAL — body copy only
   Deliberately the quietest mechanism in the file. Body text is read, not
   performed, so it gets a masked line rise and nothing else. This is the
   only primitive allowed to repeat, because paragraphs repeat.
   ========================================================================== */

export function ProseReveal({
  children,
  as: Tag = "p",
  className = "",
  delay = 0,
  stagger = 0.075,
  immediate = false,
  style,
}: {
  children: string;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useSplit(
    (self, el) =>
      gsap.from(self.lines as HTMLElement[], {
        yPercent: 118,
        duration: 1,
        delay,
        stagger,
        ease: "power4.out",
        ...(immediate
          ? {}
          : { scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
      }),
    { type: "lines", mask: "lines", autoSplit: true },
    [children]
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className, style },
    children
  );
}

/* ==========================================================================
   NON-TYPE PRIMITIVES
   ========================================================================== */

/** Instrument decode. References only, never prose. */
export function Scramble({
  children,
  className = "",
  chars = "0123456789ABCDEF/",
  duration = 1.1,
  as: Tag = "span",
}: {
  children: string;
  className?: string;
  chars?: string;
  duration?: number;
  as?: Tag;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.textContent = children;
        return;
      }

      gsap.to(el, {
        duration,
        scrambleText: { text: children, chars, speed: 0.6, revealDelay: 0.15 },
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 94%", once: true },
      });
    },
    { scope: ref, dependencies: [children] }
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className, "aria-label": children },
    children
  );
}

/** Hover fill that enters from the side the pointer actually came from. */
export function useDirectionalWipe<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const enter = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const fromLeft = e.clientX - r.left < r.width / 2;
      el.style.setProperty("--wipe-from", fromLeft ? "-101%" : "101%");
    };

    el.addEventListener("pointerenter", enter);
    return () => el.removeEventListener("pointerenter", enter);
  }, []);

  return ref;
}

/**
 * Cursor spotlight. Writes CSS variables straight onto the node instead of
 * routing pointer position through React state, which would re-render the
 * subtree on every pointermove.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  return ref;
}

/* ==========================================================================
   8. ODOMETER — every measured figure on the page
   A press counts its impressions on a mechanical wheel, so figures here do
   the same. Each digit is a 20-item strip that rolls one full revolution and
   lands on its value. Non-digits sit in identical boxes so the baseline never
   breaks. The rightmost wheel runs longest, the way a real counter behaves.

   This is the one mechanism allowed to repeat, because figures repeat. It is
   the numeric equivalent of ProseReveal.
   ========================================================================== */

const WHEEL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function Odometer({
  value,
  className = "",
  style,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Wheels are a client-only refinement. Until mount, the plain value is what
  // renders.
  //
  // This matters more than it looks. The wheel markup contains every digit of
  // the strip, so server-rendering it ships the literal string
  // "01234567890123456789" into the HTML for a figure like 9.375. A crawler
  // reads that, a reader with JavaScript disabled sees a stack of numbers, and
  // the site contradicts its own claim that every figure is a measured one.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !mounted) return;

      const wheels = gsap.utils.toArray<HTMLElement>("[data-wheel]", el);
      if (!wheels.length) return;

      const land = (t: HTMLElement) => -(Number(t.dataset.digit) + 10) * 5;

      if (prefersReducedMotion()) {
        wheels.forEach((w) => gsap.set(w, { yPercent: land(w) }));
        return;
      }

      gsap.set(wheels, { yPercent: 0 });
      gsap.to(wheels, {
        yPercent: (_i: number, t: HTMLElement) => land(t),
        duration: (i: number) => 1.05 + i * 0.14,
        ease: "power4.out",
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
      });
    },
    { scope: ref, dependencies: [value, mounted] }
  );

  if (!mounted) {
    return (
      <span
        ref={ref}
        className={className}
        style={{
          ...style,
          // Match the mounted layout so hydration does not shift the figure.
          fontVariantNumeric: "tabular-nums",
          fontFeatureSettings: '"tnum" 1',
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </span>
    );
  }

  return (
    // role="text" so the aria-label is actually announced: a bare span with an
    // aria-label and no role is not reliably exposed by screen readers, and
    // the visual children are aria-hidden, so without it the figure reads as
    // nothing at all.
    <span ref={ref} className={className} style={style} role="text" aria-label={value}>
      {[...value].map((ch, i) => {
        const digit = /\d/.test(ch);
        const blank = /\s/.test(ch);
        return (
          <span key={i} aria-hidden className="odo-slot">
            {digit ? (
              <span data-wheel data-digit={ch} className="odo-wheel">
                {WHEEL.map((d, j) => (
                  <span key={j} className="odo-digit">
                    {d}
                  </span>
                ))}
              </span>
            ) : (
              <span className="odo-wheel">
                <span className="odo-digit">{blank ? "\u00A0" : ch}</span>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/* ==========================================================================
   9. PROXIMITY WEIGHT — cabinet rows, on hover
   The cursor behaves like pressure on a platen: characters near it gain
   weight on the variable axis and thin out again as the hand moves away.
   Gaussian falloff, so there is no hard edge to the effect.

   Character centres are cached per row on pointerenter, relative to the row's
   left edge, so the per-frame handler performs zero layout reads. Weights are
   written straight to the node as CSS variables, never through React state.
   ========================================================================== */

export function useProximityWeight<T extends HTMLElement>(
  rowSelector = "[data-row]",
  titleSelector = "[data-prox]"
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const splits: SplitText[] = [];
    const byRow = new Map<HTMLElement, HTMLElement[]>();

    root.querySelectorAll<HTMLElement>(rowSelector).forEach((row) => {
      const title = row.querySelector<HTMLElement>(titleSelector);
      if (!title) return;
      const s = SplitText.create(title, {
        type: "chars",
        charsClass: "prox-char",
        aria: "auto",
      });
      splits.push(s);
      byRow.set(row, s.chars as HTMLElement[]);
    });

    let cache: { chars: HTMLElement[]; centres: number[]; left: number } | null =
      null;
    let frame = 0;
    let pointerX = 0;

    const measure = (row: HTMLElement) => {
      const chars = byRow.get(row);
      if (!chars) return null;
      const left = row.getBoundingClientRect().left;
      const centres = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return r.left - left + r.width / 2;
      });
      return { chars, centres, left };
    };

    const paint = () => {
      frame = 0;
      if (!cache) return;
      const local = pointerX - cache.left;
      const sigma = 78;
      // Weight clamped to the font's real 200-800 span. The previous ceiling
      // of 800 was correct on the high end, but the floor of 380 meant a
      // resting line never went as light as the face can go.
      for (let i = 0; i < cache.chars.length; i++) {
        const d = local - cache.centres[i];
        const w = 200 + 600 * Math.exp(-(d * d) / (2 * sigma * sigma));
        cache.chars[i].style.setProperty("--pw", w.toFixed(0));
      }
    };

    const onEnter = (e: PointerEvent) => {
      const row = (e.target as HTMLElement)?.closest<HTMLElement>(rowSelector);
      if (!row) return;
      cache = measure(row);
    };

    const onMove = (e: PointerEvent) => {
      const row = (e.target as HTMLElement)?.closest<HTMLElement>(rowSelector);
      if (!row) return;
      if (!cache || !byRow.get(row)?.includes(cache.chars[0])) {
        cache = measure(row);
      }
      pointerX = e.clientX;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      byRow.forEach((chars) =>
        chars.forEach((c) => c.style.removeProperty("--pw"))
      );
      cache = null;
    };

    root.addEventListener("pointerover", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      root.removeEventListener("pointerover", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      splits.forEach((s) => s.revert());
    };
  }, [rowSelector, titleSelector]);

  return ref;
}

/* ==========================================================================
   10. CASE DROP — warrant sub-headings
   Type spilling out of a case: characters fall in seeded random order with a
   small rotation and land with a short bounce. Random order is what separates
   it from every ordered stagger elsewhere on the page, and the seed keeps it
   deterministic across renders so it never looks like a different animation
   twice.
   ========================================================================== */

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function CaseDrop({
  children,
  as: Tag = "h3",
  className = "",
  seed = 11,
}: {
  children: string;
  as?: Tag;
  className?: string;
  seed?: number;
}) {
  const ref = useSplit(
    (self, el) => {
      const chars = self.chars as HTMLElement[];
      const rnd = seededRandom(seed);

      const order = chars
        .map((c) => ({ c, k: rnd() }))
        .sort((a, b) => a.k - b.k);

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });

      order.forEach(({ c }, n) => {
        gsap.set(c, {
          yPercent: -150,
          rotate: (rnd() - 0.5) * 24,
          opacity: 0,
        });
        tl.to(
          c,
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(2.1)",
          },
          n * 0.028
        );
      });

      return tl;
    },
    { type: "words,chars", mask: "words" },
    [children, seed]
  );

  return React.createElement(
    Tag,
    { ref: ref as React.Ref<never>, className },
    children
  );
}

/* ==========================================================================
   11. PLATE FLIP — the register figure, on tab change
   A split-flap board changing its reading. Hinged on a Z-offset origin so the
   plate rotates about its own thickness rather than its face, which is what
   makes it read as a physical card rather than a CSS rotation.
   ========================================================================== */

export function PlateFlip({
  children,
  className = "",
  flipKey,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  flipKey: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    gsap.fromTo(
      el,
      {
        rotationX: -94,
        opacity: 0,
        transformPerspective: 760,
        transformOrigin: "50% 50% -0.32em",
      },
      { rotationX: 0, opacity: 1, duration: 0.82, ease: "power4.out" }
    );
  }, [flipKey]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/* ==========================================================================
   FIT TO MEASURE
   Sets a display line to exactly fill its column by driving the real wdth
   axis of the variable face, then correcting the residue with tracking.
   This is optical justification, the compositor's job: no scaleX, no
   transform, so the stroke-to-counter ratio stays the designer's.

   AXIS TRUTH: the search range was min=62 max=132, but the font's real wdth
   range is 75 to 100. Values above 100 do not exist on this face, so the
   binary search was asking half its range for behaviour the font cannot
   produce, and every result above 100 was clamped to the same maximum. The
   search now runs the true 75-100 span, which is narrower but honest, and
   the tracking correction carries the remainder as it always did.
   ========================================================================== */

export function useFitToMeasure<T extends HTMLElement>(
  text: string,
  opts: { min?: number; max?: number; tolerance?: number } = {}
) {
  const { min = 75, max = 100, tolerance = 0.4 } = opts;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const target = parent.clientWidth;
      if (target < 40) return;

      // Binary search the width axis until the rendered line matches the
      // column. 18 iterations resolves the axis to well under one unit.
      let lo = min;
      let hi = max;
      el.style.letterSpacing = "";

      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        el.style.setProperty("--fit", String(mid));
        const w = el.scrollWidth;
        if (Math.abs(w - target) <= tolerance) {
          lo = hi = mid;
          break;
        }
        if (w > target) hi = mid;
        else lo = mid;
      }

      el.style.setProperty("--fit", String(lo));

      // Residue after the axis is exhausted goes into tracking, distributed
      // across the gaps rather than added to the last glyph.
      const gaps = Math.max(1, text.replace(/\s/g, "").length - 1);
      const residue = target - el.scrollWidth;
      el.style.letterSpacing = `${residue / gaps}px`;
    };

    fit();

    const ro = new ResizeObserver(fit);
    if (el.parentElement) ro.observe(el.parentElement);

    if (typeof document !== "undefined" && document.fonts) {
      void document.fonts.ready.then(fit);
    }

    return () => ro.disconnect();
  }, [text, min, max, tolerance]);

  return ref;
}

export { ScrollTrigger, gsap };
