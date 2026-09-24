import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Blog — Bizorvia | Business Growth Resources',
  description: 'Practical guides, case studies, and strategies to grow your business with Bizorvia.',
  openGraph: { title: 'Bizorvia Blog', description: 'Grow faster with Bizorvia — practical strategies for modern business owners.', url: 'https://bizorvia.com/blog' },
};

const posts = [
  { slug: 'how-to-use-bizorvia', title: 'How to Use Bizorvia: A Complete Getting Started Guide', date: '2026-09-22', category: 'Guide', excerpt: 'Everything you need to launch with Bizorvia — from your first project to automating your entire workflow.', readTime: '6 min' },
  { slug: 'automate-your-business-with-bizorvia', title: 'Automate 80% of Your Business With Bizorvia (No Tech Team Needed)', date: '2026-09-15', category: 'Automation', excerpt: 'A practical step-by-step guide for solo founders and small teams who want to do more with less.', readTime: '7 min' },
  { slug: 'bizorvia-for-content-marketing', title: 'How Bizorvia Powers Your Entire Content Marketing Strategy', date: '2026-09-08', category: 'Marketing', excerpt: 'From blogs to social posts to email campaigns — one platform to create content that actually converts.', readTime: '8 min' },
  { slug: 'bizorvia-vs-hiring', title: 'Bizorvia vs. Hiring: When Automation Wins Every Time', date: '2026-08-28', category: 'Strategy', excerpt: 'Calculate the real cost of tasks and see why Bizorvia beats hiring for most small business workflows.', readTime: '6 min' },
  { slug: 'bizorvia-roi-guide', title: 'The Bizorvia ROI Guide: How to Measure What Matters', date: '2026-08-19', category: 'Strategy', excerpt: 'Stop guessing — here is how to calculate the real returns your business gets from Bizorvia.', readTime: '4 min' },
  { slug: 'bizorvia-for-solo-founders', title: 'Why Solo Founders Are Choosing Bizorvia to Run Their Entire Business', date: '2026-08-10', category: 'Founders', excerpt: 'One person. One platform. See how solo founders use Bizorvia to compete with teams ten times their size.', readTime: '5 min' },
];

const catColors: Record<string, string> = { 'Guide': '#d8ff72', 'Automation': '#a78bfa', 'Strategy': '#fb923c', 'Marketing': '#34d399', 'Founders': '#60a5fa' };

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
          <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 12 }}>Grow your business with Bizorvia</h1>
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
