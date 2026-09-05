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
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 md:p-10" data-lenis-prevent>
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
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/12 bg-[#140b06] text-[#ffedd7] p-5 sm:p-8 shadow-2xl shadow-black/80"
          >
            {/* Top Close bar */}
            <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0c0704] border border-white/12 flex items-center justify-center text-[#ff5700] shadow-inner">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="eyebrow-oryzo text-[#ff5700]">
                    CRYPTOGRAPHICALLY VERIFIED RECORD // CLASS OF 2029
                  </div>
                  <div className="text-base sm:text-lg font-bold uppercase text-[#ffedd7]">
                    {record.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0c0704] text-xs font-mono text-[#ffedd7] hover:border-[#ff5700] transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full border border-white/10 bg-[#0c0704] text-[#c89f82] hover:text-[#ffedd7] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Institution Badge Header */}
            <div className="bg-[#0c0704] border border-white/8 rounded-2xl p-4 sm:p-5 mb-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#c89f82]">
                  ISSUING AUTHORITY: <strong className="text-[#ffedd7]">{record.certificateIssuer}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5700]/10 text-[#ff5700] font-mono text-[11px] font-bold border border-[#ff5700]/30">
                  <CheckCircle2 className="w-3 h-3" />
                  {record.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 bg-[#140b06] border border-white/5 rounded-xl">
                  <div className="font-mono text-[10px] text-[#8a654e]">CANDIDATE</div>
                  <div className="text-xs font-semibold text-[#ffedd7]">PEDDAPALEM IZAZ AHMED</div>
                </div>
                <div className="p-3 bg-[#140b06] border border-white/5 rounded-xl">
                  <div className="font-mono text-[10px] text-[#8a654e]">REG / ROLL NO</div>
                  <div className="font-mono text-xs font-bold text-[#ff5700] tabular-nums">{record.regNumber.replace(/.*:\s*/, "")}</div>
                </div>
                <div className="p-3 bg-[#140b06] border border-white/5 rounded-xl">
                  <div className="font-mono text-[10px] text-[#8a654e]">SCORE BENCHMARK</div>
                  <div className="text-sm font-bold text-[#ffedd7] tabular-nums">{record.score}</div>
                </div>
                <div className="p-3 bg-[#140b06] border border-white/5 rounded-xl">
                  <div className="font-mono text-[10px] text-[#8a654e]">TENURE / HORIZON</div>
                  <div className="font-mono text-xs text-[#c89f82] font-bold truncate tabular-nums">{record.period}</div>
                </div>
              </div>
            </div>

            {/* Subject Breakdown Table */}
            <div className="space-y-2.5 mb-5">
              <div className="flex items-center justify-between font-mono text-xs text-[#c89f82] font-bold">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#ff5700]" />
                  CURRICULUM MARKS MEMORANDUM
                </span>
                <span className="text-[11px] text-[#8a654e]">AUTHENTICATED SCORE SHEET</span>
              </div>

              <div className="border border-white/8 rounded-2xl overflow-hidden bg-[#0c0704]">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#140b06] border-b border-white/8 text-[#8a654e] text-[11px]">
                    <tr>
                      <th className="p-3 sm:p-3.5">SUBJECT / DOMAIN</th>
                      <th className="p-3 sm:p-3.5 text-center">MAX</th>
                      <th className="p-3 sm:p-3.5 text-center">SECURED</th>
                      <th className="p-3 sm:p-3.5 text-right">PERCENTAGE / GRADE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {record.subjects.map((sub, i) => (
                      <tr key={i} className="hover:bg-[#140b06]/60 transition-colors">
                        <td className="p-3 sm:p-3.5 font-medium text-[#ffedd7] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5700]" />
                          {sub.subject}
                          {sub.detail && <span className="font-mono text-[10px] text-[#8a654e] ml-1">({sub.detail})</span>}
                        </td>
                        <td className="p-3 sm:p-3.5 text-center text-[#c89f82] tabular-nums">{sub.max}</td>
                        <td className="p-3 sm:p-3.5 text-center font-bold text-[#ff5700] tabular-nums">{sub.secured}</td>
                        <td className="p-3 sm:p-3.5 text-right font-bold text-[#ffedd7] tabular-nums">
                          {sub.percentage ? `${sub.percentage}%` : sub.grade || "PASS"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Footer & Security Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-white/8 bg-[#0c0704] font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#ff5700]/40 flex items-center justify-center bg-[#ff5700]/10 text-[#ff5700] font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-[#ffedd7]">Institutional Seal Validated</div>
                  <div className="text-[11px] text-[#c89f82]">
                    Authenticated from official academic records (Batch 2025–2029)
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-[10px] text-[#8a654e]">
                AUTHENTICATED DOSSIER<br />
                DIGITAL WATERMARK: VALID
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

