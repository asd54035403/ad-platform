import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: {
      url: process.env.VERCEL_URL,
      env: process.env.VERCEL_ENV,
      region: process.env.VERCEL_REGION,
    },
    database: {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    }
  });
}