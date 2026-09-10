import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const crmProxyTarget = (
  process.env.CRM_API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_CRM_API_URL ||
  "http://127.0.0.1:8081"
).replace("://localhost", "://127.0.0.1");

const nextConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
  env: {
    NEXT_PUBLIC_CRM_API_URL:
      process.env.NEXT_PUBLIC_CRM_API_URL ||
      process.env.VITE_CRM_API_URL ||
      "http://127.0.0.1:8081",
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
