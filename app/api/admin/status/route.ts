import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'oracledigitalmarketingagency@gmail.com';
const ALLOWED_ORIGINS = ['https://bizorvia.com', 'https://www.bizorvia.com', 'https://bizorvia-full-fgyb4wkys-sellovate-s-projects.vercel.app'];

// Reports whether each backend integration is actually configured on this
// deployment (server-side env vars present), without ever exposing the
// secret values themselves. Used by the admin Health/Plans tabs so those
// statuses reflect reality instead of a hardcoded label.
export async function GET(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || '';
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && !ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const anonClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: { user }, error } = await anonClient.auth.getUser(token);
    if (error || !user) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

    if (user.email !== ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!user.email_confirmed_at) return NextResponse.json({ error: 'Email not verified' }, { status: 403 });

    return NextResponse.json({
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      aiConfigured: !!process.env.ANTHROPIC_API_KEY,
      emailConfigured: !!process.env.RESEND_API_KEY,
      supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
