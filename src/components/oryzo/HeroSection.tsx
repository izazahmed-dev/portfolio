"use client";

import React from "react";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { HeroCanvasMoment } from "@/components/canvas/HeroCanvasMoment";
import { soundFx } from "@/lib/audio";

interface HeroSectionProps {
  onOpenContact: () => void;
  onOpenDossier: () => void;
}

export function HeroSection({ onOpenContact, onOpenDossier }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full flex flex-col justify-center items-center px-6 sm:px-10 pt-24 pb-16 overflow-hidden select-none"
    >
      {/* Interactive WebGL / Generative Canvas Moment */}
      <HeroCanvasMoment />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-content w-full mx-auto flex flex-col items-start justify-center text-left my-auto">
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-white/15 bg-[#1b1109]/80 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#dc5000] animate-pulse" />
          <span className="eyebrow-oryzo text-[11px] text-[#c09060]">
            B.Tech AIML (2025–2029) • RMD Engineering College
          </span>
        </div>

        {/* H1 Display: 123px desktop / 68px mobile, weight 500, letter-spacing -2.214px, line-height 0.9 */}
        <h1 className="h1-oryzo text-[#ffedd7] max-w-5xl tracking-tight">
          ENGINEERED FOR <br className="hidden sm:block" />
          AUTONOMY <span className="text-[#dc5000] font-normal">*</span>
        </h1>

        {/* One supporting line max, muted color */}
        <p className="mt-8 text-base sm:text-lg md:text-xl text-[#c09060] max-w-2xl leading-relaxed font-normal">
          Autonomous multi-agent swarms, Oracle-certified neural architectures, and verified mathematical foundations from R.M.D. Engineering College.
        </p>

        {/* CTAs: primary side by side, 12px gap */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenContact();
            }}
            className="btn-oryzo-primary cursor-pointer"
          >
            <span>SEND</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDossier();
            }}
            className="btn-oryzo-ghost cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#c09060]" />
            <span>EXPLORE DOSSIER</span>
          </button>
        </div>

        {/* Bottom Metadata Pill Strip */}
        <div className="mt-14 pt-8 border-t border-white/10 w-full flex flex-wrap items-center justify-between gap-4 text-xs text-[#a86048]">
          <div className="flex items-center gap-2">
            <span className="text-[#ffedd7] font-medium">PEDDAPALEM IZAZ AHMED</span>
            <span>•</span>
            <span>CLASS OF 2029</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#dc5000]" />
            <span className="text-[#ffedd7]">ORACLE CERTIFIED AGENTIC AI FOUNDATIONS ASSOCIATE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
