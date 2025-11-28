import { Metadata } from 'next';
import Link from 'next/link';
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

function ArticleCard({ article }: { article: BlogArticle }) {
  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block bg-bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border"
    >
      <div className="relative aspect-[16/10] bg-bg-surface-secondary">
        <div className="absolute inset-0 flex items-center justify-center text-text-tertiary">
          <svg
            className="w-12 h-12 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
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

function CategoryFilter({
  categories,
  currentCategory,
}: {
  categories: BlogArticle['category'][];
  currentCategory: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/blog"
        className="px-4 py-2 text-sm font-medium bg-bg-surface-secondary text-text-secondary rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/blog/category/${category.toLowerCase()}`}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            category.toLowerCase() === currentCategory.toLowerCase()
              ? 'bg-primary text-white'
              : 'bg-bg-surface-secondary text-text-secondary hover:bg-primary/10 hover:text-primary'
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
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
        {/* Hero Section */}
        <section className="dark-section pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                All Insights
              </Link>
            </div>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {normalizedCategory}
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                {categoryDescriptions[category.toLowerCase()]}
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <CategoryFilter categories={categories} currentCategory={category} />
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="text-text-tertiary mb-8">
              {articles.length} article{articles.length !== 1 ? 's' : ''} in {normalizedCategory}
            </p>
            {articles.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-text-secondary">No articles found in this category.</p>
                <Link href="/blog" className="text-primary hover:underline mt-4 inline-block">
                  View all articles
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
