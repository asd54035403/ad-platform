'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.scss';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'advertiser' | 'publisher';
}

interface DashboardStats {
  active_ads?: number;
  active_listings?: number;
  unread_messages: number;
  monthly_interactions: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>AdMatch</Link>
          <div className={styles.userInfo}>
            <span>歡迎，{user.name}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              登出
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcome}>
          <h1>控制台</h1>
          <p>角色：{user.role === 'advertiser' ? '廣告主' : '媒體主'}</p>
        </div>

        <div className={styles.actions}>
          {user.role === 'advertiser' ? (
            <div className={styles.advertiserActions}>
              <div className={styles.actionCard}>
                <h3>瀏覽廣告位</h3>
                <p>尋找適合的廣告投放位置</p>
                <Link href="/listings" className={styles.actionButton}>
                  開始瀏覽
                </Link>
              </div>
              
              <div className={styles.actionCard}>
                <h3>發布廣告需求</h3>
                <p>讓媒體主主動找到您</p>
                <Link href="/post-ad" className={styles.actionButton}>
                  發布需求
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.publisherActions}>
              <div className={styles.actionCard}>
                <h3>上架廣告位</h3>
                <p>將您的平台流量變現</p>
                <Link href="/create-listing" className={styles.actionButton}>
                  上架廣告位
                </Link>
              </div>
              
              <div className={styles.actionCard}>
                <h3>管理廣告位</h3>
                <p>查看和管理您的廣告位</p>
                <Link href="/my-listings" className={styles.actionButton}>
                  管理廣告位
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className={styles.quickStats}>
          <h2>快速統計</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <h3>{stats ? (user.role === 'advertiser' ? stats.active_ads : stats.active_listings) : 0}</h3>
              <p>{user.role === 'advertiser' ? '進行中的廣告' : '活躍廣告位'}</p>
            </div>
            <div className={styles.stat}>
              <h3>{stats ? stats.unread_messages : 0}</h3>
              <p>未讀訊息</p>
            </div>
            <div className={styles.stat}>
              <h3>{stats ? stats.monthly_interactions : 0}</h3>
              <p>本月互動</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}