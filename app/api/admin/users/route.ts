import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'neelodigitalproducts@gmail.com';
const ALLOWED_ORIGINS = ['https://bizorvia.com', 'https://www.bizorvia.com', 'https://bizorvia-full-fgyb4wkys-sellovate-s-projects.vercel.app'];

export async function GET(req: NextRequest) {
  try {
    // CSRF check
    const origin = req.headers.get('origin') || '';
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && !ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify token with Supabase
    const anonClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: { user }, error } = await anonClient.auth.getUser(token);
    if (error || !user) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

    // Double check: email must match AND be verified
    if (user.email !== ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!user.email_confirmed_at) return NextResponse.json({ error: 'Email not verified' }, { status: 403 });

    // Use service role to fetch all users
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

    const serviceClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error: fetchError } = await serviceClient
      .from('profiles')
      .select('id, email, full_name, plan, created_at, stripe_customer_id')
      .order('created_at', { ascending: false });

    if (fetchError) return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });

    // Redact sensitive fields before returning
    const sanitized = (data || []).map(p => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      plan: p.plan,
      created_at: p.created_at,
      has_billing: !!p.stripe_customer_id,
    }));

    return NextResponse.json(sanitized);

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
