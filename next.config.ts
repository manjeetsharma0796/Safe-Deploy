import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },

  },
  typescript: {
    ignoreBuildErrors: true,
  },
};


export default nextConfig;
