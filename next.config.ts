import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 確保 sqlite3 不會在服務器組件中引起問題
  experimental: {
    serverComponentsExternalPackages: ['sqlite3']
  }
};

export default nextConfig;
