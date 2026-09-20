import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the parent Remotion project has its own lockfile; pin the root to this app
  turbopack: { root: __dirname },
  images: {
    // AVIF first (smallest), WebP fallback; the source PNGs are never shipped to the browser
    formats: ["image/avif", "image/webp"],
    qualities: [70, 82],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560, 3840],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
