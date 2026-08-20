"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Download, Copy, Check, ArrowUpRight, Cpu } from "lucide-react";
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
      className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-10 pointer-events-none z-20"
    >
      <div className="max-w-content w-full mx-auto space-y-6 sm:space-y-8 text-center flex flex-col items-center">
        {/* Top Status Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-[#1b1109]/90 backdrop-blur-sm text-xs text-[#dc5000]">
          <span className="w-2 h-2 rounded-full bg-[#dc5000] animate-ping" />
          <span className="font-mono font-bold uppercase tracking-wider">
            {PORTFOLIO_DATA.profile.horizon}
          </span>
        </div>

        {/* Big Headline */}
        <div className="space-y-3">
          <h2 className="h2-oryzo text-3xl sm:text-5xl md:text-6xl font-medium uppercase text-[#ffedd7] tracking-tight">
            INITIATE <span className="text-[#dc5000]">ENGINEERING</span> COLLABORATION
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#c09060] leading-relaxed">
            Open for high-impact AI/ML engineering internships, autonomous agent research, and forward-deployed development projects (2025–2029).
          </p>
        </div>

        {/* Oversized Magnetic Email Target */}
        <div className="pointer-events-auto pt-2">
          <a
            href={`mailto:${PORTFOLIO_DATA.profile.email}`}
            className="inline-block"
          >
            <MagneticButton
              magneticStrength={0.35}
              className="px-8 sm:px-12 py-5 sm:py-6 rounded-full bg-[#181818] border-2 border-[#dc5000] text-[#ffedd7] font-medium text-lg sm:text-2xl md:text-3xl tracking-tight hover:bg-[#dc5000] hover:text-[#100904] hover:scale-105 transition-all flex items-center gap-3 group cursor-pointer"
            >
              <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
              <span>{PORTFOLIO_DATA.profile.email}</span>
              <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </MagneticButton>
          </a>
        </div>

        {/* Direct Copy Quick Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto pt-2 text-xs font-mono">
          {/* Phone pill */}
          <button
            onClick={() => copyToClipboard(PORTFOLIO_DATA.profile.phone, "phone")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-[#181818] text-[#ffedd7] hover:border-[#dc5000] transition-colors group font-semibold cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-[#dc5000]" />
            <span>{PORTFOLIO_DATA.profile.phone}</span>
            {copiedField === "phone" ? (
              <span className="text-[#dc5000] font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> COPIED
              </span>
            ) : (
              <Copy className="w-3 h-3 text-[#a86048] group-hover:text-[#ffedd7] transition-colors" />
            )}
          </button>

          {/* Location pill */}
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-[#181818] text-[#ffedd7]">
            <MapPin className="w-3.5 h-3.5 text-[#a86048]" />
            <span>{PORTFOLIO_DATA.profile.location}</span>
          </div>

          {/* Institutional ID pill */}
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-[#181818] text-[#ffedd7]">
            <Cpu className="w-3.5 h-3.5 text-[#dc5000]" />
            <span>CLASS OF 2029 // REG: {PORTFOLIO_DATA.profile.registerNumber}</span>
          </div>
        </div>

        {/* 1-Click Action Button */}
        <div className="pointer-events-auto pt-4">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDossier();
            }}
            className="btn-oryzo-primary text-xs sm:text-sm py-4 px-8 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#100904]" />
            <span>DOWNLOAD ACADEMIC DOSSIER (PDF)</span>
          </button>
        </div>

        {/* Footer Technical Metadata */}
        <div className="border-t border-white/10 w-full pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[11px] text-[#a86048] pointer-events-auto">
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
