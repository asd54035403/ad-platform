import { NextRequest, NextResponse } from 'next/server';
import { executeGet, executeUpdate } from '../../../../../lib/db-adapter';
import { getUserFromToken } from '../../../../../lib/auth';
import type { DbParam } from '../../../../../lib/types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listing = await executeGet(`
      SELECT l.*, u.name as owner_name, u.email as owner_email, u.bio as owner_bio
      FROM Listings l 
      JOIN Users u ON l.owner_id = u.id 
      WHERE l.id = ? AND l.is_active = 1
    `, [params.id]);

    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: listing
    });

  } catch (error) {
    console.error('Get listing error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
        { success: false, message: 'Only publishers can update listings' },
        { status: 403 }
      );
    }

    // Check if listing exists and belongs to user
    const existingListing = await executeGet(
      'SELECT * FROM Listings WHERE id = ? AND owner_id = ?',
      [params.id, user.id]
    );

    if (!existingListing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found or not owned by you' },
        { status: 404 }
      );
    }

    const updates = await request.json();
    const allowedFields = ['title', 'type', 'description', 'platform_url', 'price', 'categories', 'tags', 'location', 'image_url', 'is_active'];
    
    const updateFields: string[] = [];
    const updateValues: DbParam[] = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value as DbParam);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updateValues.push(params.id);

    await executeUpdate(
      `UPDATE Listings SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    return NextResponse.json({
      success: true,
      message: 'Listing updated successfully'
    });

  } catch (error) {
    console.error('Update listing error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
        { success: false, message: 'Only publishers can delete listings' },
        { status: 403 }
      );
    }

    // Check if listing exists and belongs to user
    const existingListing = await executeGet(
      'SELECT * FROM Listings WHERE id = ? AND owner_id = ?',
      [params.id, user.id]
    );

    if (!existingListing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found or not owned by you' },
        { status: 404 }
      );
    }

    // Soft delete by setting is_active to 0
    await executeUpdate(
      'UPDATE Listings SET is_active = 0 WHERE id = ?',
      [params.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}