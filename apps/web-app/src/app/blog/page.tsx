import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  getAllCategories,
  getRecentArticles,
  type BlogArticle,
} from '@/lib/blog/articles';

export const metadata: Metadata = {
  title: 'Insights - Team Hiring & Liftout Resources | Liftout',
  description:
    'Expert insights on team liftouts, hiring strategies, non-compete agreements, and building high-performing teams. Stay informed with the latest trends in team-based recruitment.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Insights - Team Hiring & Liftout Resources | Liftout',
    description:
      'Expert insights on team liftouts, hiring strategies, non-compete agreements, and building high-performing teams. Stay informed with the latest trends in team-based recruitment.',
    type: 'website',
    url: '/blog',
    images: [
      {
        url: '/hero-team.jpeg',
        width: 1200,
        height: 630,
        alt: 'Liftout Insights - Team Hiring & Liftout Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights - Team Hiring & Liftout Resources | Liftout',
    description:
      'Expert insights on team liftouts, hiring strategies, non-compete agreements, and building high-performing teams.',
    images: ['/hero-team.jpeg'],
  },
};

// Practical UI: Article card with proper spacing, typography, and visual hierarchy
function ArticleCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (featured) {
    return (
      <Link
        href={`/blog/${article.slug}`}
        className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image - 16:10 aspect ratio with overlay for text legibility */}
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px] bg-navy-lightest overflow-hidden">
            <Image
              src={article.featuredImage}
              alt=""
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Content - Practical UI spacing: 32px padding */}
          <div className="p-4 md:p-6 flex flex-col justify-center">
            {/* Meta - Small text (15px) */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-navy">{article.category}</span>
              <span className="text-sm text-text-tertiary">&middot;</span>
              <span className="text-sm text-text-tertiary">{formattedDate}</span>
            </div>
            {/* Title - H3 (28px bold) with tight line height */}
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-2 leading-tight group-hover:text-navy transition-colors duration-200">
              {article.title}
            </h2>
            {/* Description - Body text (18px) */}
            <p className="text-base text-text-secondary leading-normal mb-4 line-clamp-3">
              {article.metaDescription}
            </p>
            {/* CTA - Tertiary button style (underlined text link) */}
            <span className="inline-flex items-center gap-1 text-navy font-medium text-base underline underline-offset-4 decoration-navy/30 group-hover:decoration-navy transition-colors">
              Read article
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-navy-lightest overflow-hidden">
        <Image
          src={article.featuredImage}
          alt=""
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      {/* Content - 24px padding (M spacing) */}
      <div className="p-3">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-navy">{article.category}</span>
          <span className="text-sm text-text-tertiary">&middot;</span>
          <span className="text-sm text-text-tertiary">{formattedDate}</span>
        </div>
        {/* Title - H4 (22px bold) */}
        <h3 className="font-heading text-lg font-bold text-text-primary mb-1 leading-snug group-hover:text-navy transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
        {/* Description */}
        <p className="text-base text-text-secondary leading-normal line-clamp-2">
          {article.metaDescription}
        </p>
      </div>
    </Link>
  );
}

// Practical UI: Category filter with proper touch targets (48px min)
function CategoryFilter({ categories }: { categories: BlogArticle['category'][] }) {
  return (
    <nav aria-label="Article categories" className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className="min-h-[48px] px-4 inline-flex items-center text-base font-medium bg-navy text-white rounded-full hover:bg-navy-600 transition-colors duration-200"
      >
        All articles
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/blog/category/${category.toLowerCase()}`}
          className="min-h-[48px] px-4 inline-flex items-center text-base font-medium bg-white text-text-secondary border border-border rounded-full hover:border-navy hover:text-navy transition-colors duration-200"
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}

export default function BlogPage() {
  const categories = getAllCategories();
  const recentArticles = getRecentArticles(13);
  const [featuredArticle, ...otherArticles] = recentArticles;

  const baseUrl = process.env.NEXTAUTH_URL || 'https://liftout.com';

  // JSON-LD structured data for Blog
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Liftout Insights',
    description: 'Expert insights on team liftouts, hiring strategies, non-compete agreements, and building high-performing teams.',
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Liftout',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/Liftout-logo-dark.png`,
      },
    },
    blogPost: recentArticles.slice(0, 10).map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.metaDescription,
      url: `${baseUrl}/blog/${article.slug}`,
      datePublished: article.publishDate,
      author: {
        '@type': 'Person',
        name: article.author.name,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHeader />
      <main className="bg-bg min-h-screen">
        {/* Hero Section - Practical UI: Dark section with proper contrast */}
        <section className="bg-[#0f172a] pt-40 pb-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="max-w-3xl">
              {/* H1 - 44px bold, tight line height */}
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
                Insights
              </h1>
              {/* Body text - 18px, 1.5 line height */}
              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-prose">
                Expert perspectives on team liftouts, hiring strategies, employment law, and
                building high-performing teams. Stay ahead with the latest trends in team-based
                recruitment.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter - 48px section spacing */}
        <section className="py-6 border-b border-border bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <CategoryFilter categories={categories} />
          </div>
        </section>

        {/* Featured Article - XL spacing (48px) */}
        {featuredArticle && (
          <section className="py-6 md:py-10">
            <div className="max-w-7xl mx-auto px-4 lg:px-10">
              {/* Section label - Small caps style */}
              <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                Featured
              </p>
              <ArticleCard article={featuredArticle} featured />
            </div>
          </section>
        )}

        {/* Articles Grid - XXL spacing (80px) for major section */}
        <section className="py-6 md:py-10 pb-10 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">
              Latest articles
            </p>
            {/* 12-column grid with 32px gutters */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {otherArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA - Proper form design */}
        <section className="py-10 md:py-16 bg-navy-lightest border-t border-border">
          <div className="max-w-7xl mx-auto px-4 lg:px-10 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-2 leading-tight">
              Stay updated on team hiring trends
            </h2>
            <p className="text-base text-text-secondary mb-6 max-w-2xl mx-auto">
              Get the latest insights on liftouts, non-compete legislation, and team-based
              recruitment strategies delivered to your inbox.
            </p>
            {/* Form - Single column, labels would be on top if we had them */}
            <form className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
              <label htmlFor="email-subscribe" className="sr-only">
                Email address
              </label>
              <input
                id="email-subscribe"
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 min-h-[48px] px-4 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent text-base"
              />
              {/* Primary button - Verb + Noun label */}
              <button
                type="submit"
                className="min-h-[48px] px-6 bg-navy text-white font-medium rounded-lg hover:bg-navy-600 transition-colors duration-200 text-base"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
