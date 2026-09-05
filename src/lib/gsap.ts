"use client";

/**
 * Single GSAP registration point.
 * Registering a plugin from more than one module double-registers it and
 * disturbs ScrollTrigger's refresh ordering, so every animation in the app
 * imports its instances from here.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    ScrambleTextPlugin,
    DrawSVGPlugin,
    CustomEase,
    useGSAP
  );

  // House easing: weighted, decelerating. Never linear, never ease-in-out.
  if (!CustomEase.get("press")) {
    CustomEase.create("press", "M0,0 C0.32,0.72 0,1 1,1");
  }
}

export const EASE_OUT = "power4.out";
export const EASE_IN = "power2.in";
export const EASE_CSS = "cubic-bezier(0.32, 0.72, 0, 1)";

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export {
  gsap,
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  CustomEase,
  useGSAP,
};
