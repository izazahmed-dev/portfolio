"use client";

import React from "react";

export function SocialProofSection() {
  const partners = [
    "R.M.D. ENGINEERING COLLEGE",
    "ANNA UNIVERSITY",
    "ORACLE UNIVERSITY",
    "CORIZO EDU TECH",
    "ISTE NATIONAL FORUM",
    "AP BOARD OF EDUCATION",
  ];

  return (
    <section className="w-full py-16 sm:py-24 border-y border-white/10 bg-[#100904] px-6 sm:px-10">
      <div className="max-w-content mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Eyebrow Label */}
        <div className="shrink-0">
          <span className="eyebrow-oryzo text-[#a86048]">
            TRUSTED BY & AFFILIATED WITH
          </span>
        </div>

        {/* 5-6 Recognizable Partner / Academic Entities in 40% white */}
        <div className="w-full flex flex-wrap items-center justify-between gap-6 sm:gap-10">
          {partners.map((partner, index) => (
            <span
              key={index}
              className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#ffedd7]/40 hover:text-[#ffedd7]/80 transition-colors"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
