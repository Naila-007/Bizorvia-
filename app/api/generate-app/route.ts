import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PLAN_LIMITS: Record<string, number> = { free: 10, builder: 100, business: 500, scale: 2000 };

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
  return createClient(url, key);
}

function sanitize(input: string): string {
  return input
    .replace(/\bignore (previous|all|above)\b/gi, '')
    .replace(/\bsystem prompt\b/gi, '')
    .replace(/\bact as\b/gi, '')
    .replace(/\bjailbreak\b/gi, '')
    .slice(0, 4000);
}

function stripCodeFence(text: string): string {
  let out = text.trim();
  if (out.startsWith('```')) {
    out = out.replace(/^```[a-zA-Z]*\n/, '').replace(/```\s*$/, '');
  }
  return out.trim();
}

async function getUserAndCredits(token: string) {
  const supabase = getSupabase();
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
  if (!token) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const { user, profile } = await getUserAndCredits(token);
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const plan = profile?.plan || 'free';
  const creditsUsed = profile?.ai_credits_used || 0;
  const creditLimit = PLAN_LIMITS[plan] || 10;
  if (creditsUsed >= creditLimit) {
    return NextResponse.json({ error: `AI credit limit reached (${creditLimit}/mo). Upgrade your plan.`, limitReached: true }, { status: 429 });
  }

  let body: { prompt?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { prompt } = body;
  if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

  const cleanPrompt = sanitize(prompt);
  const instruction = `Build a small working web app demo for this idea: "${cleanPrompt}". Reply with ONLY one complete, self-contained HTML file (inline <style> and <script>, no external files or CDN links). It should actually work in a browser: real buttons, real interactivity with plain JavaScript, sample data if needed. No explanation text, no markdown code fences, just the raw HTML starting with <!DOCTYPE html>.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
      signal: controller.signal,
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 4000, messages: [{ role: 'user', content: instruction }] }),
    });
    const data = await res.json();
    clearTimeout(timeout);

    const raw = data.content?.[0]?.text || '';
    const html = stripCodeFence(raw);
    if (!html || !html.toLowerCase().includes('<html')) {
      return NextResponse.json({ error: 'AI could not generate a working demo this time. Try again.' }, { status: 502 });
    }

    const supabase = getSupabase();
    await supabase.from('profiles').update({ ai_credits_used: creditsUsed + 1 }).eq('id', user.id);

    return NextResponse.json({
      html,
      credits: { used: creditsUsed + 1, limit: creditLimit, remaining: creditLimit - creditsUsed - 1 }
    });
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
