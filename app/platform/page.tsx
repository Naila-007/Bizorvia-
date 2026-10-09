import type { Metadata } from 'next';
import type { CSSProperties } from 'react';

export const metadata: Metadata = {
  title: 'Platform — Bizorvia | AI Operating System',
  description: 'Your idea-to-income operating system. Eleven modular tools for research, development, hosting, payments, and growth — each one clearly marked live, partial, or on the roadmap.',
  openGraph: {
    title: 'Bizorvia Platform',
    description: 'Your idea-to-income operating system — built, labeled, and verified module by module.',
    url: 'https://bizorvia.com/platform',
  },
};

type Status = 'LIVE' | 'PARTIAL' | 'ROADMAP';

const STATUS_STYLE: Record<Status, { bg: string; color: string; label: string }> = {
  LIVE: { bg: '#d8ff7220', color: '#d8ff72', label: 'LIVE TODAY' },
  PARTIAL: { bg: '#e0c06020', color: '#e0c060', label: 'PARTIALLY LIVE' },
  ROADMAP: { bg: '#66666630', color: '#999', label: 'ON THE ROADMAP' },
};

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{ display: 'inline-block', background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>
      {s.label}
    </span>
  );
}

const coreValues = [
  { n: '01', k: 'AUTOMATION', title: 'Automation', copy: 'Orchestrate workflows, code updates, and marketing pipelines dynamically — the parts that are built today run without hand-holding, and the rest is on the roadmap below.' },
  { n: '02', k: 'EFFICIENCY', title: 'Efficiency', copy: 'Accelerate the operational path from raw concept to a validated, revenue-ready plan.' },
  { n: '03', k: 'VERIFICATION', title: 'Verification', copy: 'Ground decisions in cited research and real data — never a fabricated number or a feature that only looks finished.' },
  { n: '04', k: 'AUTONOMY', title: 'Autonomy', copy: 'Give solo operators and lean teams AI agents that can genuinely edit code and manage real data, with clear limits where that autonomy isn’t built yet.' },
];

const modules: { mod: string; tag: string; title: string; copy: string; status: Status }[] = [
  {
    mod: 'MOD-01', tag: 'CREATION', title: 'Business Factory',
    copy: 'Describe an idea and get a real, AI-written validation — opportunity, ideal customer, starting price, and next steps. Branding, storefront, and full automation of the later stages are being built out next.',
    status: 'PARTIAL',
  },
  {
    mod: 'MOD-02', tag: 'BUILD', title: 'App Studio',
    copy: 'Create websites, online stores, web portals, and internal tools from AI prompts — real projects, hosted and deployable today.',
    status: 'LIVE',
  },
  {
    mod: 'MOD-03', tag: 'DEV', title: 'Bizorvia Code',
    copy: 'A real AI coding agent that edits the code in your project and explains its changes, backed by your own stored files — not a demo. Automated test runs and diff previews are on the roadmap.',
    status: 'PARTIAL',
  },
  {
    mod: 'MOD-04', tag: 'INFRA', title: 'Bizorvia Cloud',
    copy: 'Real hosting and object storage for every project today. Serverless functions, a global CDN, automatic SSL, and backups are on the roadmap.',
    status: 'PARTIAL',
  },
  {
    mod: 'MOD-05', tag: 'DATA', title: 'Bizorvia Data',
    copy: 'A real table editor against your own project data today. A full SQL workspace, authentication, and API access are on the roadmap.',
    status: 'PARTIAL',
  },
  {
    mod: 'MOD-06', tag: 'DEPLOY', title: 'Global Deploy',
    copy: 'Ship a project straight to production today. Preview branches, analytics, logs, and rollbacks are on the roadmap.',
    status: 'PARTIAL',
  },
  {
    mod: 'MOD-07', tag: 'REVENUE', title: 'Bizorvia Pay',
    copy: 'Real Stripe-powered checkout, subscription billing, and a customer billing portal today. Invoicing and standalone payment links are on the roadmap.',
    status: 'PARTIAL',
  },
  {
    mod: 'MOD-08', tag: 'DOMAIN', title: 'Domain Services',
    copy: 'Connect a domain you already own to any project today. Search, purchase, and automatic DNS verification are on the roadmap — for now, DNS is pointed manually.',
    status: 'PARTIAL',
  },
  {
    mod: 'MOD-09', tag: 'WORKFLOW', title: 'Agent Automations',
    copy: 'The plan: scheduled tasks, event-triggered workflows, third-party integrations, and approval routing. On the roadmap — not automated yet.',
    status: 'ROADMAP',
  },
  {
    mod: 'MOD-10', tag: 'MARKETING', title: 'Growth Studio',
    copy: 'The plan: one system across SEO, content, social, email, and ads — watching visibility and revenue in one place. On the roadmap — not tracking live data yet.',
    status: 'ROADMAP',
  },
  {
    mod: 'MOD-11', tag: 'INTEL', title: 'Deep Research',
    copy: 'Real, AI-driven research backed by actual web search and cited sources — not simulated. Ask a question and get a grounded answer with real links attached.',
    status: 'LIVE',
  },
];

