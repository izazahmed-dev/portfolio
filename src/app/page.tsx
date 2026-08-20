"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { FrameSequenceCanvas } from "@/components/canvas/FrameSequenceCanvas";
import { TopNavbarHUD } from "@/components/hud/TopNavbarHUD";
import { Act1Hero } from "@/components/acts/Act1Hero";
import { Act2Nodes } from "@/components/acts/Act2Nodes";
import { Act3Dossier } from "@/components/acts/Act3Dossier";
import { Act4Dispatch } from "@/components/acts/Act4Dispatch";

import { GlassmorphismMarquee } from "@/components/ui/GlassmorphismMarquee";
import { SocialProofSection } from "@/components/oryzo/SocialProofSection";
import { ProductProofSection } from "@/components/oryzo/ProductProofSection";
import { CapabilityGridSection } from "@/components/oryzo/CapabilityGridSection";
import { FeatureValueSection } from "@/components/oryzo/FeatureValueSection";
import { FinalCtaSection } from "@/components/oryzo/FinalCtaSection";
import { FooterSection } from "@/components/oryzo/FooterSection";

import { CertificateModal } from "@/components/ui/CertificateModal";
import { DossierPdfGenerator } from "@/components/ui/DossierPdfGenerator";
import { ContactModal } from "@/components/oryzo/ContactModal";
import { AcademicRecord, PORTFOLIO_DATA } from "@/lib/portfolio-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function MasterScrollytellingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalFrames = 239;

  // Frame and scroll state
  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Modal inspection states
  const [selectedRecord, setSelectedRecord] = useState<AcademicRecord | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isDossierPdfOpen, setIsDossierPdfOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Act visual states controlled by GSAP
  const [act1State, setAct1State] = useState({ opacity: 1, scale: 0.9, y: 0, blur: 0 });
  const [act2State, setAct2State] = useState({ opacity: 0, y: 40 });
  const [act3State, setAct3State] = useState({ opacity: 0, y: 40 });
  const [act4State, setAct4State] = useState({ opacity: 0, y: 40 });

  // GSAP Choreography Timeline for Pinned Scrollytelling
  useGSAP(
    () => {
      const frameObj = { frame: 1 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4200",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            const prog = self.progress;
            setScrollProgress(prog);

            // Act 1 Calculations (0.00 -> 0.25)
            if (prog <= 0.25) {
              const actProg = prog / 0.25;
              const op = actProg > 0.75 ? 1 - (actProg - 0.75) / 0.25 : 1;
              const sc = 0.9 + actProg * 0.25;
              const bl = actProg > 0.75 ? (actProg - 0.75) * 16 : 0;
              const yVal = actProg * -50;
              setAct1State({ opacity: Math.max(0, op), scale: sc, y: yVal, blur: bl });
            } else {
              setAct1State({ opacity: 0, scale: 1.15, y: -50, blur: 8 });
            }

            // Act 2 Calculations (0.25 -> 0.55)
            if (prog > 0.22 && prog <= 0.55) {
              const actProg = (prog - 0.22) / (0.55 - 0.22);
              let op = 0;
              let yVal = 0;
              if (actProg < 0.2) {
                op = actProg / 0.2;
                yVal = 40 * (1 - op);
              } else if (actProg < 0.8) {
                op = 1;
                yVal = 0;
              } else {
                op = 1 - (actProg - 0.8) / 0.2;
                yVal = -40 * (1 - op);
              }
              setAct2State({ opacity: Math.max(0, Math.min(1, op)), y: yVal });
            } else {
              setAct2State({ opacity: 0, y: 40 });
            }

            // Act 3 Calculations (0.55 -> 0.85)
            if (prog > 0.52 && prog <= 0.85) {
              const actProg = (prog - 0.52) / (0.85 - 0.52);
              let op = 0;
              let yVal = 0;
              if (actProg < 0.2) {
                op = actProg / 0.2;
                yVal = 40 * (1 - op);
              } else if (actProg < 0.8) {
                op = 1;
                yVal = 0;
              } else {
                op = 1 - (actProg - 0.8) / 0.2;
                yVal = -40 * (1 - op);
              }
              setAct3State({ opacity: Math.max(0, Math.min(1, op)), y: yVal });
            } else {
              setAct3State({ opacity: 0, y: 40 });
            }

            // Act 4 Calculations (0.85 -> 1.00)
            if (prog > 0.82) {
              const actProg = Math.min(1, (prog - 0.82) / (1 - 0.82));
              const op = Math.min(1, actProg / 0.3);
              const yVal = 40 * (1 - op);
              setAct4State({ opacity: Math.max(0, Math.min(1, op)), y: yVal });
            } else {
              setAct4State({ opacity: 0, y: 40 });
            }
          },
        },
      });

      // Frame scrubbing animation across the master timeline
      tl.to(frameObj, {
        frame: totalFrames,
        ease: "none",
        onUpdate: () => {
          const roundedFrame = Math.round(frameObj.frame);
          setCurrentFrame(roundedFrame);
        },
      });
    },
    { scope: containerRef }
  );

  const handleInspectCertificate = (record: AcademicRecord) => {
    setSelectedRecord(record);
    setIsCertificateOpen(true);
  };

  const handleMarqueeInspect = (title: string) => {
    if (title.includes("B.Tech")) {
      const btech = PORTFOLIO_DATA.academics.find((a) => a.id === "btech");
      if (btech) handleInspectCertificate(btech);
    } else if (title.includes("Intermediate")) {
      const inter = PORTFOLIO_DATA.academics.find((a) => a.id === "inter");
      if (inter) handleInspectCertificate(inter);
    } else if (title.includes("10th")) {
      const ssc = PORTFOLIO_DATA.academics.find((a) => a.id === "ssc");
      if (ssc) handleInspectCertificate(ssc);
    } else {
      setIsDossierPdfOpen(true);
    }
  };

  return (
    <div className="relative bg-[#100904] text-[#ffedd7] min-h-screen selection:bg-[#dc5000] selection:text-[#100904]">
      {/* Pinned Top Navbar HUD */}
      <TopNavbarHUD
        scrollProgress={scrollProgress}
        onOpenDossier={() => setIsDossierPdfOpen(true)}
      />

      {/* MAIN PINNED SCROLLYTELLING STAGE (Acts I - IV with 239-Frame Canvas Scrub) */}
      <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
        {/* Canvas 2D Render Engine */}
        <FrameSequenceCanvas
          currentFrame={currentFrame}
          totalFrames={totalFrames}
        />

        {/* Act I: Kinetic Initialization */}
        <Act1Hero
          opacity={act1State.opacity}
          scale={act1State.scale}
          y={act1State.y}
          blur={act1State.blur}
        />

        {/* Act II: Specialization & Glass 3D Parallax Tilt Cards */}
        <Act2Nodes
          opacity={act2State.opacity}
          y={act2State.y}
          onOpenDossier={() => setIsDossierPdfOpen(true)}
        />

        {/* Act III: Verified Academic Dossier & Biometric Profile */}
        <Act3Dossier
          opacity={act3State.opacity}
          y={act3State.y}
          onInspectCertificate={handleInspectCertificate}
        />

        {/* Act IV: Product Proof & Direct Dispatch Terminal */}
        <Act4Dispatch
          opacity={act4State.opacity}
          y={act4State.y}
          onOpenDossier={() => setIsDossierPdfOpen(true)}
        />
      </div>

      {/* CONTINUOUS 3D GLASSMARQUEE CAROUSEL (Infinite Scroll, Hover Pause, Zoom, Background Blur, Tilt) */}
      <div className="relative z-30 bg-[#100904]">
        <GlassmorphismMarquee onInspect={handleMarqueeInspect} />

        {/* Social Proof Strip */}
        <SocialProofSection />

        {/* Deep Product Proof & Terminal Demo */}
        <ProductProofSection />

        {/* Core Capabilities */}
        <CapabilityGridSection />

        {/* Alternating Feature/Value Rows */}
        <FeatureValueSection onOpenDossier={() => setIsDossierPdfOpen(true)} />

        {/* Final Elevated CTA */}
        <FinalCtaSection onOpenContact={() => setIsContactOpen(true)} />

        {/* Footer */}
        <FooterSection
          onOpenDossier={() => setIsDossierPdfOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
        />
      </div>

      {/* Modals & Overlays */}
      <CertificateModal
        record={selectedRecord}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      <DossierPdfGenerator
        isOpen={isDossierPdfOpen}
        onClose={() => setIsDossierPdfOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
