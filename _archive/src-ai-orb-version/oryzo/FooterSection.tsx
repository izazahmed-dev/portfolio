"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { soundFx } from "@/lib/audio";
import { ShieldCheck, Award, Sparkles, Mail, Phone, MapPin } from "lucide-react";

interface FooterSectionProps {
  onOpenDossier: () => void;
  onOpenContact: () => void;
}

export function FooterSection({ onOpenDossier, onOpenContact }: FooterSectionProps) {
  return (
    <footer className="w-full bg-[#0c0704] border-t border-white/8 py-14 sm:py-18 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Left Wordmark & Identity */}
          <div className="md:col-span-5 space-y-3">
            <div className="font-syne font-bold text-2xl tracking-tight text-[#ffedd7]">
              IZAZ<span className="text-[#ff5700]">.AI</span>
            </div>
            <p className="text-xs text-[#c89f82] max-w-sm leading-relaxed">
              Engineering autonomous AI agent swarms and high-performance neural workflows. Undergraduate Engineer (Batch 2025–2029) at RMD Engineering College.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#ff5700]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>9.375 CGPA • ORACLE CERTIFIED</span>
            </div>
          </div>

          {/* Column 1: Navigation */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="text-[11px] font-mono text-[#8a654e] uppercase tracking-wider">
              NAVIGATION
            </div>
            <ul className="space-y-2 text-xs text-[#c89f82]">
              <li>
                <a href="#hero" className="hover:text-[#ffedd7] transition-colors">
                  Intro // Act I
                </a>
              </li>
              <li>
                <a href="#product" className="hover:text-[#ffedd7] transition-colors">
                  Swarm Engine
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#ffedd7] transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#ffedd7] transition-colors">
                  Dispatch
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Verification */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="text-[11px] font-mono text-[#8a654e] uppercase tracking-wider">
              VERIFICATION
            </div>
            <ul className="space-y-2 text-xs text-[#c89f82]">
              <li>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenDossier();
                  }}
                  className="hover:text-[#ffedd7] transition-colors text-left cursor-pointer"
                >
                  Oracle Cert Hash
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenDossier();
                  }}
                  className="hover:text-[#ffedd7] transition-colors text-left cursor-pointer"
                >
                  Academic Dossier
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenDossier();
                  }}
                  className="hover:text-[#ffedd7] transition-colors text-left cursor-pointer"
                >
                  ISTE Ramanujan Math
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="text-[11px] font-mono text-[#8a654e] uppercase tracking-wider">
              DIRECT DISPATCH
            </div>
            <div className="text-xs text-[#ffedd7] font-medium font-mono">
              {PORTFOLIO_DATA.profile.email}
            </div>
            <div className="text-xs text-[#c89f82] font-mono tabular-nums">
              {PORTFOLIO_DATA.profile.phone}
            </div>
            <div className="text-xs text-[#8a654e]">
              {PORTFOLIO_DATA.profile.location}
            </div>
          </div>
        </div>

        {/* Legal Line */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[#8a654e] font-mono">
          <div>
            © 2026 PEDDAPALEM IZAZ AHMED // B.TECH AIML (2025–2029) • RMD ENGINEERING COLLEGE
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span>ANNA UNIVERSITY AFFILIATED</span>
            <span>•</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

