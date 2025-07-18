'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './create-listing.module.scss';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'advertiser' | 'publisher';
}

interface FormData {
  title: string;
  type: string;
  description: string;
  platform_url: string;
  price: number;
  categories: string;
  tags: string;
  location: string;
  image_url: string;
}

export default function CreateListing() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: 'Instagram',
    description: '',
    platform_url: '',
    price: 0,
    categories: '',
    tags: '',
    location: '',
    image_url: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'publisher') {
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
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/my-listings');
      } else {
        alert('上架失敗：' + data.message);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('上架失敗，請稍後再試');
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
            <Link href="/my-listings" className={styles.navLink}>我的廣告位</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>上架廣告位</h1>
          <p>將您的平台流量變現</p>
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
              placeholder="例如：我的 Instagram 廣告位"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">平台類型 *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="Website">網站</option>
              <option value="Restaurant">餐廳</option>
              <option value="Billboard">戶外看板</option>
              <option value="Blog">部落格</option>
              <option value="Podcast">Podcast</option>
              <option value="Other">其他</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">描述 *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="詳細描述您的廣告位，包含受眾特性、流量數據等"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="platform_url">平台網址</label>
            <input
              type="url"
              id="platform_url"
              name="platform_url"
              value={formData.platform_url}
              onChange={handleInputChange}
              placeholder="https://instagram.com/your-account"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">價格 (NT$) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="1"
              placeholder="5000"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categories">適合類別</label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              placeholder="例如：美食,生活,科技 (用逗號分隔)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tags">標籤</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="例如：台北,年輕族群,高流量 (用逗號分隔)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">地點</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="例如：台北市信義區"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image_url">圖片網址</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
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
              {submitting ? '上架中...' : '上架廣告位'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}