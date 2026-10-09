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

async function getUserAndCredits(token: string) {
  const supabase = getSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return { user: null, profile: null };
  const { data: profile } = await supabase.from('profiles').select('plan, ai_credits_used').eq('id', user.id).single();
  return { user, profile };
}

const ALLOWED_ORIGINS = [
  'https://bizorvia.com',
  'https://www.bizorvia.com',
];
const VERCEL_PREVIEW_RE = /^https:\/\/bizorvia[a-z0-9-]*\.vercel\.app$/;

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const isDev = process.env.NODE_ENV === 'development';
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const isAllowed =
    isDev ||
    ALLOWED_ORIGINS.some((o) => origin.startsWith(o)) ||
    (configuredSiteUrl && origin.startsWith(configuredSiteUrl)) ||
    VERCEL_PREVIEW_RE.test(origin);
  if (origin && !isAllowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  // Every caller must be signed in. Without this check, anyone could call
  // this route with no Authorization header (or a bad one) and skip the
  // credit check entirely below — a free, unlimited, unmetered way to run
  // the paid Anthropic API (with web search billed on top) at your cost.
  if (!token) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const { user, profile } = await getUserAndCredits(token);
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const userId: string = user.id;
  const plan = profile?.plan || 'free';
  const creditsUsed = profile?.ai_credits_used || 0;
  const creditLimit = PLAN_LIMITS[plan] || 10;
  if (creditsUsed >= creditLimit) {
    return NextResponse.json({ error: `AI credit limit reached (${creditLimit}/mo). Upgrade your plan.`, limitReached: true }, { status: 429 });
  }

  let body: { prompt?: string; model?: string; deepResearch?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { prompt, model = 'claude', deepResearch = false } = body;
  if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

  const cleanPrompt = deepResearch
    ? `${sanitize(prompt)}\n\nDo real, thorough research for this: search multiple sources, compare what you find, and note where sources agree or disagree before giving your answer.`
    : sanitize(prompt);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), deepResearch ? 55000 : 40000);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function callAnthropic(withSearch: boolean): Promise<any> {
    const reqBody: Record<string, unknown> = {
      model: 'claude-sonnet-4-6',
      max_tokens: withSearch ? (deepResearch ? 2500 : 1500) : 1000,
      messages: [{ role: 'user', content: cleanPrompt }],
    };
    if (withSearch) {
      // Real, server-side web search — Claude decides if/when to search and
      // returns genuine citations (url, title, quoted text) tied to its
      // search results. Deep research mode allows more searches so it can
      // actually compare multiple sources, capped to bound cost either way.
      reqBody.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: deepResearch ? 6 : 3 }];
    }
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01' },
      signal: controller.signal,
      body: JSON.stringify(reqBody),
    });
    const data = await res.json();
    if (!res.ok || data?.error) {
      throw new Error(data?.error?.message || `Anthropic API error (${res.status})`);
    }
    return data;
  }

  try {
    let result = '';
    type Citation = { url: string; title: string; quote: string };
    let citations: Citation[] = [];

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
      // Try with real web search first; if it's unavailable on this account
      // or plan, fall back to a plain answer so the core AI feature never breaks.
      let data;
      try {
        data = await callAnthropic(true);
      } catch {
        data = await callAnthropic(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blocks: any[] = Array.isArray(data.content) ? data.content : [];
      for (const block of blocks) {
        if (block.type === 'text') {
          result += block.text;
          if (Array.isArray(block.citations)) {
            for (const c of block.citations) {
              if (c?.url) {
                citations.push({ url: c.url, title: c.title || c.url, quote: c.cited_text || '' });
              }
            }
          }
        }
      }
      const seen = new Set<string>();
      citations = citations.filter((c) => {
        if (seen.has(c.url)) return false;
        seen.add(c.url);
        return true;
      }).slice(0, 8);
    }
    clearTimeout(timeout);

    if (userId) {
      const supabase = getSupabase();
      await supabase.from('profiles').update({ ai_credits_used: creditsUsed + 1 }).eq('id', userId);
    }

    return NextResponse.json({
      result,
      citations,
      credits: { used: creditsUsed + 1, limit: creditLimit, remaining: creditLimit - creditsUsed - 1 }
    });
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}
