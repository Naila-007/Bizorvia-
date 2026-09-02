import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const _supabaseInstance = null;
function getSupabase() { return require('@supabase/supabase-js').createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'); }
// const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FREE_LIMIT_BYTES = 500 * 1024 * 1024; // 500MB free

// GET — list user's files
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const folder = `${user.id}/`;
  const { data: files, error: listErr } = await supabase.storage.from('bizorvia-storage').list(folder, {
    limit: 200, offset: 0, sortBy: { column: 'created_at', order: 'desc' }
  });

  if (listErr) return NextResponse.json({ files: [], totalBytes: 0 });

  const safeFiles = (files || [])
    .filter(f => f.name !== '.emptyFolderPlaceholder')
    .map(f => ({
      name: f.name,
      size: f.metadata?.size || 0,
      type: f.metadata?.mimetype || 'application/octet-stream',
      createdAt: f.created_at,
      path: `${folder}${f.name}`,
    }));

  const totalBytes = safeFiles.reduce((sum, f) => sum + f.size, 0);

  return NextResponse.json({ files: safeFiles, totalBytes, limitBytes: FREE_LIMIT_BYTES });
}

// DELETE — delete a file
export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { filename } = await req.json();
  if (!filename || filename.includes('..')) return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });

  const path = `${user.id}/${filename}`;
  const { error: delErr } = await supabase.storage.from('bizorvia-storage').remove([path]);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
