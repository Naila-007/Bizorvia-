'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type Profile = { full_name: string | null; email: string; plan: string; created_at: string; stripe_customer_id: string | null; };

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) { setProfile(data); setName(data.full_name || ''); }
        setDataLoading(false);
      });
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({ full_name: name }).eq('id', user.id);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleBillingPortal() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch('/api/stripe/portal', { method: 'POST', headers: { 'Authorization': `Bearer ${session.access_token}` } });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert('No billing info found. Please upgrade to a paid plan first.');
  }

  const planColors: Record<string, string> = { free: '#555', builder: '#d8ff72', business: '#a78bfa', scale: '#fb923c' };
  const planColor = planColors[profile?.plan || 'free'] || '#555';

  if (loading || dataLoading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#666' }}>Loading…</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter,sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href='/' style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#fff' }}>Bizorvia</a>
        <button onClick={signOut} style={{ background: 'none', border: '1px solid #333', color: '#999', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Sign out</button>
      </header>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 32px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Account Settings</h1>
        <p style={{ color: '#666', marginBottom: 40 }}>{user?.email}</p>

        {/* Plan Status */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <b style={{ fontSize: 16 }}>Current Plan</b>
            <span style={{ background: planColor + '22', color: planColor, padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>{profile?.plan || 'free'}</span>
          </div>
          <p style={{ color: '#666', fontSize: 14, margin: '0 0 16px' }}>
            {profile?.plan === 'free' ? 'Upgrade to unlock unlimited AI, more projects, and priority support.' : 'Thank you for being a paid member! Manage your billing below.'}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {profile?.plan === 'free'
              ? <a href='/pricing' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>Upgrade plan →</a>
              : <button onClick={handleBillingPortal} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>Manage billing →</button>
            }
          </div>
        </div>

        {/* Profile Details */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <b style={{ fontSize: 16, display: 'block', marginBottom: 20 }}>Profile Details</b>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Full Name</span>
              <input value={name} onChange={e => setName(e.target.value)} placeholder='Your name' style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Email</span>
              <input value={user?.email || ''} disabled style={{ background: '#111', border: '1px solid #222', color: '#555', padding: '10px 14px', borderRadius: 8, fontSize: 14 }} />
            </label>
            <button type='submit' disabled={saving} style={{ background: '#d8ff72', color: '#0a0a0a', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', alignSelf: 'flex-start' }}>
              {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <b style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>Account Info</b>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { label: 'Member since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
              { label: 'User ID', value: user?.id?.slice(0, 8) + '...' || '—' },
              { label: 'Email verified', value: user?.email_confirmed_at ? '✓ Verified' : '✗ Not verified' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ color: '#666', fontSize: 14 }}>{item.label}</span>
                <span style={{ color: '#ccc', fontSize: 14 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ background: '#110a0a', border: '1px solid #2a1a1a', borderRadius: 14, padding: 24 }}>
          <b style={{ fontSize: 16, color: '#ff6b6b', display: 'block', marginBottom: 8 }}>Danger Zone</b>
          <p style={{ color: '#666', fontSize: 14, margin: '0 0 16px' }}>Need to delete your account? Email us and we'll remove all your data within 48 hours.</p>
          <a href='mailto:oracledigitalmarketingagency@gmail.com?subject=Delete my Bizorvia account' style={{ color: '#ff6b6b', fontSize: 14 }}>Request account deletion →</a>
        </div>
      </div>
    </div>
  );
}
