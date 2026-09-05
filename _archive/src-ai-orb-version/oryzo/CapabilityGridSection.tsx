"use client";

import React from "react";
import { Bot, Cpu, Binary, Layers, Terminal, Sparkles } from "lucide-react";
import { soundFx } from "@/lib/audio";

export function CapabilityGridSection() {
  const capabilities = [
    {
      icon: <Bot className="w-5 h-5 text-[#ff5700]" />,
      title: "AUTONOMOUS MULTI-AGENT SWARMS",
      sentence:
        "Deterministic task graphs, tool-calling pipelines, and self-healing reasoning chains with vector state persistence.",
      tag: "ORACLE CERTIFIED",
      stack: ["Oracle Agentic AI", "Task Planning", "Vector Graphs", "RAG"],
      metric: "100%",
      metricLabel: "VERIFIED ARCHITECTURE",
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#ff5700]" />,
      title: "HIGH-THROUGHPUT ML PIPELINES",
      sentence:
        "Production exploratory data analysis, feature engineering, and high-precision evaluation matrices from Corizo Edu Tech.",
      tag: "CORIZO ML INTERN",
      stack: ["Python", "Scikit-Learn", "Model Training", "Pipeline Automation"],
      metric: "2024–2026",
      metricLabel: "INDUSTRY EXPERIENCE",
    },
    {
      icon: <Binary className="w-5 h-5 text-[#ff5700]" />,
      title: "MATHEMATICAL SYSTEM ARCHITECTURES",
      sentence:
        "ISTE National Ramanujan Finalist algorithms, numerical proofs, linear algebra, and low-latency systems in C++/Java.",
      tag: "NATIONAL LEVEL 3",
      stack: ["ISTE Finalist", "Linear Algebra", "Calculus", "C++ / Java Systems"],
      metric: "TOP 1%",
      metricLabel: "NATIONAL BENCHMARK",
    },
  ];

  return (
    <section id="features" className="w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#0c0704]">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="space-y-3.5 max-w-3xl">
          <div className="eyebrow-oryzo text-[#ff5700]">
            02 // CORE ENGINEERING CAPABILITIES
          </div>
          <h2 className="h2-oryzo text-[#ffedd7]">
            BUILT FOR SCALE AND DETERMINISTIC EXECUTION.
          </h2>
          <p className="text-[#c89f82] text-sm sm:text-base leading-relaxed">
            Specialized engineering capabilities across autonomous agents, deep learning pipelines, and verified mathematical architectures.
          </p>
        </div>

        {/* 3 Concise Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {capabilities.map((cap, index) => (
            <div
              key={index}
              onMouseEnter={() => soundFx.playHover()}
              className="surface-card p-6 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-[#ff5700]/50 transition-all duration-300 group rounded-3xl"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#0c0704] border border-white/12 flex items-center justify-center shadow-inner">
                    {cap.icon}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-[#0c0704] border border-white/10 text-[#c89f82]">
                    {cap.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-syne font-bold text-lg sm:text-xl text-[#ffedd7] group-hover:text-[#ff5700] transition-colors leading-tight">
                    {cap.title}
                  </h3>
                  <p className="text-[#c89f82] text-xs sm:text-sm leading-relaxed">
                    {cap.sentence}
                  </p>
                </div>

                {/* Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cap.stack.map((item, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#0c0704]/70 border border-white/8 text-[#ffedd7]/90 font-mono"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/8 text-[11px] font-mono text-[#8a654e] flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#8a654e] block">{cap.metricLabel}</span>
                  <span className="font-bold text-[#ff5700] tabular-nums">{cap.metric}</span>
                </div>
                <span className="text-white/40 text-[10px]">NODE 0{index + 1} // ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

