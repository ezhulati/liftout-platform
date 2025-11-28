import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { authors, blogArticles, type BlogArticle } from '@/lib/blog/articles';

export const metadata: Metadata = {
  title: 'Nick Acimovic - Co-Founder | Liftout',
  description:
    'Nick Acimovic is co-founder of Liftout and Managing Partner at Jovian Capital Management. Learn more about his background in finance and his vision for team-based hiring.',
  alternates: {
    canonical: '/blog/author/nick-acimovic',
  },
  openGraph: {
    title: 'Nick Acimovic - Co-Founder | Liftout',
    description:
      'Nick Acimovic is co-founder of Liftout and Managing Partner at Jovian Capital Management. Learn more about his background in finance and his vision for team-based hiring.',
    type: 'profile',
    url: '/blog/author/nick-acimovic',
    images: [
      {
        url: '/images/blog/Nick-Acimovic.png',
        width: 400,
        height: 400,
        alt: 'Nick Acimovic - Co-Founder of Liftout',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nick Acimovic - Co-Founder | Liftout',
    description:
      'Nick Acimovic is co-founder of Liftout and Managing Partner at Jovian Capital Management. Learn more about his background in finance and his vision for team-based hiring.',
    images: ['/images/blog/Nick-Acimovic.png'],
  },
};

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

export default function NickAcimovicPage() {
  const author = authors.nick;
  const authorArticles = blogArticles.filter(
    (article) => article.author.name === 'Nick Acimovic'
  );

  const baseUrl = process.env.NEXTAUTH_URL || 'https://liftout.com';

  // JSON-LD structured data for Person
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Nick Acimovic',
    url: `${baseUrl}/blog/author/nick-acimovic`,
    image: `${baseUrl}/images/blog/Nick-Acimovic.png`,
    jobTitle: 'Co-Founder',
    worksFor: {
      '@type': 'Organization',
      name: 'Liftout',
      url: baseUrl,
    },
    description: 'Co-founder of Liftout and Managing Partner at Jovian Capital Management.',
    sameAs: [
      author.social?.linkedin,
      author.social?.twitter,
      author.social?.instagram,
    ].filter(Boolean),
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Florida State University',
      },
    ],
    knowsAbout: ['Finance', 'Investment Management', 'Team Acquisition', 'Private Credit', 'Portfolio Management'],
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
          <div className="max-w-4xl mx-auto px-4 lg:px-10">
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
                Back to Insights
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
              {/* Author Image */}
              <div className="flex-shrink-0">
                <Image
                  src={author.avatar!}
                  alt={author.name}
                  width={160}
                  height={160}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-lg"
                />
              </div>

              {/* Author Info */}
              <div className="flex-1">
                {/* H1 - 44px bold */}
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2 leading-tight tracking-tight">
                  {author.name}
                </h1>
                <p className="text-gold text-lg font-medium mb-3">Co-Founder, Liftout</p>
                {/* Body text - 18px */}
                <p className="text-white/80 text-base md:text-lg leading-normal mb-6 max-w-prose">
                  Managing Partner at Jovian Capital Management. Previously Senior Vice President
                  at Resolution Capital Advisors where he led private credit trading and managed
                  over $2 billion in distressed consumer credit assets.
                </p>

                {/* Social Links - 48px touch targets */}
                {author.social && (
                  <div className="flex flex-wrap items-center gap-3">
                    {author.social.linkedin && (
                      <a
                        href={author.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 min-h-[48px] px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 text-base font-medium"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {author.social.twitter && (
                      <a
                        href={author.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 min-h-[48px] px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 text-base font-medium"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        X / Twitter
                      </a>
                    )}
                    {author.social.instagram && (
                      <a
                        href={author.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 min-h-[48px] px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 text-base font-medium"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Full Bio Section */}
        <section className="py-8 md:py-12 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 lg:px-10">
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-border">
              {/* H2 - 28px bold */}
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-6 leading-tight">
                About Nick
              </h2>

              {/* Prose - 18px body text */}
              <div className="space-y-4 text-base md:text-lg text-text-secondary leading-relaxed">
                <p>
                  Nick Acimovic is a seasoned finance professional and entrepreneur who co-founded
                  Liftout to transform how companies acquire talent and how teams navigate career
                  transitions together.
                </p>

                <p>
                  As Managing Partner of Jovian Capital Management based in Dallas, Texas, Nick
                  brings extensive experience in investment management and strategic deal-making.
                  Prior to his current role, he served as Senior Vice President at Resolution
                  Capital Advisors for over seven years, where he headed private credit trading
                  and was responsible for data analysis, deal closure, and portfolio management.
                </p>

                <p>
                  Earlier in his career at Resolution Capital, Nick progressed from Financial
                  Analyst to Director, demonstrating consistent growth and leadership. Before
                  joining Resolution Capital, he worked as a Financial Analyst at Boston Portfolio
                  Advisors, where he managed over $2 billion in distressed consumer credit assets
                  and structured products.
                </p>

                <p>
                  Nick holds a Master of Science in Finance from Florida State University&apos;s
                  College of Business, where he also served as a Teaching Assistant, lecturing and
                  tutoring students in Financial Management of the Firm. He earned his
                  Bachelor&apos;s Degree in Finance from Florida State University.
                </p>

                <p>
                  His expertise spans data analysis, deal closure, private credit markets, and
                  portfolio management. Nick&apos;s vision for Liftout stems from his understanding
                  that high-performing teams create exponential value when they stay together, and
                  that the traditional individual hiring model often destroys the chemistry and
                  trust that makes teams exceptional.
                </p>
              </div>

              {/* Education & Experience Highlights */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    {/* H3 - 22px bold */}
                    <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                      Experience
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-navy mt-2.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-text-primary text-base">Managing Partner</p>
                          <p className="text-sm text-text-secondary">
                            Jovian Capital Management (2025 - Present)
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-navy/60 mt-2.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-text-primary text-base">Senior Vice President</p>
                          <p className="text-sm text-text-secondary">
                            Resolution Capital Advisors (2018 - 2025)
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-navy/40 mt-2.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-text-primary text-base">Financial Analyst</p>
                          <p className="text-sm text-text-secondary">
                            Boston Portfolio Advisors (2011 - 2014)
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div>
                    {/* H3 - 22px bold */}
                    <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                      Education
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-navy mt-2.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-text-primary text-base">M.S. Finance</p>
                          <p className="text-sm text-text-secondary">
                            Florida State University (2009 - 2010)
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-navy/60 mt-2.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-text-primary text-base">B.S. Finance</p>
                          <p className="text-sm text-text-secondary">
                            Florida State University (2005 - 2009)
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles by Nick */}
        {authorArticles.length > 0 && (
          <section className="py-8 md:py-12 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 lg:px-10">
              {/* Section label */}
              <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                Articles by {author.name}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {authorArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-10 md:py-16 bg-navy-lightest border-t border-border">
          <div className="max-w-4xl mx-auto px-4 lg:px-10 text-center">
            {/* H2 - 28px bold */}
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-2 leading-tight">
              Ready to transform how you hire?
            </h2>
            <p className="text-base text-text-secondary mb-6 max-w-2xl mx-auto">
              Join Nick&apos;s vision for team-based hiring. Whether you&apos;re a company seeking
              proven teams or a team ready for new opportunities, Liftout can help.
            </p>
            {/* Buttons - 48px touch targets, Verb + Noun labels */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center min-h-[48px] px-6 bg-navy text-white font-medium rounded-lg hover:bg-navy-600 transition-colors duration-200 text-base"
              >
                Get started
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center min-h-[48px] px-6 bg-white text-text-primary font-medium rounded-lg border border-border hover:border-navy hover:text-navy transition-colors duration-200 text-base"
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
