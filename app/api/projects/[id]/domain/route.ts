import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getAuthUser(token: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// POST — update custom domain for a project
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getAuthUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data: project } = await admin
    .from('projects')
    .select('id, slug')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { domain } = await req.json().catch(() => ({}));
  if (!domain || !domain.includes('.')) {
    return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
  }

  await admin.from('projects').update({ custom_domain: domain }).eq('id', id);

  return NextResponse.json({
    success: true,
    dnsInfo: {
      type: 'CNAME',
      host: domain,
      value: `${project.slug}.bizorvia.com`,
    },
  });
}
