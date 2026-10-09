import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getAuthUser(token: string) {
  const supabase = getAnonClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

function makeSlug(name: string, userId: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 24);
  const suffix = userId.slice(0, 5) + '-' + Date.now().toString(36);
  return `${base}-${suffix}`;
}

const PLAN_LIMITS: Record<string, number> = { free: 3, builder: 20, business: 100, scale: 500 };

// GET — list user projects
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getAuthUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data: projects, error } = await admin
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ projects: projects || [] });
}

// POST — create a new project
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getAuthUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdminClient();

  // Plan limit check
  const { data: existing } = await admin.from('projects').select('id').eq('user_id', user.id);
  const { data: profile } = await admin.from('profiles').select('plan').eq('id', user.id).single();
  const plan = profile?.plan || 'free';
  const limit = PLAN_LIMITS[plan] || 3;
  if ((existing || []).length >= limit) {
    return NextResponse.json({ error: `Limit reached (${limit} projects on ${plan} plan). Upgrade to add more.` }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const { name, framework = 'html' } = body;
  if (!name?.trim()) return NextResponse.json({ error: 'Project name is required' }, { status: 400 });

  const slug = makeSlug(name.trim(), user.id);
  const url = `https://sites.bizorvia.com/${slug}`;

  const { data: project, error: dbErr } = await admin
    .from('projects')
    .insert({
      user_id: user.id,
      name: name.trim(),
      slug,
      framework,
      url,
      status: 'pending',
    })
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ project });
}
