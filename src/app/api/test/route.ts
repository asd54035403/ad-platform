import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasDatabase: !!process.env.POSTGRES_URL,
      hasJWT: !!process.env.JWT_SECRET,
      vercelEnv: process.env.VERCEL_ENV || 'not-vercel'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}