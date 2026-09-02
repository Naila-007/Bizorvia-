import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const _supabaseInstance = null;
function getSupabase() { return require('@supabase/supabase-js').createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'); }
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const NETLIFY = 'https://api.netlify.com/api/v1';
const NET_TOKEN = process.env.NETLIFY_API_TOKEN!;

async function getProject(token: string, id: string) {
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return null;
  const { data } = await supabase.from('bizorvia_projects').select('*').eq('id', id).eq('user_id', user.id).single();
  return data;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const project = await getProject(token, params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const res = await fetch(`${NETLIFY}/accounts/${project.netlify_site_id}/env`, {
    headers: { Authorization: `Bearer ${NET_TOKEN}` },
  });
  // Fallback: get site-level env
  const res2 = await fetch(`${NETLIFY}/sites/${project.netlify_site_id}`, { headers: { Authorization: `Bearer ${NET_TOKEN}` } });
  const site = await res2.json();
  const vars = site.build_settings?.env || {};
  const list = Object.entries(vars).map(([key, value]) => ({ key, value: '***' }));
  return NextResponse.json({ env: list });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const project = await getProject(token, params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { key, value } = await req.json();
  if (!key || !/^[A-Z0-9_]+$/.test(key)) return NextResponse.json({ error: 'Invalid key (use UPPER_SNAKE_CASE)' }, { status: 400 });

  // Get current site env
  const r = await fetch(`${NETLIFY}/sites/${project.netlify_site_id}`, { headers: { Authorization: `Bearer ${NET_TOKEN}` } });
  const site = await r.json();
  const currentEnv = site.build_settings?.env || {};

  // Update with new key
  const res = await fetch(`${NETLIFY}/sites/${project.netlify_site_id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${NET_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ build_settings: { env: { ...currentEnv, [key]: value } } }),
  });

  if (!res.ok) return NextResponse.json({ error: 'Failed to set env var' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const project = await getProject(token, params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { key } = await req.json();
  const r = await fetch(`${NETLIFY}/sites/${project.netlify_site_id}`, { headers: { Authorization: `Bearer ${NET_TOKEN}` } });
  const site = await r.json();
  const env = { ...site.build_settings?.env };
  delete env[key];

  await fetch(`${NETLIFY}/sites/${project.netlify_site_id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${NET_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ build_settings: { env } }),
  });

  return NextResponse.json({ success: true });
}
