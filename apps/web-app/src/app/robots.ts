import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://liftout.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/app/',        // Authenticated dashboard routes
          '/api/',        // API routes
          '/auth/error',  // Error pages
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
