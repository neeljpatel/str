import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/admin')) {
    // If accessing login, allow it
    if (path === '/admin/login') {
      return NextResponse.next();
    }
    
    // Check if session exists
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
