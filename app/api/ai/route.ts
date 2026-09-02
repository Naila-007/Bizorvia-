import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_LIMITS: Record<string, number> = { free: 10, builder: 100, business: 500, scale: 2000 };

function sanitize(input: string): string {
  return input
    .replace(/\bignore (previous|all|above)\b/gi, '')
    .replace(/\bsystem prompt\b/gi, '')
    .replace(/\bact as\b/gi, '')
    .replace(/\bjailbreak\b/gi, '')
    .slice(0, 4000);
}

async function getUserAndCredits(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return { user: null, profile: null };
  const { data: profile } = await supabase.from('profiles').select('plan, ai_credits_used').eq('id', user.id).single();
  return { user, profile };
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  if (siteUrl && !origin.startsWith(siteUrl)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  let userId: string | null = null;
  let plan = 'free';
  let creditsUsed = 0;
  let creditLimit = 10;

  if (token) {
    const { user, profile } = await getUserAndCredits(token);
    if (user) {
      userId = user.id;
      plan = profile?.plan || 'free';
      creditsUsed = profile?.ai_credits_used || 0;
      creditLimit = PLAN_LIMITS[plan] || 10;
      if (creditsUsed >= creditLimit) {
        return NextResponse.json({ error: `AI credit limit reached (${creditLimit}/mo). Upgrade your plan.`, limitReached: true }, { status: 429 });
      }
    }
  }

  let body: { prompt?: string; model?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { prompt, model = 'claude' } = body;
  if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

  const cleanPrompt = sanitize(prompt);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    let result = '';

    if (model === 'deepseek' && process.env.DEEPSEEK_API_KEY) {
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` },
        signal: controller.signal,
        body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: cleanPrompt }], max_tokens: 1000 }),
      });
      const data = await res.json();
      result = data.choices?.[0]?.message?.content || '';
    } else {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
        signal: controller.signal,
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: cleanPrompt }] }),
      });
      const data = await res.json();
      result = data.content?.[0]?.text || '';
    }

    clearTimeout(timeout);

    // Consume credit
    if (userId) {
      await supabase.from('profiles').update({ ai_credits_used: creditsUsed + 1 }).eq('id', userId);
    }

    return NextResponse.json({
      result,
      credits: { used: creditsUsed + 1, limit: creditLimit, remaining: creditLimit - creditsUsed - 1 }
    });
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
