import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://bizorvia.com';
  const now = new Date('2026-09-23');

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/features`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/how-to-use-bizorvia`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/automate-your-business-with-bizorvia`, lastModified: new Date('2026-09-15'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/bizorvia-for-content-marketing`, lastModified: new Date('2026-09-08'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/bizorvia-vs-hiring`, lastModified: new Date('2026-08-28'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/bizorvia-roi-guide`, lastModified: new Date('2026-08-19'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/bizorvia-for-solo-founders`, lastModified: new Date('2026-08-10'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
