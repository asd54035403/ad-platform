import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { Pool } from 'pg';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
let pool: Pool | null = null;

const isProduction = process.env.NODE_ENV === 'production';

export async function getDb(): Promise<Pool | Database> {
  if (isProduction) {
    // Use PostgreSQL for production
    if (!pool) {
      const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error('Database connection string not found');
      }
      pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });
    }
    return pool;
  } else {
    // Use SQLite for development
    return await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }
}

export async function initializeDatabase() {
  const db = await getDb();
  
  if (isProduction) {
    // PostgreSQL syntax for production
    await (db as Pool).query(`
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

    await (db as Pool).query(`
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

    await (db as Pool).query(`
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

    await (db as Pool).query(`
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
  } else {
    // SQLite syntax for development
    await (db as Database).exec(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('advertiser', 'publisher')) NOT NULL,
        name TEXT NOT NULL,
        avatar_url TEXT,
        bio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await (db as Database).exec(`
      CREATE TABLE IF NOT EXISTS Listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await (db as Database).exec(`
      CREATE TABLE IF NOT EXISTS Messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER REFERENCES Listings(id),
        from_user_id INTEGER REFERENCES Users(id),
        to_user_id INTEGER REFERENCES Users(id),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await (db as Database).exec(`
      CREATE TABLE IF NOT EXISTS AdPosts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        advertiser_id INTEGER REFERENCES Users(id),
        title TEXT NOT NULL,
        budget INTEGER,
        target_type TEXT,
        content TEXT,
        attachments TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  console.log('Database initialized successfully');
  return db;
}