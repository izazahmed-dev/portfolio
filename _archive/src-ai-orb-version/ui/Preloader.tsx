"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, ShieldCheck, Sparkles } from "lucide-react";
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
          exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0c0704] px-4 text-[#ffedd7]"
        >
          {/* Central brutalist glass container */}
          <div className="relative w-full max-w-md border border-white/12 bg-[#140b06] p-7 sm:p-8 rounded-3xl shadow-2xl shadow-black/80 space-y-5">
            {/* Header Identity */}
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff5700] animate-ping" />
                <span className="font-mono text-xs tracking-widest text-[#ff5700] font-bold">
                  SYSTEM INITIALIZATION
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#c89f82] font-medium">CLASS OF 2029</span>
            </div>

            {/* Subject info */}
            <div className="space-y-1">
              <div className="font-mono text-[10px] tracking-widest text-[#8a654e] uppercase">
                ENGINEERING CANDIDATE
              </div>
              <div className="font-syne text-xl sm:text-2xl font-bold tracking-tight text-[#ffedd7] uppercase">
                PEDDAPALEM IZAZ AHMED
              </div>
              <div className="font-mono text-xs text-[#ff5700] flex items-center gap-1.5 pt-0.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>AIML • RMD ENGINEERING COLLEGE</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-[#c89f82] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#ff5700]" />
                  DECODING ASSETS{dots}
                </span>
                <span className="text-[#ffedd7] font-bold text-sm tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-2 w-full bg-[#0c0704] rounded-full overflow-hidden p-0.5 border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ff5700] to-[#eb4e00] rounded-full shadow-sm shadow-[#ff5700]/50"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.1 }}
                />
              </div>

              <div className="flex justify-between font-mono text-[10px] text-[#8a654e] pt-0.5 tabular-nums">
                <span>FRAMES: {loadedFrames} / {totalFrames}</span>
                <span>STATUS: {loadedFrames === totalFrames ? "SYNCHRONIZED" : "DECODING"}</span>
              </div>
            </div>

            {/* Terminal telemetry log */}
            <div className="bg-[#0c0704] border border-white/8 rounded-2xl p-3.5 font-mono text-[11px] space-y-1 text-[#c89f82]">
              {bootLogs.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${
                    index <= bootStep ? "text-[#ff5700]" : "text-[#8a654e] opacity-40"
                  }`}
                >
                  <span className="text-[9px] text-[#8a654e]">[{String(index + 1).padStart(2, "0")}]</span>
                  <span className="truncate">{log}</span>
                </div>
              ))}
            </div>

            {/* Completion trigger */}
            {progress >= 100 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onEnter}
                className="w-full py-3.5 btn-oryzo-primary font-mono text-xs font-bold tracking-widest uppercase rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#0c0704]" />
                <span>ENTER VERIFIED DOSSIER</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

