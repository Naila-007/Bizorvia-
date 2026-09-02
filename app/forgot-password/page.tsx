'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) { setError(error.message); setLoading(false); }
    else { setSent(true); }
  }

  if (sent) return (
    <div className='auth-page'><div className='auth-card'>
      <div className='auth-success'>
        <span>✓</span>
        <h2>Check your email</h2>
        <p>We sent a password reset link to <b>{email}</b>.</p>
        <a href='/login'>Back to sign in →</a>
      </div>
    </div></div>
  );

  return (
    <div className='auth-page'><div className='auth-card'>
      <a href='/' className='auth-brand'><span>Bizorvia</span></a>
      <h1>Reset password</h1>
      <p>Enter your email and we'll send a reset link.</p>
      <form onSubmit={handleReset} className='auth-form'>
        <label><span>Email</span>
          <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='you@company.com' required autoFocus />
        </label>
        {error && <p className='auth-error'>{error}</p>}
        <button type='submit' className='auth-submit' disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link →'}
        </button>
      </form>
      <p className='auth-switch'><a href='/login'>← Back to sign in</a></p>
    </div></div>
  );
}
