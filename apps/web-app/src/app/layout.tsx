import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Providers } from './providers';
import { SkipToContent } from '@/components/ui';
import './globals.css';

// Force dynamic rendering to avoid SSG issues with SessionProvider
export const dynamic = 'force-dynamic';

// Inter - The gold standard for modern dashboards
// Used by Linear, Stripe, Vercel, Notion - designed specifically for screens
// Per Practical UI: "Use single sans serif for most interfaces"
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Liftout',
    default: 'Liftout – Hire Entire Teams, Not Just Individuals',
  },
  description: 'Skip the 6-month team-building phase. Connect with verified, intact teams who already work well together and deliver from day one.',
  keywords: ['hire teams', 'team acquisition', 'liftout', 'intact teams', 'high-performing teams', 'team hiring', 'team placement'],
  authors: [{ name: 'Liftout Team' }],
  creator: 'Liftout',
  publisher: 'Liftout',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Liftout',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Liftout – Hire Entire Teams, Not Just Individuals',
    description: 'Skip the 6-month team-building phase. Connect with verified, intact teams who already work well together and deliver from day one.',
    url: '/',
    siteName: 'Liftout',
    images: [
      {
        url: '/hero-team.webp',
        width: 1200,
        height: 630,
        alt: 'Liftout – Hire verified teams that deliver from day one',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liftout – Hire Entire Teams, Not Just Individuals',
    description: 'Skip the 6-month team-building phase. Connect with verified, intact teams who already work well together and deliver from day one.',
    images: ['/hero-team.webp'],
    creator: '@liftout',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={inter.variable}
    >
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2X9H3CR9V3"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2X9H3CR9V3');
            `,
          }}
        />
        {/* Microsoft Clarity */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "iipj1dgvoo");
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <SkipToContent />
        <Providers>
          {children}
        </Providers>
        {/* Portal root for dropdowns - must be last child and highest z-index */}
        <div id="dropdown-portal" style={{ position: 'relative', zIndex: 2147483647 }} />
      </body>
    </html>
  );
}
