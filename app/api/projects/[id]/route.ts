import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const _supabaseInstance = null;
function getSupabase() { return require('@supabase/supabase-js').createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'); }
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const NETLIFY = 'https://api.netlify.com/api/v1';
const NET_TOKEN = process.env.NETLIFY_API_TOKEN!;

async function netFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${NETLIFY}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${NET_TOKEN}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, data: json };
}

async function getUserProject(token: string, id: string) {
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return { user: null, project: null };
  const { data: project } = await supabase.from('bizorvia_projects').select('*').eq('id', id).eq('user_id', user.id).single();
  return { user, project };
}

// GET — project details + latest deploy info
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { project } = await getUserProject(token, params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Get latest deploy from Netlify
  const { data: deploys } = await netFetch(`/sites/${project.netlify_site_id}/deploys?per_page=5`);
  const latest = Array.isArray(deploys) ? deploys[0] : null;

  return NextResponse.json({ project, latestDeploy: latest });
}

// DELETE — delete project + Netlify site
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { project } = await getUserProject(token, params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await netFetch(`/sites/${project.netlify_site_id}`, { method: 'DELETE' });
  await supabase.from('bizorvia_projects').delete().eq('id', params.id);

  return NextResponse.json({ success: true });
}
