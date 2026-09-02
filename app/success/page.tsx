'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SuccessPage() {
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Verify session_id exists in URL — basic guard against direct access
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId && sessionId.startsWith('cs_')) {
      setVerified(true);
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!verified) return;
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); window.location.href = '/'; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [verified]);

  if (checking) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'#666', fontSize:14 }}>Verifying…</div>
    </div>
  );

  if (!verified) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', padding:48 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
        <h2>Access Denied</h2>
        <p style={{ color:'#666' }}>This page is only accessible after a successful payment.</p>
        <a href='/pricing' style={{ display:'inline-block', marginTop:16, background:'#d8ff72', color:'#0a0a0a', padding:'12px 28px', borderRadius:10, textDecoration:'none', fontWeight:700 }}>View Pricing →</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif' }}>
      <div style={{ textAlign:'center', padding:48 }}>
        <div style={{ fontSize:72, marginBottom:24 }}>🎉</div>
        <h1 style={{ fontSize:32, fontWeight:700, margin:'0 0 8px' }}>You're in!</h1>
        <p style={{ color:'#888', marginBottom:24 }}>
          Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}! Your plan is now active.
        </p>
        <div style={{ background:'#1a2a1a', border:'1px solid #d8ff72', borderRadius:12, padding:'16px 32px', display:'inline-block', margin:'0 0 24px' }}>
          <span style={{ color:'#d8ff72', fontWeight:700 }}>✓ Payment confirmed</span>
        </div>
        <p style={{ color:'#555', fontSize:14 }}>Redirecting to dashboard in {countdown}s…</p>
        <a href='/' style={{ display:'inline-block', marginTop:16, background:'#d8ff72', color:'#0a0a0a', padding:'12px 28px', borderRadius:10, textDecoration:'none', fontWeight:700 }}>
          Go to Dashboard →
        </a>
      </div>
    </div>
  );
}
