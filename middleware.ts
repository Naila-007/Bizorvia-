import { NextRequest, NextResponse } from 'next/server';

const SITES_HOST = 'sites.bizorvia.com';

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').split(':')[0];

  if (host === SITES_HOST) {
    const url = req.nextUrl.clone();
    if (!url.pathname.startsWith('/api/site/')) {
      const rest = url.pathname === '/' ? '' : url.pathname;
      url.pathname = `/api/site${rest}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
