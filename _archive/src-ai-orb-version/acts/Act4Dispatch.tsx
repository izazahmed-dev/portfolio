"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Download, Copy, Check, ArrowUpRight, Cpu, Sparkles } from "lucide-react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { soundFx } from "@/lib/audio";

interface Act4DispatchProps {
  opacity: number;
  y: number;
  onOpenDossier: () => void;
}

export function Act4Dispatch({ opacity, y, onOpenDossier }: Act4DispatchProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (opacity <= 0.01) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      style={{
        opacity,
        transform: `translate3d(0, ${y}px, 0)`,
        transition: "opacity 0.05s linear",
      }}
      className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none z-20"
    >
      <div className="max-w-4xl w-full mx-auto space-y-6 sm:space-y-7 text-center flex flex-col items-center">
        {/* Top Status Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/12 bg-[#140b06]/90 backdrop-blur-md text-xs text-[#ff5700] shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#ff5700] animate-ping" />
          <span className="font-mono font-bold uppercase tracking-wider text-[11px]">
            {PORTFOLIO_DATA.profile.horizon}
          </span>
        </div>

        {/* Big Headline */}
        <div className="space-y-2.5">
          <h2 className="h2-oryzo text-3xl sm:text-5xl md:text-6xl font-bold uppercase text-[#ffedd7] tracking-tight">
            INITIATE <span className="text-[#ff5700]">ENGINEERING</span> COLLABORATION
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#c89f82] leading-relaxed">
            Open for high-impact AI/ML engineering internships, autonomous agent research, and forward-deployed development projects (2025–2029).
          </p>
        </div>

        {/* Oversized Magnetic Email Target */}
        <div className="pointer-events-auto pt-1">
          <a
            href={`mailto:${PORTFOLIO_DATA.profile.email}`}
            onClick={() => soundFx.playClick()}
            className="inline-block"
          >
            <MagneticButton
              magneticStrength={0.35}
              className="px-6 sm:px-10 py-4 sm:py-5 rounded-full bg-[#140b06] border-2 border-[#ff5700] text-[#ffedd7] font-semibold text-base sm:text-xl md:text-2xl tracking-tight hover:bg-[#ff5700] hover:text-[#0c0704] active:scale-[0.96] transition-all flex items-center gap-3 group cursor-pointer shadow-xl shadow-[#ff5700]/15"
            >
              <Mail className="w-5 h-5 sm:w-7 sm:h-7" />
              <span>{PORTFOLIO_DATA.profile.email}</span>
              <ArrowUpRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </MagneticButton>
          </a>
        </div>

        {/* Direct Copy Quick Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pointer-events-auto pt-1 text-xs font-mono">
          {/* Phone pill */}
          <button
            onClick={() => copyToClipboard(PORTFOLIO_DATA.profile.phone, "phone")}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#140b06] text-[#ffedd7] hover:border-[#ff5700] active:scale-[0.96] transition-all group font-semibold cursor-pointer shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-[#ff5700]" />
            <span className="tabular-nums">{PORTFOLIO_DATA.profile.phone}</span>
            {copiedField === "phone" ? (
              <span className="text-[#ff5700] font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> COPIED
              </span>
            ) : (
              <Copy className="w-3 h-3 text-[#8a654e] group-hover:text-[#ffedd7] transition-colors" />
            )}
          </button>

          {/* Location pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#140b06] text-[#ffedd7] shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#8a654e]" />
            <span>{PORTFOLIO_DATA.profile.location}</span>
          </div>

          {/* Institutional ID pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#140b06] text-[#ffedd7] shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#ff5700]" />
            <span className="tabular-nums">CLASS OF 2029 // REG: {PORTFOLIO_DATA.profile.registerNumber}</span>
          </div>
        </div>

        {/* 1-Click Action Button */}
        <div className="pointer-events-auto pt-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDossier();
            }}
            className="btn-oryzo-primary text-xs sm:text-sm py-3.5 px-7 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#0c0704]" />
            <span>DOWNLOAD ACADEMIC DOSSIER (PDF)</span>
          </button>
        </div>

        {/* Footer Technical Metadata */}
        <div className="border-t border-white/8 w-full pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[11px] text-[#8a654e] pointer-events-auto">
          <div>© 2026 PEDDAPALEM IZAZ AHMED // B.TECH AIML (2025–2029)</div>
          <div className="flex items-center gap-3">
            <span>RMD ENGINEERING COLLEGE</span>
            <span>•</span>
            <span>ANNA UNIVERSITY AFFILIATED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

