"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface FrameSequenceCanvasProps {
  currentFrame: number;
  totalFrames?: number;
  onProgress?: (loaded: number, total: number) => void;
  onLoaded?: () => void;
}

export function FrameSequenceCanvas({
  currentFrame,
  totalFrames = 239,
  onProgress,
  onLoaded,
}: FrameSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Preload and decode frames asynchronously
  useEffect(() => {
    let isCancelled = false;
    const images: HTMLImageElement[] = new Array(totalFrames);
    let loadedCount = 0;

    const processImage = async (index: number) => {
      const img = new Image();
      const frameStr = String(index).padStart(3, "0");
      img.src = `/sequence/frame_${frameStr}.webp`;

      try {
        await img.decode();
      } catch {
        await new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
      }

      if (isCancelled) return;
      images[index - 1] = img;
      loadedCount++;
      if (onProgress) onProgress(loadedCount, totalFrames);

      if (loadedCount >= totalFrames) {
        imagesRef.current = images;
        setIsReady(true);
        if (onLoaded) onLoaded();
      }
    };

    // Load frames in concurrent batches
    const batchSize = 16;
    let currentIdx = 1;

    const loadNextBatch = () => {
      if (isCancelled || currentIdx > totalFrames) return;
      const promises: Promise<void>[] = [];
      const end = Math.min(totalFrames, currentIdx + batchSize - 1);
      for (let i = currentIdx; i <= end; i++) {
        promises.push(processImage(i));
      }
      currentIdx = end + 1;
      Promise.all(promises).then(() => {
        if (currentIdx <= totalFrames) {
          loadNextBatch();
        }
      });
    };

    loadNextBatch();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, onProgress, onLoaded]);

  // High-DPI Cover Draw Loop
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const safeIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex - 1));
      const img = imagesRef.current[safeIndex];

      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      // Object-fit: cover math
      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const offsetX = (canvasWidth - drawWidth) / 2;
      const offsetY = (canvasHeight - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      lastDrawnFrameRef.current = frameIndex;
    },
    [totalFrames]
  );

  useEffect(() => {
    const handleResize = () => {
      if (lastDrawnFrameRef.current !== -1) {
        drawFrame(lastDrawnFrameRef.current);
      } else {
        drawFrame(currentFrame);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrame, drawFrame]);

  useEffect(() => {
    if (isReady || imagesRef.current.length > 0) {
      drawFrame(currentFrame);
    }
  }, [currentFrame, isReady, drawFrame]);

  return (
    <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden pointer-events-none bg-[#100904]">
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover select-none pointer-events-none opacity-75"
        style={{
          imageRendering: "auto",
        }}
      />

      {/* Warm Ambient Vignette for #100904 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#100904] via-[#100904]/40 to-[#100904]/80" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient from-transparent via-[#100904]/30 to-[#100904]" />
    </div>
  );
}
