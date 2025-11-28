import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  blogArticles,
  getArticleBySlug,
  getRelatedArticles,
  type BlogArticle,
} from '@/lib/blog/articles';

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
      publishedTime: article.publishDate,
      modifiedTime: article.modifiedDate,
      authors: [article.author.name],
      tags: article.tags,
    },
  };
}

function RelatedArticleCard({ article }: { article: BlogArticle }) {
  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block bg-bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border"
    >
      <div className="relative aspect-[16/9] bg-bg-surface-secondary">
        <div className="absolute inset-0 flex items-center justify-center text-text-tertiary">
          <svg
            className="w-10 h-10 opacity-30"
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
      <div className="p-4">
        <span className="text-xs text-text-tertiary">{formattedDate}</span>
        <h4 className="text-sm font-semibold text-text-primary mt-1 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h4>
      </div>
    </Link>
  );
}

function ArticleContent({ content }: { content: string }) {
  // Convert markdown-style content to HTML
  const processContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let inList = false;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 my-6 text-text-secondary">
            {currentList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        currentList = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-text-primary mt-10 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-text-primary mt-8 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- **') || trimmedLine.startsWith('* **')) {
        inList = true;
        const text = trimmedLine
          .replace(/^[-*]\s+/, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        currentList.push(text);
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        inList = true;
        currentList.push(trimmedLine.replace(/^[-*]\s+/, ''));
      } else if (trimmedLine.startsWith('1. ') || /^\d+\.\s/.test(trimmedLine)) {
        flushList();
        // Handle numbered lists
        const text = trimmedLine.replace(/^\d+\.\s+/, '');
        elements.push(
          <div key={index} className="flex gap-3 my-2">
            <span className="text-primary font-semibold">{trimmedLine.match(/^\d+/)?.[0]}.</span>
            <span className="text-text-secondary">{text}</span>
          </div>
        );
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold text-text-primary my-4">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      } else if (trimmedLine.startsWith('*Disclaimer:') || trimmedLine.startsWith('*Note:')) {
        flushList();
        elements.push(
          <p key={index} className="text-sm text-text-tertiary italic my-6 p-4 bg-bg-surface-secondary rounded-lg">
            {trimmedLine.replace(/^\*/, '').replace(/\*$/, '')}
          </p>
        );
      } else if (trimmedLine === '') {
        flushList();
      } else {
        flushList();
        // Process inline formatting
        const processedLine = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        elements.push(
          <p
            key={index}
            className="text-text-secondary leading-relaxed my-4"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    });

    flushList();
    return elements;
  };

  return <div className="prose-custom">{processContent(content)}</div>;
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
        {/* Hero Section */}
        <section className="dark-section pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
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
                Back to Insights
              </Link>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Link
                href={`/blog/category/${article.category.toLowerCase()}`}
                className="px-3 py-1 text-sm font-medium bg-primary/20 text-primary-light rounded-full hover:bg-primary/30 transition-colors"
              >
                {article.category}
              </Link>
              <span className="text-white/50">|</span>
              <span className="text-white/70">{formattedDate}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-white/70 leading-relaxed mb-8">
              {article.metaDescription}
            </p>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary-light font-semibold text-lg">
                  {article.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{article.author.name}</p>
                {article.author.bio && (
                  <p className="text-white/60 text-sm">{article.author.bio.slice(0, 60)}...</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="bg-bg-surface rounded-2xl p-8 md:p-12 shadow-sm border border-border">
              <ArticleContent content={article.content} />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm font-medium text-text-tertiary mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                      className="px-3 py-1 text-sm bg-bg-surface-secondary text-text-secondary rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              {article.author.bio && (
                <div className="mt-8 p-6 bg-bg-surface-secondary rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-2xl">
                        {article.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary mb-1">
                        About {article.author.name}
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {article.author.bio}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-12 pb-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-text-primary mb-8">Related Articles</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <RelatedArticleCard key={relatedArticle.slug} article={relatedArticle} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-bg-surface-secondary border-t border-border">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Ready to Make Your Move Together?
            </h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Whether you&apos;re a team looking for new opportunities or a company seeking proven
              talent, Liftout connects you with the right match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary px-8 py-3">
                Get Started
              </Link>
              <Link
                href="/contact"
                className="btn-secondary px-8 py-3"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
