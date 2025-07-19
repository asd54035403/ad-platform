import { NextRequest, NextResponse } from 'next/server';
import { executeGet } from '../../../../lib/db-adapter';
import { getUserFromToken } from '../../../../lib/auth';

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

    let stats = {};

    if (user.role === 'advertiser') {
      // Get advertiser statistics
      const activeAds = await executeGet(
        'SELECT COUNT(*) as count FROM AdPosts WHERE advertiser_id = ?',
        [user.id]
      );

      const unreadMessages = await executeGet(
        'SELECT COUNT(*) as count FROM Messages WHERE to_user_id = ? AND is_read = 0',
        [user.id]
      );

      const monthlyMessages = await executeGet(
        `SELECT COUNT(*) as count FROM Messages 
         WHERE (from_user_id = ? OR to_user_id = ?) 
         AND created_at >= datetime('now', '-30 days')`,
        [user.id, user.id]
      );

      stats = {
        active_ads: activeAds.count,
        unread_messages: unreadMessages.count,
        monthly_interactions: monthlyMessages.count
      };

    } else if (user.role === 'publisher') {
      // Get publisher statistics
      const activeListings = await executeGet(
        'SELECT COUNT(*) as count FROM Listings WHERE owner_id = ? AND is_active = 1',
        [user.id]
      );

      const unreadMessages = await executeGet(
        'SELECT COUNT(*) as count FROM Messages WHERE to_user_id = ? AND is_read = 0',
        [user.id]
      );

      const monthlyMessages = await executeGet(
        `SELECT COUNT(*) as count FROM Messages 
         WHERE (from_user_id = ? OR to_user_id = ?) 
         AND created_at >= datetime('now', '-30 days')`,
        [user.id, user.id]
      );

      stats = {
        active_listings: activeListings.count,
        unread_messages: unreadMessages.count,
        monthly_interactions: monthlyMessages.count
      };
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}