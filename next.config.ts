import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Static export friendly: the only images are local files in /public.
    unoptimized: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
