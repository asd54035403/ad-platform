'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './post-ad.module.scss';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'advertiser' | 'publisher';
}

interface FormData {
  title: string;
  budget: number;
  target_type: string;
  content: string;
  attachments: string;
}

export default function PostAd() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    budget: 0,
    target_type: '',
    content: '',
    attachments: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'advertiser') {
      router.push('/dashboard');
      return;
    }
    
    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/dashboard');
      } else {
        alert('發布失敗：' + data.message);
      }
    } catch (error) {
      console.error('Error posting ad:', error);
      alert('發布失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
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
          <div className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>控制台</Link>
            <Link href="/listings" className={styles.navLink}>廣告位列表</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>發布廣告需求</h1>
          <p>讓媒體主主動找到您，獲得更多合作機會</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">標題 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="例如：尋找美食部落客合作推廣新品牌"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="budget">預算 (NT$) *</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              required
              min="0"
              step="1000"
              placeholder="10000"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="target_type">目標媒體類型 *</label>
            <select
              id="target_type"
              name="target_type"
              value={formData.target_type}
              onChange={handleInputChange}
              required
            >
              <option value="">請選擇目標媒體類型</option>
              <option value="Instagram">美食 Instagram 帳號</option>
              <option value="YouTube">美食 YouTube 頻道</option>
              <option value="Website">美食相關網站</option>
              <option value="Restaurant">實體餐廳廣告位</option>
              <option value="Billboard">戶外看板</option>
              <option value="Blog">部落格</option>
              <option value="Podcast">Podcast 節目</option>
              <option value="Other">其他</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">廣告需求詳細內容 *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder="請詳細描述您的廣告需求：

1. 產品或服務介紹
2. 目標受眾群體
3. 希望的合作方式
4. 期望的曝光時間
5. 其他特殊要求

例如：我們是一個新的手工烘焙品牌，尋找美食部落客或 Instagram 帳號合作推廣。目標受眾為 25-40 歲的女性，希望能在一個月內完成合作。"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="attachments">相關附件或圖片連結</label>
            <input
              type="url"
              id="attachments"
              name="attachments"
              value={formData.attachments}
              onChange={handleInputChange}
              placeholder="https://example.com/product-image.jpg"
            />
            <small>可以放上產品圖片、Logo 或其他相關資料的連結</small>
          </div>

          <div className={styles.formActions}>
            <Link href="/dashboard" className={styles.cancelButton}>
              取消
            </Link>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? '發布中...' : '發布廣告需求'}
            </button>
          </div>
        </form>

        <div className={styles.tips}>
          <h3>提高合作成功率的小訣窮：</h3>
          <ul>
            <li>詳細描述您的產品或服務特色</li>
            <li>明確指出目標受眾群體</li>
            <li>提供合理的合作預算</li>
            <li>附上產品圖片或品牌資料</li>
            <li>說明期望的合作時間表</li>
          </ul>
        </div>
      </main>
    </div>
  );
}