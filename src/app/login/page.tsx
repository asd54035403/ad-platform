'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.scss';
import { getUserByEmail, createUser, saveAuthToken, saveCurrentUser, initializeMockData } from '../../lib/localStorage';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'advertiser' as 'advertiser' | 'publisher'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 確保數據已初始化
      initializeMockData();

      if (isLogin) {
        // 登入邏輯
        const user = getUserByEmail(formData.email);
        if (user) {
          // 簡化版本：不驗證密碼，直接登入
          const token = 'mock-token-' + Date.now();
          saveAuthToken(token);
          saveCurrentUser(user);
          router.push('/dashboard');
        } else {
          setMessage('用戶不存在');
        }
      } else {
        // 註冊邏輯
        const existingUser = getUserByEmail(formData.email);
        if (existingUser) {
          setMessage('該電子郵件已被使用');
        } else {
          const newUser = createUser({
            email: formData.email,
            name: formData.name,
            role: formData.role
          });
          const token = 'mock-token-' + Date.now();
          saveAuthToken(token);
          saveCurrentUser(newUser);
          router.push('/dashboard');
        }
      }
    } catch {
      setMessage('操作失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>← 回到首頁</Link>
          <h1>{isLogin ? '登入' : '註冊'}</h1>
        </div>

        <div className={styles.tabs}>
          <button 
            className={isLogin ? styles.active : ''} 
            onClick={() => setIsLogin(true)}
          >
            登入
          </button>
          <button 
            className={!isLogin ? styles.active : ''} 
            onClick={() => setIsLogin(false)}
          >
            註冊
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.field}>
              <label>姓名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className={styles.field}>
            <label>密碼</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {!isLogin && (
            <div className={styles.field}>
              <label>角色</label>
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value as 'advertiser' | 'publisher'})}
              >
                <option value="advertiser">廣告主</option>
                <option value="publisher">媒體主</option>
              </select>
            </div>
          )}

          {message && <div className={styles.message}>{message}</div>}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? '處理中...' : (isLogin ? '登入' : '註冊')}
          </button>
        </form>
      </div>
    </div>
  );
}