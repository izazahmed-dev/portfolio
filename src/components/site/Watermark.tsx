"use client";

import { useEffect, useState } from "react";

/**
 * Watermark.
 *
 * Stamped across every preview with a stable, non-identifying viewer token and
 * the date. Be clear about what this is: the image bytes are unchanged and a
 * determined visitor can strip an overlay, so this is a deterrent and a
 * provenance marker, not a control. What it genuinely buys is that a copy
 * that leaves this site carries a receipt saying where and when it was taken.
 *
 * The token is a random id in localStorage. It is deliberately NOT derived
 * from an email, a name, or an IP: those would put a real person's identity
 * into every screenshot permanently, and for a portfolio of public academic
 * records that is a disproportionate cost for very little deterrent value.
 *
 * `aria-hidden` and `pointer-events: none` keep it out of the accessibility
 * tree and out of the way of the close button and the scroll container.
 */
export function Watermark({ className }: { className?: string }) {
  const [stamp, setStamp] = useState<string | null>(null);

  useEffect(() => {
    const KEY = "press-viewer";
    const today = new Date().toISOString().slice(0, 10);

    let id: string;
    try {
      const existing = window.localStorage.getItem(KEY);
      if (existing) {
        id = existing;
      } else {
        // 8 hex chars is enough to distinguish sessions without being a
        // meaningful identifier on its own.
        const rand = window.crypto.getRandomValues(new Uint8Array(4));
        id = Array.from(rand, (b) => b.toString(16).padStart(2, "0")).join("");
        window.localStorage.setItem(KEY, id);
      }
    } catch {
      // Storage blocked (private mode, strict settings). Fall back to a
      // per-render id so the watermark still appears, just not persistently.
      id = "ephemeral";
    }

    setStamp(`${id} · ${today}`);
  }, []);

  if (!stamp) return null;

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-[3] grid select-none place-items-center overflow-hidden ${className ?? ""}`}
    >
      <span
        className="whitespace-nowrap font-mono uppercase"
        style={{
          transform: "rotate(-24deg)",
          fontSize: "clamp(0.625rem, 1.6vw, 0.9375rem)",
          letterSpacing: "0.3em",
          color: "color-mix(in srgb, var(--ink) 13%, transparent)",
          // Faint enough to never compete with the document it sits on.
          mixBlendMode: "multiply",
        }}
      >
        {stamp}
      </span>
    </span>
  );
}
