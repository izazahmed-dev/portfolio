import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // GSAP ScrollTrigger works smoothest without double-mount quirks
  images: {
    unoptimized: true,
  },
  // Fix: Windows webpack vendor-chunk splitting issues in Next.js 15
  transpilePackages: ["lucide-react", "gsap", "@gsap/react", "lenis"],
};

export default nextConfig;
