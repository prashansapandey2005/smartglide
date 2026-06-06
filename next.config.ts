import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10000mb',
    },
    proxyClientMaxBodySize: '10000mb',
  },
};

export default nextConfig;
