import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Blog — Bizorvia | AI Tools for Business',
  description: 'Tips, guides, and case studies on AI productivity for small businesses.',
  openGraph: { title: 'Bizorvia Blog', description: 'AI tips for modern business owners.', url: 'https://bizorvia.com/blog' },
};

const posts = [
  { slug: 'ai-tools-for-small-business-2025', title: '10 AI Tools That Are Changing Small Business in 2025', date: '2025-06-15', category: 'AI Tools', excerpt: 'From content generation to customer service, discover the AI tools giving small businesses a competitive edge.', readTime: '5 min' },
  { slug: 'how-to-automate-your-business-with-ai', title: 'How to Automate 80% of Your Business With AI (Without a Tech Team)', date: '2025-06-08', category: 'Automation', excerpt: 'A practical step-by-step guide for solo founders and small teams who want to do more with less.', readTime: '7 min' },
  { slug: 'ai-vs-hiring-what-makes-sense', title: 'AI vs. Hiring: When Does It Make Sense to Automate?', date: '2025-05-28', category: 'Strategy', excerpt: 'Calculate the real cost of tasks and decide intelligently whether to hire or automate.', readTime: '6 min' },
  { slug: 'content-marketing-with-ai', title: 'Content Marketing With AI: A Beginner\'s Playbook', date: '2025-05-19', category: 'Marketing', excerpt: 'How to use AI to write blogs, social posts, and email campaigns that actually convert.', readTime: '8 min' },
  { slug: 'bizorvia-vs-chatgpt', title: 'Bizorvia vs. ChatGPT: Which One Is Actually Better for Business?', date: '2025-05-10', category: 'Comparison', excerpt: 'We break down the real differences so you can choose the right tool for your workflow.', readTime: '5 min' },
  { slug: 'roi-of-ai-tools', title: 'The ROI of AI Tools: How to Measure What Matters', date: '2025-05-01', category: 'Strategy', excerpt: 'Stop guessing — here\'s how to calculate actual returns from your AI investments.', readTime: '4 min' },
];

const catColors: Record<string, string> = { 'AI Tools': '#d8ff72', 'Automation': '#a78bfa', 'Strategy': '#fb923c', 'Marketing': '#34d399', 'Comparison': '#60a5fa' };

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter,sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href='/' style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#fff' }}>Bizorvia</a>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href='/pricing' style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pricing</a>
          <a href='/login' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Start free</a>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ marginBottom: 52, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#d8ff7220', color: '#d8ff72', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>BLOG</div>
          <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 12 }}>AI insights for your business</h1>
          <p style={{ color: '#888', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>Practical guides, case studies, and strategies to help you work smarter.</p>
        </div>

        <div style={{ display: 'grid', gap: 24 }}>
          {posts.map((post, i) => (
            <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 28, transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ background: (catColors[post.category] || '#d8ff72') + '22', color: catColors[post.category] || '#d8ff72', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: 1 }}>{post.category}</span>
                <span style={{ color: '#555', fontSize: 12 }}>{post.readTime} read</span>
              </div>
              <h2 style={{ color: '#fff', fontSize: i === 0 ? 22 : 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{post.title}</h2>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>{post.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#444', fontSize: 12 }}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span style={{ color: '#d8ff72', fontSize: 13, fontWeight: 600 }}>Read article →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
