import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

// Force dynamic rendering to avoid SSG issues with SessionProvider
export const dynamic = 'force-dynamic';

// Heading font - Elegant serif for premium feel
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-heading',
  display: 'swap',
});

// Body font - Clean sans-serif for readability
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-body',
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
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
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
        url: '/og-image.png',
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
    images: ['/og-image.png'],
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
      className={`${playfair.variable} ${sourceSans.variable}`}
    >
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
