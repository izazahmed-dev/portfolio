"use client";

import React from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { soundFx } from "@/lib/audio";

interface FinalCtaSectionProps {
  onOpenContact: () => void;
}

export function FinalCtaSection({ onOpenContact }: FinalCtaSectionProps) {
  return (
    <section id="contact" className="w-full py-24 sm:py-32 px-6 sm:px-10 bg-[#100904]">
      <div className="max-w-content mx-auto">
        {/* Slightly Lighter Surface Card */}
        <div className="surface-lighter p-10 sm:p-16 border border-white/15 text-center flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-[#dc5000]/10 via-transparent to-transparent pointer-events-none" />

          {/* Eyebrow */}
          <div className="eyebrow-oryzo text-[#dc5000]">
            03 // DIRECT DISPATCH & ACCESS
          </div>

          {/* H2 restating the promise */}
          <h2 className="h2-oryzo text-[#ffedd7] max-w-2xl leading-tight">
            INITIATE ENGINEERING COLLABORATION.
          </h2>

          <p className="text-[#c09060] text-base max-w-lg leading-relaxed">
            Open for forward-deployed AI/ML internships, autonomous agent research, and high-performance system engineering.
          </p>

          {/* Primary CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenContact();
              }}
              className="btn-oryzo-primary text-sm sm:text-base py-4 px-8 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#100904]" />
              <span>SEND // {PORTFOLIO_DATA.profile.email}</span>
              <ArrowUpRight className="w-4 h-4 text-[#100904]" />
            </button>
          </div>

          {/* Reassurance Line Underneath */}
          <div className="text-xs text-[#a86048] font-mono tracking-wide">
            Batch 2025–2029 • Open for ML Internships & Research • Direct Communication
          </div>
        </div>
      </div>
    </section>
  );
}
