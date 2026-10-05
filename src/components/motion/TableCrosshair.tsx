"use client";

import { useEffect, useRef } from "react";
import { gsap, useReducedMotionLive } from "@/lib/gsap";

/* ==========================================================================
   CROSSHAIR -- the register table, once.

   Adapted from React Bits' Crosshair. Free-floating lines would cross the
   very figures they are meant to point at, so this version snaps: a row band
   and a column band meet on the cell under the pointer, with a registration
   red tick on the row. It is a reading aid for a table read across, the same
   job a ruler does on a printed mark sheet.

   Bands sit behind the text (z-index -1 inside an isolated host), only run on
   fine pointers that can hover, and are skipped entirely under reduced motion.
   ========================================================================== */

export function TableCrosshair({ rowSelector = ".reg-row" }: { rowSelector?: string }) {
  const layerRef = useRef<HTMLSpanElement | null>(null);
  const rowRef = useRef<HTMLSpanElement | null>(null);
  const colRef = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotionLive();

  useEffect(() => {
    const layer = layerRef.current;
    const host = layer?.parentElement ?? null;
    const rowBand = rowRef.current;
    const colBand = colRef.current;
    if (!layer || !host || !rowBand || !colBand || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const tween = { duration: 0.3, ease: "power3.out" };
    const rowY = gsap.quickTo(rowBand, "y", tween);
    const rowH = gsap.quickTo(rowBand, "height", tween);
    const colX = gsap.quickTo(colBand, "x", tween);
    const colW = gsap.quickTo(colBand, "width", tween);
    let rowOn = false;
    let colOn = false;

    const fade = (el: HTMLElement, on: boolean) =>
      gsap.to(el, {
        autoAlpha: on ? 1 : 0,
        duration: on ? 0.2 : 0.32,
        ease: "power2.out",
        overwrite: "auto",
      });

    const hideRow = () => {
      if (!rowOn) return;
      rowOn = false;
      fade(rowBand, false);
    };
    const hideCol = () => {
      if (!colOn) return;
      colOn = false;
      fade(colBand, false);
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const row = target ? target.closest<HTMLElement>(rowSelector) : null;
      if (!row || !host.contains(row)) {
        hideRow();
        hideCol();
        return;
      }

      const hr = host.getBoundingClientRect();
      const rr = row.getBoundingClientRect();
      const y = rr.top - hr.top;
      gsap.set(rowBand, { x: rr.left - hr.left, width: rr.width });
      if (!rowOn) {
        rowOn = true;
        rowY(y, y);
        rowH(rr.height, rr.height);
        fade(rowBand, true);
      } else {
        rowY(y);
        rowH(rr.height);
      }

      // Column: only the mark columns, never the subject name.
      let cell: DOMRect | null = null;
      for (let i = 1; i < row.children.length; i++) {
        const c = row.children[i];
        if (!c) continue;
        const cr = c.getBoundingClientRect();
        if (e.clientX >= cr.left - 12 && e.clientX <= cr.right + 12) {
          cell = cr;
          break;
        }
      }
      if (!cell) {
        hideCol();
        return;
      }
      const x = cell.left - hr.left - 8;
      const w = cell.width + 16;
      if (!colOn) {
        colOn = true;
        colX(x, x);
        colW(w, w);
        fade(colBand, true);
      } else {
        colX(x);
        colW(w);
      }
    };

    const onLeave = () => {
      hideRow();
      hideCol();
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([rowBand, colBand]);
      gsap.set([rowBand, colBand], { clearProps: "all" });
    };
  }, [rowSelector, reduced]);

  return (
    <span ref={layerRef} aria-hidden className="xhair">
      <span ref={rowRef} className="xhair__row" />
      <span ref={colRef} className="xhair__col" />
    </span>
  );
}
