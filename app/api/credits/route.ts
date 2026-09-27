import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
const PLAN_LIMITS: Record<string, number> = { free: 10, builder: 100, business: 500, scale: 2000 };

async function getAuthUser(token: string) {
  const supabase = getAnonClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getAuthUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data: profile } = await admin.from('profiles').select('plan, ai_credits_used, ai_credits_reset_at').eq('id', user.id).single();
  const plan = profile?.plan || 'free';
  const limit = PLAN_LIMITS[plan] || 10;
  const used = profile?.ai_credits_used || 0;

  return NextResponse.json({ used, limit, plan, remaining: Math.max(0, limit - used) });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getAuthUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data: profile } = await admin.from('profiles').select('plan, ai_credits_used').eq('id', user.id).single();
  const plan = profile?.plan || 'free';
  const limit = PLAN_LIMITS[plan] || 10;
  const used = (profile?.ai_credits_used || 0) + 1;

  if (used > limit) return NextResponse.json({ error: 'Credit limit reached', limit, plan }, { status: 429 });

  await admin.from('profiles').update({ ai_credits_used: used }).eq('id', user.id);
  return NextResponse.json({ used, limit, remaining: limit - used });
}
