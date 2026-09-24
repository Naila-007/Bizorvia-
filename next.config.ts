import type { NextConfig } from 'next';

// Bizorvia — rebuilt 2026-09-24
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
