import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_BASE_URL: "/api/v1/",
  },
  async rewrites() {
    const backendUrl = process.env.API_BASE_URL || "http://localhost:8000/api/v1/";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}:path*`,
      },
    ];
  },
};

export default nextConfig;
