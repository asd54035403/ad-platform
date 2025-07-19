import { NextRequest, NextResponse } from 'next/server';

let dbInitialized = false;

export async function middleware(request: NextRequest) {
  // Only initialize database once on first request
  if (!dbInitialized && process.env.NODE_ENV === 'production') {
    try {
      const response = await fetch(new URL('/api/init', request.url), {
        method: 'POST',
      });
      
      if (response.ok) {
        dbInitialized = true;
        console.log('Database initialized via middleware');
      } else {
        console.error('Failed to initialize database via middleware');
      }
    } catch (error) {
      console.error('Middleware database initialization error:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}