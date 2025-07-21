'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './listings.module.scss';
import { getListings, initializeMockData } from '../../lib/localStorage';

interface Listing {
  id: string;
  title: string;
  type: string;
  description: string;
  price: number;
  categories: string;
  location?: string;
  image_url?: string;
  owner_name?: string;
  created_at: string;
}

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = () => {
    try {
      // 確保數據已初始化
      initializeMockData();
      
      // 從localStorage獲取listings
      const listingsData = getListings();
      setListings(listingsData);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || listing.type === selectedType;
    return matchesSearch && matchesType;
  });

  const platformTypes = [...new Set(listings.map(l => l.type))];

  if (loading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>AdMatch</Link>
          <Link href="/dashboard" className={styles.dashboardLink}>
            控制台
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>廣告位列表</h1>
          <p>找到最適合您的廣告投放位置</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="搜尋廣告位..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.typeFilter}>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">所有類型</option>
              {platformTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.results}>
          <p className={styles.resultsCount}>
            找到 {filteredListings.length} 個廣告位
          </p>
          
          <div className={styles.listingsGrid}>
            {filteredListings.map(listing => (
              <div key={listing.id} className={styles.listingCard}>
                <div className={styles.cardImage}>
                  {listing.image_url ? (
                    <Image 
                      src={listing.image_url} 
                      alt={listing.title}
                      width={300}
                      height={150}
                      className={styles.cardImageImg}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <span>{listing.type}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.cardContent}>
                  <h3>{listing.title}</h3>
                  <p className={styles.type}>{listing.type}</p>
                  <p className={styles.description}>{listing.description}</p>
                  
                  <div className={styles.cardMeta}>
                    <span className={styles.owner}>by {listing.owner_name}</span>
                    {listing.location && (
                      <span className={styles.location}>📍 {listing.location}</span>
                    )}
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>NT$ {listing.price.toLocaleString()}</span>
                    <Link href={`/listings/${listing.id}`} className={styles.viewButton}>
                      查看詳情
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredListings.length === 0 && (
            <div className={styles.emptyState}>
              <p>目前沒有找到符合條件的廣告位</p>
              <Link href="/dashboard" className={styles.backButton}>
                回到控制台
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}