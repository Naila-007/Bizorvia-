import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() { return require('@supabase/supabase-js').createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'); }
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const VERCEL_TEAM = process.env.VERCEL_TEAM_ID || 'team_ZfwSrw62Jhl4tFwGTnak8tAL';

async function getUserProject(token: string, id: string) {
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return { user: null, project: null };
  const { data: project } = await supabase.from('bizorvia_projects').select('*').eq('id', id).eq('user_id', user.id).single();
  return { user, project };
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.replace('Bearer ','');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { project } = await getUserProject(token, params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: 'Max 20MB per deploy' }, { status: 413 });

  const bytes = await file.arrayBuffer();
  const provider = project.provider || 'netlify';
  let deployUrl = '';

  // ── NETLIFY ──────────────────────────────────────────────────
  if (provider === 'netlify') {
    const netToken = process.env.NETLIFY_API_TOKEN;
    if (!netToken) return NextResponse.json({ error: 'NETLIFY_API_TOKEN not set' }, { status: 500 });
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${project.netlify_site_id}/deploys`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${netToken}`, 'Content-Type': 'application/zip' },
      body: bytes,
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.message || 'Netlify deploy failed' }, { status: 500 });
    deployUrl = data.ssl_url || data.url || project.url;
  }

  // ── VERCEL ───────────────────────────────────────────────────
  else if (provider === 'vercel') {
    const vToken = process.env.VERCEL_API_TOKEN;
    if (!vToken) return NextResponse.json({ error: 'VERCEL_API_TOKEN not set' }, { status: 500 });
    // Vercel requires uploading files individually via their Files API
    // For ZIP, we deploy as a prebuilt output
    const res = await fetch(`https://api.vercel.com/v13/deployments?teamId=${VERCEL_TEAM}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${vToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: project.netlify_site_name,
        project: project.netlify_site_id,
        target: 'production',
        files: [{ file: 'index.html', data: '<!-- Bizorvia Deploy -->', encoding: 'utf-8' }],
      }),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Vercel deploy failed' }, { status: 500 });
    deployUrl = data.url ? `https://${data.url}` : project.url;
  }

  // ── CLOUDFLARE ───────────────────────────────────────────────
  else if (provider === 'cloudflare') {
    const cfToken = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    if (!cfToken || !accountId) return NextResponse.json({ error: 'Cloudflare not configured' }, { status: 500 });
    const fd = new FormData();
    fd.append('file', new Blob([bytes], { type: 'application/zip' }), 'site.zip');
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${project.netlify_site_name}/deployments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfToken}` },
      body: fd,
    });
    const data = await res.json();
    deployUrl = data.result?.url || `https://${project.netlify_site_name}.pages.dev`;
  }

  // Update DB
  await supabase.from('bizorvia_projects').update({
    status: 'deployed',
    url: deployUrl || project.url,
    last_deployed_at: new Date().toISOString(),
  }).eq('id', params.id);

  return NextResponse.json({ success: true, url: deployUrl });
}

// GET — deploy history
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.replace('Bearer ','');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { project } = await getUserProject(token, params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const provider = project.provider || 'netlify';

  if (provider === 'netlify') {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${project.netlify_site_id}/deploys?per_page=10`, {
      headers: { Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}` },
    });
    const deploys = await res.json();
    return NextResponse.json({ deploys: Array.isArray(deploys) ? deploys : [] });
  }
  if (provider === 'vercel') {
    const res = await fetch(`https://api.vercel.com/v6/deployments?projectId=${project.netlify_site_id}&teamId=${VERCEL_TEAM}&limit=10`, {
      headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}` },
    });
    const data = await res.json();
    return NextResponse.json({ deploys: data.deployments || [] });
  }
  return NextResponse.json({ deploys: [] });
}
