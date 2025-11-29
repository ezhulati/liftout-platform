import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://liftout.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/for-companies',
          '/for-teams',
          '/blog',
          '/contact',
          '/privacy',
          '/terms',
          '/auth/signin',
          '/auth/signup',
        ],
        disallow: [
          '/app/',              // Authenticated dashboard routes
          '/admin/',            // Admin panel routes
          '/api/',              // API routes
          '/auth/error',        // Error pages
          '/auth/forgot-password',
          '/auth/reset-password',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
