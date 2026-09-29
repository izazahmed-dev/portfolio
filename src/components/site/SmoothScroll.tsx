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
    // Reduced motion leaves the native scroller in charge, which also means
    // native hash jumps keep working. No Lenis, no interception.
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let lenis: Lenis | null = null;
    let ticker: ((t: number) => void) | null = null;
    let detach: (() => void) | null = null;

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

      /*
       * In-page links.
       *
       * Without this, clicking a section link triggers a native hash jump that
       * cuts instantly, ignores the running head, and can slide a Lenis page
       * straight back where it was -- the browser sets scrollTop while Lenis
       * is driving the scroll, and the two fight. Routing the click through
       * Lenis means one authority owns the position, and the offset keeps the
       * section heading clear of the fixed header.
       */
      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const target = e.target as HTMLElement | null;
        const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
        const href = anchor?.getAttribute("href");
        if (!anchor || !href?.startsWith("#") || href === "#") return;

        const el = document.getElementById(href.slice(1));
        if (!el) return; // unknown hash: let the browser handle it

        e.preventDefault();

        const chrome = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--chrome"),
          10
        );

        instance.scrollTo(el, {
          offset: -(Number.isFinite(chrome) ? chrome : 68),
          duration: 1.1,
        });

        // Keep the URL, keyboard focus, and the visual jump in agreement.
        history.pushState(null, "", href);
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      };

      document.addEventListener("click", onClick);
      detach = () => document.removeEventListener("click", onClick);

      ticker = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      detach?.();
      if (ticker) gsap.ticker.remove(ticker);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
