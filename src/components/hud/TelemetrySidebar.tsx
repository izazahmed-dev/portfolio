"use client";

import React from "react";
import { Activity, Binary, Layers } from "lucide-react";

interface TelemetrySidebarProps {
  scrollProgress: number;
  currentFrame: number;
  totalFrames: number;
}

export function TelemetrySidebar({
  scrollProgress,
  currentFrame,
  totalFrames,
}: TelemetrySidebarProps) {
  const getActInfo = () => {
    if (scrollProgress < 0.25) {
      return { number: "01", name: "KINETIC INITIALIZATION", range: "001–060" };
    } else if (scrollProgress < 0.55) {
      return { number: "02", name: "SPECIALIZATION NODES", range: "061–130" };
    } else if (scrollProgress < 0.85) {
      return { number: "03", name: "DOSSIER & BIOMETRICS", range: "131–190" };
    } else {
      return { number: "04", name: "DISPATCH TERMINAL", range: "191–239" };
    }
  };

  const act = getActInfo();
  const percentage = Math.min(100, Math.max(0, Math.round(scrollProgress * 100)));

  return (
    <>
      {/* Right Telemetry Rail */}
      <aside className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-4 pointer-events-none">
        {/* Progress Gauge */}
        <div className="flex flex-col items-end gap-1 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-[#a86048] font-bold">
            <Binary className="w-3.5 h-3.5 text-[#dc5000]" />
            <span className="tracking-widest">DECRYPTED</span>
          </div>
          <div className="text-2xl font-medium text-[#ffedd7] tracking-tight">
            {percentage}%
          </div>
          <div className="w-24 h-1.5 bg-[#181818] border border-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#dc5000] rounded-full transition-all duration-75"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Act Telemetry Pill */}
        <div className="bg-[#181818]/90 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl flex flex-col items-end gap-1 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 text-[#dc5000] font-bold">
            <Layers className="w-3 h-3" />
            <span>ACT {act.number} / 04</span>
          </div>
          <div className="text-[#ffedd7] font-medium text-right max-w-[130px] leading-tight">
            {act.name}
          </div>
          <div className="text-[#a86048] text-[9px]">FRAMES {act.range}</div>
        </div>

        {/* Frame Tracker */}
        <div className="bg-[#181818]/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full font-mono text-[10px] text-[#c09060] flex items-center gap-2">
          <Activity className="w-3 h-3 text-[#dc5000] animate-pulse" />
          <span className="font-bold text-[#ffedd7]">F_{String(currentFrame).padStart(3, "0")} / {totalFrames}</span>
        </div>
      </aside>

      {/* Left Coordinate Tracker (Desktop) */}
      <div className="fixed left-6 sm:left-10 bottom-8 z-40 hidden xl:flex flex-col gap-1 font-mono text-[9px] text-[#a86048] pointer-events-none">
        <div>SYS_LAT: 13.0827° N // CHENNAI</div>
        <div>SYS_LON: 79.3845° E // TIRUPATI</div>
        <div>ARCH: AUTONOMOUS_AGENT_DOSSIER</div>
        <div className="text-[#dc5000] font-bold">BATCH: 2025–2029 // VERIFIED</div>
      </div>
    </>
  );
}
