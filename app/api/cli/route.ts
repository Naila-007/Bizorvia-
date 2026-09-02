import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() { return require('@supabase/supabase-js').createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'); }
const PLAN_LIMITS: Record<string, number> = { free: 10, builder: 100, business: 500, scale: 2000 };

function sanitize(input: string): string {
  return String(input)
    .replace(/\bignore (previous|all|above)\b/gi, '')
    .replace(/\bsystem prompt\b/gi, '')
    .replace(/\bjailbreak\b/gi, '')
    .slice(0, 8000); // CLI gets higher limit than web
}

export async function POST(req: NextRequest) {
  const ua = req.headers.get('user-agent') || '';
  const isCliAgent = ua.startsWith('bizorvia-cli/');

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized. Run: bizorvia login' }, { status: 401 });

  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: 'Invalid session. Run: bizorvia login' }, { status: 401 });

  // Credits check
  const { data: profile } = await supabase.from('profiles').select('plan, ai_credits_used').eq('id', user.id).single();
  const plan = profile?.plan || 'free';
  const limit = PLAN_LIMITS[plan] || 10;
  const used = profile?.ai_credits_used || 0;
  if (used >= limit) {
    return NextResponse.json({ error: `Credit limit reached (${used}/${limit}). Upgrade: bizorvia.com/pricing`, limitReached: true, plan }, { status: 429 });
  }

  let body: { prompt?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const { prompt } = body;
  if (!prompt) return NextResponse.json({ error: 'prompt is required' }, { status: 400 });

  const cleanPrompt = sanitize(prompt);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000); // 45s for CLI (longer tasks)

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: 'You are Bizorvia, an expert coding agent running in a developer\'s terminal. Produce working, production-quality code. Be concise but complete. Format code in markdown code blocks with the correct language tag.',
        messages: [{ role: 'user', content: cleanPrompt }],
      }),
    });

    clearTimeout(timeout);
    const data = await res.json();
    const result = data.content?.[0]?.text || '';

    // Consume credit
    await supabase.from('profiles').update({ ai_credits_used: used + 1 }).eq('id', user.id);

    return NextResponse.json({
      result,
      credits: { used: used + 1, limit, remaining: limit - used - 1, plan },
    });
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') return NextResponse.json({ error: 'Request timed out (45s limit)' }, { status: 408 });
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
