"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { soundFx } from "@/lib/audio";

interface FooterSectionProps {
  onOpenDossier: () => void;
  onOpenContact: () => void;
}

export function FooterSection({ onOpenDossier, onOpenContact }: FooterSectionProps) {
  return (
    <footer className="w-full bg-[#181818] border-t border-white/10 py-16 sm:py-20 px-6 sm:px-10">
      <div className="max-w-content mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Wordmark & Identity */}
          <div className="md:col-span-5 space-y-3">
            <div className="font-heading font-semibold text-2xl tracking-tight text-[#ffedd7]">
              IZAZ<span className="text-[#dc5000]">.AI</span>
            </div>
            <p className="text-xs text-[#c09060] max-w-sm leading-relaxed">
              Engineering autonomous AI agent swarms and high-performance neural workflows. Undergraduate Engineer (Batch 2025–2029) at RMD Engineering College.
            </p>
          </div>

          {/* Column 1: Navigation */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[11px] font-mono text-[#a86048] uppercase tracking-wider">
              NAVIGATION
            </div>
            <ul className="space-y-2 text-xs text-[#c09060]">
              <li>
                <a href="#hero" className="hover:text-[#ffedd7] transition-colors">
                  Intro
                </a>
              </li>
              <li>
                <a href="#product" className="hover:text-[#ffedd7] transition-colors">
                  Product
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#ffedd7] transition-colors">
                  Capabilities
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Verification */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[11px] font-mono text-[#a86048] uppercase tracking-wider">
              VERIFICATION
            </div>
            <ul className="space-y-2 text-xs text-[#c09060]">
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
                  ISTE Honors
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-mono text-[#a86048] uppercase tracking-wider">
              DIRECT DISPATCH
            </div>
            <div className="text-xs text-[#ffedd7] font-medium">
              {PORTFOLIO_DATA.profile.email}
            </div>
            <div className="text-xs text-[#c09060]">
              {PORTFOLIO_DATA.profile.phone}
            </div>
            <div className="text-xs text-[#a86048]">
              {PORTFOLIO_DATA.profile.location}
            </div>
          </div>
        </div>

        {/* Legal Line in 12px muted */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-[#a86048]">
          <div>
            © 2026 PEDDAPALEM IZAZ AHMED // B.TECH AIML (2025–2029) • RMD ENGINEERING COLLEGE
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>ANNA UNIVERSITY AFFILIATED</span>
            <span>•</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
