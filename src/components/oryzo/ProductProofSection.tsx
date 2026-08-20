"use client";

import React from "react";
import { Terminal, ShieldCheck, Cpu, Sparkles, CheckCircle2, Code2 } from "lucide-react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export function ProductProofSection() {
  return (
    <section id="product" className="w-full py-24 sm:py-32 px-6 sm:px-10 bg-[#100904]">
      <div className="max-w-content mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="eyebrow-oryzo text-[#dc5000]">
            01 // PRODUCT PROOF & REASONING ENGINE
          </div>
          <h2 className="h2-oryzo text-[#ffedd7]">
            AUTONOMOUS AGENT ORCHESTRATION IN REAL TIME.
          </h2>
          <p className="text-[#c09060] text-base leading-relaxed">
            A production agentic loop executing deterministic tool calls, self-healing memory contexts, and verified algorithmic workflows.
          </p>
        </div>

        {/* Large Framed Product / Terminal Demo Mock */}
        <div className="relative surface-card p-6 sm:p-10 border border-white/15 overflow-hidden">
          {/* Ambient Warm Gradient inside Mock */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#dc5000]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Terminal Window Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#603018]" />
              <div className="w-3 h-3 rounded-full bg-[#a86048]" />
              <div className="w-3 h-3 rounded-full bg-[#dc5000]" />
              <span className="text-xs font-mono text-[#c09060] ml-2">
                swarm_orchestrator.py — Peddapalem Izaz Ahmed
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#a86048]">
              <span className="w-2 h-2 rounded-full bg-[#dc5000] animate-ping" />
              <span>STATUS: 200 OK</span>
            </div>
          </div>

          {/* Code & Agent Execution Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
            {/* Left: Code stream */}
            <div className="lg:col-span-7 space-y-3 text-[#ffedd7]/80">
              <div className="text-[#a86048]"># Initialize Oracle Certified Multi-Agent Swarm (July 30, 2026)</div>
              <div>
                <span className="text-[#dc5000]">from</span> agentic_core <span className="text-[#dc5000]">import</span> SwarmEngine, MemoryVectorGraph
              </div>
              <div>
                <span className="text-[#dc5000]">class</span> <span className="text-[#ffedd7] font-bold">AutonomousSystem</span>:
              </div>
              <div className="pl-4">
                <span className="text-[#c09060]">candidate_id</span> = <span className="text-[#ffedd7]">"111525203076"</span> # RMD Engineering College
              </div>
              <div className="pl-4">
                <span className="text-[#c09060]">cert_hash</span> = <span className="text-[#ffedd7]">"103498358AAI26OFA"</span> # Oracle Foundations Associate
              </div>
              <div className="pl-4">
                <span className="text-[#c09060]">cgpa_benchmark</span> = <span className="text-[#dc5000]">9.375</span> # Zero Arrears Track Record
              </div>
              <div className="pl-4">
                <span className="text-[#dc5000]">def</span> <span className="text-[#ffedd7]">execute_task_pipeline</span>(self, telemetry_payload):
              </div>
              <div className="pl-8 text-[#c09060]">
                reasoning_tree = self.swarm.evaluate(telemetry_payload)
              </div>
              <div className="pl-8 text-[#ffedd7]">
                <span className="text-[#dc5000]">return</span> reasoning_tree.dispatch(status=<span className="text-[#dc5000]">"SUCCESS"</span>)
              </div>
            </div>

            {/* Right: Live Telemetry Output Card */}
            <div className="lg:col-span-5 bg-[#100904] border border-white/10 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#c09060]">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#dc5000]" />
                  TELEMETRY DISPATCH
                </span>
                <span className="text-[#dc5000] font-bold">VERIFIED</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between">
                  <span className="text-[#a86048]">ACADEMIC TENURE</span>
                  <span className="font-bold text-[#ffedd7]">2025–2029 (CLASS OF 2029)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between">
                  <span className="text-[#a86048]">INSTITUTION</span>
                  <span className="font-bold text-[#ffedd7]">RMD ENGG COLLEGE</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between">
                  <span className="text-[#a86048]">ORACLE CERTIFICATION</span>
                  <span className="font-bold text-[#dc5000]">103498358AAI26OFA</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between">
                  <span className="text-[#a86048]">ISTE RAMANUJAN MATH</span>
                  <span className="font-bold text-[#ffedd7]">NATIONAL FINALIST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Annotation Badges */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181818] border border-white/15 text-xs text-[#ffedd7]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#dc5000]" />
              <span>AUTONOMOUS REASONING SWARM // ACTIVE</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181818] border border-white/15 text-xs text-[#ffedd7]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#dc5000]" />
              <span>ORACLE CERTIFIED AGENTIC PIPELINE</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181818] border border-white/15 text-xs text-[#ffedd7]">
              <Sparkles className="w-3.5 h-3.5 text-[#dc5000]" />
              <span>9.375 CGPA // ZERO ARREARS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
