'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      else setError('Invalid or expired reset link. Please request a new one.');
    });
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push('/login?reset=success'); }
  }

  if (!ready && !error) return (
    <div className='auth-page'><div className='auth-card'><p style={{textAlign:'center',color:'#748078'}}>Verifying link…</p></div></div>
  );

  return (
    <div className='auth-page'><div className='auth-card'>
      <a href='/' className='auth-brand'><span>Bizorvia</span></a>
      <h1>Set new password</h1>
      <p>Choose a strong password for your account.</p>
      <form onSubmit={handleUpdate} className='auth-form'>
        <label><span>New password</span>
          <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Min 8 characters' minLength={8} required autoFocus />
        </label>
        <label><span>Confirm password</span>
          <input type='password' value={confirm} onChange={e => setConfirm(e.target.value)} placeholder='Repeat password' required />
        </label>
        {error && <p className='auth-error'>{error}</p>}
        <button type='submit' className='auth-submit' disabled={loading || !ready}>
          {loading ? 'Updating…' : 'Set new password →'}
        </button>
      </form>
    </div></div>
  );
}
