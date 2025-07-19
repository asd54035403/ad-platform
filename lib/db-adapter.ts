// Database adapter to handle differences between SQLite and PostgreSQL
import { getDb } from './db';
import type { DbParam } from './types';
import type { Pool } from 'pg';
import type { Database } from 'sqlite';

const isProduction = process.env.NODE_ENV === 'production';

// Prevent database connection during build time
if (process.env.VERCEL_ENV === 'production' && !process.env.VERCEL_URL) {
  // This is build time, skip database operations
}

export async function executeQuery(query: string, params: DbParam[] = []) {
  const db = await getDb();
  
  if (isProduction) {
    // PostgreSQL
    const result = await (db as Pool).query(query, params);
    return result;
  } else {
    // SQLite
    return await (db as Database).all(query, params);
  }
}

export async function executeInsert(query: string, params: DbParam[] = []) {
  const db = await getDb();
  
  if (isProduction) {
    // PostgreSQL - use RETURNING id
    const modifiedQuery = query.replace(/\bINSERT INTO\b/i, 'INSERT INTO') + ' RETURNING id';
    const result = await (db as Pool).query(modifiedQuery, params);
    return { lastID: result.rows[0]?.id };
  } else {
    // SQLite
    return await (db as Database).run(query, params);
  }
}

export async function executeUpdate(query: string, params: DbParam[] = []) {
  const db = await getDb();
  
  if (isProduction) {
    // PostgreSQL
    const result = await (db as Pool).query(query, params);
    return { changes: result.rowCount };
  } else {
    // SQLite
    return await (db as Database).run(query, params);
  }
}

export async function executeDelete(query: string, params: DbParam[] = []) {
  const db = await getDb();
  
  if (isProduction) {
    // PostgreSQL
    const result = await (db as Pool).query(query, params);
    return { changes: result.rowCount };
  } else {
    // SQLite
    return await (db as Database).run(query, params);
  }
}

export async function executeGet(query: string, params: DbParam[] = []) {
  const db = await getDb();
  
  if (isProduction) {
    // PostgreSQL
    const result = await (db as Pool).query(query, params);
    return result.rows[0] || null;
  } else {
    // SQLite
    return await (db as Database).get(query, params);
  }
}

export async function executeAll(query: string, params: DbParam[] = []) {
  const db = await getDb();
  
  if (isProduction) {
    // PostgreSQL
    const result = await (db as Pool).query(query, params);
    return result.rows;
  } else {
    // SQLite
    return await (db as Database).all(query, params);
  }
}