"use client";

import React, { useEffect, useState } from "react";

export function NoiseOverlay() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Dynamic Radial Ambient Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(230, 255, 0, 0.035), transparent 75%)`,
        }}
      />

      {/* SVG Turbulence Grain Layer */}
      <div className="pointer-events-none fixed inset-0 z-20 opacity-[0.02] dark:opacity-[0.03] select-none">
        <svg className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </>
  );
}
