import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Bizorvia — AI Business Operating System',
  description: 'Learn about Bizorvia, the AI-powered platform that helps solo founders launch and grow businesses faster.',
  openGraph: { title: 'About Bizorvia', description: 'AI-powered business OS for solo founders.', url: 'https://bizorvia.com/about' },
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter,sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href='/' style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#fff' }}>Bizorvia</a>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="marketing-nav-links" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <a href='/platform' style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Platform</a>
            <a href='/pricing' style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pricing</a>
            <a href='/blog' style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Blog</a>
          </span>
          <a href='/login' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>Start free</a>
        </div>
        <style>{`@media (max-width: 640px) { .marketing-nav-links { display: none !important; } }`}</style>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ display: 'inline-block', background: '#d8ff7220', color: '#d8ff72', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: 1 }}>ABOUT US</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
            Built for founders who<br />move fast and build alone
          </h1>
          <p style={{ color: '#888', fontSize: 18, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
            Bizorvia is the AI-powered business operating system that replaces a full team — 
            from research and branding to payments and marketing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 80 }}>
          {[
            { icon: '🧠', title: 'AI-First', desc: 'Every feature is powered by AI — built to think, write, and execute alongside you.' },
            { icon: '⚡', title: 'Move Fast', desc: 'Go from idea to live product in days, not months. No dev team required.' },
            { icon: '💰', title: 'Built to Earn', desc: 'Integrated payments, subscriptions, and commerce — ready from day one.' },
            { icon: '🌍', title: 'Global Ready', desc: 'Launch anywhere. Multi-currency, SEO-optimized, and cloud-hosted out of the box.' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 20, padding: '48px 40px', marginBottom: 60 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>Our Story</h2>
          <p style={{ color: '#888', fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            Bizorvia was built by <strong style={{ color: '#fff' }}>Neelofer</strong>, a Chicago-based solo founder and digital marketing 
            expert behind Oracle Digital Marketing. After years of running campaigns for clients and building 
            her own brands, she faced the same wall every founder hits — not enough hours, not enough team.
          </p>
          <p style={{ color: '#888', fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            She built Bizorvia to solve that exact problem. One platform. All the tools. 
            No team required. From AI research to branded storefronts to integrated payments — 
            Bizorvia is the business she wished she had when starting out.
          </p>
          <p style={{ color: '#888', fontSize: 16, lineHeight: 1.8 }}>
            Today, Bizorvia operates under <strong style={{ color: '#fff' }}>Dayyan LLC</strong> and is trusted by solo founders 
            who want to build fast, launch lean, and scale smart.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Ready to build?</h2>
          <p style={{ color: '#888', marginBottom: 28 }}>Join thousands of founders turning ideas into income.</p>
          <a href='/signup' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
            Get started free →
          </a>
        </div>

      </div>
    </div>
  );
}
