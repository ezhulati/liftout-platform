'use client';

import Link from 'next/link';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  ArrowRightIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BeakerIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';

// Case study summaries for the hub page
const caseStudies = [
  {
    slug: 'meta-scale-ai',
    year: '2025',
    acquirer: 'Meta',
    target: 'Scale AI',
    headline: 'Meta Hires Scale AI Founder to Lead Superintelligence Efforts',
    dealValue: '$14.3B',
    teamSize: 'CEO + leadership',
    industry: 'Technology / AI',
    category: 'tech',
  },
  {
    slug: 'google-windsurf',
    year: '2025',
    acquirer: 'Google',
    target: 'Windsurf',
    headline: 'Google Poaches Windsurf Leadership, Derailing OpenAI\'s $3B Acquisition',
    dealValue: '$2.4B',
    teamSize: '40+ engineers',
    industry: 'Technology / AI',
    category: 'tech',
  },
  {
    slug: 'crowell-reed-smith',
    year: '2025',
    acquirer: 'Crowell & Moring',
    target: 'Reed Smith',
    headline: '16 Partners and 24+ Associates Move as One Unit',
    dealValue: '40+ lawyers',
    teamSize: '16 partners + 24+',
    industry: 'Law',
    category: 'law',
  },
  {
    slug: 'mayer-brown-dechert',
    year: '2025',
    acquirer: 'Mayer Brown',
    target: 'Dechert',
    headline: 'Three Dechert Partners to Build Private Capital Powerhouse',
    dealValue: '3 partners',
    teamSize: '3 partners + team',
    industry: 'Law',
    category: 'law',
  },
  {
    slug: 'microsoft-inflection',
    year: '2024',
    acquirer: 'Microsoft',
    target: 'Inflection AI',
    headline: 'Microsoft Pays $650M to Hire Inflection AI\'s Entire Leadership',
    dealValue: '$650M',
    teamSize: 'CEO + 70 employees',
    industry: 'Technology / AI',
    category: 'tech',
  },
  {
    slug: 'google-character-ai',
    year: '2024',
    acquirer: 'Google',
    target: 'Character.AI',
    headline: 'Google Pays $2.7B to Rehire the Inventors of Transformer Architecture',
    dealValue: '$2.7B',
    teamSize: 'Founders + key staff',
    industry: 'Technology / AI',
    category: 'tech',
  },
  {
    slug: 'polsinelli-holland-knight',
    year: '2024',
    acquirer: 'Polsinelli',
    target: 'Holland & Knight',
    headline: '47 Lawyers Move in One of the Biggest Law Firm Hires of the Year',
    dealValue: '47 lawyers',
    teamSize: '30 partners + 17',
    industry: 'Law',
    category: 'law',
  },
  {
    slug: 'paul-hastings-vinson-elkins',
    year: '2024',
    acquirer: 'Paul Hastings',
    target: 'Vinson & Elkins',
    headline: 'Largest Texas Practice Group Transfer Ever',
    dealValue: '25 lawyers',
    teamSize: '8 partners + 17',
    industry: 'Law',
    category: 'law',
  },
];

// Stats for the hero
const stats = [
  { label: 'Case Studies', value: '8', suffix: '+' },
  { label: 'Total Deal Value', value: '$23', suffix: 'B+' },
  { label: 'People Moved', value: '300', suffix: '+' },
];

