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
      <div className="p-3">
        <span className="text-sm text-text-tertiary">{formattedDate}</span>
        <h4 className="font-heading text-base font-bold text-text-primary mt-1 group-hover:text-navy transition-colors duration-200 line-clamp-2 leading-snug">
          {article.title}
        </h4>
      </div>
    </Link>
  );
}

// Practical UI: Prose content with proper typography
function ArticleContent({ content }: { content: string }) {
  const processContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let inList = false;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="list-disc pl-6 space-y-2 my-4 text-text-secondary text-base leading-normal"
          >
            {currentList.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
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
          <h2
            key={index}
            className="font-heading text-2xl font-bold text-text-primary mt-10 mb-3 leading-tight"
          >
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3
            key={index}
            className="font-heading text-xl font-bold text-text-primary mt-8 mb-2 leading-snug"
          >
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- **') || trimmedLine.startsWith('* **')) {
        inList = true;
        const text = trimmedLine
          .replace(/^[-*]\s+/, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>');
        currentList.push(text);
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        inList = true;
        currentList.push(trimmedLine.replace(/^[-*]\s+/, ''));
      } else if (trimmedLine.startsWith('1. ') || /^\d+\.\s/.test(trimmedLine)) {
        flushList();
        const num = trimmedLine.match(/^\d+/)?.[0];
        const text = trimmedLine.replace(/^\d+\.\s+/, '');
        elements.push(
          <div key={index} className="flex gap-3 my-2">
            <span className="text-navy font-semibold flex-shrink-0">{num}.</span>
            <span className="text-text-secondary text-base leading-normal">{text}</span>
          </div>
        );
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold text-text-primary my-4 text-base">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      } else if (trimmedLine.startsWith('*Disclaimer:') || trimmedLine.startsWith('*Note:')) {
        flushList();
        elements.push(
          <p
            key={index}
            className="text-sm text-text-tertiary italic my-6 p-4 bg-navy-lightest rounded-lg border border-border"
          >
            {trimmedLine.replace(/^\*/, '').replace(/\*$/, '')}
          </p>
        );
      } else if (trimmedLine === '') {
        flushList();
      } else {
        flushList();
        const processedLine = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        elements.push(
          <p
            key={index}
            className="text-text-secondary text-base leading-normal my-4 max-w-prose"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    });

    flushList();
    return elements;
  };

  return <div className="prose-article">{processContent(content)}</div>;
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
        <section className="bg-navy-darkest pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 lg:px-10">
            {/* Back link - Tertiary button style */}
            <div className="mb-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 text-base underline underline-offset-4 decoration-white/30 hover:decoration-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Insights
              </Link>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 mb-3">
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
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight max-w-heading">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-white/80 leading-normal mb-6 max-w-prose">
              {article.metaDescription}
            </p>

            {/* Author - with avatar and link */}
            <div className="flex items-center gap-3">
              {article.author.avatar ? (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {article.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <Link
                  href="/blog/author/nick-acimovic"
                  className="text-white font-medium text-base hover:text-gold transition-colors"
                >
                  {article.author.name}
                </Link>
                {article.author.bio && (
                  <p className="text-white/60 text-sm line-clamp-1">{article.author.bio.slice(0, 50)}...</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 lg:px-10">
            <div className="bg-white rounded-lg p-6 md:p-10 shadow-sm border border-border">
              <ArticleContent content={article.content} />

              {/* Tags */}
              <div className="mt-10 pt-6 border-t border-border">
                <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                      className="min-h-[40px] px-3 inline-flex items-center text-sm bg-navy-lightest text-text-secondary rounded-full hover:bg-navy-light hover:text-navy transition-colors duration-200"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              {article.author.bio && (
                <div className="mt-6 p-6 bg-navy-lightest rounded-lg">
                  <div className="flex items-start gap-4">
                    {article.author.avatar ? (
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-navy-light flex items-center justify-center flex-shrink-0">
                        <span className="text-navy font-semibold text-2xl">
                          {article.author.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <Link
                        href="/blog/author/nick-acimovic"
                        className="font-heading font-bold text-text-primary text-lg hover:text-navy transition-colors"
                      >
                        About {article.author.name}
                      </Link>
                      <p className="text-text-secondary text-base leading-normal mt-1 mb-3">
                        {article.author.bio}
                      </p>
                      {/* Social links - 48px touch targets */}
                      {article.author.social && (
                        <div className="flex items-center gap-2">
                          {article.author.social.linkedin && (
                            <a
                              href={article.author.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 inline-flex items-center justify-center text-text-tertiary hover:text-navy transition-colors"
                              aria-label="LinkedIn"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                            </a>
                          )}
                          {article.author.social.twitter && (
                            <a
                              href={article.author.social.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 inline-flex items-center justify-center text-text-tertiary hover:text-navy transition-colors"
                              aria-label="Twitter"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                            </a>
                          )}
                          {article.author.social.instagram && (
                            <a
                              href={article.author.social.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 inline-flex items-center justify-center text-text-tertiary hover:text-navy transition-colors"
                              aria-label="Instagram"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-10 pb-16">
            <div className="max-w-4xl mx-auto px-4 lg:px-10">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6 leading-tight">
                Related articles
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedArticles.map((relatedArticle) => (
                  <RelatedArticleCard key={relatedArticle.slug} article={relatedArticle} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-10 md:py-16 bg-navy-lightest border-t border-border">
          <div className="max-w-4xl mx-auto px-4 lg:px-10 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-2 leading-tight">
              Ready to make your move together?
            </h2>
            <p className="text-base text-text-secondary mb-6 max-w-2xl mx-auto">
              Whether you&apos;re a team looking for new opportunities or a company seeking proven
              talent, Liftout connects you with the right match.
            </p>
            {/* Buttons - Primary left, Secondary right */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
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
