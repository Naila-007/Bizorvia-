import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// ─── Provider configs ─────────────────────────────────────────
const PROVIDERS = {
  netlify: {
    name: 'Netlify',
    base: 'https://api.netlify.com/api/v1',
    token: () => process.env.NETLIFY_API_TOKEN,
    free: '500 sites · 100GB BW · 125k functions/mo',
  },
  vercel: {
    name: 'Vercel',
    base: 'https://api.vercel.com',
    token: () => process.env.VERCEL_API_TOKEN,
    teamId: () => process.env.VERCEL_TEAM_ID || 'team_ZfwSrw62Jhl4tFwGTnak8tAL',
    free: 'Unlimited projects · 100GB BW · 6000 build mins',
  },
  cloudflare: {
    name: 'Cloudflare Pages',
    base: 'https://api.cloudflare.com/client/v4',
    token: () => process.env.CLOUDFLARE_API_TOKEN,
    accountId: () => process.env.CLOUDFLARE_ACCOUNT_ID,
    free: 'Unlimited sites · Unlimited BW · 500 builds/mo',
  },
};

async function netFetch(provider: string, path: string, opts: RequestInit = {}) {
  const p = PROVIDERS[provider as keyof typeof PROVIDERS];
  if (!p) throw new Error(`Unknown provider: ${provider}`);
  const token = p.token();
  if (!token) return { ok: false, data: { error: `${p.name} not connected. Add ${provider.toUpperCase()}_API_TOKEN to env vars.` } };

  const teamQ = provider === 'vercel' ? `${path.includes('?') ? '&' : '?'}teamId=${(p as any).teamId()}` : '';
  const res = await fetch(`${p.base}${path}${teamQ}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

// GET — provider status check
export async function GET(req: NextRequest) {
  const statuses = await Promise.all(
    Object.entries(PROVIDERS).map(async ([key, p]) => {
      const token = p.token();
      if (!token) return { provider: key, name: p.name, connected: false, free: p.free };
      try {
        let path = key === 'netlify' ? '/accounts' : key === 'vercel' ? '/v2/user' : '/user/tokens';
        const { ok } = await netFetch(key, path);
        return { provider: key, name: p.name, connected: ok, free: p.free };
      } catch {
        return { provider: key, name: p.name, connected: false, free: p.free };
      }
    })
  );
  return NextResponse.json({ providers: statuses });
}