export default function CaseStudiesHub() {
  const heroRef = useScrollAnimation({ threshold: 0.1 });
  const gridRef = useScrollAnimation({ threshold: 0.1 });
  const ctaRef = useScrollAnimation({ threshold: 0.1 });

  const techStudies = caseStudies.filter(s => s.category === 'tech');
  const lawStudies = caseStudies.filter(s => s.category === 'law');

  return (
    <>
      <LandingHeader />
      <main className="bg-bg">
        {/* Hero Section - Practical UI: 48pt+ section spacing, clear hierarchy */}
        <section
          ref={heroRef.ref as React.RefObject<HTMLElement>}
          className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-bg-elevated border-b border-border"
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            {/* Eyebrow - Practical UI: 16px minimum small text */}
            <p
              className={`text-base font-semibold text-purple-700 mb-4 transition-all duration-500 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Real-world examples
            </p>

            {/* H1 - Practical UI: 44px, bold, tight line height */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6 transition-all duration-500 delay-75 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Liftout case studies
            </h1>

            {/* Subheadline - Practical UI: 18px+ body text, 45-75ch line length */}
            <p
              className={`text-xl lg:text-2xl text-text-secondary leading-relaxed max-w-3xl mb-12 transition-all duration-500 delay-100 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              From billion-dollar AI talent deals to law firm practice group moves,
              these are the defining liftouts shaping industries today.
            </p>

            {/* Stats - Practical UI: Group related elements, consistent spacing */}
            <div
              className={`grid grid-cols-3 gap-8 max-w-xl transition-all duration-500 delay-150 ${
                heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl lg:text-4xl font-bold text-purple-700">
                    {stat.value}<span className="text-purple-400">{stat.suffix}</span>
                  </p>
                  <p className="text-base text-text-tertiary mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section
          ref={gridRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24"
        >
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            {/* Section header - Practical UI: Icon + label pattern */}
            <div
              className={`flex items-center gap-3 mb-8 transition-all duration-500 ${
                gridRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <BeakerIcon className="w-5 h-5 text-purple-700" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Technology & AI</h2>
            </div>

            {/* Cards grid - Practical UI: Consistent card styling, 16pt gap */}
            <div className="grid sm:grid-cols-2 gap-6">
              {techStudies.map((study, index) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className={`group bg-bg-surface rounded-xl border border-border hover:border-purple-200 hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    gridRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: gridRef.isVisible ? `${100 + index * 75}ms` : '0ms' }}
                >
                  {/* Card content - Practical UI: 24pt padding, clear hierarchy */}
                  <div className="p-6">
                    {/* Meta row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                        {study.year}
                      </span>
                      <span className="text-sm text-text-tertiary">{study.industry}</span>
                    </div>

                    {/* Title - Practical UI: Bold, action-oriented */}
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-purple-700 transition-colors">
                      {study.acquirer} ← {study.target}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary mb-6 line-clamp-2">
                      {study.headline}
                    </p>

                    {/* Stats row - Practical UI: Icon + label, consistent sizing */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="w-4 h-4 text-text-tertiary" />
                        <span className="font-medium text-text-primary">{study.dealValue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4 text-text-tertiary" />
                        <span className="font-medium text-text-primary">{study.teamSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card footer - Practical UI: Visual separation, hover state */}
                  <div className="px-6 py-4 bg-bg-elevated border-t border-border group-hover:bg-purple-50 transition-colors">
                    <span className="text-sm font-medium text-purple-700 flex items-center gap-2">
                      Read case study
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Law Section */}
        <section className="py-16 lg:py-24 bg-bg-elevated border-y border-border">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <ScaleIcon className="w-5 h-5 text-purple-700" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Legal</h2>
            </div>

            {/* Cards grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {lawStudies.map((study, index) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className="group bg-bg-surface rounded-xl border border-border hover:border-purple-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                        {study.year}
                      </span>
                      <span className="text-sm text-text-tertiary">{study.industry}</span>
                    </div>

                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-purple-700 transition-colors">
                      {study.acquirer} ← {study.target}
                    </h3>

                    <p className="text-text-secondary mb-6 line-clamp-2">
                      {study.headline}
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4 text-text-tertiary" />
                        <span className="font-medium text-text-primary">{study.dealValue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BuildingOfficeIcon className="w-4 h-4 text-text-tertiary" />
                        <span className="font-medium text-text-primary">{study.teamSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-bg border-t border-border group-hover:bg-purple-50 transition-colors">
                    <span className="text-sm font-medium text-purple-700 flex items-center gap-2">
                      Read case study
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Practical UI: Single primary action, clear hierarchy */}
        <section
          ref={ctaRef.ref as React.RefObject<HTMLElement>}
          className="py-16 lg:py-24"
        >
          <div
            className={`max-w-3xl mx-auto px-6 lg:px-8 text-center transition-all duration-500 ${
              ctaRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Ready to explore your own liftout?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
              Whether you&apos;re a team considering a move or a company looking to acquire proven talent, we can help.
            </p>

            {/* Buttons - Practical UI: Primary first, secondary second, 16pt gap */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="btn-primary min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center gap-2"
              >
                Get started free
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/what-is-a-liftout"
                className="btn-outline min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center"
              >
                Learn about liftouts
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
