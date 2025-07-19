// Database parameter type
export type DbParam = string | number | boolean | null;

// Database error type
export interface DatabaseError extends Error {
  code?: string;
  errno?: number;
  sqlState?: string;
}

// User types
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'advertiser' | 'publisher';
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface UserWithToken extends Omit<User, 'password'> {
  token: string;
}

// Listing types
export interface Listing {
  id: number;
  owner_id: number;
  title: string;
  type: string;
  description?: string;
  platform_url?: string;
  price: number;
  categories?: string;
  tags?: string;
  location?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  owner_name?: string;
  owner_email?: string;
}

// Message types
export interface Message {
  id: number;
  listing_id?: number;
  from_user_id: number;
  to_user_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  from_user_name?: string;
  from_user_email?: string;
  to_user_name?: string;
  to_user_email?: string;
  listing_title?: string;
}

// Ad post types
export interface AdPost {
  id: number;
  advertiser_id: number;
  title: string;
  budget?: number;
  target_type?: string;
  content?: string;
  attachments?: string;
  created_at: string;
  advertiser_name?: string;
  advertiser_email?: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Dashboard stats types
export interface DashboardStats {
  active_ads?: number;
  active_listings?: number;
  unread_messages: number;
  monthly_interactions: number;
}