"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, ShieldCheck, Mail, Clock } from "lucide-react";
import { soundFx } from "@/lib/audio";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

interface TopNavbarHUDProps {
  onOpenDossier: () => void;
  scrollProgress: number;
}

export function TopNavbarHUD({ onOpenDossier }: TopNavbarHUDProps) {
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
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-6 sm:px-10 py-4 sm:py-6">
      <div className="max-w-content mx-auto flex items-center justify-between gap-4">
        {/* Left: Identity Node */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#181818]/90 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full">
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#dc5000]" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-[#dc5000]/40 animate-ping" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs sm:text-sm tracking-tight text-[#ffedd7]">
                {PORTFOLIO_DATA.profile.name}
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#dc5000]/15 text-[#dc5000] border border-[#dc5000]/30">
                AIML (2025–2029)
              </span>
            </div>
            <div className="text-[10px] text-[#a86048] font-mono hidden sm:block">
              RMD ENGINEERING COLLEGE, CHENNAI
            </div>
          </div>
        </div>

        {/* Center: Live IST Clock & Institution */}
        <div className="hidden lg:flex items-center gap-3 pointer-events-auto bg-[#181818]/90 backdrop-blur-md border border-white/15 px-5 py-2 rounded-full text-xs text-[#c09060] font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#dc5000]" />
            <span className="text-[#ffedd7] font-medium">{timeString || "19:20:00 IST"}</span>
          </div>
          <div className="w-px h-3.5 bg-white/15" />
          <span className="text-[11px] text-[#c09060]">
            RMD ENGINEERING COLLEGE
          </span>
        </div>

        {/* Right: Actions */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            title={isMuted ? "Enable Audio Feedback" : "Mute Audio Feedback"}
            className="p-2.5 rounded-full bg-[#181818] border border-white/15 text-[#c09060] hover:text-[#ffedd7] hover:border-[#dc5000]/50 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#a86048]" /> : <Volume2 className="w-4 h-4 text-[#dc5000]" />}
          </button>

          {/* Contact Trigger Link */}
          <a
            href={`mailto:${PORTFOLIO_DATA.profile.email}`}
            onClick={() => soundFx.playClick()}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181818] border border-white/15 text-[#ffedd7] hover:border-[#dc5000] transition-colors text-xs font-medium uppercase"
          >
            <Mail className="w-3.5 h-3.5 text-[#dc5000]" />
            <span>CONTACT</span>
          </a>

          {/* Dossier Primary Action Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDossier();
            }}
            className="btn-oryzo-primary text-xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#100904]" />
            <span>DOSSIER</span>
          </button>
        </div>
      </div>
    </header>
  );
}
