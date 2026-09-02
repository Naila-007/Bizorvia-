import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bizorvia CLI — The Coding Agent for Your Terminal',
  description: 'A coding agent that runs from your terminal, powered by Bizorvia AI. Write code, fix bugs, generate files — all without leaving your shell.',
  openGraph: {
    title: 'Bizorvia CLI — The Coding Agent for Your Terminal',
    description: 'npm install -g bizorvia — A coding agent powered by Bizorvia AI.',
    url: 'https://bizorvia.com/cli',
  },
};

const steps = [
  { cmd: 'npm install -g bizorvia', label: 'Install globally' },
  { cmd: 'bizorvia login', label: 'Connect your account' },
  { cmd: 'bizorvia "build me a REST API for a todo app"', label: 'Start coding' },
];

const features = [
  { icon: '⚡', title: 'Write code instantly', desc: 'Describe what you want in plain English. Bizorvia writes the file, the function, the whole app.' },
  { icon: '🔍', title: 'Fix bugs automatically', desc: 'Paste an error. Get the fix. No Stack Overflow tab-switching required.' },
  { icon: '📂', title: 'Reads your codebase', desc: 'Point it at any file or folder. It understands context and writes code that fits your project.' },
  { icon: '🔄', title: 'Iterates on feedback', desc: 'Not quite right? Tell it. It refines without losing context from the conversation.' },
  { icon: '🌐', title: 'Works with any stack', desc: 'React, Next.js, Node, Python, Go, SQL — language-agnostic by design.' },
  { icon: '🔐', title: 'Your API key, your data', desc: 'Authenticated via your Bizorvia account. We never store your code.' },
];

const demos = [
  {
    input: '$ bizorvia "create a Next.js API route that accepts a POST with name and email, saves to Supabase, and returns a confirmation"',
    output: `✓ Reading project context...
✓ Detected: Next.js 15 + Supabase
✓ Writing: app/api/subscribe/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();
  const { error } = await supabase
    .from('subscribers')
    .insert({ name, email });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}

✓ Done in 1.2s`
  },
  {
    input: '$ bizorvia fix "TypeError: Cannot read properties of undefined (reading \'map\')"',
    output: `✓ Analyzing error...
✓ Scanning: src/components/ProductList.tsx

Found issue on line 23:
  products.map(p => <ProductCard key={p.id} {...p} />)

products may be undefined before data loads.

Fix applied:
  {(products ?? []).map(p => <ProductCard key={p.id} {...p} />)}

✓ File updated. No more crashes.`
  },
];

