'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type ProviderStatus = { provider: string; name: string; connected: boolean; free: string };
type Project = { id: string; name: string; framework: string; url: string; provider: string; status: string; last_deployed_at?: string; netlify_site_name: string };

const PROVIDER_LOGOS: Record<string,string> = { netlify:'#00ad9f', vercel:'#fff', cloudflare:'#f48120', supabase:'#3ecf8e' };
const PROVIDER_ICONS: Record<string,string> = { netlify:'◈', vercel:'▲', cloudflare:'⬡', supabase:'⬡' };
const PROVIDER_BGCOLORS: Record<string,string> = { netlify:'#00ad9f11', vercel:'#ffffff11', cloudflare:'#f4812011', supabase:'#3ecf8e11' };
const FW_ICONS: Record<string,string> = { html:'🌐', nextjs:'▲', react:'⚛️', vue:'💚', svelte:'🔥', astro:'🚀', static:'📄' };

function ServiceCard({ name, icon, color, bg, connected, free, envKey, docsUrl }: any) {
  return (
    <div style={{ background: connected ? bg : '#111', border: `1px solid ${connected ? color+'33' : '#1a1a1a'}`, borderRadius: 14, padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, color }}>{icon}</span>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: connected ? '#d8ff7222' : '#333', color: connected ? '#d8ff72' : '#555' }}>
          {connected ? '● LIVE' : '○ SETUP'}
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 14, lineHeight: 1.6 }}>{free}</div>
      {!connected && (
        <div style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>Add to Netlify env vars:</div>
          <code style={{ color: '#d8ff72', fontSize: 11 }}>{envKey} = your_token</code>
          {docsUrl && <a href={docsUrl} target='_blank' style={{ display: 'block', color: '#555', fontSize: 11, marginTop: 6, textDecoration: 'none' }}>Get token → {docsUrl}</a>}
        </div>
      )}
    </div>
  );
}

