import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  getArticlesByCategory,
  getAllCategories,
  type BlogArticle,
} from '@/lib/blog/articles';

interface PageProps {
  params: Promise<{ category: string }>;
}

const categoryDescriptions: Record<string, string> = {
  contracts:
    'Stay informed about non-compete agreements, employment contracts, and the evolving legal landscape affecting team mobility.',
  liftouts:
    'Learn the ins and outs of team liftouts, from ethical resignation strategies to maximizing the benefits of moving together.',
  teamwork:
    'Discover insights on building high-performing teams, collaboration strategies, and what makes great partnerships thrive.',
};

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const isValidCategory = getAllCategories().includes(normalizedCategory as BlogArticle['category']);

  if (!isValidCategory) {
    return {
      title: 'Category Not Found | Liftout',
    };
  }

  return {
    title: `${normalizedCategory} - Insights | Liftout`,
    description: categoryDescriptions[category.toLowerCase()] || `Articles about ${normalizedCategory}`,
  };
}

// Practical UI: Article card with proper spacing, typography, and visual hierarchy
function ArticleCard({ article }: { article: BlogArticle }) {
  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
function CategoryFilter({
  categories,
  currentCategory,
}: {
  categories: BlogArticle['category'][];
  currentCategory: string;
}) {
  return (
    <nav aria-label="Article categories" className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className="min-h-[48px] px-4 inline-flex items-center text-base font-medium bg-white text-text-secondary border border-border rounded-full hover:border-navy hover:text-navy transition-colors duration-200"
      >
        All articles
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/blog/category/${category.toLowerCase()}`}
          className={`min-h-[48px] px-4 inline-flex items-center text-base font-medium rounded-full transition-colors duration-200 ${
            category.toLowerCase() === currentCategory.toLowerCase()
              ? 'bg-navy text-white'
              : 'bg-white text-text-secondary border border-border hover:border-navy hover:text-navy'
          }`}
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const normalizedCategory = (category.charAt(0).toUpperCase() + category.slice(1)) as BlogArticle['category'];
  const categories = getAllCategories();

  if (!categories.includes(normalizedCategory)) {
    notFound();
  }

  const articles = getArticlesByCategory(normalizedCategory);

  return (
    <>
      <LandingHeader />
      <main className="bg-bg min-h-screen">
        {/* Hero Section - Practical UI: Dark section with proper contrast */}
        <section className="bg-[#0f172a] pt-40 pb-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            {/* Back link - 48px touch target */}
            <div className="mb-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 min-h-[48px] text-white/70 hover:text-white transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                All Insights
              </Link>
            </div>
            <div className="max-w-3xl">
              {/* H1 - 44px bold, tight line height */}
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
                {normalizedCategory}
              </h1>
              {/* Body text - 18px, 1.5 line height */}
              <p className="text-lg text-white/80 leading-normal max-w-prose">
                {categoryDescriptions[category.toLowerCase()]}
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter - 48px section spacing */}
        <section className="py-6 border-b border-border bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <CategoryFilter categories={categories} currentCategory={category} />
          </div>
        </section>

        {/* Articles Grid - XXL spacing (80px) for major section */}
        <section className="py-6 md:py-10 pb-10 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            {/* Article count - Small text */}
            <p className="text-sm text-text-tertiary mb-4">
              {articles.length} article{articles.length !== 1 ? 's' : ''} in {normalizedCategory}
            </p>
            {articles.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-base text-text-secondary mb-4">No articles found in this category.</p>
                <Link
                  href="/blog"
                  className="inline-flex items-center min-h-[48px] px-6 bg-navy text-white font-medium rounded-lg hover:bg-navy-600 transition-colors duration-200"
                >
                  View all articles
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA - Proper form design */}
        <section className="py-10 md:py-16 bg-navy-lightest border-t border-border">
          <div className="max-w-7xl mx-auto px-4 lg:px-10 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-2 leading-tight">
              Stay updated on {normalizedCategory.toLowerCase()}
            </h2>
            <p className="text-base text-text-secondary mb-6 max-w-2xl mx-auto">
              Get the latest insights on {normalizedCategory.toLowerCase()} delivered to your inbox.
            </p>
            {/* Form - Single column, labels would be on top if we had them */}
            <form className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
              <label htmlFor="email-subscribe-category" className="sr-only">
                Email address
              </label>
              <input
                id="email-subscribe-category"
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
