"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

/**
 * A restrained ink ripple for the hero and evidence cabinet.
 *
 * It intentionally uses short-lived DOM rings rather than a full-screen WebGL
 * or jQuery canvas: the interaction stays legible, cheap, and easy to disable
 * for touch and reduced-motion users.
 */
export function CursorRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const lastPoint = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    if (reduced.matches || !finePointer.matches) return;

    const onMove = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("[data-ripple-zone]")) return;

      const now = performance.now();
      const previous = lastPoint.current;
      const distance = Math.hypot(event.clientX - previous.x, event.clientY - previous.y);
      if (now - previous.time < 75 || distance < 12) return;

      lastPoint.current = { x: event.clientX, y: event.clientY, time: now };
      const ripple: Ripple = {
        id: nextId.current++,
        x: event.clientX,
        y: event.clientY,
        size: 24 + Math.min(distance, 32),
      };

      setRipples((current) => [...current.slice(-5), ripple]);
      window.setTimeout(() => {
        setRipples((current) => current.filter((item) => item.id !== ripple.id));
      }, 780);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="cursor-ripple-layer no-print" aria-hidden="true">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="cursor-ripple"
          style={
            {
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
