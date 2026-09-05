"use client";

import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { soundFx } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
}

export function MagneticButton({
  children,
  className = "",
  magneticStrength = 0.35,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * magneticStrength;
    const y = (clientY - (top + height / 2)) * magneticStrength;
    setPosition({ x, y });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundFx.playHover();
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPosition({ x: 0, y: 0 });
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundFx.playClick();
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 18, mass: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn(
        "relative inline-flex items-center justify-center font-medium transition-colors focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
