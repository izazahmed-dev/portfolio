"use client";

import React from "react";
import { ArrowDown, Cpu, Sparkles, Award, ShieldCheck } from "lucide-react";
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
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 pointer-events-none z-20 select-none"
    >
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-7 flex flex-col items-center">
        {/* Status Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/12 bg-[#140b06]/90 backdrop-blur-md text-xs shadow-lg shadow-black/30">
          <span className="w-2 h-2 rounded-full bg-[#ff5700] animate-pulse" />
          <span className="eyebrow-oryzo text-[11px] text-[#c89f82]">
            ACADEMIC TENURE: 2025–2029 • OPEN FOR ML INTERNSHIPS
          </span>
        </div>

        {/* H1 Display: Fluid and Heavy */}
        <div className="space-y-2.5">
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#8a654e] font-mono font-medium">
            PEDDAPALEM IZAZ AHMED // VERIFIED CANDIDATE
          </div>
          <h1 className="h1-oryzo text-[#ffedd7] tracking-tight uppercase max-w-4xl">
            ENGINEERED FOR <br className="hidden sm:block" />
            AUTONOMOUS AI <span className="text-[#ff5700] font-normal">*</span>
          </h1>
        </div>

        {/* Supporting Line */}
        <p className="max-w-2xl text-sm sm:text-base md:text-lg text-[#c89f82] leading-relaxed font-normal">
          Autonomous multi-agent swarms, Oracle-certified neural architectures, and verified mathematical foundations from <strong className="text-[#ffedd7] font-semibold">R.M.D. Engineering College</strong>.
        </p>

        {/* Telemetry Highlight Row with Tabular Numbers */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-white/10 bg-[#140b06]/90 text-[#ffedd7] shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#ff5700]" />
            <span className="font-mono text-[11px]">B.TECH AIML (2025–2029)</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-white/10 bg-[#140b06]/90 text-[#ffedd7] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5700]" />
            <span className="font-bold text-[#ff5700] tabular-nums font-mono text-[11px]">9.375 CGPA • ZERO ARREARS</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-white/10 bg-[#140b06]/90 text-[#ffedd7] shadow-sm">
            <Award className="w-3.5 h-3.5 text-[#ff5700]" />
            <span className="font-mono text-[11px]">ORACLE AGENTIC AI</span>
          </div>
        </div>

        {/* Kinetic Scroll Prompt */}
        <div className="pt-6 sm:pt-8 flex flex-col items-center gap-2 text-[#8a654e] text-xs font-mono">
          <span className="tracking-wider text-[11px]">SCROLL TO INITIALIZE SYSTEM NODES</span>
          <ArrowDown className="w-4 h-4 text-[#ff5700] animate-bounce" />
        </div>
      </div>
    </div>
  );
}