export default function DevHubPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState<'overview'|'projects'|'database'|'storage'|'functions'>('overview');

  // new project state
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFw, setNewFw] = useState('html');
  const [newProvider, setNewProvider] = useState('netlify');
  const [creating, setCreating] = useState(false);

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [loading, user]);
  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  }

  async function loadAll() {
    const t = await getToken();
    const [provRes, projRes] = await Promise.all([
      fetch('/api/deploy', { headers: { Authorization: `Bearer ${t}` } }),
      fetch('/api/projects', { headers: { Authorization: `Bearer ${t}` } }),
    ]);
    if (provRes.ok) { const d = await provRes.json(); setProviders(d.providers || []); }
    if (projRes.ok) { const d = await projRes.json(); setProjects(d.projects || []); }
    setDataLoading(false);
  }

  useEffect(() => { if (user) loadAll(); }, [user]);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const t = await getToken();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, framework: newFw, provider: newProvider }),
    });
    const data = await res.json();
    if (res.ok) { notify('✓ Project created!'); setNewName(''); setShowNew(false); await loadAll(); setActiveTab('projects'); }
    else notify(`✗ ${data.error}`);
    setCreating(false);
  }

  const connectedProviders = providers.filter(p => p.connected);
  const totalDeploys = projects.filter(p => p.status === 'deployed').length;

  if (loading || dataLoading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#d8ff72', fontSize: 32, marginBottom: 12 }}>⚡</div>
        <div style={{ color: '#555' }}>Loading Dev Hub…</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter,sans-serif' }}>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, background: '#1a2a1a', border: '1px solid #2a4a2a', color: '#d8ff72', padding: '12px 20px', borderRadius: 10, zIndex: 999, fontSize: 14 }}>{toast}</div>}

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href='/' style={{ fontWeight: 700, fontSize: 17, textDecoration: 'none', color: '#fff' }}>Bizorvia</a>
          <span style={{ color: '#333' }}>›</span>
          <span style={{ color: '#d8ff72', fontWeight: 600, fontSize: 14 }}>⚡ Dev Hub</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href='/storage' style={{ background: '#111', border: '1px solid #2a2a2a', color: '#888', padding: '7px 16px', borderRadius: 8, fontSize: 13, textDecoration: 'none' }}>☁️ Storage</a>
          <button onClick={() => setShowNew(true)} style={{ background: '#d8ff72', border: 'none', color: '#0a0a0a', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Deploy project</button>
        </div>
      </header>

      {/* New Project Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowNew(false)}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 18, padding: 36, width: 520, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>New project</h2>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', color: '#555', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={createProject} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Project name *</span>
                <input required value={newName} onChange={e => setNewName(e.target.value)} placeholder='my-website' style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Deploy to</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[
                    { key: 'netlify', label: 'Netlify', icon: '◈', color: '#00ad9f', note: 'Connected' },
                    { key: 'vercel', label: 'Vercel', icon: '▲', color: '#fff', note: 'Add token' },
                    { key: 'cloudflare', label: 'Cloudflare', icon: '⬡', color: '#f48120', note: 'Add token' },
                  ].map(opt => {
                    const isConnected = providers.find(p => p.provider === opt.key)?.connected;
                    return (
                      <button type='button' key={opt.key} onClick={() => setNewProvider(opt.key)}
                        style={{ background: newProvider === opt.key ? opt.color+'22' : '#1a1a1a', border: `1px solid ${newProvider === opt.key ? opt.color : '#2a2a2a'}`, borderRadius: 10, padding: '12px 8px', cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ fontSize: 20, color: opt.color, marginBottom: 4 }}>{opt.icon}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: newProvider === opt.key ? opt.color : '#888' }}>{opt.label}</div>
                        <div style={{ fontSize: 10, color: isConnected ? '#d8ff72' : '#555', marginTop: 2 }}>{isConnected ? '✓ Live' : opt.note}</div>
                      </button>
                    );
                  })}
                </div>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Framework</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.entries(FW_ICONS).map(([k, v]) => (
                    <button type='button' key={k} onClick={() => setNewFw(k)} style={{ background: newFw === k ? '#d8ff72' : '#1a1a1a', color: newFw === k ? '#0a0a0a' : '#888', border: `1px solid ${newFw === k ? '#d8ff72' : '#2a2a2a'}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: newFw === k ? 700 : 400 }}>{v} {k}</button>
                  ))}
                </div>
              </label>

              <div style={{ background: '#0d180d', border: '1px solid #1e3a1e', borderRadius: 10, padding: 14 }}>
                {['Free HTTPS + SSL cert', 'Global CDN', 'Custom domain', 'Serverless functions', 'Auto deploy on push'].map(f => (
                  <div key={f} style={{ fontSize: 11, color: '#7a9a7a', marginBottom: 4 }}>✓ {f}</div>
                ))}
              </div>

              <button type='submit' disabled={creating} style={{ background: '#d8ff72', border: 'none', color: '#0a0a0a', padding: 13, borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                {creating ? 'Creating…' : `Deploy to ${newProvider} →`}
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 32px' }}>
        {/* Hero stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Projects', value: projects.length, max: 3, icon: '⚡', color: '#d8ff72' },
            { label: 'Live deploys', value: totalDeploys, max: projects.length || 1, icon: '🚀', color: '#34d399' },
            { label: 'Providers', value: connectedProviders.length, max: 3, icon: '🔌', color: '#a78bfa' },
            { label: 'Free tier', value: '100%', max: null, icon: '✓', color: '#fb923c' },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#555' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #1a1a1a', marginBottom: 28 }}>
          {(['overview','projects','database','storage','functions'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ background: 'none', border: 'none', color: activeTab === t ? '#fff' : '#555', borderBottom: activeTab === t ? '2px solid #d8ff72' : '2px solid transparent', padding: '10px 18px', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === t ? 700 : 400, textTransform: 'capitalize', marginBottom: -1 }}>
              {t === 'overview' ? '🗂 Overview' : t === 'projects' ? '⚡ Projects' : t === 'database' ? '🗄 Database' : t === 'storage' ? '☁️ Storage' : '⚙️ Functions'}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: 28 }}>
            {/* Services status */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Connected services</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
                <ServiceCard name='Netlify' icon='◈' color='#00ad9f' bg='#00ad9f0d'
                  connected={providers.find(p=>p.provider==='netlify')?.connected}
                  free='500 sites · 100GB BW · 125k functions/mo · Free SSL · Global CDN'
                  envKey='NETLIFY_API_TOKEN'
                  docsUrl='app.netlify.com/user/applications' />
                <ServiceCard name='Vercel' icon='▲' color='#ffffff' bg='#ffffff0d'
                  connected={providers.find(p=>p.provider==='vercel')?.connected}
                  free='Unlimited projects · 100GB BW · Serverless functions · Edge network'
                  envKey='VERCEL_API_TOKEN'
                  docsUrl='vercel.com/account/tokens' />
                <ServiceCard name='Cloudflare Pages' icon='⬡' color='#f48120' bg='#f481200d'
                  connected={providers.find(p=>p.provider==='cloudflare')?.connected}
                  free='Unlimited sites · Unlimited BW · 500 builds/mo · Edge workers'
                  envKey='CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID'
                  docsUrl='dash.cloudflare.com/profile/api-tokens' />
                <div style={{ background: '#3ecf8e11', border: '1px solid #3ecf8e33', borderRadius: 14, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 22, color: '#3ecf8e' }}>⬡</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Supabase</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#d8ff7222', color: '#d8ff72', marginLeft: 'auto' }}>● LIVE</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 14, lineHeight: 1.6 }}>2 free projects · 500MB DB · 5GB BW · Auth · Realtime</div>
                  <div style={{ background: '#0d0d0d', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>Connected project:</div>
                    <code style={{ color: '#3ecf8e', fontSize: 11 }}>xcbezfmthtcbmcpfilyk.supabase.co</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick setup guide */}
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: 28 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>⚡ Quick setup — connect all providers in 5 min</h2>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 20 }}>Add these env vars in Netlify → bizorvia-app → Environment variables, then redeploy.</p>
              <div style={{ background: '#0d1117', borderRadius: 12, padding: 20, fontFamily: 'monospace', fontSize: 12, lineHeight: 2 }}>
                <div style={{ color: '#555' }}># Netlify — get token from app.netlify.com/user/applications</div>
                <div><span style={{ color: '#d8ff72' }}>NETLIFY_API_TOKEN</span> = <span style={{ color: '#7ec87e' }}>nfp_xxxxxxxxxxxxx</span></div>
                <div style={{ color: '#555', marginTop: 8 }}># Vercel — get token from vercel.com/account/tokens</div>
                <div><span style={{ color: '#d8ff72' }}>VERCEL_API_TOKEN</span> = <span style={{ color: '#7ec87e' }}>xxxxxxxxxxxxx</span></div>
                <div><span style={{ color: '#d8ff72' }}>VERCEL_TEAM_ID</span> = <span style={{ color: '#7ec87e' }}>team_ZfwSrw62Jhl4tFwGTnak8tAL</span></div>
                <div style={{ color: '#555', marginTop: 8 }}># Cloudflare — get token from dash.cloudflare.com/profile/api-tokens</div>
                <div><span style={{ color: '#d8ff72' }}>CLOUDFLARE_API_TOKEN</span> = <span style={{ color: '#7ec87e' }}>xxxxxxxxxxxxx</span></div>
                <div><span style={{ color: '#d8ff72' }}>CLOUDFLARE_ACCOUNT_ID</span> = <span style={{ color: '#7ec87e' }}>xxxxxxxxxxxxx</span></div>
              </div>
              <p style={{ color: '#555', fontSize: 12, marginTop: 12 }}>After adding → redeploy Bizorvia → all providers light up green ✓</p>
            </div>
          </div>
        )}

        {/* ─── PROJECTS TAB ─── */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Your projects</h2>
              <button onClick={() => setShowNew(true)} style={{ background: '#d8ff72', border: 'none', color: '#0a0a0a', padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ New</button>
            </div>
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No projects yet</h3>
                <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>Deploy your first website free — choose Netlify, Vercel, or Cloudflare.</p>
                <button onClick={() => setShowNew(true)} style={{ background: '#d8ff72', border: 'none', color: '#0a0a0a', padding: '11px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Create first project →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {projects.map(p => {
                  const provColor = PROVIDER_LOGOS[p.provider] || '#555';
                  return (
                    <div key={p.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 13, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
                      <span style={{ fontSize: 26 }}>{FW_ICONS[p.framework] || '🌐'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#555', display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span style={{ color: provColor, fontWeight: 600 }}>{PROVIDER_ICONS[p.provider]} {p.provider}</span>
                          {p.url && <a href={p.url} target='_blank' style={{ color: '#d8ff72', textDecoration: 'none' }}>{p.netlify_site_name || p.url.split('/')[2]} ↗</a>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ background: p.status === 'deployed' ? '#d8ff7222' : '#1a1a1a', color: p.status === 'deployed' ? '#d8ff72' : '#555', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{p.status}</span>
                        <a href='/projects' style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>Manage →</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── DATABASE TAB ─── */}
        {activeTab === 'database' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Database</h2>
            <div style={{ background: '#3ecf8e0d', border: '1px solid #3ecf8e33', borderRadius: 14, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>⬡</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Supabase — Bizorvia DB</div>
                  <div style={{ color: '#3ecf8e', fontSize: 13 }}>● Active · Postgres 17</div>
                </div>
                <a href='https://supabase.com/dashboard/project/xcbezfmthtcbmcpfilyk' target='_blank' style={{ marginLeft: 'auto', background: '#3ecf8e22', color: '#3ecf8e', padding: '7px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Open dashboard ↗</a>
              </div>
              {[['Project URL', 'xcbezfmthtcbmcpfilyk.supabase.co'],['Region','us-east-1'],['Postgres','v17'],['Auth','Email + social'],['RLS','Enabled on all tables']].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1a2a1a', fontSize: 13 }}>
                  <span style={{ color: '#666' }}>{k}</span>
                  <span style={{ color: '#fff', fontFamily: k === 'Project URL' ? 'monospace' : 'inherit', fontSize: k === 'Project URL' ? 12 : 13 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 22 }}>
              <div style={{ fontWeight: 700, marginBottom: 14 }}>Tables in use</div>
              {[['profiles','User accounts, plan, credits'],['bizorvia_projects','Web deployment projects'],['storage.objects','File storage (Supabase Storage)']].map(([t,d]) => (
                <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}>
                  <code style={{ color: '#d8ff72', fontSize: 13 }}>{t}</code>
                  <span style={{ color: '#555', fontSize: 12 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── STORAGE TAB ─── */}
        {activeTab === 'storage' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Storage</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {[{name:'Supabase Storage',desc:'Secure file storage, 500MB free',color:'#3ecf8e',link:'/storage'},{name:'Netlify Assets',desc:'Static files served from CDN',color:'#00ad9f',link:'https://app.netlify.com'},].map(s=>(
                <div key={s.name} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 22 }}>
                  <div style={{ color: s.color, fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{s.name}</div>
                  <div style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>{s.desc}</div>
                  <a href={s.link} style={{ color: s.color, fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Open →</a>
                </div>
              ))}
            </div>
            <a href='/storage' style={{ display: 'block', background: '#d8ff72', color: '#0a0a0a', textAlign: 'center', padding: '13px', borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>Open file manager → bizorvia.com/storage</a>
          </div>
        )}

        {/* ─── FUNCTIONS TAB ─── */}
        {activeTab === 'functions' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Serverless functions</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>All API routes are serverless functions, deployed automatically with your site.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {route:'/api/ai',desc:'Claude + DeepSeek AI — credits tracked per user',method:'POST',status:'live'},
                {route:'/api/cli',desc:'Bizorvia CLI agent — 45s timeout, 4k tokens',method:'POST',status:'live'},
                {route:'/api/stripe/webhook',desc:'Stripe payments — checkout + subscription events',method:'POST',status:'pending stripe webhook'},
                {route:'/api/storage/upload',desc:'Secure file upload to Supabase Storage',method:'POST',status:'live'},
                {route:'/api/projects',desc:'Multi-provider web deployment API',method:'GET/POST',status:'live'},
                {route:'/api/credits',desc:'AI credits usage tracker per user',method:'GET/POST',status:'live'},
                {route:'/api/contact',desc:'Contact form submissions',method:'POST',status:'live'},
                {route:'/api/admin/users',desc:'Admin user management — protected',method:'GET',status:'live'},
              ].map(fn=>(
                <div key={fn.route} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <code style={{ color: '#d8ff72', fontSize: 12, minWidth: 200 }}>{fn.route}</code>
                  <span style={{ color: '#888', fontSize: 12, flex: 1 }}>{fn.desc}</span>
                  <span style={{ color: '#555', fontSize: 11, background: '#1a1a1a', padding: '2px 8px', borderRadius: 4 }}>{fn.method}</span>
                  <span style={{ fontSize: 11, color: fn.status==='live'?'#d8ff72':'#fb923c', fontWeight: 600 }}>{fn.status==='live'?'● live':'⚠ '+fn.status}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, background: '#0d180d', border: '1px solid #1e3a1e', borderRadius: 12, padding: 18 }}>
              <div style={{ color: '#7a9a7a', fontSize: 13 }}>✓ Netlify Functions free tier: <strong style={{ color: '#fff' }}>125,000 invocations/month</strong></div>
              <div style={{ color: '#7a9a7a', fontSize: 13, marginTop: 6 }}>✓ Max execution time: <strong style={{ color: '#fff' }}>26 seconds</strong></div>
              <div style={{ color: '#7a9a7a', fontSize: 13, marginTop: 6 }}>✓ Memory: <strong style={{ color: '#fff' }}>1024 MB</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
