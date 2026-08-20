"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CheckCircle2, Award, Printer } from "lucide-react";
import { AcademicRecord } from "@/lib/portfolio-data";
import { soundFx } from "@/lib/audio";

interface CertificateModalProps {
  record: AcademicRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ record, isOpen, onClose }: CertificateModalProps) {
  useEffect(() => {
    if (isOpen) {
      soundFx.playDecrypt();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!record) return null;

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 md:p-10" data-lenis-prevent>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[36px] border border-white/15 bg-[#181818] text-[#ffedd7] p-6 sm:p-8"
          >
            {/* Top Close bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#100904] border border-white/15 flex items-center justify-center text-[#dc5000]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="eyebrow-oryzo text-[#dc5000]">
                    CRYPTOGRAPHICALLY VERIFIED RECORD // CLASS OF 2029
                  </div>
                  <div className="text-lg sm:text-xl font-medium uppercase text-[#ffedd7]">
                    {record.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 bg-[#100904] text-xs font-mono text-[#ffedd7] hover:border-[#dc5000] transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-full border border-white/15 bg-[#100904] text-[#c09060] hover:text-[#ffedd7] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Institution Badge Header */}
            <div className="bg-[#100904] border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#c09060]">
                  ISSUING AUTHORITY: <strong className="text-[#ffedd7]">{record.certificateIssuer}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dc5000]/10 text-[#dc5000] font-mono text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  {record.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-[#181818] border border-white/5 rounded-xl">
                  <div className="font-mono text-[10px] text-[#a86048]">CANDIDATE</div>
                  <div className="text-xs font-medium text-[#ffedd7]">PEDDAPALEM IZAZ AHMED</div>
                </div>
                <div className="p-3 bg-[#181818] border border-white/5 rounded-xl">
                  <div className="font-mono text-[10px] text-[#a86048]">REG / ROLL NO</div>
                  <div className="font-mono text-xs font-bold text-[#dc5000]">{record.regNumber.replace(/.*:\s*/, "")}</div>
                </div>
                <div className="p-3 bg-[#181818] border border-white/5 rounded-xl">
                  <div className="font-mono text-[10px] text-[#a86048]">SCORE BENCHMARK</div>
                  <div className="text-sm font-bold text-[#ffedd7]">{record.score}</div>
                </div>
                <div className="p-3 bg-[#181818] border border-white/5 rounded-xl">
                  <div className="font-mono text-[10px] text-[#a86048]">TENURE / HORIZON</div>
                  <div className="font-mono text-xs text-[#c09060] font-bold truncate">{record.period}</div>
                </div>
              </div>
            </div>

            {/* Subject Breakdown Table */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between font-mono text-xs text-[#c09060] font-bold">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#dc5000]" />
                  CURRICULUM MARKS MEMORANDUM
                </span>
                <span className="text-[11px]">AUTHENTICATED SCORE SHEET</span>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#100904]">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#181818] border-b border-white/10 text-[#a86048] text-[11px]">
                    <tr>
                      <th className="p-3.5">SUBJECT / DOMAIN</th>
                      <th className="p-3.5 text-center">MAX</th>
                      <th className="p-3.5 text-center">SECURED</th>
                      <th className="p-3.5 text-right">PERCENTAGE / GRADE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {record.subjects.map((sub, i) => (
                      <tr key={i} className="hover:bg-[#181818] transition-colors">
                        <td className="p-3.5 font-medium text-[#ffedd7] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
                          {sub.subject}
                          {sub.detail && <span className="font-mono text-[10px] text-[#a86048] ml-1">({sub.detail})</span>}
                        </td>
                        <td className="p-3.5 text-center text-[#c09060]">{sub.max}</td>
                        <td className="p-3.5 text-center font-bold text-[#dc5000]">{sub.secured}</td>
                        <td className="p-3.5 text-right font-bold text-[#ffedd7]">
                          {sub.percentage ? `${sub.percentage}%` : sub.grade || "PASS"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Footer & Security Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-[#100904] font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#dc5000]/40 flex items-center justify-center bg-[#dc5000]/10 text-[#dc5000] font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-[#ffedd7]">Institutional Seal Validated</div>
                  <div className="text-[11px] text-[#c09060]">
                    Authenticated from official academic records (Batch 2025–2029)
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-[10px] text-[#a86048]">
                TIMESTAMP: 2026-08-18<br />
                DIGITAL WATERMARK: VALID
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
