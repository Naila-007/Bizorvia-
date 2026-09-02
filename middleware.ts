import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block direct access to /admin — redirect to login if no session cookie
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('sb-access-token')?.value ||
                  req.cookies.get('sb-xcbezfmthtcbmcpfilyk-auth-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login?from=admin', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
