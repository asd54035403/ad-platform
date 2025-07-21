import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開發環境設定
  images: {
    unoptimized: true
  },
  
  // 確保路由正常工作
  trailingSlash: false,
  
  // 基礎路徑配置 (如果需要部署到子路徑)  
  // basePath: '/ad-platform',
};

export default nextConfig;
