import type { NextConfig } from "next";

const crmProxyTarget = process.env.CRM_API_PROXY_TARGET || process.env.NEXT_PUBLIC_CRM_API_URL || "http://localhost:8081";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CRM_API_URL:
      process.env.NEXT_PUBLIC_CRM_API_URL ||
      process.env.VITE_CRM_API_URL ||
      "http://localhost:8081",
  },
  async rewrites() {
    return [
      {
        source: "/crm-api/:path*",
        destination: `${crmProxyTarget.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
