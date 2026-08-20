"use client";

import React, { useRef, useState } from "react";
import { soundFx } from "@/lib/audio";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  scaleOnHover?: number;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
  scaleOnHover = 1.05,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1.02)`
    );

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY, opacity: 0.35 });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundFx.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: isHovered ? "transform 0.08s ease-out, box-shadow 0.25s ease" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease",
        transformStyle: "preserve-3d",
        zIndex: isHovered ? 40 : 1,
      }}
      className={`relative glass-card rounded-[28px] overflow-hidden will-change-transform ${
        isHovered ? "ring-2 ring-[#dc5000]/60 shadow-[0_20px_50px_rgba(220,80,0,0.2)]" : ""
      } ${className}`}
      {...props}
    >
      {/* Dynamic Specular Sheen Glare */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-[28px]"
          style={{
            background: `radial-gradient(circle 350px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.22), transparent 75%)`,
            opacity: glarePosition.opacity,
          }}
        />
      )}

      {/* Internal Content Container */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
