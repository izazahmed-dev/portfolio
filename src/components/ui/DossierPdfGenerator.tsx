"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import confetti from "canvas-confetti";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { soundFx } from "@/lib/audio";

interface DossierPdfGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DossierPdfGenerator({ isOpen, onClose }: DossierPdfGeneratorProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      soundFx.playDecrypt();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    soundFx.playClick();
    setDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          soundFx.playSuccess();
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore confetti error
          }
          window.print();
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 sm:p-6" data-lenis-prevent>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[36px] border border-white/15 bg-[#181818] text-[#ffedd7] p-6 sm:p-10 space-y-8"
        >
          {/* Top Actions */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#100904] border border-white/15 flex items-center justify-center text-[#dc5000]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="eyebrow-oryzo text-[#dc5000]">
                  OFFICIAL ACADEMIC DOSSIER // CLASS OF 2029
                </div>
                <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#ffedd7]">
                  Engineering Profile & Verified Credentials
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-oryzo-primary text-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? `COMPILING (${downloadProgress}%)` : "EXPORT / PRINT PDF"}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full border border-white/10 bg-[#100904] text-[#c09060] hover:text-[#ffedd7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Container */}
          <div className="printable-dossier bg-[#100904] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-8">
            {/* Header with Photo */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-white/10 pb-6">
              <div className="flex items-start gap-4">
                {/* Photo Thumbnail */}
                <div className="w-20 h-24 rounded-2xl overflow-hidden border-2 border-[#dc5000]/40 shrink-0 bg-[#181818] relative shadow-md hidden sm:block">
                  <img
                    src="/profile.jpg"
                    alt={PORTFOLIO_DATA.profile.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                </div>

                <div>
                  <div className="eyebrow-oryzo text-[#dc5000] mb-1">
                    VERIFIED CANDIDATE PROFILE // AUTONOMOUS AI SYSTEMS (CLASS OF 2029)
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-medium text-[#ffedd7] tracking-tight">
                    {PORTFOLIO_DATA.profile.name}
                  </h1>
                  <p className="text-[#c09060] text-sm mt-1 max-w-xl">
                    {PORTFOLIO_DATA.profile.tagline}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#c09060] font-mono">
                    <span className="flex items-center gap-1.5 text-[#ffedd7]">
                      <Mail className="w-3.5 h-3.5 text-[#dc5000]" />
                      {PORTFOLIO_DATA.profile.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#ffedd7]">
                      <Phone className="w-3.5 h-3.5 text-[#dc5000]" />
                      {PORTFOLIO_DATA.profile.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#a86048]" />
                      {PORTFOLIO_DATA.profile.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-white/15 rounded-2xl p-4 bg-[#181818] text-right font-mono text-xs space-y-1 sm:min-w-[200px] shrink-0">
                <div className="text-[#a86048] text-[10px]">REGISTRATION ID</div>
                <div className="font-bold text-[#ffedd7]">{PORTFOLIO_DATA.profile.registerNumber}</div>
                <div className="text-[#a86048] text-[10px] pt-1">GRADUATION HORIZON</div>
                <div className="text-[#dc5000] font-bold">CLASS OF 2029</div>
              </div>
            </div>

            {/* Academic Track Record */}
            <div className="space-y-4">
              <div className="eyebrow-oryzo text-[#dc5000] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                1. VERIFIED ACADEMIC BENCHMARKS
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PORTFOLIO_DATA.academics.map((acad) => (
                  <div
                    key={acad.id}
                    className="p-4 rounded-2xl border border-white/10 bg-[#181818] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#a86048]">{acad.period}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#dc5000]/10 text-[#dc5000] border border-[#dc5000]/30 font-bold">
                        {acad.gradeBadge.split("•")[0]}
                      </span>
                    </div>

                    <div>
                      <div className="text-2xl font-medium text-[#ffedd7]">{acad.score}</div>
                      <div className="text-xs font-semibold text-[#ffedd7] mt-0.5">{acad.institution}</div>
                      <div className="text-[11px] text-[#c09060] font-mono">{acad.degree}</div>
                    </div>

                    <div className="border-t border-white/10 pt-2 space-y-1">
                      {acad.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="font-mono text-[11px] text-[#c09060] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Honors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="eyebrow-oryzo text-[#dc5000]">
                  2. CORE TECHNICAL PROFICIENCIES
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-[#181818] space-y-3">
                  <div>
                    <div className="text-[11px] font-mono text-[#a86048]">PROGRAMMING LANGUAGES</div>
                    <div className="font-medium text-sm text-[#ffedd7] mt-1">Python • C++ • Java • TypeScript</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#a86048]">AI & ARCHITECTURES</div>
                    <div className="font-medium text-sm text-[#ffedd7] mt-1">
                      Oracle Certified Agentic AI • Autonomous Swarms • Vector Stores
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="eyebrow-oryzo text-[#dc5000]">
                  3. VERIFIED HONORS
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-[#181818] space-y-3">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <strong className="text-[#ffedd7] text-sm font-medium">Oracle Agentic AI Foundations Associate</strong>
                      <span className="font-mono text-[10px] text-[#dc5000]">103498358AAI26OFA</span>
                    </div>
                    <p className="text-xs text-[#c09060] mt-1">
                      Recognized by Oracle Corporation (July 30, 2026 – 2028). Autonomous multi-agent systems.
                    </p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between items-baseline">
                      <strong className="text-[#ffedd7] text-sm font-medium">ISTE Ramanujan Math National Finalist</strong>
                      <span className="font-mono text-[10px] text-[#c09060]">Level 3 Finalist</span>
                    </div>
                    <p className="text-xs text-[#c09060] mt-1">
                      Indian Society for Technical Education National Mathematical Competition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
