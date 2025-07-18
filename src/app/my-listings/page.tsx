'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './my-listings.module.scss';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'advertiser' | 'publisher';
}

interface Listing {
  id: number;
  title: string;
  type: string;
  description: string;
  price: number;
  categories: string;
  location: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export default function MyListings() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchMyListings();
  }, [router]);

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/listings?owner=me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setListings(data.data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleListingStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        setListings(prev => prev.map(listing => 
          listing.id === id 
            ? { ...listing, is_active: !currentStatus }
            : listing
        ));
      }
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const deleteListing = async (id: number) => {
    if (!confirm('確定要刪除這個廣告位嗎？')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setListings(prev => prev.filter(listing => listing.id !== id));
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>AdMatch</Link>
          <div className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>控制台</Link>
            <Link href="/create-listing" className={styles.navLink}>上架廣告位</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>我的廣告位</h1>
          <p>管理您的廣告位列表</p>
        </div>

        <div className={styles.actions}>
          <Link href="/create-listing" className={styles.createButton}>
            + 新增廣告位
          </Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <h3>{listings.length}</h3>
            <p>總廣告位</p>
          </div>
          <div className={styles.statItem}>
            <h3>{listings.filter(l => l.is_active).length}</h3>
            <p>活躍中</p>
          </div>
          <div className={styles.statItem}>
            <h3>{listings.filter(l => !l.is_active).length}</h3>
            <p>已暫停</p>
          </div>
        </div>

        <div className={styles.listings}>
          {listings.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>您還沒有上架任何廣告位</h3>
              <p>開始上架您的第一個廣告位，讓廣告主找到您！</p>
              <Link href="/create-listing" className={styles.createFirstButton}>
                上架第一個廣告位
              </Link>
            </div>
          ) : (
            <div className={styles.listingsGrid}>
              {listings.map(listing => (
                <div key={listing.id} className={`${styles.listingCard} ${!listing.is_active ? styles.inactive : ''}`}>
                  <div className={styles.cardImage}>
                    {listing.image_url ? (
                      <img src={listing.image_url} alt={listing.title} />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <span>{listing.type}</span>
                      </div>
                    )}
                    {!listing.is_active && (
                      <div className={styles.inactiveOverlay}>
                        <span>已暫停</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.cardContent}>
                    <h3>{listing.title}</h3>
                    <p className={styles.type}>{listing.type}</p>
                    <p className={styles.description}>{listing.description}</p>
                    
                    <div className={styles.cardMeta}>
                      {listing.location && (
                        <span className={styles.location}>📍 {listing.location}</span>
                      )}
                      <span className={styles.price}>NT$ {listing.price.toLocaleString()}</span>
                    </div>
                    
                    <div className={styles.cardActions}>
                      <Link href={`/listings/${listing.id}`} className={styles.viewButton}>
                        查看
                      </Link>
                      <button 
                        onClick={() => toggleListingStatus(listing.id, listing.is_active)}
                        className={`${styles.toggleButton} ${listing.is_active ? styles.active : styles.inactive}`}
                      >
                        {listing.is_active ? '暫停' : '啟用'}
                      </button>
                      <button 
                        onClick={() => deleteListing(listing.id)}
                        className={styles.deleteButton}
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}