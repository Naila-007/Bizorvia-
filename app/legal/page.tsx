import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal — Bizorvia',
  description: 'Privacy Policy, Terms of Service, and legal information for Bizorvia.',
  openGraph: {
    title: 'Legal — Bizorvia',
    description: 'Legal information for Bizorvia users.',
    url: 'https://bizorvia.com/legal',
  },
};

export default function LegalPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter,sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href='/' style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#fff' }}>Bizorvia</a>
        <a href='/signup' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Start free</a>
      </header>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#d8ff7220', color: '#d8ff72', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>LEGAL</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Legal Center</h1>
          <p style={{ color: '#888', fontSize: 16 }}>Everything you need to know about how Bizorvia works, what we collect, and your rights.</p>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          {/* Privacy Policy */}
          <a href='/privacy' style={{ textDecoration: 'none', display: 'block', background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, background: '#d8ff7220', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔒</div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Privacy Policy</h2>
            </div>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, margin: '0 0 14px' }}>
              Learn exactly what data Bizorvia collects, how we store it, how we use it, and your rights to access, update, or delete it.
            </p>
            <span style={{ color: '#d8ff72', fontSize: 13, fontWeight: 600 }}>Read Privacy Policy →</span>
          </a>

          {/* Terms of Service */}
          <a href='/terms' style={{ textDecoration: 'none', display: 'block', background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, background: '#a78bfa20', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📋</div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Terms of Service</h2>
            </div>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, margin: '0 0 14px' }}>
              The agreement between you and Bizorvia — what you can do, what we provide, and the rules that keep the platform fair for everyone.
            </p>
            <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>Read Terms of Service →</span>
          </a>
        </div>

        {/* Contact */}
        <div style={{ marginTop: 48, padding: 28, background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: 14, margin: '0 0 8px' }}>Questions about our legal documents?</p>
          <a href='mailto:oracledigitalmarketingagency@gmail.com' style={{ color: '#d8ff72', fontSize: 14, fontWeight: 600 }}>
            oracledigitalmarketingagency@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
