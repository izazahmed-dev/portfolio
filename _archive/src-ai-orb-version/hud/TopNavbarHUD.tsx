"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, ShieldCheck, Mail, Clock, Terminal, Award, Sparkles } from "lucide-react";
import { soundFx } from "@/lib/audio";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

interface TopNavbarHUDProps {
  onOpenDossier: () => void;
  scrollProgress: number;
}

export function TopNavbarHUD({ onOpenDossier, scrollProgress }: TopNavbarHUDProps) {
  const [timeString, setTimeString] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const baseTime = new Intl.DateTimeFormat("en-GB", options).format(now);
      setTimeString(`${baseTime} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-4 sm:px-8 py-3.5 sm:py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Identity & Verified Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#140b06]/85 backdrop-blur-xl border border-white/10 px-3.5 sm:px-4 py-2 rounded-full shadow-lg shadow-black/40">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#ff5700]" />
            <span className="absolute w-3.5 h-3.5 rounded-full bg-[#ff5700]/35 animate-ping" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs sm:text-sm tracking-tight text-[#ffedd7]">
                {PORTFOLIO_DATA.profile.name}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#ff5700]/15 text-[#ff5700] border border-[#ff5700]/30">
                <Sparkles className="w-2.5 h-2.5" />
                <span>AIML 2025–2029</span>
              </span>
            </div>
            <div className="text-[10px] text-[#c89f82] font-mono hidden sm:flex items-center gap-1.5">
              <span>R.M.D. ENGINEERING COLLEGE</span>
              <span className="text-white/20">•</span>
              <span className="text-[#ff5700] font-semibold tabular-nums">9.375 CGPA</span>
            </div>
          </div>
        </div>

        {/* Center: Live IST Clock & Telemetry */}
        <div className="hidden lg:flex items-center gap-3.5 pointer-events-auto bg-[#140b06]/85 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-xs text-[#c89f82] font-mono shadow-lg shadow-black/40">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#ff5700]" />
            <span className="text-[#ffedd7] font-medium tabular-nums">{timeString || "19:30:00 IST"}</span>
          </div>
          <div className="w-px h-3.5 bg-white/15" />
          <div className="flex items-center gap-1.5 text-[11px] text-[#c89f82]">
            <Award className="w-3.5 h-3.5 text-[#ff5700]" />
            <span>ORACLE AGENTIC AI</span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleAudioToggle}
            aria-label={isMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback"}
            title={isMuted ? "Enable Audio Synthesizer" : "Mute Audio Synthesizer"}
            className="p-2 sm:p-2.5 rounded-full bg-[#140b06]/85 backdrop-blur-xl border border-white/10 text-[#c89f82] hover:text-[#ffedd7] hover:border-[#ff5700]/50 active:scale-[0.96] transition-all cursor-pointer shadow-lg shadow-black/40"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#8a654e]" /> : <Volume2 className="w-4 h-4 text-[#ff5700]" />}
          </button>

          {/* Quick Contact Trigger */}
          <a
            href={`mailto:${PORTFOLIO_DATA.profile.email}`}
            onClick={() => soundFx.playClick()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#140b06]/85 backdrop-blur-xl border border-white/10 text-[#ffedd7] hover:border-[#ff5700]/60 active:scale-[0.96] transition-all text-xs font-semibold uppercase tracking-wider shadow-lg shadow-black/40"
          >
            <Mail className="w-3.5 h-3.5 text-[#ff5700]" />
            <span>CONNECT</span>
          </a>

          {/* Master Dossier Primary Trigger */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDossier();
            }}
            className="btn-oryzo-primary text-xs py-2 sm:py-2.5 px-3.5 sm:px-5 cursor-pointer shadow-lg shadow-[#ff5700]/25"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0c0704]" />
            <span>DOSSIER</span>
          </button>
        </div>
      </div>
    </header>
  );
}

