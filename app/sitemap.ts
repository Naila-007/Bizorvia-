import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://bizorvia.com';
  const now = new Date();

  const blogSlugs = [
    'ai-tools-for-small-business-2025',
    'how-to-automate-your-business-with-ai',
    'ai-vs-hiring-what-makes-sense',
    'content-marketing-with-ai',
    'bizorvia-vs-chatgpt',
    'roi-of-ai-tools',
  ];

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/cli`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/storage`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/dev-hub`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...blogSlugs.map(slug => ({
      url: `${base}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}
