"use client";

import React from "react";
import { ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { soundFx } from "@/lib/audio";

interface FinalCtaSectionProps {
  onOpenContact: () => void;
}

export function FinalCtaSection({ onOpenContact }: FinalCtaSectionProps) {
  return (
    <section id="contact" className="w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#0c0704]">
      <div className="max-w-5xl mx-auto">
        {/* Surface Card with Amber Ambient Glow */}
        <div className="surface-lighter p-8 sm:p-14 border border-white/12 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-7 relative overflow-hidden rounded-3xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-[#ff5700]/12 via-transparent to-transparent pointer-events-none" />

          {/* Eyebrow */}
          <div className="eyebrow-oryzo text-[#ff5700] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>03 // DIRECT DISPATCH & ACCESS</span>
          </div>

          {/* H2 restating the promise */}
          <h2 className="h2-oryzo text-[#ffedd7] max-w-2xl leading-tight">
            INITIATE ENGINEERING COLLABORATION.
          </h2>

          <p className="text-[#c89f82] text-sm sm:text-base max-w-lg leading-relaxed">
            Open for forward-deployed AI/ML internships, autonomous agent research, and high-performance system engineering (Batch 2025–2029).
          </p>

          {/* Primary CTA */}
          <div className="pt-1">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenContact();
              }}
              className="btn-oryzo-primary text-xs sm:text-sm py-3.5 px-7 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#0c0704]" />
              <span>SEND BRIEF // {PORTFOLIO_DATA.profile.email}</span>
              <ArrowUpRight className="w-4 h-4 text-[#0c0704]" />
            </button>
          </div>

          {/* Reassurance Line Underneath */}
          <div className="text-xs text-[#8a654e] font-mono tracking-wide">
            Batch 2025–2029 • Open for ML Internships & Applied Research • Direct Communication
          </div>
        </div>
      </div>
    </section>
  );
}

