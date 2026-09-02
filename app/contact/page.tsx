'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', plan: 'builder', message: '' });
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setStatus('sent');
    } catch { setStatus('error'); }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (status === 'sent') return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✉️</div>
        <h2 style={{ color: '#fff', fontSize: 28, marginBottom: 8 }}>Message sent!</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>We'll get back to you within 24 hours.</p>
        <a href='/' style={{ color: '#d8ff72', textDecoration: 'none' }}>← Back to home</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter,sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href='/' style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#fff' }}>Bizorvia</a>
        <a href='/pricing' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>See pricing</a>
      </header>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: '#d8ff7220', color: '#d8ff72', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>CONTACT SALES</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>Let's talk about your business</h1>
          <p style={{ color: '#888', fontSize: 16 }}>Tell us what you're building — we'll set you up with the right plan and a personalized walkthrough.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Jane Smith', required: true },
            { label: 'Business Email *', key: 'email', type: 'email', placeholder: 'jane@company.com', required: true },
            { label: 'Company / Project', key: 'company', type: 'text', placeholder: 'Acme Inc.', required: false },
          ].map(f => (
            <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>{f.label}</span>
              <input type={f.type} placeholder={f.placeholder} required={f.required} value={(form as any)[f.key]} onChange={set(f.key)} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
            </label>
          ))}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Interested plan</span>
            <select value={form.plan} onChange={set('plan')} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none' }}>
              <option value='builder'>Builder ($39/mo)</option>
              <option value='business'>Business ($89/mo)</option>
              <option value='scale'>Scale ($199/mo)</option>
              <option value='enterprise'>Enterprise (custom)</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>How can we help? *</span>
            <textarea required value={form.message} onChange={set('message')} placeholder='Tell us about your project, questions, or needs…' rows={5} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical' }} />
          </label>
          {status === 'error' && <p style={{ color: '#ff6b6b', fontSize: 14 }}>Something went wrong. Please email us at oracledigitalmarketingagency@gmail.com</p>}
          <button type='submit' disabled={status === 'sending'} style={{ background: '#d8ff72', color: '#0a0a0a', border: 'none', padding: '14px 28px', borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: 'pointer', alignSelf: 'flex-start' }}>
            {status === 'sending' ? 'Sending…' : 'Send message →'}
          </button>
        </form>

        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { icon: '📧', label: 'Email us', value: 'oracledigitalmarketingagency@gmail.com', href: 'mailto:oracledigitalmarketingagency@gmail.com' },
            { icon: '⚡', label: 'Response time', value: 'Within 24 hours', href: null },
          ].map(item => (
            <div key={item.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>{item.label}</div>
              {item.href ? <a href={item.href} style={{ color: '#d8ff72', fontSize: 13 }}>{item.value}</a> : <span style={{ color: '#fff', fontSize: 13 }}>{item.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
