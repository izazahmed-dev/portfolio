"use client";

import React from "react";
import { ShieldCheck, Award, CheckCircle2, ChevronRight } from "lucide-react";
import { soundFx } from "@/lib/audio";

interface FeatureValueSectionProps {
  onOpenDossier: () => void;
}

export function FeatureValueSection({ onOpenDossier }: FeatureValueSectionProps) {
  return (
    <section className="w-full py-24 sm:py-32 px-6 sm:px-10 bg-[#100904] border-t border-white/10">
      <div className="max-w-content mx-auto space-y-24 sm:space-y-32">
        {/* ROW 1: Text Left / Visual Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="eyebrow-oryzo text-[#dc5000]">
              01 // CERTIFICATION & SPECIALIZATION
            </div>
            <h2 className="h2-oryzo text-[#ffedd7]">
              ORACLE CERTIFIED AGENTIC AI ARCHITECTURE.
            </h2>
            <p className="text-[#c09060] text-base leading-relaxed">
              Validated by Oracle Corporation for designing enterprise multi-agent workflows, autonomous memory graphs, and production vector architectures.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenDossier();
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#dc5000] hover:underline uppercase tracking-wider cursor-pointer"
              >
                <span>VIEW VERIFIED CREDENTIAL (ID: 103498358AAI26OFA)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="lg:col-span-6 surface-card p-8 border border-white/15 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#dc5000]/15 rounded-full blur-2xl" />
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#181818] border border-white/15 flex items-center justify-center text-[#dc5000]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#ffedd7]">Oracle Certified Foundations Associate</div>
                    <div className="text-[10px] text-[#c09060] font-mono">Oracle Corporation • July 30, 2026</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#dc5000] bg-[#dc5000]/10 px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                <div className="p-3 rounded-2xl bg-[#100904] border border-white/10">
                  <div className="text-[#a86048] text-[10px]">VERIFICATION HASH</div>
                  <div className="text-[#ffedd7] font-bold mt-0.5">103498358AAI26OFA</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#100904] border border-white/10">
                  <div className="text-[#a86048] text-[10px]">VALIDITY HORIZON</div>
                  <div className="text-[#ffedd7] font-bold mt-0.5">2026 – 2028</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Visual Left / Text Right (Flipped) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual */}
          <div className="lg:col-span-6 order-2 lg:order-1 surface-card p-8 border border-white/15 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#181818] border border-white/15 flex items-center justify-center text-[#dc5000]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#ffedd7]">Verified Academic Record</div>
                    <div className="text-[10px] text-[#c09060] font-mono">Batch 2025–2029 (Class of 2029)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#dc5000] bg-[#dc5000]/10 px-2 py-0.5 rounded-full">
                  9.375 CGPA
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-[#100904] border border-white/10 flex items-center justify-between">
                  <span className="text-[#c09060]">10TH SSC (SV CHILDREN'S)</span>
                  <span className="font-bold text-[#ffedd7]">95.83% (575/600)</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#100904] border border-white/10 flex items-center justify-between">
                  <span className="text-[#c09060]">12TH MPC (RAJU JUNIOR)</span>
                  <span className="font-bold text-[#ffedd7]">94.00% (940/1000)</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#100904] border border-white/10 flex items-center justify-between">
                  <span className="text-[#c09060]">B.TECH AIML (RMD ENGG)</span>
                  <span className="font-bold text-[#dc5000]">9.375 CGPA (0 ARREARS)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="eyebrow-oryzo text-[#dc5000]">
              02 // VERIFIED ACADEMIC TRACK RECORD
            </div>
            <h2 className="h2-oryzo text-[#ffedd7]">
              UNCOMPROMISED MATHEMATICAL & SYSTEM PERFORMANCE.
            </h2>
            <p className="text-[#c09060] text-base leading-relaxed">
              9.375 CGPA with zero arrears at RMD Engineering College, backed by 94.00% in Intermediate MPC and 95.83% in Secondary SSC.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenDossier();
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#dc5000] hover:underline uppercase tracking-wider cursor-pointer"
              >
                <span>INSPECT AUTHENTICATED MARKSHEETS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
