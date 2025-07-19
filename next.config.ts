import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 靜態導出配置 - 純前端應用
  output: 'export',
  
  // 禁用圖片優化 (靜態導出不支持)
  images: {
    unoptimized: true
  },
  
  // 解決潛在的路由問題
  trailingSlash: false,
  
  // 基礎路徑配置 (如果需要部署到子路徑)
  // basePath: '/ad-platform',
};

export default nextConfig;
