"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, ShieldCheck, Mail, Phone, MapPin, Sparkles } from "lucide-react";
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
      <div className="fixed inset-0 z-[9995] flex items-center justify-center p-3 sm:p-6" data-lenis-prevent>
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
          className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/12 bg-[#140b06] text-[#ffedd7] p-5 sm:p-8 space-y-6 shadow-2xl shadow-black/80"
        >
          {/* Top Actions */}
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0c0704] border border-white/12 flex items-center justify-center text-[#ff5700] shadow-inner">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="eyebrow-oryzo text-[#ff5700]">
                  OFFICIAL ACADEMIC DOSSIER // CLASS OF 2029
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#ffedd7]">
                  Engineering Profile & Verified Credentials
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-oryzo-primary text-xs cursor-pointer py-2 px-4"
              >
                <Download className="w-3.5 h-3.5 text-[#0c0704]" />
                <span className="font-mono">{downloading ? `COMPILING (${downloadProgress}%)` : "EXPORT / PRINT PDF"}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full border border-white/10 bg-[#0c0704] text-[#c89f82] hover:text-[#ffedd7] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Container */}
          <div className="printable-dossier bg-[#0c0704] border border-white/10 rounded-2xl p-5 sm:p-7 space-y-6">
            {/* Header with Photo */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-5 border-b border-white/8 pb-5">
              <div className="flex items-start gap-4">
                {/* Photo Thumbnail */}
                <div className="w-20 h-24 rounded-2xl overflow-hidden border border-white/15 shrink-0 bg-[#140b06] relative shadow-md hidden sm:block outline outline-1 outline-white/10">
                  <img
                    src="/profile.jpg"
                    alt={PORTFOLIO_DATA.profile.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div>
                  <div className="eyebrow-oryzo text-[#ff5700] mb-1">
                    VERIFIED CANDIDATE PROFILE // AUTONOMOUS AI SYSTEMS (CLASS OF 2029)
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#ffedd7] tracking-tight font-syne">
                    {PORTFOLIO_DATA.profile.name}
                  </h1>
                  <p className="text-[#c89f82] text-xs sm:text-sm mt-0.5 max-w-xl">
                    {PORTFOLIO_DATA.profile.tagline}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2.5 text-xs text-[#c89f82] font-mono">
                    <span className="flex items-center gap-1.5 text-[#ffedd7]">
                      <Mail className="w-3.5 h-3.5 text-[#ff5700]" />
                      {PORTFOLIO_DATA.profile.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#ffedd7] tabular-nums">
                      <Phone className="w-3.5 h-3.5 text-[#ff5700]" />
                      {PORTFOLIO_DATA.profile.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8a654e]" />
                      {PORTFOLIO_DATA.profile.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 rounded-2xl p-3.5 bg-[#140b06] text-right font-mono text-xs space-y-1 sm:min-w-[200px] shrink-0">
                <div className="text-[#8a654e] text-[10px]">REGISTRATION ID</div>
                <div className="font-bold text-[#ffedd7] tabular-nums">{PORTFOLIO_DATA.profile.registerNumber}</div>
                <div className="text-[#8a654e] text-[10px] pt-1">GRADUATION HORIZON</div>
                <div className="text-[#ff5700] font-bold">CLASS OF 2029</div>
              </div>
            </div>

            {/* Academic Track Record */}
            <div className="space-y-3.5">
              <div className="eyebrow-oryzo text-[#ff5700] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                1. VERIFIED ACADEMIC BENCHMARKS
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {PORTFOLIO_DATA.academics.map((acad) => (
                  <div
                    key={acad.id}
                    className="p-4 rounded-2xl border border-white/8 bg-[#140b06] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#8a654e] tabular-nums">{acad.period}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#ff5700]/10 text-[#ff5700] border border-[#ff5700]/30 font-bold">
                        {acad.gradeBadge.split("•")[0]}
                      </span>
                    </div>

                    <div>
                      <div className="text-xl font-bold text-[#ffedd7] font-syne tabular-nums">{acad.score}</div>
                      <div className="text-xs font-semibold text-[#ffedd7] mt-0.5">{acad.institution}</div>
                      <div className="text-[11px] text-[#c89f82] font-mono">{acad.degree}</div>
                    </div>

                    <div className="border-t border-white/8 pt-2 space-y-1">
                      {acad.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="font-mono text-[10px] text-[#c89f82] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5700]" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Honors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <div className="eyebrow-oryzo text-[#ff5700]">
                  2. CORE TECHNICAL PROFICIENCIES
                </div>
                <div className="p-4 rounded-2xl border border-white/8 bg-[#140b06] space-y-2.5">
                  <div>
                    <div className="text-[10px] font-mono text-[#8a654e]">PROGRAMMING LANGUAGES</div>
                    <div className="font-semibold text-xs text-[#ffedd7] mt-0.5">Python • C++ • Java • TypeScript</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#8a654e]">AI & ARCHITECTURES</div>
                    <div className="font-semibold text-xs text-[#ffedd7] mt-0.5">
                      Oracle Certified Agentic AI • Autonomous Swarms • Vector Stores
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="eyebrow-oryzo text-[#ff5700]">
                  3. VERIFIED HONORS
                </div>
                <div className="p-4 rounded-2xl border border-white/8 bg-[#140b06] space-y-2.5">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <strong className="text-[#ffedd7] text-xs font-semibold">Oracle Agentic AI Foundations Associate</strong>
                      <span className="font-mono text-[10px] text-[#ff5700] tabular-nums">103498358AAI26OFA</span>
                    </div>
                    <p className="text-[11px] text-[#c89f82] mt-0.5">
                      Recognized by Oracle Corporation (July 30, 2026 – 2028). Autonomous multi-agent systems.
                    </p>
                  </div>
                  <div className="border-t border-white/8 pt-2">
                    <div className="flex justify-between items-baseline">
                      <strong className="text-[#ffedd7] text-xs font-semibold">ISTE Ramanujan Math National Finalist</strong>
                      <span className="font-mono text-[10px] text-[#c89f82]">Level 3 Finalist</span>
                    </div>
                    <p className="text-[11px] text-[#c89f82] mt-0.5">
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

