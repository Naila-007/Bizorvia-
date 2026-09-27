import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}
async function getAuthUser(token: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// GET — list env var keys for a project (never values)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getAuthUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data: project } = await admin.from('projects').select('id, env_vars').eq('id', id).eq('user_id', user.id).single();
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const keys = project.env_vars ? Object.keys(project.env_vars) : [];
  return NextResponse.json({ keys });
}

// POST — add / update a single env var (accepts { key, value } from frontend)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getAuthUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data: project } = await admin.from('projects').select('id, env_vars').eq('id', id).eq('user_id', user.id).single();
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));

  let updatedEnv: Record<string, string> = { ...(project.env_vars || {}) };
  if (body.key && body.value !== undefined) {
    const cleanKey = String(body.key).toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    updatedEnv[cleanKey] = String(body.value);
  } else if (body.env && typeof body.env === 'object') {
    updatedEnv = { ...updatedEnv, ...body.env };
  } else {
    return NextResponse.json({ error: 'Provide { key, value } or { env: {...} }' }, { status: 400 });
  }

  await admin.from('projects').update({ env_vars: updatedEnv }).eq('id', id);
  return NextResponse.json({ success: true });
}
