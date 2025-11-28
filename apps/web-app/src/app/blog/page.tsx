import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  blogArticles,
  getAllCategories,
  getRecentArticles,
  type BlogArticle,
} from '@/lib/blog/articles';

export const metadata: Metadata = {
  title: 'Insights - Team Hiring & Liftout Resources | Liftout',
  description:
    'Expert insights on team liftouts, hiring strategies, non-compete agreements, and building high-performing teams. Stay informed with the latest trends in team-based recruitment.',
};

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
        className="group block bg-bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px] bg-bg-surface-secondary">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                {article.category}
              </span>
              <span className="text-sm text-text-tertiary">{formattedDate}</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              {article.metaDescription}
            </p>
            <div className="flex items-center gap-2 text-primary font-medium">
              Read article
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block bg-bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border"
    >
      <div className="relative aspect-[16/10] bg-bg-surface-secondary overflow-hidden">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {article.category}
          </span>
          <span className="text-sm text-text-tertiary">{formattedDate}</span>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
          {article.metaDescription}
        </p>
      </div>
    </Link>
  );
}

function CategoryFilter({ categories }: { categories: BlogArticle['category'][] }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/blog"
        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/blog/category/${category.toLowerCase()}`}
          className="px-4 py-2 text-sm font-medium bg-bg-surface-secondary text-text-secondary rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const categories = getAllCategories();
  const recentArticles = getRecentArticles(12);
  const [featuredArticle, ...otherArticles] = recentArticles;

  return (
    <>
      <LandingHeader />
      <main className="bg-bg min-h-screen">
        {/* Hero Section */}
        <section className="dark-section pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Insights</h1>
              <p className="text-xl text-white/70 leading-relaxed">
                Expert perspectives on team liftouts, hiring strategies, employment law, and
                building high-performing teams. Stay ahead with the latest trends in team-based
                recruitment.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <CategoryFilter categories={categories} />
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-6">
                Featured
              </h2>
              <ArticleCard article={featuredArticle} featured />
            </div>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="py-12 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-6">
              Latest Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-bg-surface-secondary border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Stay Updated on Team Hiring Trends
            </h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Get the latest insights on liftouts, non-compete legislation, and team-based
              recruitment strategies delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="btn-primary px-6 py-3">Subscribe</button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
