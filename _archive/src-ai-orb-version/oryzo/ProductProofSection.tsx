"use client";

import React, { useState } from "react";
import { Terminal, ShieldCheck, Cpu, Sparkles, CheckCircle2, Code2, Play, RefreshCw, Layers, Database } from "lucide-react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { soundFx } from "@/lib/audio";

interface ExecutionStep {
  id: number;
  label: string;
  detail: string;
  status: "pending" | "running" | "complete";
  time: string;
}

export function ProductProofSection() {
  const [selectedTask, setSelectedTask] = useState<string>("SWARM_AGENT_DISPATCH");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(4);

  const tasks = [
    {
      id: "SWARM_AGENT_DISPATCH",
      title: "Autonomous Multi-Agent Swarm",
      desc: "Deterministic tool routing & self-healing memory hierarchy",
    },
    {
      id: "ORACLE_CERT_VERIFIER",
      title: "Oracle AI Credential Hash",
      desc: "Cryptographic verification of 103498358AAI26OFA",
    },
    {
      id: "ACADEMIC_TRANSCRIPT_AUDIT",
      title: "Anna University Academic Audit",
      desc: "100% first-pass clearance, 9.375 CGPA zero arrears",
    },
  ];

  const handleRunSimulation = () => {
    if (isRunning) return;
    soundFx.playClick();
    setIsRunning(true);
    setActiveStep(1);

    setTimeout(() => {
      soundFx.playClick();
      setActiveStep(2);
    }, 600);

    setTimeout(() => {
      soundFx.playClick();
      setActiveStep(3);
    }, 1200);

    setTimeout(() => {
      soundFx.playSuccess();
      setActiveStep(4);
      setIsRunning(false);
    }, 1800);
  };

  return (
    <section id="product" className="w-full py-20 sm:py-28 px-4 sm:px-8 bg-[#0c0704]">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="space-y-3.5 max-w-3xl">
          <div className="eyebrow-oryzo text-[#ff5700]">
            01 // PRODUCT PROOF & REASONING ENGINE
          </div>
          <h2 className="h2-oryzo text-[#ffedd7]">
            AUTONOMOUS AGENT ORCHESTRATION IN REAL TIME.
          </h2>
          <p className="text-[#c89f82] text-sm sm:text-base leading-relaxed">
            A production agentic loop executing deterministic tool calls, self-healing vector graphs, and verified academic transcripts.
          </p>
        </div>

        {/* Task Selector Tabs */}
        <div className="flex flex-wrap gap-2.5">
          {tasks.map((t) => {
            const isSelected = selectedTask === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedTask(t.id);
                  handleRunSimulation();
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all text-left flex flex-col gap-0.5 cursor-pointer border ${
                  isSelected
                    ? "bg-[#1c1009] border-[#ff5700] text-[#ffedd7] shadow-lg shadow-[#ff5700]/15"
                    : "bg-[#140b06] border-white/10 text-[#c89f82] hover:border-white/20"
                }`}
              >
                <span className="font-bold flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#ff5700]" : "bg-white/20"}`} />
                  {t.title}
                </span>
                <span className="text-[10px] text-[#8a654e]">{t.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Large Framed Product / Terminal Demo Mock */}
        <div className="relative surface-card p-5 sm:p-8 border border-white/12 overflow-hidden rounded-3xl">
          {/* Ambient Warm Glow inside Mock */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5700]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Terminal Window Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5700]/60" />
              <div className="w-3 h-3 rounded-full bg-[#ff5700]/30" />
              <div className="w-3 h-3 rounded-full bg-white/15" />
              <span className="text-xs font-mono text-[#c89f82] ml-2">
                swarm_orchestrator.py — Peddapalem Izaz Ahmed (111525203076)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunSimulation}
                disabled={isRunning}
                className="btn-oryzo-primary text-[11px] py-1.5 px-3.5 cursor-pointer shadow-none"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-[#0c0704]" />
                    <span>EXECUTING...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#0c0704]" />
                    <span>RUN AGENT CYCLE</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[#8a654e]">
                <span className="w-2 h-2 rounded-full bg-[#ff5700] animate-ping" />
                <span className="text-[#ff5700] font-semibold tabular-nums">200 OK</span>
              </div>
            </div>
          </div>

          {/* Code & Agent Execution Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start font-mono text-xs">
            {/* Left: Code stream */}
            <div className="lg:col-span-7 space-y-2.5 text-[#ffedd7]/85 bg-[#0c0704]/70 p-5 rounded-2xl border border-white/8">
              <div className="text-[#8a654e]"># Oracle Certified Multi-Agent Swarm (Cert: 103498358AAI26OFA)</div>
              <div>
                <span className="text-[#ff5700]">from</span> agentic_swarm <span className="text-[#ff5700]">import</span> SwarmEngine, MemoryVectorGraph
              </div>
              <div>
                <span className="text-[#ff5700]">class</span> <span className="text-[#ffedd7] font-bold">AutonomousSystem</span>:
              </div>
              <div className="pl-4">
                <span className="text-[#c89f82]">candidate</span> = <span className="text-[#ffedd7]">"Peddapalem Izaz Ahmed"</span>
              </div>
              <div className="pl-4">
                <span className="text-[#c89f82]">register_no</span> = <span className="text-[#ffedd7]">"111525203076"</span> # RMD Engineering College
              </div>
              <div className="pl-4">
                <span className="text-[#c89f82]">oracle_hash</span> = <span className="text-[#ffedd7]">"103498358AAI26OFA"</span> # Foundations Associate
              </div>
              <div className="pl-4">
                <span className="text-[#c89f82]">btech_cgpa</span> = <span className="text-[#ff5700] tabular-nums font-bold">9.375</span> # Zero Arrears Track Record
              </div>
              <div className="pl-4">
                <span className="text-[#ff5700]">def</span> <span className="text-[#ffedd7]">execute_task_pipeline</span>(self, task_intent):
              </div>
              <div className="pl-8 text-[#c89f82]">
                plan_graph = self.swarm.evaluate(task_intent, memory_graph=self.vector_db)
              </div>
              <div className="pl-8 text-[#ffedd7]">
                <span className="text-[#ff5700]">return</span> plan_graph.dispatch(status=<span className="text-[#ff5700]">"VERIFIED_SUCCESS"</span>)
              </div>
            </div>

            {/* Right: Live Telemetry Output Card */}
            <div className="lg:col-span-5 bg-[#0c0704] border border-white/10 p-5 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between text-[11px] text-[#c89f82]">
                <span className="flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-[#ff5700]" />
                  SWARM STEP REASONING
                </span>
                <span className="text-[#ff5700] font-bold tabular-nums">
                  {activeStep}/4 STEPS COMPLETE
                </span>
              </div>

              {/* Execution Steps */}
              <div className="space-y-2 text-[11px]">
                <div className={`p-2.5 rounded-xl border transition-all ${
                  activeStep >= 1 ? "bg-[#1c1009] border-[#ff5700]/40 text-[#ffedd7]" : "bg-[#140b06] border-white/5 text-[#8a654e]"
                } flex items-center justify-between`}>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${activeStep >= 1 ? "text-[#ff5700]" : "text-white/20"}`} />
                    <span>01 // Ingest Task & Graph Partition</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#8a654e] tabular-nums">12ms</span>
                </div>

                <div className={`p-2.5 rounded-xl border transition-all ${
                  activeStep >= 2 ? "bg-[#1c1009] border-[#ff5700]/40 text-[#ffedd7]" : "bg-[#140b06] border-white/5 text-[#8a654e]"
                } flex items-center justify-between`}>
                  <span className="flex items-center gap-2">
                    <Database className={`w-3.5 h-3.5 ${activeStep >= 2 ? "text-[#ff5700]" : "text-white/20"}`} />
                    <span>02 // Vector Memory Context Query</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#8a654e] tabular-nums">34ms</span>
                </div>

                <div className={`p-2.5 rounded-xl border transition-all ${
                  activeStep >= 3 ? "bg-[#1c1009] border-[#ff5700]/40 text-[#ffedd7]" : "bg-[#140b06] border-white/5 text-[#8a654e]"
                } flex items-center justify-between`}>
                  <span className="flex items-center gap-2">
                    <Layers className={`w-3.5 h-3.5 ${activeStep >= 3 ? "text-[#ff5700]" : "text-white/20"}`} />
                    <span>03 // Tool Calling Dispatch & Execution</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#8a654e] tabular-nums">68ms</span>
                </div>

                <div className={`p-2.5 rounded-xl border transition-all ${
                  activeStep >= 4 ? "bg-[#1c1009] border-[#ff5700]/40 text-[#ffedd7]" : "bg-[#140b06] border-white/5 text-[#8a654e]"
                } flex items-center justify-between`}>
                  <span className="flex items-center gap-2">
                    <ShieldCheck className={`w-3.5 h-3.5 ${activeStep >= 4 ? "text-[#ff5700]" : "text-white/20"}`} />
                    <span>04 // Transcript & Hash Validation</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#ff5700] font-bold tabular-nums">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Annotation Badges */}
          <div className="mt-6 pt-5 border-t border-white/8 flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c0704] border border-white/10 text-xs text-[#ffedd7]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff5700]" />
              <span>AUTONOMOUS REASONING SWARM // ACTIVE</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c0704] border border-white/10 text-xs text-[#ffedd7]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff5700]" />
              <span>ORACLE CERTIFIED AGENTIC PIPELINE</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c0704] border border-white/10 text-xs text-[#ffedd7]">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5700]" />
              <span className="tabular-nums font-mono">9.375 CGPA // ZERO ARREARS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

