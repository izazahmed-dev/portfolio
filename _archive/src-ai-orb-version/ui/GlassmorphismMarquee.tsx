"use client";

import React, { useState } from "react";
import { Award, ShieldCheck, Sparkles, Binary, Bot, Cpu, Code2, Brain } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { soundFx } from "@/lib/audio";

interface MarqueeCardItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  highlight: string;
  metric: string;
  metricLabel: string;
  icon: React.ReactNode;
  tags: string[];
}

export function GlassmorphismMarquee({
  onInspect,
}: {
  onInspect?: (title: string) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const marqueeCards: MarqueeCardItem[] = [
    {
      id: "oracle-ai",
      badge: "ORACLE CERTIFIED",
      title: "Agentic AI Architect",
      subtitle: "Autonomous Swarms & Tool Chains",
      highlight: "Cert ID: 103498358AAI26OFA",
      metric: "100%",
      metricLabel: "VERIFIED HASH",
      icon: <Award className="w-5 h-5 text-[#ff5700]" />,
      tags: ["Multi-Agent Swarms", "RAG", "Vector Stores", "Oracle 2026–2028"],
    },
    {
      id: "btech-aiml",
      badge: "CLASS OF 2029",
      title: "B.Tech AI & ML",
      subtitle: "RMD Engineering College (Anna Univ)",
      highlight: "Academic Tenure: 2025–2029",
      metric: "9.375",
      metricLabel: "CGPA • 0 ARREARS",
      icon: <Cpu className="w-5 h-5 text-[#ff5700]" />,
      tags: ["Autonomous Systems", "Data Structures", "OOP", "Neural Architectures"],
    },
    {
      id: "iste-math",
      badge: "NATIONAL FINALIST",
      title: "ISTE Ramanujan Math",
      subtitle: "Srinivasa Ramanujan National Competition",
      highlight: "Level 3 National Level Finalist",
      metric: "TOP 1%",
      metricLabel: "NATIONAL BENCHMARK",
      icon: <Binary className="w-5 h-5 text-[#ff5700]" />,
      tags: ["Discrete Algorithms", "Numerical Proofs", "Calculus", "Optimization"],
    },
    {
      id: "corizo-intern",
      badge: "INDUSTRY EXPERIENCE",
      title: "ML Engineering Intern",
      subtitle: "Corizo Edu Tech Systems",
      highlight: "Production Model Pipelines",
      metric: "2026",
      metricLabel: "ACTIVE TENURE",
      icon: <Bot className="w-5 h-5 text-[#ff5700]" />,
      tags: ["Scikit-Learn", "Model Training", "Data Cleaning", "Evaluation"],
    },
    {
      id: "inter-mpc",
      badge: "AP STATE BOARD",
      title: "Intermediate 12th MPC",
      subtitle: "Raju Junior College, Tirupati",
      highlight: "100% Practicals (60/60) • Grade A",
      metric: "94.00%",
      metricLabel: "940 / 1000 TOTAL",
      icon: <Sparkles className="w-5 h-5 text-[#ff5700]" />,
      tags: ["Maths A&B: 288/300", "Physics: 144/150", "Chemistry: 140/150"],
    },
    {
      id: "ssc-10th",
      badge: "SECONDARY HONORS",
      title: "10th Standard SSC",
      subtitle: "SV Children's High School, Tirupati",
      highlight: "Maths: 98/100 • Science: 99/100",
      metric: "95.83%",
      metricLabel: "575 / 600 TOTAL",
      icon: <ShieldCheck className="w-5 h-5 text-[#ff5700]" />,
      tags: ["Mathematics: 98", "General Science: 99", "Social: 96"],
    },
    {
      id: "languages-stack",
      badge: "CORE PROFICIENCY",
      title: "Polyglot Systems Stack",
      subtitle: "Deterministic High-Performance Code",
      highlight: "Production Engineering Tooling",
      metric: "4+",
      metricLabel: "LANGUAGES",
      icon: <Code2 className="w-5 h-5 text-[#ff5700]" />,
      tags: ["Python", "C++", "Java", "TypeScript", "VS Code"],
    },
    {
      id: "agentic-swarms",
      badge: "RESEARCH FOCUS",
      title: "Autonomous Reasoning",
      subtitle: "Self-Healing Memory & Dynamic Tooling",
      highlight: "Deterministic Execution Graphs",
      metric: "24/7",
      metricLabel: "AUTONOMOUS OPS",
      icon: <Brain className="w-5 h-5 text-[#ff5700]" />,
      tags: ["Swarm Theory", "Vector Indexing", "Function Calling", "Graph DB"],
    },
  ];

  const duplicatedCards = [...marqueeCards, ...marqueeCards];

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden bg-[#0c0704] select-none border-t border-white/6">
      {/* Subtle Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#ff5700]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 relative z-10">
        <div>
          <div className="eyebrow-oryzo flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff5700] animate-ping" />
            CONTINUOUS STREAM // 3D GLASSMARQUEE
          </div>
          <h2 className="h2-oryzo text-[#ffedd7] mt-1">
            VERIFIED CREDENTIALS & CAPABILITIES
          </h2>
        </div>

        <div className="text-xs font-mono text-[#c89f82] glass-pill px-3.5 py-1.5 rounded-full self-start sm:self-auto">
          HOVER TO PAUSE • 3D PARALLAX TILT
        </div>
      </div>

      {/* Infinite Horizontal Glass Stream Container */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left / Right Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#0c0704] to-transparent z-30" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#0c0704] to-transparent z-30" />

        {/* Marquee Track */}
        <div className="animate-marquee flex gap-5 px-4">
          {duplicatedCards.map((item, idx) => {
            const isThisHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <div
                key={`${item.id}-${idx}`}
                onMouseEnter={() => {
                  setHoveredIndex(idx);
                  soundFx.playHover();
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transition: "opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                  opacity: isAnyHovered && !isThisHovered ? 0.45 : 1,
                  transform: isThisHovered ? "scale(1.03)" : "scale(1)",
                  zIndex: isThisHovered ? 40 : 1,
                }}
                className="w-[300px] sm:w-[340px] shrink-0 cursor-pointer relative"
              >
                <TiltCard
                  maxTilt={10}
                  scaleOnHover={1.02}
                  glare={true}
                  className="h-full p-5 sm:p-6 flex flex-col justify-between rounded-3xl"
                  onClick={() => {
                    soundFx.playClick();
                    if (onInspect) onInspect(item.title);
                  }}
                >
                  <div className="space-y-3.5">
                    {/* Top Tag & Icon */}
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-[#0c0704]/80 border border-white/12 flex items-center justify-center shadow-inner">
                        {item.icon}
                      </div>

                      <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full glass-pill text-[#ffedd7]">
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="font-syne text-lg sm:text-xl font-bold text-[#ffedd7] tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#c89f82] mt-0.5 font-medium">
                        {item.subtitle}
                      </p>
                      <div className="text-[11px] text-[#ffedd7]/75 font-mono mt-1">
                        {item.highlight}
                      </div>
                    </div>

                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[#0c0704]/60 border border-white/8 text-[#ffedd7]/90 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Metric Bar */}
                  <div className="mt-5 pt-3.5 border-t border-white/8 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-mono text-[#8a654e] uppercase tracking-wider">
                        {item.metricLabel}
                      </div>
                      <div className="font-syne text-base sm:text-lg font-bold text-[#ff5700] tabular-nums">
                        {item.metric}
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-[#ffedd7]/70 glass-pill px-2.5 py-1 rounded-full">
                      DETAILS ↗
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