export default function CLIPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 10 }}>
        <a href='/' style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#fff' }}>Bizorvia</a>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <a href='/pricing' style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pricing</a>
          <a href='/blog' style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Blog</a>
          <a href='/signup' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Get started free</a>
        </div>
      </header>

      {/* Hero */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 32px 64px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#d8ff7215', border: '1px solid #d8ff7233', color: '#d8ff72', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 28 }}>
          <span>⬡</span> BIZORVIA CLI — BETA
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
          The coding agent<br />
          <span style={{ color: '#d8ff72' }}>that lives in your terminal.</span>
        </h1>
        <p style={{ color: '#888', fontSize: 18, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
          Describe what you want to build. Bizorvia writes the code, fixes the bugs, and ships the files — right from your shell.
        </p>

        {/* Install command */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: '#111', border: '1px solid #2a2a2a', borderRadius: 12, padding: '14px 24px', marginBottom: 16 }}>
          <span style={{ color: '#555', fontSize: 14, userSelect: 'none' }}>$</span>
          <code style={{ color: '#d8ff72', fontSize: 16, fontFamily: 'monospace', letterSpacing: '0.5px' }}>npm install -g bizorvia</code>
          <span style={{ color: '#555', fontSize: 12 }}>copy</span>
        </div>
        <p style={{ color: '#555', fontSize: 13 }}>Free plan includes 10 AI actions/month. No credit card required.</p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 32 }}>
          <a href='/signup' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '14px 32px', borderRadius: 10, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>Create free account →</a>
          <a href='#demo' style={{ background: '#111', border: '1px solid #2a2a2a', color: '#fff', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>See it in action</a>
        </div>
      </div>

      {/* Terminal demo */}
      <div id='demo' style={{ maxWidth: 800, margin: '0 auto 80px', padding: '0 32px' }}>
        {demos.map((demo, i) => (
          <div key={i} style={{ background: '#0d1117', border: '1px solid #1e2a1e', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ background: '#111', borderBottom: '1px solid #1a1a1a', padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ color: '#555', fontSize: 12, marginLeft: 8 }}>terminal</span>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ color: '#d8ff72', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6, marginBottom: 16, wordBreak: 'break-word' }}>{demo.input}</div>
              <pre style={{ color: '#7ec87e', fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{demo.output}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 760, margin: '0 auto 80px', padding: '0 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Up and running in 60 seconds.</h2>
        <p style={{ color: '#666', marginBottom: 48 }}>Three commands. That's all it takes.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '18px 24px', textAlign: 'left' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#d8ff7222', color: '#d8ff72', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <code style={{ color: '#d8ff72', fontFamily: 'monospace', fontSize: 14 }}>{step.cmd}</code>
              </div>
              <span style={{ color: '#555', fontSize: 13 }}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 32px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, textAlign: 'center' }}>Everything a coding agent should do.</h2>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: 48 }}>Built for developers who want speed without the context-switching.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{f.title}</div>
              <div style={{ color: '#666', fontSize: 13, lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Commands reference */}
      <div style={{ maxWidth: 760, margin: '0 auto 80px', padding: '0 32px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, textAlign: 'center' }}>Command reference</h2>
        <div style={{ background: '#0d1117', border: '1px solid #1e2a1e', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ background: '#111', borderBottom: '1px solid #1a1a1a', padding: '10px 16px', display: 'flex', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{ padding: 28 }}>
            {[
              { cmd: 'bizorvia login', desc: '# Connect your Bizorvia account' },
              { cmd: 'bizorvia "prompt"', desc: '# Run a coding task' },
              { cmd: 'bizorvia fix "error"', desc: '# Debug and auto-fix an error' },
              { cmd: 'bizorvia explain file.ts', desc: '# Explain what a file does' },
              { cmd: 'bizorvia refactor file.ts', desc: '# Refactor a file for clarity' },
              { cmd: 'bizorvia test file.ts', desc: '# Generate unit tests' },
              { cmd: 'bizorvia review', desc: '# Review your last git diff' },
              { cmd: 'bizorvia credits', desc: '# Check remaining AI credits' },
              { cmd: 'bizorvia --help', desc: '# Full command list' },
            ].map(row => (
              <div key={row.cmd} style={{ display: 'flex', gap: 24, marginBottom: 12, fontFamily: 'monospace', fontSize: 13 }}>
                <span style={{ color: '#d8ff72', minWidth: 220 }}>{row.cmd}</span>
                <span style={{ color: '#555' }}>{row.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 640, margin: '0 auto 80px', padding: '0 32px', textAlign: 'center' }}>
        <div style={{ background: '#111', border: '1px solid #1e2a1e', borderRadius: 20, padding: '48px 40px' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Start building faster.</h2>
          <p style={{ color: '#666', marginBottom: 32, fontSize: 16 }}>One command. Your terminal. Bizorvia intelligence.</p>
          <code style={{ display: 'block', background: '#0d1117', border: '1px solid #2a2a2a', borderRadius: 8, padding: '14px 24px', color: '#d8ff72', fontSize: 15, fontFamily: 'monospace', marginBottom: 24 }}>npm install -g bizorvia</code>
          <a href='/signup' style={{ display: 'inline-block', background: '#d8ff72', color: '#0a0a0a', padding: '14px 40px', borderRadius: 10, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>Create free account →</a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 900, margin: '0 auto' }}>
        <span style={{ color: '#555', fontSize: 13 }}>© 2025 Bizorvia. Built by Dayyan LLC.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Blog', '/blog'], ['Contact', '/contact']].map(([l, h]) => (
            <a key={l} href={h} style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
