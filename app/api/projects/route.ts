import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const _supabaseInstance = null;
function getSupabase() { return require('@supabase/supabase-js').createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'); }
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const NETLIFY = 'https://api.netlify.com/api/v1';
const VERCEL  = 'https://api.vercel.com';
const VERCEL_TEAM = process.env.VERCEL_TEAM_ID || 'team_ZfwSrw62Jhl4tFwGTnak8tAL';

const PLAN_LIMITS: Record<string,number> = { free:3, builder:20, business:100, scale:500 };

async function netlifyFetch(path: string, opts: RequestInit={}) {
  const token = process.env.NETLIFY_API_TOKEN;
  if (!token) return { ok: false, data: { error: 'NETLIFY_API_TOKEN not set' } };
  const res = await fetch(`${NETLIFY}${path}`, { ...opts, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers||{}) } });
  return { ok: res.ok, data: await res.json().catch(()=>({})) };
}

async function vercelFetch(path: string, opts: RequestInit={}) {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return { ok: false, data: { error: 'VERCEL_API_TOKEN not set' } };
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${VERCEL}${path}${sep}teamId=${VERCEL_TEAM}`, { ...opts, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers||{}) } });
  return { ok: res.ok, data: await res.json().catch(()=>({})) };
}

async function getUser(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// GET — list user projects
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ','');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: projects } = await supabase.from('bizorvia_projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  return NextResponse.json({ projects: projects || [] });
}

// POST — create project on chosen provider
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ','');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Plan limit check
  const { data: existing } = await supabase.from('bizorvia_projects').select('id').eq('user_id', user.id);
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
  const plan = profile?.plan || 'free';
  const limit = PLAN_LIMITS[plan] || 3;
  if ((existing||[]).length >= limit) return NextResponse.json({ error: `Limit reached (${limit} projects on ${plan}). Upgrade to add more.` }, { status: 429 });

  const body = await req.json();
  const { name, framework='html', provider='netlify' } = body;
  const slug = `bzv-${user.id.slice(0,6)}-${name.toLowerCase().replace(/[^a-z0-9]/g,'-').slice(0,18)}-${Date.now().toString(36)}`;

  let siteId = '', siteUrl = '', siteName = '';

  if (provider === 'vercel') {
    const { ok, data } = await vercelFetch('/v9/projects', {
      method: 'POST',
      body: JSON.stringify({ name: slug, framework: framework === 'nextjs' ? 'nextjs' : null }),
    });
    if (!ok) return NextResponse.json({ error: data.error?.message || 'Vercel: failed to create project' }, { status: 500 });
    siteId = data.id;
    siteName = data.name;
    siteUrl = `https://${data.name}.vercel.app`;

  } else if (provider === 'cloudflare') {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const cfToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!accountId || !cfToken) return NextResponse.json({ error: 'Cloudflare not connected. Add CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID.' }, { status: 400 });
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: slug, production_branch: 'main' }),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.errors?.[0]?.message || 'Cloudflare: failed' }, { status: 500 });
    siteId = data.result.id;
    siteName = slug;
    siteUrl = `https://${slug}.pages.dev`;

  } else {
    // Default: Netlify
    const { ok, data } = await netlifyFetch('/sites', {
      method: 'POST',
      body: JSON.stringify({ name: slug }),
    });
    if (!ok) return NextResponse.json({ error: data.message || data.error || 'Netlify: failed to create site' }, { status: 500 });
    siteId = data.id;
    siteName = data.name;
    siteUrl = data.ssl_url || data.url || `https://${slug}.netlify.app`;
  }

  const { data: project, error: dbErr } = await supabase.from('bizorvia_projects').insert({
    user_id: user.id, name, framework, provider,
    netlify_site_id: siteId,
    netlify_site_name: siteName,
    url: siteUrl,
    status: 'created',
  }).select().single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ project });
}
