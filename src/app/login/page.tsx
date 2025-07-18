'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './login.module.scss';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'advertiser' as 'advertiser' | 'publisher'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          role: data.data.role
        }));
        window.location.href = '/dashboard';
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('網路錯誤，請稍後再試');
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