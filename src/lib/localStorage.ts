import { User, Listing, Message, AdPost, mockUsers, mockListings, mockMessages, mockAdPosts } from './mockData';

// Auth related
export const AUTH_TOKEN_KEY = 'ad_platform_token';
export const CURRENT_USER_KEY = 'ad_platform_user';

// Data keys
export const LISTINGS_KEY = 'ad_platform_listings';
export const MESSAGES_KEY = 'ad_platform_messages'; 
export const AD_POSTS_KEY = 'ad_platform_ad_posts';
export const USERS_KEY = 'ad_platform_users';

// Helper functions
const getItem = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const setItem = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('LocalStorage setItem error:', error);
  }
};

// Initialize mock data if not exists
export const initializeMockData = () => {
  if (!getItem(USERS_KEY)) {
    setItem(USERS_KEY, mockUsers);
  }
  if (!getItem(LISTINGS_KEY)) {
    setItem(LISTINGS_KEY, mockListings);
  }
  if (!getItem(MESSAGES_KEY)) {
    setItem(MESSAGES_KEY, mockMessages);
  }
  if (!getItem(AD_POSTS_KEY)) {
    setItem(AD_POSTS_KEY, mockAdPosts);
  }
};

// Auth functions
export const saveAuthToken = (token: string) => {
  setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return getItem(AUTH_TOKEN_KEY);
};

export const saveCurrentUser = (user: User) => {
  setItem(CURRENT_USER_KEY, user);
};

export const getCurrentUser = (): User | null => {
  return getItem(CURRENT_USER_KEY);
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

// User functions
export const getUsers = (): User[] => {
  return getItem(USERS_KEY) || [];
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const createUser = (userData: Omit<User, 'id' | 'created_at'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  setItem(USERS_KEY, users);
  return newUser;
};

// Listing functions
export const getListings = (): Listing[] => {
  return getItem(LISTINGS_KEY) || [];
};

export const getListingById = (id: string): Listing | null => {
  const listings = getListings();
  return listings.find(listing => listing.id === id) || null;
};

export const getListingsByOwner = (ownerId: string): Listing[] => {
  const listings = getListings();
  return listings.filter(listing => listing.owner_id === ownerId);
};

export const createListing = (listingData: Omit<Listing, 'id' | 'created_at'>): Listing => {
  const listings = getListings();
  const newListing: Listing = {
    ...listingData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  listings.push(newListing);
  setItem(LISTINGS_KEY, listings);
  return newListing;
};

export const updateListing = (id: string, updates: Partial<Listing>): Listing | null => {
  const listings = getListings();
  const index = listings.findIndex(listing => listing.id === id);
  if (index === -1) return null;
  
  listings[index] = { ...listings[index], ...updates };
  setItem(LISTINGS_KEY, listings);
  return listings[index];
};

export const deleteListing = (id: string): boolean => {
  const listings = getListings();
  const filteredListings = listings.filter(listing => listing.id !== id);
  if (filteredListings.length === listings.length) return false;
  
  setItem(LISTINGS_KEY, filteredListings);
  return true;
};

// Message functions
export const getMessages = (): Message[] => {
  return getItem(MESSAGES_KEY) || [];
};

export const getMessagesByUserId = (userId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(msg => msg.from_user_id === userId || msg.to_user_id === userId);
};

export const createMessage = (messageData: Omit<Message, 'id' | 'created_at'>): Message => {
  const messages = getMessages();
  const newMessage: Message = {
    ...messageData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  messages.push(newMessage);
  setItem(MESSAGES_KEY, messages);
  return newMessage;
};

// Ad Post functions
export const getAdPosts = (): AdPost[] => {
  return getItem(AD_POSTS_KEY) || [];
};

export const createAdPost = (adPostData: Omit<AdPost, 'id' | 'created_at'>): AdPost => {
  const adPosts = getAdPosts();
  const newAdPost: AdPost = {
    ...adPostData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  adPosts.push(newAdPost);
  setItem(AD_POSTS_KEY, adPosts);
  return newAdPost;
};