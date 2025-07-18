import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeInsert, executeGet } from './db-adapter';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(userId: number, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { userId: number; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string, name: string, role: 'advertiser' | 'publisher'): Promise<number> {
  const hashedPassword = await hashPassword(password);
  
  try {
    const result = await executeInsert(
      'INSERT INTO Users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, role]
    );
    if (!result.lastID) {
      throw new Error('Failed to create user');
    }
    return result.lastID;
  } catch (error) {
    throw error;
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await executeGet('SELECT * FROM Users WHERE email = ?', [email]);
    if (!user) {
      return null;
    }
    
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return null;
    }
    
    const token = generateToken(user.id, user.email, user.role);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token
    };
  } catch (error) {
    throw error;
  }
}

export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }
  
  const user = await executeGet('SELECT id, email, name, role FROM Users WHERE id = ?', [decoded.userId]);
  return user;
}