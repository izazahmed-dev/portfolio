"use client";

import React from "react";
import { ShieldCheck, Award } from "lucide-react";

export function SocialProofSection() {
  const partners = [
    { name: "R.M.D. ENGINEERING COLLEGE", role: "B.Tech AIML (2025–2029)" },
    { name: "ANNA UNIVERSITY", role: "Affiliated Institution" },
    { name: "ORACLE CORPORATION", role: "Certified Agentic AI Architect" },
    { name: "CORIZO EDU TECH", role: "ML Engineering Intern" },
    { name: "ISTE NATIONAL FORUM", role: "Ramanujan Math Level 3" },
    { name: "AP STATE EDUCATION", role: "94.00% MPC & 95.83% SSC" },
  ];

  return (
    <section className="w-full py-12 sm:py-16 border-y border-white/8 bg-[#0c0704] px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
        {/* Eyebrow Label */}
        <div className="shrink-0 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#ff5700]" />
          <span className="eyebrow-oryzo text-[#8a654e]">
            VERIFIED INSTITUTIONAL AFFILIATIONS
          </span>
        </div>

        {/* Recognizable Partner / Academic Entities */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col group cursor-default"
            >
              <span className="text-xs font-semibold tracking-wider uppercase text-[#ffedd7]/50 group-hover:text-[#ffedd7] transition-colors">
                {partner.name}
              </span>
              <span className="text-[10px] font-mono text-[#8a654e] group-hover:text-[#ff5700] transition-colors">
                {partner.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

