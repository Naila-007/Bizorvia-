import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const cookies = req.cookies.getAll();
    const hasSession = cookies.some(c =>
      c.name.startsWith('sb-') ||
      c.name === 'supabase-auth-token'
    );
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login?from=admin', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
