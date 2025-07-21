import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開發環境使用標準模式，支援完整的Next.js功能
  // output: 'export', // 暫時關閉靜態導出以支援路由
  
  // 圖片優化配置
  images: {
    unoptimized: true
  },
  
  // 解決潛在的路由問題
  trailingSlash: false,
  
  // 基礎路徑配置 (如果需要部署到子路徑)
  // basePath: '/ad-platform',
};

export default nextConfig;
