"use client";

import React from "react";
import { ArrowDown, Cpu, Sparkles, Award } from "lucide-react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

interface Act1HeroProps {
  opacity: number;
  scale: number;
  y: number;
  blur: number;
}

export function Act1Hero({ opacity, scale, y, blur }: Act1HeroProps) {
  if (opacity <= 0.01) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        transition: "opacity 0.05s linear, filter 0.05s linear",
      }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-10 pointer-events-none z-20 select-none"
    >
      <div className="max-w-content mx-auto space-y-6 sm:space-y-8 flex flex-col items-center">
        {/* Status Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-[#1b1109]/90 backdrop-blur-sm text-xs">
          <span className="w-2 h-2 rounded-full bg-[#dc5000] animate-pulse" />
          <span className="eyebrow-oryzo text-[11px] text-[#c09060]">
            ACADEMIC TENURE: 2025–2029 • OPEN FOR ML INTERNSHIPS
          </span>
        </div>

        {/* H1 Display: 123px desktop / 68px mobile */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-[#a86048] font-mono">
            PEDDAPALEM IZAZ AHMED // VERIFIED CANDIDATE
          </div>
          <h1 className="h1-oryzo text-[#ffedd7] tracking-tight uppercase max-w-5xl">
            ENGINEERED FOR <br className="hidden sm:block" />
            AUTONOMY <span className="text-[#dc5000] font-normal">*</span>
          </h1>
        </div>

        {/* Supporting Line */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-[#c09060] leading-relaxed font-normal">
          Autonomous multi-agent swarms, Oracle-certified neural architectures, and verified mathematical foundations from <strong className="text-[#ffedd7]">R.M.D. Engineering College</strong>.
        </p>

        {/* Telemetry Highlight Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-[#181818]/90 text-[#ffedd7]">
            <Cpu className="w-3.5 h-3.5 text-[#dc5000]" />
            <span>B.TECH AIML (2025–2029)</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-[#181818]/90 text-[#ffedd7]">
            <Sparkles className="w-3.5 h-3.5 text-[#dc5000]" />
            <span className="font-bold text-[#dc5000]">9.375 CGPA • ZERO ARREARS</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-[#181818]/90 text-[#ffedd7]">
            <Award className="w-3.5 h-3.5 text-[#dc5000]" />
            <span>ORACLE AGENTIC AI CERTIFIED</span>
          </div>
        </div>

        {/* Kinetic Scroll Prompt */}
        <div className="pt-8 flex flex-col items-center gap-2 text-[#a86048] text-xs font-mono">
          <span>SCROLL TO INITIALIZE SPECIALIZATION NODES</span>
          <ArrowDown className="w-4 h-4 text-[#dc5000] animate-bounce" />
        </div>
      </div>
    </div>
  );
}
