import { NextRequest, NextResponse } from 'next/server';
import { executeAll, executeInsert } from '../../../../lib/db-adapter';
import { getUserFromToken } from '../../../../lib/auth';
import type { DbParam } from '../../../../lib/types';

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const listing_id = searchParams.get('listing_id');

    let query = `
      SELECT m.*, 
             from_user.name as from_user_name, from_user.email as from_user_email,
             to_user.name as to_user_name, to_user.email as to_user_email,
             l.title as listing_title
      FROM Messages m 
      JOIN Users from_user ON m.from_user_id = from_user.id
      JOIN Users to_user ON m.to_user_id = to_user.id
      LEFT JOIN Listings l ON m.listing_id = l.id
      WHERE (m.from_user_id = ? OR m.to_user_id = ?)
    `;
    const params: DbParam[] = [user.id, user.id];

    if (listing_id) {
      query += ' AND m.listing_id = ?';
      params.push(listing_id);
    }

    query += ' ORDER BY m.created_at DESC';

    const messages = await executeAll(query, params);

    return NextResponse.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
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
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { listing_id, to_user_id, content } = await request.json();

    if (!content || !to_user_id) {
      return NextResponse.json(
        { success: false, message: 'Content and to_user_id are required' },
        { status: 400 }
      );
    }

    if (user.id === to_user_id) {
      return NextResponse.json(
        { success: false, message: 'Cannot send message to yourself' },
        { status: 400 }
      );
    }

    const result = await executeInsert(
      `INSERT INTO Messages (listing_id, from_user_id, to_user_id, content) 
       VALUES (?, ?, ?, ?)`,
      [listing_id, user.id, to_user_id, content]
    );

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: { id: result.lastID }
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}