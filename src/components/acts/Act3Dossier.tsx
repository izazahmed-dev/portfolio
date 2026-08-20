"use client";

import React, { useState } from "react";
import { ShieldCheck, Search, User, Binary } from "lucide-react";
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
      className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-10 pointer-events-none z-20"
    >
      <div className="max-w-content w-full mx-auto space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/15 pb-4">
          <div>
            <div className="eyebrow-oryzo text-[#dc5000] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#dc5000] animate-ping" />
              ACT III // VERIFIED ACADEMIC DOSSIER & BIOMETRIC PROFILE
            </div>
            <h2 className="h2-oryzo text-[#ffedd7] mt-1">
              BENCHMARKS & ACADEMIC TENURE
            </h2>
          </div>

          <div className="text-xs font-mono text-[#dc5000] glass-pill border border-[#dc5000]/30 px-4 py-1.5 rounded-full">
            TOP 1% PERCENTILE • ZERO ARREARS • CLASS OF 2029
          </div>
        </div>

        {/* 4-Card Glassmorphism Parallax Tilt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pointer-events-auto">
          {/* 1. Biometric Profile Card */}
          <div
            onMouseEnter={() => setHoveredCard("biometric")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transition: "opacity 0.3s ease, transform 0.3s ease",
              opacity: hoveredCard !== null && hoveredCard !== "biometric" ? 0.45 : 1,
            }}
          >
            <TiltCard
              maxTilt={10}
              scaleOnHover={1.06}
              glare={true}
              className="p-6 h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#dc5000] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Binary className="w-3 h-3" />
                    BIOMETRIC ID
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#dc5000]/15 border border-[#dc5000]/30">
                    ACTIVE
                  </span>
                </div>

                {/* Portrait Visual Container with User Photo */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#100904] border border-white/15 flex flex-col justify-end p-3 text-center group shadow-inner">
                  {/* Photo with Object Cover */}
                  <img
                    src="/profile.jpg"
                    alt="Peddapalem Izaz Ahmed"
                    className="absolute inset-0 w-full h-full object-cover object-top filter contrast-105 brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Vignette & Biometric Scan Line */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100904] via-[#100904]/40 to-transparent" />
                  
                  {/* High-tech Corner Reticles */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[#dc5000]" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[#dc5000]" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[#dc5000]" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[#dc5000]" />

                  {/* Face Mesh Overlay Status */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#100904]/80 backdrop-blur-sm border border-[#dc5000]/30 px-2 py-0.5 rounded-full text-[9px] font-mono text-[#dc5000]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000] animate-pulse" />
                    <span>SCAN: OK</span>
                  </div>

                  {/* Name & Reg Number Overlay */}
                  <div className="relative z-10 text-left">
                    <div className="font-syne font-bold text-xs text-[#ffedd7] tracking-tight">
                      PEDDAPALEM IZAZ AHMED
                    </div>
                    <div className="text-[10px] text-[#dc5000] font-mono font-semibold mt-0.5">
                      REG: 111525203076
                    </div>
                  </div>
                </div>

                {/* Bio Telemetry Fields */}
                <div className="space-y-1.5 text-xs font-mono border-t border-white/10 pt-3">
                  <div className="flex justify-between text-[#a86048]">
                    <span>DEPT</span>
                    <span className="font-bold text-[#ffedd7]">AIML</span>
                  </div>
                  <div className="flex justify-between text-[#a86048]">
                    <span>COLLEGE</span>
                    <span className="font-bold text-[#ffedd7] truncate ml-2">RMD ENGG</span>
                  </div>
                  <div className="flex justify-between text-[#a86048]">
                    <span>LOCATION</span>
                    <span className="text-[#c09060]">TIRUPATI // CHN</span>
                  </div>
                </div>
              </div>

              {/* Footer Status */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#a86048]">
                <span>TENURE: 2025–2029</span>
                <span className="text-[#dc5000] font-bold">VERIFIED</span>
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
                onMouseEnter={() => setHoveredCard(record.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  opacity: isAnyHovered && !isThisHovered ? 0.45 : 1,
                }}
              >
                <TiltCard
                  maxTilt={10}
                  scaleOnHover={1.06}
                  glare={true}
                  className="flex flex-col justify-between p-6 h-full"
                >
                  <div className="space-y-4">
                    {/* Header Period & Status */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#c09060] font-bold uppercase tracking-widest">
                      <span className="truncate">{record.level.split("(")[0]}</span>
                      <span className="px-2.5 py-0.5 rounded-full glass-pill text-[#ffedd7] font-semibold shrink-0">
                        {record.period}
                      </span>
                    </div>

                    {/* Score Big Display */}
                    <div>
                      <div className="font-syne text-3xl font-bold tracking-tight text-[#ffedd7] group-hover:text-[#dc5000] transition-colors">
                        {record.score}
                      </div>
                      <div className="text-[11px] font-mono text-[#dc5000] mt-0.5">
                        {record.scoreLabel}
                      </div>
                      <p className="text-xs font-semibold text-[#ffedd7] mt-1.5 leading-tight">
                        {record.institution}
                      </p>
                      <div className="text-[10px] text-[#a86048] font-mono">
                        {record.location}
                      </div>
                    </div>

                    {/* Key Score Highlights */}
                    <div className="border-t border-white/10 pt-2.5 space-y-1 text-xs font-mono">
                      {record.highlights.slice(0, 3).map((item, i) => (
                        <div key={i} className="text-[#c09060] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000] shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inspect Marksheet Action Button */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <div className="text-[10px] font-mono text-[#a86048] flex justify-between">
                      <span>STATUS</span>
                      <span className="text-[#dc5000] font-bold">Zero Arrears</span>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onInspectCertificate(record);
                      }}
                      className="btn-oryzo-primary w-full py-2.5 text-[11px] font-bold cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>INSPECT MARKSHEET</span>
                    </button>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Bottom Status Assurance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[#a86048] text-xs font-mono pt-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#dc5000]" />
            <span>ALL TRANSCRIPTS ARE CROSS-VERIFIED WITH ORIGINAL REGISTRATION NUMBERS</span>
          </div>
          <span className="text-[11px]">ANNA UNIV // AP STATE BOARD // CLASS OF 2029</span>
        </div>
      </div>
    </div>
  );
}
