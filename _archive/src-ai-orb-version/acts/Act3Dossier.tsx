"use client";

import React, { useState } from "react";
import { ShieldCheck, Search, User, Binary, CheckCircle2, Award } from "lucide-react";
import { AcademicRecord, PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { TiltCard } from "@/components/ui/TiltCard";
import { soundFx } from "@/lib/audio";

interface Act3DossierProps {
  opacity: number;
  y: number;
  onInspectCertificate: (record: AcademicRecord) => void;
}

export function Act3Dossier({ opacity, y, onInspectCertificate }: Act3DossierProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  if (opacity <= 0.01) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translate3d(0, ${y}px, 0)`,
        transition: "opacity 0.05s linear",
      }}
      className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none z-20"
    >
      <div className="max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-3.5">
          <div>
            <div className="eyebrow-oryzo text-[#ff5700] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5700] animate-ping" />
              ACT III // VERIFIED ACADEMIC DOSSIER & BIOMETRIC PROFILE
            </div>
            <h2 className="h2-oryzo text-[#ffedd7] mt-1">
              BENCHMARKS & ACADEMIC TENURE
            </h2>
          </div>

          <div className="text-xs font-mono text-[#ff5700] glass-pill border border-[#ff5700]/30 px-3.5 py-1.5 rounded-full self-start sm:self-auto tabular-nums">
            TOP 1% PERCENTILE • ZERO ARREARS • CLASS OF 2029
          </div>
        </div>

        {/* 4-Card Glassmorphism Parallax Tilt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pointer-events-auto">
          {/* 1. Biometric Profile Card */}
          <div
            onMouseEnter={() => {
              setHoveredCard("biometric");
              soundFx.playHover();
            }}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transition: "opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              opacity: hoveredCard !== null && hoveredCard !== "biometric" ? 0.45 : 1,
              transform: hoveredCard === "biometric" ? "scale(1.02)" : "scale(1)",
            }}
          >
            <TiltCard
              maxTilt={10}
              scaleOnHover={1.02}
              glare={true}
              className="p-5 sm:p-6 h-full flex flex-col justify-between rounded-3xl"
            >
              <div className="space-y-3.5">
                {/* Header Badge */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#ff5700] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Binary className="w-3 h-3" />
                    BIOMETRIC ID
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ff5700]/15 border border-[#ff5700]/30 text-[#ff5700]">
                    ACTIVE
                  </span>
                </div>

                {/* Portrait Visual Container with User Photo */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#0c0704] border border-white/12 flex flex-col justify-end p-3 text-center group shadow-inner img-outline">
                  {/* Photo with Object Cover */}
                  <img
                    src="/profile.jpg"
                    alt="Peddapalem Izaz Ahmed"
                    className="absolute inset-0 w-full h-full object-cover object-top filter contrast-105 brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Vignette & Biometric Scan Line */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0704] via-[#0c0704]/40 to-transparent" />
                  
                  {/* High-tech Corner Reticles */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[#ff5700]" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[#ff5700]" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[#ff5700]" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[#ff5700]" />

                  {/* Face Mesh Overlay Status */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#0c0704]/80 backdrop-blur-sm border border-[#ff5700]/30 px-2 py-0.5 rounded-full text-[9px] font-mono text-[#ff5700]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5700] animate-pulse" />
                    <span>SCAN: OK</span>
                  </div>

                  {/* Name & Reg Number Overlay */}
                  <div className="relative z-10 text-left">
                    <div className="font-syne font-bold text-xs text-[#ffedd7] tracking-tight">
                      PEDDAPALEM IZAZ AHMED
                    </div>
                    <div className="text-[10px] text-[#ff5700] font-mono font-semibold tabular-nums mt-0.5">
                      REG: 111525203076
                    </div>
                  </div>
                </div>

                {/* Bio Telemetry Fields */}
                <div className="space-y-1 text-xs font-mono border-t border-white/8 pt-2.5">
                  <div className="flex justify-between text-[#8a654e]">
                    <span>DEPT</span>
                    <span className="font-bold text-[#ffedd7]">AIML</span>
                  </div>
                  <div className="flex justify-between text-[#8a654e]">
                    <span>COLLEGE</span>
                    <span className="font-bold text-[#ffedd7] truncate ml-2">RMD ENGG</span>
                  </div>
                  <div className="flex justify-between text-[#8a654e]">
                    <span>LOCATION</span>
                    <span className="text-[#c89f82]">TIRUPATI // CHN</span>
                  </div>
                </div>
              </div>

              {/* Footer Status */}
              <div className="mt-3 pt-2.5 border-t border-white/8 flex items-center justify-between text-[10px] font-mono text-[#8a654e]">
                <span>TENURE: 2025–2029</span>
                <span className="text-[#ff5700] font-bold">VERIFIED</span>
              </div>
            </TiltCard>
          </div>

          {/* 2, 3, 4. Verified Academic Record Cards */}
          {PORTFOLIO_DATA.academics.map((record) => {
            const isThisHovered = hoveredCard === record.id;
            const isAnyHovered = hoveredCard !== null;

            return (
              <div
                key={record.id}
                onMouseEnter={() => {
                  setHoveredCard(record.id);
                  soundFx.playHover();
                }}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transition: "opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                  opacity: isAnyHovered && !isThisHovered ? 0.45 : 1,
                  transform: isThisHovered ? "scale(1.02)" : "scale(1)",
                }}
              >
                <TiltCard
                  maxTilt={10}
                  scaleOnHover={1.02}
                  glare={true}
                  className="flex flex-col justify-between p-5 sm:p-6 h-full rounded-3xl"
                >
                  <div className="space-y-3.5">
                    {/* Header Period & Status */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#c89f82] font-bold uppercase tracking-widest">
                      <span className="truncate">{record.level.split("(")[0]}</span>
                      <span className="px-2.5 py-0.5 rounded-full glass-pill text-[#ffedd7] font-semibold shrink-0">
                        {record.period}
                      </span>
                    </div>

                    {/* Score Big Display */}
                    <div>
                      <div className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#ffedd7] group-hover:text-[#ff5700] transition-colors tabular-nums">
                        {record.score}
                      </div>
                      <div className="text-[11px] font-mono text-[#ff5700] mt-0.5">
                        {record.scoreLabel}
                      </div>
                      <p className="text-xs font-semibold text-[#ffedd7] mt-1.5 leading-tight">
                        {record.institution}
                      </p>
                      <div className="text-[10px] text-[#8a654e] font-mono mt-0.5">
                        {record.location}
                      </div>
                    </div>

                    {/* Key Score Highlights */}
                    <div className="border-t border-white/8 pt-2 space-y-1 text-xs font-mono">
                      {record.highlights.slice(0, 3).map((item, i) => (
                        <div key={i} className="text-[#c89f82] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5700] shrink-0" />
                          <span className="truncate text-[11px]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inspect Marksheet Action Button */}
                  <div className="mt-3 pt-2.5 border-t border-white/8 space-y-2">
                    <div className="text-[10px] font-mono text-[#8a654e] flex justify-between">
                      <span>STATUS</span>
                      <span className="text-[#ff5700] font-bold">Zero Arrears</span>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onInspectCertificate(record);
                      }}
                      className="btn-oryzo-primary w-full py-2 text-[11px] font-bold cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-[#0c0704]" />
                      <span>INSPECT TRANSCRIPT</span>
                    </button>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Bottom Status Assurance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[#8a654e] text-xs font-mono pt-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ff5700]" />
            <span className="text-[11px]">ALL TRANSCRIPTS ARE CROSS-VERIFIED WITH ORIGINAL REGISTRATION NUMBERS</span>
          </div>
          <span className="text-[11px]">ANNA UNIV // AP STATE BOARD // CLASS OF 2029</span>
        </div>
      </div>
    </div>
  );
}

