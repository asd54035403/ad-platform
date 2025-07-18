'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './messages.module.scss';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'advertiser' | 'publisher';
}

interface Message {
  id: number;
  listing_id: number;
  from_user_id: number;
  to_user_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  from_user_name: string;
  from_user_email: string;
  to_user_name: string;
  to_user_email: string;
  listing_title: string;
}

export default function Messages() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchMessages();
  }, [router]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupMessagesByListing = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const key = `${message.listing_id}-${message.from_user_id < message.to_user_id ? message.from_user_id : message.to_user_id}-${message.from_user_id < message.to_user_id ? message.to_user_id : message.from_user_id}`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(message);
    });
    
    return groups;
  };

  if (loading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) {
    return null;
  }

  const messageGroups = groupMessagesByListing(messages);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>AdMatch</Link>
          <div className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>控制台</Link>
            <Link href="/listings" className={styles.navLink}>廣告位列表</Link>
            <Link href="/messages" className={styles.navLink}>訊息中心</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>訊息中心</h1>
          <p>管理您的所有對話</p>
        </div>

        <div className={styles.messagesContainer}>
          {Object.keys(messageGroups).length === 0 ? (
            <div className={styles.emptyState}>
              <h3>目前沒有任何訊息</h3>
              <p>當有人對您的廣告位感興趣時，他們會在這裡與您聯繫</p>
              <Link href="/listings" className={styles.browseButton}>
                瀏覽廣告位
              </Link>
            </div>
          ) : (
            <div className={styles.conversations}>
              {Object.entries(messageGroups).map(([groupKey, groupMessages]) => {
                const latestMessage = groupMessages[0];
                const otherUser = latestMessage.from_user_id === user.id 
                  ? { name: latestMessage.to_user_name, email: latestMessage.to_user_email }
                  : { name: latestMessage.from_user_name, email: latestMessage.from_user_email };
                
                return (
                  <div key={groupKey} className={styles.conversationCard}>
                    <div className={styles.conversationHeader}>
                      <h3>{otherUser.name}</h3>
                      <span className={styles.listingTitle}>
                        關於：{latestMessage.listing_title}
                      </span>
                    </div>
                    
                    <div className={styles.messagesList}>
                      {groupMessages.reverse().map(message => (
                        <div 
                          key={message.id} 
                          className={`${styles.message} ${message.from_user_id === user.id ? styles.sent : styles.received}`}
                        >
                          <div className={styles.messageContent}>
                            <p>{message.content}</p>
                            <span className={styles.messageTime}>
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}