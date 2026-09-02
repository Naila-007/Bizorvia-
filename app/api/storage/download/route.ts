import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() { return require('@supabase/supabase-js').createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'); }
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { filename } = await req.json();
  if (!filename || filename.includes('..')) return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });

  const path = `${user.id}/${filename}`;
  const { data, error: urlErr } = await supabase.storage
    .from('bizorvia-storage')
    .createSignedUrl(path, 3600); // 1-hour signed URL

  if (urlErr || !data) return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 });

  return NextResponse.json({ url: data.signedUrl });
}
