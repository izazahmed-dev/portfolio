"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, ShieldCheck } from "lucide-react";
import { soundFx } from "@/lib/audio";

interface PreloaderProps {
  progress: number;
  totalFrames: number;
  loadedFrames: number;
  isComplete: boolean;
  onEnter: () => void;
}

export function Preloader({
  progress,
  totalFrames,
  loadedFrames,
  isComplete,
  onEnter,
}: PreloaderProps) {
  const [dots, setDots] = useState("");
  const [bootStep, setBootStep] = useState(0);

  const bootLogs = [
    "ALLOCATING HIGH-DPI CANVAS MATRIX [2D CONTEXT]",
    "BUFFERING OPTICAL WEBP SEQUENCE [239 FRAMES]",
    "HYDRATING AGENTIC AI DOSSIER & VERIFIED METRICS",
    "ESTABLISHING SYSTEM NODE 01 // READY",
  ];

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    if (progress > 20) setBootStep(1);
    if (progress > 55) setBootStep(2);
    if (progress > 85) setBootStep(3);
    if (isComplete) {
      soundFx.playSuccess();
    }
  }, [progress, isComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#121418] px-6 text-[#F8FAFC]"
        >
          {/* Central brutalist container */}
          <div className="relative w-full max-w-md border border-[#282D37] bg-[#1A1D23] p-8 rounded-2xl shadow-2xl space-y-6">
            {/* Header Identity */}
            <div className="flex items-center justify-between border-b border-[#282D37] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E6FF00] animate-ping" />
                <span className="font-mono text-xs tracking-widest text-[#E6FF00] font-bold">
                  SYSTEM INITIALIZATION
                </span>
              </div>
              <span className="font-mono text-xs text-[#94A3B8] font-semibold">CLASS OF 2029</span>
            </div>

            {/* Subject info */}
            <div className="space-y-1">
              <div className="font-mono text-[10px] tracking-widest text-[#94A3B8] uppercase">
                ENGINEERING CANDIDATE
              </div>
              <div className="font-display text-2xl font-black tracking-tight text-white uppercase">
                PEDDAPALEM IZAZ AHMED
              </div>
              <div className="font-mono text-xs text-[#38BDF8] flex items-center gap-1.5 pt-0.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>AIML • RMD ENGINEERING COLLEGE</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#E6FF00]" />
                  DECODING ASSETS{dots}
                </span>
                <span className="text-white font-black text-sm">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-2 w-full bg-[#121418] rounded-full overflow-hidden p-0.5 border border-[#282D37]">
                <motion.div
                  className="h-full bg-[#E6FF00] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>

              <div className="flex justify-between font-mono text-[10px] text-[#64748B] pt-1">
                <span>FRAMES: {loadedFrames} / {totalFrames}</span>
                <span>STATUS: {loadedFrames === totalFrames ? "SYNCHRONIZED" : "DECODING"}</span>
              </div>
            </div>

            {/* Terminal telemetry log */}
            <div className="bg-[#121418] border border-[#282D37] rounded-xl p-3.5 font-mono text-[11px] space-y-1.5 text-[#94A3B8]">
              {bootLogs.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${
                    index <= bootStep ? "text-[#E6FF00]" : "text-[#64748B] opacity-40"
                  }`}
                >
                  <span className="text-[9px] text-[#64748B]">[{String(index + 1).padStart(2, "0")}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {/* Completion trigger */}
            {progress >= 100 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onEnter}
                className="w-full py-3.5 bg-[#E6FF00] text-black font-mono text-xs font-black tracking-widest uppercase rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                ENTER VERIFIED DOSSIER
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
