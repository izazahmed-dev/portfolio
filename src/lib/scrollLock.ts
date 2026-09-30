"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/**
 * Scroll lock.
 *
 * Every overlay on this page used to do `document.body.style.overflow = "hidden"`
 * and call it a day. That is wrong twice over here, and both halves have to be
 * fixed for the lock to actually hold:
 *
 * 1. Lenis's wrapper is `window`, so the scrolling element is the documentElement,
 *    not the body. Hiding overflow on the body does not stop the page scrolling.
 * 2. Lenis keeps driving `window.scrollTo` from its own ticker regardless. The
 *    wheel was still consumed and still moved the page behind the overlay, which
 *    is why an open reader would drift the document underneath itself.
 *
 * So the lock has to reach Lenis. `registerLenis` hands the instance over when
 * the scroller boots; if a lock is already held at that point the instance is
 * stopped immediately, which closes the race where an overlay is open before the
 * dynamic import of Lenis has resolved.
 *
 * The counter matters because two overlays can legitimately be open at once: the
 * cabinet drawer is still mounted when the reader is summoned from inside it. With
 * a plain set/clear pair, closing the drawer cleared the flag while the reader was
 * still up and the page became scrollable behind a full-screen dialog.
 */
let depth = 0;
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null): void {
  lenis = instance;
  // A lock taken before Lenis booted has to be applied to it retroactively.
  if (instance && depth > 0) instance.stop();
}

function apply(locked: boolean): void {
  const html = document.documentElement;

  if (locked) {
    html.dataset.scrollLocked = "true";
    html.style.overflow = "hidden";
    // reset() inside stop() kills any in-flight smooth scroll, so the page does
    // not keep gliding after the overlay is up.
    lenis?.stop();
    return;
  }

  delete html.dataset.scrollLocked;
  // Order matters: restore the native scroller BEFORE handing authority back to
  // Lenis, or Lenis's start() reset reads a clamped scroll position.
  html.style.overflow = "";
  lenis?.start();
}

/**
 * Locks page scrolling for as long as the returned function is not called.
 * Safe to call from several overlays at once; the last release wins.
 */
export function useScrollLock(active = true): void {
  useEffect(() => {
    if (!active) return;

    depth += 1;
    if (depth === 1) apply(true);

    let released = false;
    return () => {
      // React StrictMode mounts effects twice. Without the guard the second
      // teardown drives the counter negative and the page never unlocks.
      if (released) return;
      released = true;
      depth = Math.max(0, depth - 1);
      if (depth === 0) apply(false);
    };
  }, [active]);
}