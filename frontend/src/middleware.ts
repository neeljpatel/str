import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  let path = request.nextUrl.pathname;
  let url = request.nextUrl.clone();
  let rewritten = false;

  // Custom subdomain routing for the admin portal
  const hostname = request.headers.get('host') || '';
  const isAdminDomain = hostname.startsWith('admin.chicagoavecollective.com');

  if (isAdminDomain && !path.startsWith('/admin')) {
    path = `/admin${path}`;
    url.pathname = path;
    rewritten = true;
  }

  // Update Supabase session and get current user
  const { supabaseResponse, user } = await updateSession(request, rewritten, url);

  if (path.startsWith('/admin')) {
    // If accessing login
    if (path === '/admin/login') {
      // If already logged in, redirect to dashboard
      if (user) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = isAdminDomain ? '/dashboard' : '/admin/dashboard';
        return NextResponse.redirect(dashboardUrl);
      }
      return supabaseResponse;
    }
    
    // Auth Guard: If no user, boot to login
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = isAdminDomain ? '/login' : '/admin/login';
      return NextResponse.redirect(loginUrl);
    }

    // Redirect root admin hits to dashboard
    if (path === '/admin') {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = isAdminDomain ? '/dashboard' : '/admin/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
