import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || '';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    if (siteUrl && !origin.startsWith(siteUrl)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const { name, email, company, plan, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Sanitize
    const clean = (s: string) => String(s).slice(0, 2000).replace(/<[^>]*>/g, '');

    // Log to console (visible in Netlify function logs)
    console.log('[CONTACT FORM]', { name: clean(name), email: clean(email), company: clean(company || ''), plan, message: clean(message) });

    // TODO: Send to email via SendGrid/Resend when ready
    // For now: stored in Supabase if table exists, else just logged
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
