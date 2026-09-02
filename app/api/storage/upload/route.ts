import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() { return require('@supabase/supabase-js').createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'); }
const FREE_LIMIT_BYTES = 500 * 1024 * 1024; // 500MB
const FILE_MAX_BYTES   = 50 * 1024 * 1024;  // 50MB per file

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (file.size > FILE_MAX_BYTES) return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 413 });

  // Sanitize filename
  const safeName = file.name.replace(/[^a-zA-Z0-9._\-\s]/g, '_').slice(0, 200);
  const folder = `${user.id}/`;

  // Check total usage
  const { data: existing } = await supabase.storage.from('bizorvia-storage').list(folder, { limit: 200 });
  const totalUsed = (existing || []).reduce((sum, f) => sum + (f.metadata?.size || 0), 0);
  if (totalUsed + file.size > FREE_LIMIT_BYTES) {
    return NextResponse.json({ error: 'Storage full (500MB free limit reached)' }, { status: 413 });
  }

  const bytes = await file.arrayBuffer();
  const { error: uploadErr } = await supabase.storage
    .from('bizorvia-storage')
    .upload(`${folder}${safeName}`, bytes, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    });

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  return NextResponse.json({ success: true, name: safeName, size: file.size });
}
