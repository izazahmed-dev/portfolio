"use client";

import React, { useEffect, useRef } from "react";

export function HeroCanvasMoment() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Particle nodes in oryzo.ai amber/warm palette
    const particleCount = 42;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ["#dc5000", "#c09060", "#603018", "#a86048"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.fillStyle = "#100904";
      ctx.fillRect(0, 0, width, height);

      // Ambient radial warm glow following cursor
      const radialGradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        20,
        mouseX,
        mouseY,
        Math.max(width, height) * 0.55
      );
      radialGradient.addColorStop(0, "rgba(220, 80, 0, 0.12)");
      radialGradient.addColorStop(0.4, "rgba(96, 48, 24, 0.06)");
      radialGradient.addColorStop(1, "rgba(16, 9, 4, 0)");

      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      // Center generative organic orb
      const centerX = width * 0.5 + (mouseX - width * 0.5) * 0.1;
      const centerY = height * 0.45 + (mouseY - height * 0.45) * 0.1;
      const baseRadius = Math.min(width, height) * 0.28;

      ctx.save();
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.04) {
        const distortion =
          Math.sin(angle * 4 + time) * 18 +
          Math.cos(angle * 7 - time * 1.5) * 12 +
          Math.sin(angle * 2 + time * 2) * 8;
        const r = baseRadius + distortion;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      const orbGradient = ctx.createRadialGradient(
        centerX - 40,
        centerY - 40,
        10,
        centerX,
        centerY,
        baseRadius * 1.4
      );
      orbGradient.addColorStop(0, "rgba(220, 80, 0, 0.22)");
      orbGradient.addColorStop(0.5, "rgba(168, 96, 72, 0.10)");
      orbGradient.addColorStop(0.85, "rgba(96, 48, 24, 0.03)");
      orbGradient.addColorStop(1, "rgba(16, 9, 4, 0)");

      ctx.fillStyle = orbGradient;
      ctx.fill();

      // Subtle organic contour stroke
      ctx.strokeStyle = "rgba(220, 80, 0, 0.18)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // Draw particle network
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw connections between nearby nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(192, 144, 96, " + (0.12 * (1 - dist / 140)) + ")";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none select-none z-0"
      style={{ imageRendering: "auto" }}
    />
  );
}
