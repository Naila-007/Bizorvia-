import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy — Bizorvia' };
export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 32px', fontFamily: 'Inter, sans-serif', color: '#182019', lineHeight: 1.75 }}>
      <a href='/' style={{ color: '#174f37', textDecoration: 'none', fontSize: 14 }}>← Back to Bizorvia</a>
      <h1 style={{ fontSize: 36, fontWeight: 700, margin: '24px 0 8px' }}>Privacy Policy</h1>
      <p style={{ color: '#68716a', marginBottom: 40 }}>Last updated: August 2026</p>
      {[
        { title: '1. Information We Collect', body: 'We collect information you provide directly: name, email address, and payment information. We also collect usage data including pages visited, features used, and device information.' },
        { title: '2. How We Use Your Information', body: 'We use your information to provide and improve Bizorvia, process payments, send transactional emails, and communicate service updates. We do not sell your personal data.' },
        { title: '3. Data Storage', body: 'Your data is stored securely using Supabase (PostgreSQL) with row-level security. Payment data is processed and stored by Stripe — we never store credit card numbers.' },
        { title: '4. Cookies', body: 'We use essential cookies for authentication sessions. We do not use tracking or advertising cookies.' },
        { title: '5. Third-Party Services', body: 'Bizorvia uses Stripe for payments, Supabase for database, and Anthropic/DeepSeek for AI features. Each has their own privacy policy.' },
        { title: '6. Your Rights', body: 'You may request deletion of your account and data at any time by emailing us. For GDPR requests, we respond within 30 days.' },
        { title: '7. Contact', body: 'For privacy questions: oracledigitalmarketingagency@gmail.com' },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</h2>
          <p style={{ margin: 0, color: '#374840' }}>{s.body}</p>
        </div>
      ))}
    </div>
  );
}
