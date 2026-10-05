"use client";

/**
 * Single GSAP registration point.
 * Registering a plugin from more than one module double-registers it and
 * disturbs ScrollTrigger's refresh ordering, so every animation in the app
 * imports its instances from here.
 */
import { useEffect, useState } from "react";
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

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  // The Imprint's motion switch writes data-motion="off" before first paint,
  // so a reader's choice and the OS setting are honoured by the same check.
  return (
    document.documentElement.getAttribute("data-motion") === "off" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Live reduced-motion. Static prefersReducedMotion() is read once at effect
 * setup, so a reader who flips the OS setting mid-session never gets a
 * re-evaluation and the page keeps animating under them. This hook
 * subscribes instead, and the components that use it rebuild themselves.
 */
export function useReducedMotionLive(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(prefersReducedMotion());
    mq.addEventListener("change", onChange);
    setReduced(prefersReducedMotion());
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export {
  gsap,
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  CustomEase,
  useGSAP,
};