const architecture = [
  { n: '01', title: 'Deep Market Analysis', copy: 'Deep Research runs real web searches and hands back a cited, evidence-backed answer to ground your decision before you build.' },
  { n: '02', title: 'Real Code & Data', copy: 'Bizorvia Code edits your real files with AI; Bizorvia Data gives you a real table view of your project today, with the rest of the database workspace on the roadmap.' },
  { n: '03', title: 'Global Distribution', copy: 'Global Deploy ships your project to production today. Edge CDN, automatic SSL, and backups are on the roadmap.' },
  { n: '04', title: 'Revenue & Growth Loops', copy: 'Bizorvia Pay handles real checkout and subscription billing today. Growth Studio’s multi-channel SEO and outreach engine is on the roadmap.' },
];

const operatingParameters = [
  { k: 'Pricing Tier', v: 'Accessible' },
  { k: 'Function Type', v: 'Utility' },
  { k: 'Innovation Strategy', v: 'Disruptive' },
  { k: 'Design Era', v: 'Futuristic Experimental' },
];

const gridBackdrop: CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(216,255,114,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(216,255,114,0.06) 1px, transparent 1px)',
  backgroundSize: '36px 36px',
};

export default function PlatformPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#07080a', color: '#fff', fontFamily: 'Inter,sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#07080acc', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/bizorvia-mark.png" alt="" style={{ width: 24, height: 24 }} />
          Bizorvia
        </a>
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span className="marketing-nav-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#overview" style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>Overview</a>
            <a href="#values" style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>Values</a>
            <a href="#suite" style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>Modular Suite</a>
            <a href="#architecture" style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>Architecture</a>
          </span>
          <a href="/signup" style={{ background: '#d8ff72', color: '#0a0a0a', padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>Get started</a>
        </nav>
      </header>
      <style>{`@media (max-width: 640px) { .marketing-nav-links { display: none !important; } }`}</style>

      {/* Hero */}
      <section id="overview" style={{ ...gridBackdrop, padding: '96px 32px 64px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ color: '#d8ff72', fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 16, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
            BIZORVIA / AI OPERATING SYSTEM
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, maxWidth: 760 }}>
            Your idea-to-income operating system
          </h1>
          <p style={{ color: '#999', fontSize: 18, lineHeight: 1.7, maxWidth: 640, marginBottom: 32 }}>
            Bizorvia is an AI operating system for business owners, solo founders, and developers. Turn raw concepts into real, live businesses with integrated tools for market research, software development, hosting, payments, databases, and marketing — each one clearly marked as live, partially live, or on the roadmap.
          </p>
          <a href="#suite" style={{ display: 'inline-block', background: '#d8ff72', color: '#0a0a0a', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            EXPLORE PRODUCT MODULES →
          </a>

          {/* Core display panel */}
          <div style={{ marginTop: 64, border: '1px solid #1e2920', borderRadius: 16, background: 'linear-gradient(160deg, #0d120e 0%, #0a0a0a 60%)', padding: 28, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11, color: '#6a7a6a' }}>
              <span>bizorvia-core // live-instance</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ background: '#d8ff7220', color: '#d8ff72', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>SYSTEM: ONLINE</span>
                <span style={{ background: '#66666630', color: '#999', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>REAL FEATURES, CLEARLY LABELED</span>
              </div>
            </div>
            <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, color: '#8fae8a', lineHeight: 1.9 }}>
              <div>&gt; research --depth full</div>
              <div>&gt; validate --idea "$INPUT"</div>
              <div>&gt; deploy --target production</div>
            </div>
          </div>
        </div>
      </section>

      {/* System concept */}
      <section style={{ padding: '72px 32px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>
          <div>
            <div style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>// SYSTEM CONCEPT</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>End-to-End Business Orchestration</h2>
            <p style={{ color: '#999', fontSize: 15, lineHeight: 1.7 }}>
              Reduce tool sprawl and manual friction. Bizorvia brings real market research, application building, managed infrastructure, and billing into one workspace — with every module’s true status shown right on its card, not buried in fine print.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>From Abstract Concept to Production Engine</h2>
            <p style={{ color: '#999', fontSize: 15, lineHeight: 1.7 }}>
              Whether you’re validating an idea, shipping an app, or connecting billing, Bizorvia gives you functional tools built for execution speed — and tells you plainly which parts are live today and which are still being built.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section id="values" style={{ padding: '72px 32px', borderBottom: '1px solid #1a1a1a', background: '#0a0c0a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>// CORE VALUES</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Built on Functional Principles</h2>
          <p style={{ color: '#999', fontSize: 15, maxWidth: 620, marginBottom: 40, lineHeight: 1.7 }}>
            Designed for developers, founders, and operators who need real evidence, honest status, and genuine autonomy where it exists.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {coreValues.map((v) => (
              <div key={v.k} style={{ border: '1px solid #1a1a1a', borderRadius: 12, padding: 24, background: '#0d0f0d' }}>
                <div style={{ color: '#d8ff72', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{v.n} / {v.k}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{v.title}</h3>
                <p style={{ color: '#999', fontSize: 13.5, lineHeight: 1.6 }}>{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product suite */}
      <section id="suite" style={{ padding: '72px 32px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>// PRODUCT SUITE</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Integrated Workspace Tools</h2>
          <p style={{ color: '#999', fontSize: 15, maxWidth: 680, marginBottom: 16, lineHeight: 1.7 }}>
            Eleven modular tools covering every phase of business creation, deployment, and growth. Each card is tagged with its real, current status — live, partially live, or on the roadmap.
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
            <StatusBadge status="LIVE" /><StatusBadge status="PARTIAL" /><StatusBadge status="ROADMAP" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {modules.map((m) => (
              <div key={m.mod} style={{ border: '1px solid #1a1a1a', borderRadius: 12, padding: 24, background: '#0d0f0d', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{m.mod} // {m.tag}</span>
                  <StatusBadge status={m.status} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{m.title}</h3>
                <p style={{ color: '#999', fontSize: 13.5, lineHeight: 1.6 }}>{m.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" style={{ padding: '72px 32px', borderBottom: '1px solid #1a1a1a', background: '#0a0c0a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>// TERMINAL ARCHITECTURE</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Autonomous Execution Framework</h2>
          <p style={{ color: '#999', fontSize: 15, maxWidth: 680, marginBottom: 40, lineHeight: 1.7 }}>
            A straight line from research to revenue — built with modular clarity so the transition between research, development, and hosting is effortless.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {architecture.map((a) => (
              <div key={a.n} style={{ border: '1px solid #1a1a1a', borderRadius: 12, padding: 24, background: '#0d0f0d' }}>
                <div style={{ color: '#d8ff72', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{a.n}.</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{a.title}</h3>
                <p style={{ color: '#999', fontSize: 13.5, lineHeight: 1.6 }}>{a.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operating parameters */}
      <section style={{ padding: '72px 32px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>// OPERATING PARAMETERS</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>System Positioning</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {operatingParameters.map((p) => (
              <div key={p.k} style={{ borderLeft: '2px solid #d8ff72', paddingLeft: 16 }}>
                <div style={{ color: '#666', fontSize: 12, marginBottom: 6 }}>{p.k}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{p.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '48px 32px', background: '#0a0c0a' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ maxWidth: 360 }}>
            <a href="/" style={{ fontWeight: 700, fontSize: 16, textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <img src="/bizorvia-mark.png" alt="" style={{ width: 20, height: 20 }} />
              Bizorvia
            </a>
            <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6 }}>
              Your idea-to-income operating system. Every module’s status is real — live, partial, or roadmap, never guessed.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>NAVIGATION</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#overview" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Overview</a>
                <a href="#values" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Core Values</a>
                <a href="#suite" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Product Suite</a>
                <a href="#architecture" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Architecture</a>
              </div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>CORE VALUES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {coreValues.map((v) => (
                  <span key={v.k} style={{ color: '#999', fontSize: 13 }}>{v.title}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 980, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid #1a1a1a', color: '#555', fontSize: 12 }}>
          © Bizorvia. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
