import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 確保 sqlite3 不會在服務器組件中引起問題
  serverExternalPackages: ['sqlite3'],
  
  // 確保正確的輸出配置
  output: 'standalone',
  
  // 解決潛在的路由問題
  trailingSlash: false,
  
  // 確保API routes正確處理
  experimental: {
    serverComponentsExternalPackages: ['sqlite3']
  }
};

export default nextConfig;
