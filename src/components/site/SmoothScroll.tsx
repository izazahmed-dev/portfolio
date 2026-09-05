"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Lenis smooth scroll, wired to GSAP's ticker so Lenis and ScrollTrigger share
 * one frame loop instead of fighting over rAF. Skipped entirely under
 * prefers-reduced-motion, which leaves the native scroller in charge.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let lenis: Lenis | null = null;
    let ticker: ((t: number) => void) | null = null;

    void (async () => {
      const mod = await import("lenis");
      if (cancelled) return;

      const instance = new mod.default({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });

      lenis = instance;
      instance.on("scroll", ScrollTrigger.update);

      ticker = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      if (ticker) gsap.ticker.remove(ticker);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
