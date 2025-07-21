'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './listing-detail.module.scss';
import { getListingById, getCurrentUser } from '../../../lib/localStorage';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'advertiser' | 'publisher';
}

interface Listing {
  id: string;
  title: string;
  type: string;
  description: string;
  platform_url?: string;
  price: number;
  categories: string;
  tags: string;
  location?: string;
  image_url?: string;
  owner_id: string;
  owner_name?: string;
  owner_email?: string;
  is_active: boolean;
  created_at: string;
}

interface MessageData {
  content: string;
}

interface Props {
  listingId: string;
}

export default function ListingDetailClient({ listingId }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageData, setMessageData] = useState<MessageData>({ content: '' });
  const [sending, setSending] = useState(false);

  const fetchListingDetail = useCallback(() => {
    try {
      const listingData = getListingById(listingId);
      
      if (listingData) {
        setListing(listingData);
      } else {
        router.push('/listings');
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      router.push('/listings');
    } finally {
      setLoading(false);
    }
  }, [listingId, router]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    
    fetchListingDetail();
  }, [listingId, fetchListingDetail]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      if (!user || !listing) {
        alert('請先登入');
        return;
      }

      // 模擬發送訊息 (在真實應用中這裡會調用 createMessage)
      alert('訊息已發送！（Demo版本）');
      setShowMessageForm(false);
      setMessageData({ content: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('發送失敗，請稍後再試');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!listing) {
    return <div className={styles.error}>找不到此廣告位</div>;
  }

  const categories = listing.categories ? listing.categories.split(',').map(c => c.trim()) : [];
  const tags = listing.tags ? listing.tags.split(',').map(t => t.trim()) : [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>AdMatch</Link>
          <div className={styles.nav}>
            <Link href="/listings" className={styles.navLink}>返回列表</Link>
            {user && (
              <Link href="/dashboard" className={styles.navLink}>控制台</Link>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link href="/listings">廣告位列表</Link>
          <span>/</span>
          <span>{listing.title}</span>
        </div>

        <div className={styles.content}>
          <div className={styles.imageSection}>
            {listing.image_url ? (
              <Image 
                src={listing.image_url} 
                alt={listing.title} 
                width={600}
                height={300}
                className={styles.mainImage} 
              />
            ) : (
              <div className={styles.placeholderImage}>
                <span>{listing.type}</span>
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.header}>
              <h1>{listing.title}</h1>
              <div className={styles.typeTag}>{listing.type}</div>
            </div>

            <div className={styles.price}>
              <span className={styles.priceLabel}>價格</span>
              <span className={styles.priceValue}>NT$ {listing.price.toLocaleString()}</span>
            </div>

            <div className={styles.owner}>
              <h3>媒體主資訊</h3>
              <p><strong>姓名：</strong>{listing.owner_name}</p>
              <p><strong>聯絡郵箱：</strong>{listing.owner_email}</p>
            </div>

            {listing.location && (
              <div className={styles.location}>
                <h3>地點</h3>
                <p>📍 {listing.location}</p>
              </div>
            )}

            {listing.platform_url && (
              <div className={styles.platformUrl}>
                <h3>平台連結</h3>
                <a href={listing.platform_url} target="_blank" rel="noopener noreferrer">
                  {listing.platform_url}
                </a>
              </div>
            )}

            {categories.length > 0 && (
              <div className={styles.categories}>
                <h3>適合類別</h3>
                <div className={styles.tagList}>
                  {categories.map((category, index) => (
                    <span key={index} className={styles.categoryTag}>
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className={styles.tags}>
                <h3>標籤</h3>
                <div className={styles.tagList}>
                  {tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.description}>
              <h3>詳細描述</h3>
              <p>{listing.description}</p>
            </div>

            <div className={styles.actions}>
              {user && user.role === 'advertiser' && (
                <>
                  <button 
                    onClick={() => setShowMessageForm(true)}
                    className={styles.contactButton}
                  >
                    聯絡媒體主
                  </button>
                </>
              )}
              {!user && (
                <Link href="/login" className={styles.loginButton}>
                  登入以聯絡媒體主
                </Link>
              )}
            </div>
          </div>
        </div>

        {showMessageForm && (
          <div className={styles.messageModal}>
            <div className={styles.modalContent}>
              <h3>發送訊息給 {listing.owner_name}</h3>
              <form onSubmit={handleSendMessage}>
                <textarea
                  value={messageData.content}
                  onChange={(e) => setMessageData({ content: e.target.value })}
                  placeholder="請輸入您的訊息內容，例如合作意願、預算範圍等..."
                  rows={5}
                  required
                />
                <div className={styles.modalActions}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowMessageForm(false);
                      setMessageData({ content: '' });
                    }}
                    className={styles.cancelButton}
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    disabled={sending}
                    className={styles.sendButton}
                  >
                    {sending ? '發送中...' : '發送訊息'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}