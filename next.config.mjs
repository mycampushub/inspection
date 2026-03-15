import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: "/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;