import { NextResponse } from 'next/server';

export function middleware(request) {
  const sessionCookie = request.cookies.get('admin_session');

  // Guard block intercepts rogue unauthenticated sub-queries on administrative endpoints
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!sessionCookie && request.nextUrl.pathname !== '/admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};