import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() { return require('@supabase/supabase-js').createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'); }
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const NETLIFY = 'https://api.netlify.com/api/v1';
const NET_TOKEN = process.env.NETLIFY_API_TOKEN!;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: project } = await supabase.from('bizorvia_projects').select('*').eq('id', params.id).eq('user_id', user.id).single();
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { domain } = await req.json();
  if (!domain || !domain.includes('.')) return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });

  const res = await fetch(`${NETLIFY}/sites/${project.netlify_site_id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${NET_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ custom_domain: domain }),
  });

  if (!res.ok) return NextResponse.json({ error: 'Failed to set domain. Make sure DNS is configured.' }, { status: 500 });
  const data = await res.json();

  await supabase.from('bizorvia_projects').update({ custom_domain: domain }).eq('id', params.id);

  return NextResponse.json({ success: true, dnsInfo: { type: 'CNAME', host: domain, value: data.default_domain } });
}
