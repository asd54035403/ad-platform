import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { getUserFromToken } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const advertiser_id = searchParams.get('advertiser_id');
    const target_type = searchParams.get('target_type');
    const search = searchParams.get('search');

    let query = `
      SELECT a.*, u.name as advertiser_name, u.email as advertiser_email
      FROM AdPosts a 
      JOIN Users u ON a.advertiser_id = u.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (advertiser_id) {
      query += ' AND a.advertiser_id = ?';
      params.push(advertiser_id);
    }

    if (target_type) {
      query += ' AND a.target_type = ?';
      params.push(target_type);
    }

    if (search) {
      query += ' AND (a.title LIKE ? OR a.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY a.created_at DESC';

    const ads = await db.all(query, params);

    return NextResponse.json({
      success: true,
      data: ads
    });

  } catch (error) {
    console.error('Get ads error:', error);
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
    if (!user || user.role !== 'advertiser') {
      return NextResponse.json(
        { success: false, message: 'Only advertisers can post ads' },
        { status: 403 }
      );
    }

    const { title, budget, target_type, content, attachments } = await request.json();

    if (!title || !budget || !target_type || !content) {
      return NextResponse.json(
        { success: false, message: 'Title, budget, target_type, and content are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO AdPosts (advertiser_id, title, budget, target_type, content, attachments) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user.id, title, budget, target_type, content, attachments || '']
    );

    return NextResponse.json({
      success: true,
      message: 'Ad requirement posted successfully',
      data: { id: result.lastID }
    });

  } catch (error) {
    console.error('Create ad error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}