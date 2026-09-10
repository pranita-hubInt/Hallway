import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/v1/:path*",
          destination: "/api/crm/v1/:path*",
        },
        {
          source: "/crm-api/:path*",
          destination: "/api/crm/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
