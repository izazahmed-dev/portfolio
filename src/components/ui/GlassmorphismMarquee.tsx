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
      icon: <Award className="w-6 h-6 text-[#dc5000]" />,
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
      icon: <Cpu className="w-6 h-6 text-[#dc5000]" />,
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
      icon: <Binary className="w-6 h-6 text-[#dc5000]" />,
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
      icon: <Bot className="w-6 h-6 text-[#dc5000]" />,
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
      icon: <Sparkles className="w-6 h-6 text-[#dc5000]" />,
      tags: ["Maths A&B: 289/300", "Physics: 144/150", "Chemistry: 147/150"],
    },
    {
      id: "ssc-10th",
      badge: "SECONDARY HONORS",
      title: "10th Standard SSC",
      subtitle: "SV Children's High School, Tirupati",
      highlight: "Maths: 98/100 • Science: 99/100",
      metric: "95.83%",
      metricLabel: "575 / 600 TOTAL",
      icon: <ShieldCheck className="w-6 h-6 text-[#dc5000]" />,
      tags: ["Mathematics: 98", "General Science: 99", "Social: 98"],
    },
    {
      id: "languages-stack",
      badge: "CORE PROFICIENCY",
      title: "Polyglot Systems Stack",
      subtitle: "Deterministic High-Performance Code",
      highlight: "Production Engineering Tooling",
      metric: "4+",
      metricLabel: "LANGUAGES",
      icon: <Code2 className="w-6 h-6 text-[#dc5000]" />,
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
      icon: <Brain className="w-6 h-6 text-[#dc5000]" />,
      tags: ["Swarm Theory", "Vector Indexing", "Function Calling", "Graph DB"],
    },
  ];

  // Duplicate for seamless infinite stream loop
  const duplicatedCards = [...marqueeCards, ...marqueeCards];

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-[#100904] select-none">
      {/* Subtle Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#dc5000]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-content mx-auto px-6 sm:px-10 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
        <div>
          <div className="eyebrow-oryzo flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dc5000] animate-ping" />
            CONTINUOUS STREAM // 3D GLASSMARQUEE
          </div>
          <h2 className="h2-oryzo text-[#ffedd7] mt-1">
            VERIFIED CREDENTIALS & CAPABILITIES
          </h2>
        </div>

        <div className="text-xs font-mono text-[#c09060] glass-pill px-4 py-2 rounded-full">
          HOVER TO PAUSE & FOCUS • 3D PARALLAX TILT
        </div>
      </div>

      {/* Infinite Horizontal Glass Stream Container */}
      <div className="relative w-full overflow-visible py-10">
        {/* Left / Right Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#100904] to-transparent z-30" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#100904] to-transparent z-30" />

        {/* Marquee Track */}
        <div className="animate-marquee flex gap-6 px-6">
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
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  opacity: isAnyHovered && !isThisHovered ? 0.45 : 1,
                  transform: isThisHovered ? "scale(1.06)" : "scale(1)",
                  zIndex: isThisHovered ? 40 : 1,
                }}
                className="w-[320px] sm:w-[360px] shrink-0 cursor-pointer relative"
              >
                <TiltCard
                  maxTilt={10}
                  scaleOnHover={1.02}
                  glare={true}
                  className="h-full p-6 sm:p-7 flex flex-col justify-between"
                  onClick={() => {
                    soundFx.playClick();
                    if (onInspect) onInspect(item.title);
                  }}
                >
                  <div className="space-y-4">
                    {/* Top Tag & Icon */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#100904]/80 border border-white/15 flex items-center justify-center shadow-inner">
                        {item.icon}
                      </div>

                      <span className="text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-full glass-pill text-[#ffedd7]">
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="font-syne text-xl font-bold text-[#ffedd7] tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#c09060] mt-1 font-medium">
                        {item.subtitle}
                      </p>
                      <div className="text-[11px] text-[#ffedd7]/80 font-mono mt-1">
                        {item.highlight}
                      </div>
                    </div>

                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-[#100904]/60 border border-white/10 text-[#ffedd7]/90 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Metric Bar */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-mono text-[#a86048] uppercase tracking-wider">
                        {item.metricLabel}
                      </div>
                      <div className="font-syne text-lg font-bold text-[#dc5000]">
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
