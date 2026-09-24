import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Bizorvia | Everything Your Business Needs',
  description: 'Discover every Bizorvia feature — from project management to content creation, automation to analytics. One platform for your entire business.',
  openGraph: {
    title: 'Bizorvia Features',
    description: 'One platform. Every tool your business needs to grow.',
    url: 'https://bizorvia.com/features',
  },
};

const features = [
  {
    icon: '✍️',
    title: 'Content Creation',
    description: 'Write blog posts, social media content, emails, and marketing copy — all inside Bizorvia. No switching apps.',
    color: '#d8ff72',
  },
  {
    icon: '📁',
    title: 'Project Management',
    description: 'Organize every client, campaign, and deliverable in one place. Bizorvia keeps your work structured so nothing falls through the cracks.',
    color: '#a78bfa',
  },
  {
    icon: '⚡',
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks, follow-ups, and approvals. Bizorvia handles the busywork so you can focus on growth.',
    color: '#fb923c',
  },
  {
    icon: '📊',
    title: 'Business Analytics',
    description: 'See what is working at a glance. Bizorvia gives you clear, actionable insights about your projects, clients, and revenue.',
    color: '#34d399',
  },
  {
    icon: '🤝',
    title: 'Client Workspace',
    description: 'Share deliverables, collect feedback, and manage client communication without leaving Bizorvia.',
    color: '#60a5fa',
  },
  {
    icon: '🔒',
    title: 'Secure Storage',
    description: 'All your files, assets, and documents stored securely in Bizorvia — organized, searchable, and always accessible.',
    color: '#f472b6',
  },
  {
    icon: '🌐',
    title: 'Integrations',
    description: 'Connect Bizorvia with the tools you already use. Stripe payments, email, and more — all synced automatically.',
    color: '#38bdf8',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Bizorvia runs in your browser — desktop, tablet, or mobile. Your business is always at your fingertips.',
    color: '#fbbf24',
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter,sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href='/' style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#fff' }}>Bizorvia</a>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href='/pricing' style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pricing</a>
          <a href='/blog' style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Blog</a>
          <a href='/signup' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Start free</a>
        </div>
      </header>

      {/* Hero */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 32px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#d8ff7220', color: '#d8ff72', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: 1 }}>FEATURES</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Everything your business needs,<br />
          <span style={{ color: '#d8ff72' }}>inside Bizorvia</span>
        </h1>
        <p style={{ color: '#888', fontSize: 18, maxWidth: 560, margin: '0 auto 36px' }}>
          Stop juggling five different apps. Bizorvia brings your content, projects, clients, and automation into one place — so you can focus on growing.
        </p>
        <a href='/signup' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '14px 36px', borderRadius: 10, fontWeight: 800, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>
          Start free today →
        </a>
      </div>

      {/* Feature Grid */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '16px 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#fff' }}>{f.title}</h3>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div style={{ marginTop: 72, background: '#111', border: '1px solid #d8ff7230', borderRadius: 20, padding: '52px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 14 }}>Ready to run your business with Bizorvia?</h2>
          <p style={{ color: '#888', fontSize: 16, marginBottom: 28 }}>Start free. No credit card. Cancel anytime.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href='/signup' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '14px 32px', borderRadius: 10, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>Get started free</a>
            <a href='/pricing' style={{ background: 'transparent', color: '#fff', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1px solid #333' }}>See pricing</a>
          </div>
        </div>
      </div>
    </div>
  );
}
