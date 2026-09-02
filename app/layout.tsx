import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Bizorvia — Your Idea-to-Income Operating System',
  description: 'Build, launch, and scale your business with AI. Research, brand, website, payments, legal, marketing — all in one workspace.',
  metadataBase: new URL('https://bizorvia.com'),
  verification: { google: 'WJ8RkzHm-nkbZy9kBNfrQAIq61Z0ICgSvO2y1AnHX3w' },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon-64.png',
    shortcut: '/favicon-64.png',
  },
  openGraph: {
    title: 'Bizorvia — Your Idea-to-Income Operating System',
    description: 'Turn one idea into a live business with AI.',
    url: 'https://bizorvia.com',
    siteName: 'Bizorvia',
    type: 'website',
    images: [{ url: '/bizorvia-mark.png', width: 1080, height: 1080, alt: 'Bizorvia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bizorvia — Your Idea-to-Income Operating System',
    description: 'Turn one idea into a live business with AI.',
    images: ['/bizorvia-mark.png'],
  },
};

// REPLACE G-XXXXXXXXXX with your real Google Analytics Measurement ID
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        {GA_ID !== 'G-XXXXXXXXXX' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy='afterInteractive'
            />
            <Script id='ga-init' strategy='afterInteractive'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
