import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { getUserFromToken } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const owner = searchParams.get('owner');

    let query = `
      SELECT l.*, u.name as owner_name 
      FROM Listings l 
      JOIN Users u ON l.owner_id = u.id 
    `;
    const params: (string | number)[] = [];

    // Handle owner=me parameter for authenticated users
    if (owner === 'me') {
      const token = request.headers.get('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }

      const user = await getUserFromToken(token);
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid token' },
          { status: 401 }
        );
      }

      query += ' WHERE l.owner_id = ?';
      params.push(user.id);
    } else {
      query += ' WHERE l.is_active = 1';
    }

    if (type) {
      query += ' AND l.type = ?';
      params.push(type);
    }

    if (category) {
      query += ' AND l.categories LIKE ?';
      params.push(`%${category}%`);
    }

    if (search) {
      query += ' AND (l.title LIKE ? OR l.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY l.created_at DESC';

    const listings = await db.all(query, params);

    return NextResponse.json({
      success: true,
      data: listings
    });

  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user || user.role !== 'publisher') {
      return NextResponse.json(
        { success: false, message: 'Only publishers can create listings' },
        { status: 403 }
      );
    }

    const { title, type, description, platform_url, price, categories, tags, location, image_url } = await request.json();

    if (!title || !type || !price) {
      return NextResponse.json(
        { success: false, message: 'Title, type, and price are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO Listings (owner_id, title, type, description, platform_url, price, categories, tags, location, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, title, type, description, platform_url, price, categories, tags, location, image_url]
    );

    return NextResponse.json({
      success: true,
      message: 'Listing created successfully',
      data: { id: result.lastID }
    });

  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}