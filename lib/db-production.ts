import { Pool } from 'pg';

let pool: Pool | null = null;

export async function getProductionDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function initializeProductionDatabase() {
  const db = await getProductionDb();
  
  // Users table
  await db.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(50) CHECK(role IN ('advertiser', 'publisher')) NOT NULL,
      name VARCHAR(255) NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Listings table
  await db.query(`
    CREATE TABLE IF NOT EXISTS Listings (
      id SERIAL PRIMARY KEY,
      owner_id INTEGER REFERENCES Users(id),
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      platform_url TEXT,
      price INTEGER NOT NULL,
      categories TEXT,
      tags TEXT,
      location TEXT,
      image_url TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Messages table
  await db.query(`
    CREATE TABLE IF NOT EXISTS Messages (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER REFERENCES Listings(id),
      from_user_id INTEGER REFERENCES Users(id),
      to_user_id INTEGER REFERENCES Users(id),
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // AdPosts table
  await db.query(`
    CREATE TABLE IF NOT EXISTS AdPosts (
      id SERIAL PRIMARY KEY,
      advertiser_id INTEGER REFERENCES Users(id),
      title TEXT NOT NULL,
      budget INTEGER,
      target_type TEXT,
      content TEXT,
      attachments TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Production database initialized successfully');
  return db;
}