import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms of Service — Bizorvia' };
export default function TermsPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 32px', fontFamily: 'Inter, sans-serif', color: '#182019', lineHeight: 1.75 }}>
      <a href='/' style={{ color: '#174f37', textDecoration: 'none', fontSize: 14 }}>← Back to Bizorvia</a>
      <h1 style={{ fontSize: 36, fontWeight: 700, margin: '24px 0 8px' }}>Terms of Service</h1>
      <p style={{ color: '#68716a', marginBottom: 40 }}>Last updated: August 2026</p>
      {[
        { title: '1. Acceptance', body: 'By accessing Bizorvia, you agree to these Terms. If you do not agree, do not use the service.' },
        { title: '2. Description of Service', body: 'Bizorvia is an AI-powered business operating system. Features include AI assistance, business tools, and payment processing. We reserve the right to modify or discontinue features with notice.' },
        { title: '3. Account Responsibility', body: 'You are responsible for maintaining your account security. Do not share your password. You are responsible for all activity under your account.' },
        { title: '4. Payments & Subscriptions', body: 'Paid plans are billed monthly. Cancellations take effect at the end of the billing period. No refunds for partial months. Prices may change with 30 days notice.' },
        { title: '5. Acceptable Use', body: 'Do not use Bizorvia for illegal activities, spam, or harmful content. We reserve the right to suspend accounts that violate these terms.' },
        { title: '6. AI Features', body: 'AI outputs are provided for informational purposes. We do not guarantee accuracy. Do not rely solely on AI for legal, financial, or medical decisions.' },
        { title: '7. Limitation of Liability', body: 'Bizorvia is provided "as is." We are not liable for indirect, incidental, or consequential damages arising from use of the service.' },
        { title: '8. Governing Law', body: 'These terms are governed by the laws of Illinois, United States.' },
        { title: '9. Contact', body: 'Questions: oracledigitalmarketingagency@gmail.com' },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</h2>
          <p style={{ margin: 0, color: '#374840' }}>{s.body}</p>
        </div>
      ))}
    </div>
  );
}
