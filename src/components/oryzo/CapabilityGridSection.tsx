"use client";

import React from "react";
import { Bot, Cpu, Binary } from "lucide-react";

export function CapabilityGridSection() {
  const capabilities = [
    {
      icon: <Bot className="w-6 h-6 text-[#dc5000]" />,
      title: "AUTONOMOUS MULTI-AGENT SWARMS",
      sentence:
        "Deterministic task graphs, tool-calling pipelines, and self-healing reasoning chains.",
      tag: "ORACLE CERTIFIED",
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#dc5000]" />,
      title: "HIGH-THROUGHPUT ML PIPELINES",
      sentence:
        "Production data flows, feature engineering, and high-precision evaluation matrices.",
      tag: "CORIZO INTERN",
    },
    {
      icon: <Binary className="w-6 h-6 text-[#dc5000]" />,
      title: "MATHEMATICAL SYSTEM ARCHITECTURES",
      sentence:
        "ISTE National Ramanujan Finalist algorithms, numerical proofs, and low-latency logic.",
      tag: "NATIONAL LEVEL 3",
    },
  ];

  return (
    <section id="features" className="w-full py-24 sm:py-32 px-6 sm:px-10 bg-[#100904]">
      <div className="max-w-content mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="eyebrow-oryzo text-[#dc5000]">
            02 // CORE ENGINEERING CAPABILITIES
          </div>
          <h2 className="h2-oryzo text-[#ffedd7]">
            BUILT FOR SCALE AND DETERMINISTIC EXECUTION.
          </h2>
        </div>

        {/* 3 Concise Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => (
            <div
              key={index}
              className="surface-card p-8 flex flex-col justify-between border border-white/15 hover:border-[#dc5000]/60 transition-colors duration-200 group"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center">
                    {cap.icon}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-[#181818] border border-white/10 text-[#c09060]">
                    {cap.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-medium text-xl text-[#ffedd7] group-hover:text-[#dc5000] transition-colors leading-tight">
                    {cap.title}
                  </h3>
                  <p className="text-[#c09060] text-sm leading-relaxed">
                    {cap.sentence}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 text-[11px] font-mono text-[#a86048] flex justify-between items-center">
                <span>SYSTEM NODE 0{index + 1}</span>
                <span className="text-[#dc5000] font-bold">READY</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
