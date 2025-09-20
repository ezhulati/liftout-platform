import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Liftout',
    default: 'Liftout - Team-Based Hiring Marketplace',
  },
  description: 'The first marketplace for team-based hiring. Connect companies seeking intact teams with teams looking to move together.',
  keywords: ['team hiring', 'liftout', 'recruitment', 'talent acquisition', 'team placement'],
  authors: [{ name: 'Liftout Team' }],
  creator: 'Liftout',
  publisher: 'Liftout',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Liftout - Team-Based Hiring Marketplace',
    description: 'The first marketplace for team-based hiring. Connect companies seeking intact teams with teams looking to move together.',
    url: '/',
    siteName: 'Liftout',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Liftout - Team-Based Hiring Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liftout - Team-Based Hiring Marketplace',
    description: 'The first marketplace for team-based hiring. Connect companies seeking intact teams with teams looking to move together.',
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}