import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  blogArticles,
  getArticleBySlug,
  getRelatedArticles,
  type BlogArticle,
} from '@/lib/blog/articles';
import { ArticleWithTOC } from '@/components/blog/ArticleWithTOC';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Liftout',
    };
  }

  return {
    title: `${article.title} | Liftout Insights`,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: 'article',
      url: `/blog/${slug}`,
      publishedTime: article.publishDate,
      modifiedTime: article.modifiedDate,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: article.featuredImage,
          width: 1024,
          height: 768,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: [article.featuredImage],
    },
  };
}

// Practical UI: Related article card with proper hierarchy
function RelatedArticleCard({ article }: { article: BlogArticle }) {
  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
    >
      <div className="relative aspect-[16/9] bg-navy-lightest overflow-hidden">
        <Image
          src={article.featuredImage}
          alt=""
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          sizes="33vw"
        />
      </div>
      <div className="p-4">
        <span className="text-sm text-text-tertiary">{formattedDate}</span>
        <h4 className="font-heading text-base font-bold text-text-primary mt-1 group-hover:text-navy transition-colors duration-200 line-clamp-2 leading-snug">
          {article.title}
        </h4>
      </div>
    </Link>
  );
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article, 3);
  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <LandingHeader />
      <main className="bg-bg min-h-screen">
        {/* Hero Section - Dark with proper contrast */}
        <section className="bg-[#0f172a] pt-40 pb-20">
          <div className="max-w-4xl mx-auto px-4 lg:px-10">
            {/* Back link - Tertiary button style */}
            <div className="mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 min-h-[48px] text-white/70 hover:text-white transition-colors duration-200 text-base"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Insights
              </Link>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/blog/category/${article.category.toLowerCase()}`}
                className="text-gold font-medium text-base hover:text-gold-light transition-colors"
              >
                {article.category}
              </Link>
              <span className="text-white/50">&middot;</span>
              <span className="text-white/70 text-base">{formattedDate}</span>
            </div>

            {/* Title - H1 44px */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-prose">
              {article.metaDescription}
            </p>

            {/* Author byline */}
            <p className="text-white/80 text-base">
              By{' '}
              <Link
                href="/blog/author/nick-acimovic"
                className="text-white font-medium hover:text-gold transition-colors"
              >
                {article.author.name}
              </Link>
            </p>
          </div>
        </section>

        {/* Article Content with TOC */}
        <ArticleWithTOC article={article} relatedArticles={relatedArticles} />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-12 pb-20">
            <div className="max-w-4xl mx-auto px-4 lg:px-10">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-8 leading-tight">
                Related articles
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <RelatedArticleCard key={relatedArticle.slug} article={relatedArticle} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-navy-lightest border-t border-border">
          <div className="max-w-4xl mx-auto px-4 lg:px-10 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-3 leading-tight">
              Ready to make your move together?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Whether you&apos;re a team looking for new opportunities or a company seeking proven
              talent, Liftout connects you with the right match.
            </p>
            {/* Buttons - Primary left, Secondary right */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/signup"
                className="min-h-[48px] px-6 inline-flex items-center justify-center bg-navy text-white font-medium rounded-lg hover:bg-navy-600 transition-colors duration-200 text-base"
              >
                Get started
              </Link>
              <Link
                href="/contact"
                className="min-h-[48px] px-6 inline-flex items-center justify-center bg-white text-navy font-medium rounded-lg border border-navy hover:bg-navy-lightest transition-colors duration-200 text-base"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
