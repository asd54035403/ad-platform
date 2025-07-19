export interface User {
  id: string;
  email: string;
  name: string;
  role: 'advertiser' | 'publisher';
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  type: string;
  description: string;
  platform_url?: string;
  price: number;
  categories: string;
  tags: string;
  location?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  owner_name?: string;
  owner_email?: string;
  owner_bio?: string;
}

export interface Message {
  id: string;
  listing_id: string;
  from_user_id: string;
  to_user_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface AdPost {
  id: string;
  advertiser_id: string;
  title: string;
  budget?: number;
  target_type?: string;
  content: string;
  attachments?: string;
  created_at: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'publisher@example.com',
    name: '小明出版社',
    role: 'publisher',
    bio: '專業的數位媒體平台，擁有豐富的廣告投放經驗',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2', 
    email: 'advertiser@example.com',
    name: '創新科技公司',
    role: 'advertiser',
    bio: '致力於推廣創新產品的科技公司',
    created_at: '2024-01-02T00:00:00Z'
  }
];

// Mock Listings
export const mockListings: Listing[] = [
  {
    id: '1',
    owner_id: '1',
    title: '首頁橫幅廣告位',
    type: 'banner',
    description: '網站首頁最顯眼的橫幅廣告位置，每日瀏覽量超過10萬人次',
    platform_url: 'https://example-media.com',
    price: 5000,
    categories: '科技,生活',
    tags: '首頁,橫幅,高曝光',
    location: '台北',
    image_url: 'https://via.placeholder.com/400x200',
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    owner_name: '小明出版社',
    owner_email: 'publisher@example.com',
    owner_bio: '專業的數位媒體平台，擁有豐富的廣告投放經驗'
  },
  {
    id: '2', 
    owner_id: '1',
    title: '文章內嵌廣告',
    type: 'article',
    description: '在熱門文章中嵌入的原生廣告，提高讀者參與度',
    platform_url: 'https://example-blog.com',
    price: 3000,
    categories: '教育,科技',
    tags: '原生廣告,文章,高互動',
    location: '台中',
    image_url: 'https://via.placeholder.com/300x150',
    is_active: true,
    created_at: '2024-01-16T00:00:00Z',
    owner_name: '小明出版社',
    owner_email: 'publisher@example.com',
    owner_bio: '專業的數位媒體平台，擁有豐富的廣告投放經驗'
  },
  {
    id: '3',
    owner_id: '1', 
    title: '影片前置廣告',
    type: 'video',
    description: '熱門影片播放前的15秒廣告時段',
    platform_url: 'https://example-video.com',
    price: 8000,
    categories: '娛樂,生活',
    tags: '影片,前置廣告,年輕族群',
    location: '高雄',
    image_url: 'https://via.placeholder.com/350x200',
    is_active: true,
    created_at: '2024-01-17T00:00:00Z',
    owner_name: '小明出版社',
    owner_email: 'publisher@example.com',
    owner_bio: '專業的數位媒體平台，擁有豐富的廣告投放經驗'
  }
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: '1',
    listing_id: '1',
    from_user_id: '2',
    to_user_id: '1', 
    content: '您好，我對這個首頁橫幅廣告位很有興趣，請問可以進一步討論合作細節嗎？',
    is_read: false,
    created_at: '2024-01-20T10:30:00Z'
  }
];

// Mock Ad Posts
export const mockAdPosts: AdPost[] = [
  {
    id: '1',
    advertiser_id: '2',
    title: '尋找科技類網站廣告位',
    budget: 50000,
    target_type: '科技愛好者',
    content: '我們是一家創新科技公司，正在尋找優質的科技類網站進行廣告投放。預算充足，希望能找到合適的合作夥伴。',
    created_at: '2024-01-18T00:00:00Z'
  }
];