"use client";

import React, { useState } from "react";
import { Code2, Bot, Briefcase, ChevronRight, Terminal } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { soundFx } from "@/lib/audio";

interface Act2NodesProps {
  opacity: number;
  y: number;
  onOpenDossier: () => void;
}

export function Act2Nodes({ opacity, y, onOpenDossier }: Act2NodesProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  if (opacity <= 0.01) return null;

  const nodeIcons = [
    <Code2 key="1" className="w-5 h-5 text-[#ff5700]" />,
    <Bot key="2" className="w-5 h-5 text-[#ff5700]" />,
    <Briefcase key="3" className="w-5 h-5 text-[#ff5700]" />,
  ];

  return (
    <div
      style={{
        opacity,
        transform: `translate3d(0, ${y}px, 0)`,
        transition: "opacity 0.05s linear",
      }}
      className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none z-20"
    >
      <div className="max-w-6xl w-full mx-auto space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="eyebrow-oryzo text-[#ff5700] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5700] animate-pulse" />
              ACT II // SPECIALIZATION & 3D SYSTEM NODES
            </div>
            <h2 className="h2-oryzo text-[#ffedd7] mt-1">
              SYSTEM ARCHITECTURES & WORKFLOWS
            </h2>
          </div>

          <div className="text-xs text-[#c89f82] font-mono glass-pill px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            INTERACTIVE 3D TILT • HOVER TO FOCUS
          </div>
        </div>

        {/* 3 Glassmorphism Parallax Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pointer-events-auto">
          {PORTFOLIO_DATA.nodes.map((node, index) => {
            const isThisHovered = hoveredCard === index;
            const isAnyHovered = hoveredCard !== null;

            return (
              <div
                key={node.id}
                onMouseEnter={() => {
                  setHoveredCard(index);
                  soundFx.playHover();
                }}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transition: "opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                  opacity: isAnyHovered && !isThisHovered ? 0.45 : 1,
                  transform: isThisHovered ? "scale(1.02)" : "scale(1)",
                }}
              >
                <TiltCard
                  maxTilt={10}
                  scaleOnHover={1.02}
                  glare={true}
                  className="flex flex-col justify-between p-6 sm:p-7 h-full rounded-3xl"
                >
                  <div className="space-y-4 sm:space-y-5">
                    {/* Top Badge & Node Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#0c0704]/80 border border-white/12 flex items-center justify-center shadow-inner">
                          {nodeIcons[index]}
                        </div>
                        <span className="text-xs font-mono font-bold text-[#c89f82] tracking-wider">
                          NODE {node.number}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono tracking-wider px-3 py-1 rounded-full glass-pill text-[#ffedd7]">
                        {node.badge}
                      </span>
                    </div>

                    {/* Node Title & Description */}
                    <div>
                      <h3 className="font-syne font-bold text-lg sm:text-xl text-[#ffedd7] tracking-tight">
                        {node.title}
                      </h3>
                      <p className="text-[#c89f82] text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                        {node.description}
                      </p>
                    </div>

                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {node.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#0c0704]/70 border border-white/8 text-[#ffedd7] font-medium font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Bottom Row */}
                  <div className="mt-5 pt-4 border-t border-white/8 grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                    {node.metrics.map((m, i) => (
                      <div key={i} className="p-2 rounded-xl bg-[#0c0704]/60 border border-white/5">
                        <div className="text-[#8a654e] text-[9px] truncate">{m.label}</div>
                        <div className="font-bold text-[#ffedd7] tabular-nums truncate mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Action Prompt */}
        <div className="flex justify-center pt-2 pointer-events-auto">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenDossier();
            }}
            className="text-xs text-[#c89f82] hover:text-[#ff5700] active:scale-[0.96] transition-all flex items-center gap-1.5 group font-medium cursor-pointer glass-pill px-5 py-2.5 rounded-full shadow-md"
          >
            <span>VIEW VERIFIED CREDENTIALS & ORACLE AGENTIC AI HASH</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#ff5700]" />
          </button>
        </div>
      </div>
    </div>
  );
}

