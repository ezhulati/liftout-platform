'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type BlogArticle } from '@/lib/blog/articles';

// Extract headings from content for TOC
function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split('\n');

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace('## ', '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 2 });
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace('### ', '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 3 });
    }
  });

  return headings;
}

// Sidebar Related Article Card
function SidebarArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block py-3 border-b border-border last:border-b-0"
    >
      <span className="text-xs text-navy font-medium">{article.category}</span>
      <h4 className="text-sm font-medium text-text-primary mt-1 group-hover:text-navy transition-colors leading-snug line-clamp-2">
        {article.title}
      </h4>
    </Link>
  );
}

// Table of Contents component
function TableOfContents({
  headings,
  relatedArticles = []
}: {
  headings: { id: string; text: string; level: number }[];
  relatedArticles?: BlogArticle[];
}) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile TOC - Collapsible */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between min-h-[48px] px-4 bg-white rounded-lg text-text-primary font-medium border border-border shadow-sm"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Table of contents
          </span>
          <svg
            className={`w-5 h-5 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <nav className="mt-2 p-4 bg-white rounded-lg border border-border shadow-sm">
            <ul className="space-y-1">
              {headings.map(({ id, text, level }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToHeading(id)}
                    className={`w-full text-left min-h-[44px] px-3 py-2 rounded-lg text-base transition-colors ${
                      level === 3 ? 'pl-6' : ''
                    } ${
                      activeId === id
                        ? 'bg-navy text-white font-medium'
                        : 'text-text-secondary hover:bg-navy-lightest hover:text-navy'
                    }`}
                  >
                    {text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop TOC - Sticky sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-28">
          {/* Table of Contents */}
          <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            On this page
          </p>
          <nav className="mb-10">
            <ul className="space-y-1 border-l-2 border-border">
              {headings.map(({ id, text, level }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToHeading(id)}
                    className={`w-full text-left py-2 transition-colors border-l-2 -ml-[2px] ${
                      level === 3 ? 'pl-6' : 'pl-4'
                    } ${
                      activeId === id
                        ? 'border-navy text-navy font-medium'
                        : 'border-transparent text-text-secondary hover:text-navy hover:border-navy-light'
                    }`}
                  >
                    <span className="text-sm leading-snug line-clamp-2">{text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                Related articles
              </p>
              <div>
                {relatedArticles.map((article) => (
                  <SidebarArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// Practical UI: Prose content with proper typography
// H2: 28px bold, H3: 22px bold, Body: 18px, Line height: 1.5+
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
            className="list-disc pl-6 space-y-3 my-6 text-text-secondary text-lg leading-relaxed"
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
        const headingText = trimmedLine.replace('## ', '');
        const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        elements.push(
          <h2
            key={index}
            id={id}
            className="font-heading text-2xl md:text-[28px] font-bold text-text-primary mt-12 mb-4 leading-tight scroll-mt-28"
          >
            {headingText}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        const headingText = trimmedLine.replace('### ', '');
        const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        elements.push(
          <h3
            key={index}
            id={id}
            className="font-heading text-xl md:text-[22px] font-bold text-text-primary mt-10 mb-3 leading-snug scroll-mt-28"
          >
            {headingText}
          </h3>
        );
      } else if (trimmedLine.startsWith('- **') || trimmedLine.startsWith('* **')) {
        inList = true;
        const text = trimmedLine
          .replace(/^[-*]\s+/, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>');
        currentList.push(text);
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        inList = true;
        currentList.push(trimmedLine.replace(/^[-*]\s+/, ''));
      } else if (trimmedLine.startsWith('1. ') || /^\d+\.\s/.test(trimmedLine)) {
        flushList();
        const num = trimmedLine.match(/^\d+/)?.[0];
        const text = trimmedLine.replace(/^\d+\.\s+/, '');
        elements.push(
          <div key={index} className="flex gap-4 my-3">
            <span className="text-navy font-semibold text-lg flex-shrink-0">{num}.</span>
            <span className="text-text-secondary text-lg leading-relaxed">{text}</span>
          </div>
        );
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold text-text-primary my-6 text-lg">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      } else if (trimmedLine.startsWith('*Disclaimer:') || trimmedLine.startsWith('*Note:')) {
        flushList();
        elements.push(
          <p
            key={index}
            className="text-base text-text-tertiary italic my-8 p-5 bg-navy-lightest rounded-lg border border-border"
          >
            {trimmedLine.replace(/^\*/, '').replace(/\*$/, '')}
          </p>
        );
      } else if (trimmedLine === '') {
        flushList();
      } else {
        flushList();
        const processedLine = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        elements.push(
          <p
            key={index}
            className="text-text-secondary text-lg leading-relaxed my-5"
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

interface ArticleWithTOCProps {
  article: BlogArticle;
  relatedArticles?: BlogArticle[];
}

export function ArticleWithTOC({ article, relatedArticles = [] }: ArticleWithTOCProps) {
  const headings = extractHeadings(article.content);

  return (
    <article className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:gap-12">
          {/* TOC - Collapsible on mobile, sticky sidebar on desktop */}
          <TableOfContents headings={headings} relatedArticles={relatedArticles} />

          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">

            <div className="bg-white rounded-lg p-6 md:p-12 shadow-sm border border-border">
              <ArticleContent content={article.content} />

              {/* Tags - XL spacing above */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                  Tags
                </p>
                <div className="flex flex-wrap gap-3">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                      className="min-h-[48px] px-4 inline-flex items-center text-base bg-navy-lightest text-text-secondary rounded-full hover:bg-navy-light hover:text-navy transition-colors duration-200"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Author Bio - M spacing (24pt) */}
              {article.author.bio && (
                <div className="mt-8 p-6 md:p-8 bg-navy-lightest rounded-lg">
                  <div className="flex items-start gap-5">
                    {article.author.avatar ? (
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={72}
                        height={72}
                        className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-navy-light flex items-center justify-center flex-shrink-0">
                        <span className="text-navy font-semibold text-2xl">
                          {article.author.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <Link
                        href="/blog/author/nick-acimovic"
                        className="font-heading font-bold text-text-primary text-xl hover:text-navy transition-colors"
                      >
                        About {article.author.name}
                      </Link>
                      <p className="text-text-secondary text-base md:text-lg leading-relaxed mt-2 mb-4">
                        {article.author.bio}
                      </p>
                      {/* Social links - 48px touch targets */}
                      {article.author.social && (
                        <div className="flex items-center gap-1">
                          {article.author.social.linkedin && (
                            <a
                              href={article.author.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 inline-flex items-center justify-center text-text-tertiary hover:text-navy transition-colors rounded-lg hover:bg-white/50"
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
                              className="w-12 h-12 inline-flex items-center justify-center text-text-tertiary hover:text-navy transition-colors rounded-lg hover:bg-white/50"
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
                              className="w-12 h-12 inline-flex items-center justify-center text-text-tertiary hover:text-navy transition-colors rounded-lg hover:bg-white/50"
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
        </div>
      </div>
    </article>
  );
}
