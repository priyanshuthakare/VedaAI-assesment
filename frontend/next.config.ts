import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve images directly from /public without running through
    // Next.js image optimizer. Fixes 400 errors on .avif source files on Vercel.
    unoptimized: true,
  },
};

export default nextConfig;
