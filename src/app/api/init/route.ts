import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('API /init called - Starting database initialization');
    await initializeDatabase();
    
    console.log('Database initialization completed successfully');
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to initialize database',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}