"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  useEffect(() => {
    // Initialize mock data when component mounts (client-side only)
    if (typeof window !== 'undefined') {
      // Dynamically import to avoid SSR issues
      import("../lib/localStorage").then(({ initializeMockData }) => {
        initializeMockData();
      });
    }
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>AdMatch</h1>
          <p className={styles.subtitle}>廣告媒合平台</p>
          <p className={styles.description}>
            連接廣告主與媒體主，讓廣告投放更有效率
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>廣告主</h3>
            <p>尋找最適合的廣告投放平台</p>
            <ul>
              <li>瀏覽多樣化廣告位</li>
              <li>精準篩選目標受眾</li>
              <li>直接與媒體主溝通</li>
            </ul>
          </div>
          
          <div className={styles.feature}>
            <h3>媒體主</h3>
            <p>將你的平台流量變現</p>
            <ul>
              <li>上架你的廣告空間</li>
              <li>設定合理的價格</li>
              <li>獲得穩定收益</li>
            </ul>
          </div>
        </div>

        <div className={styles.ctas}>
          <Link href="/login" className={styles.primary}>
            開始使用
          </Link>
          <Link href="/listings" className={styles.secondary}>
            瀏覽廣告位
          </Link>
        </div>
      </main>
    </div>
  );
}