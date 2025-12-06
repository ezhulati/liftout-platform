'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  SparklesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

const stories2025 = [
  {
    year: '2025',
    title: 'Meta ← Scale AI',
    description: 'Hired founder Alexandr Wang to lead superintelligence',
    outcome: '$14.3B for 49% stake + CEO',
    detail: 'Instant world-class AI leadership',
    Icon: SparklesIcon,
    slug: 'meta-scale-ai',
  },
  {
    year: '2025',
    title: 'Google ← Windsurf',
    description: 'Poached CEO, co-founder, and 40 engineers from under OpenAI',
    outcome: '$2.4B talent deal for DeepMind',
    detail: 'Derailed a $3B competitor acquisition',
    Icon: ChartBarIcon,
    slug: 'google-windsurf',
  },
  {
    year: '2025',
    title: 'Crowell ← Reed Smith',
    description: '16 partners + 24 associates moved as one unit',
    outcome: '40 lawyers in healthcare litigation',
    detail: 'Became premier health practice overnight',
    Icon: ArrowTrendingUpIcon,
    slug: 'crowell-reed-smith',
  },
  {
    year: '2025',
    title: 'Mayer Brown ← Dechert',
    description: 'Private capital team incl. global leveraged finance co-heads',
    outcome: '3 partners in London',
    detail: '"Doubling down" on private capital',
    Icon: BuildingOfficeIcon,
    slug: 'mayer-brown-dechert',
  },
];

const stories2024 = [
  {
    year: '2024',
    title: 'Microsoft ← Inflection AI',
    description: 'Paid to "license" tech and hire entire AI team incl. CEO Mustafa Suleyman',
    outcome: '$650M',
    detail: 'Suleyman became EVP & CEO of Microsoft AI',
    Icon: CurrencyDollarIcon,
    slug: 'microsoft-inflection',
  },
  {
    year: '2024',
    title: 'Google ← Character.AI',
    description: 'Brought back Noam Shazeer—who invented transformer architecture at Google',
    outcome: '$2.7B',
    detail: 'Regained the inventor of modern AI',
    Icon: SparklesIcon,
    slug: 'google-character-ai',
  },
  {
    year: '2024',
    title: 'Polsinelli ← Holland & Knight',
    description: 'Largest law firm group move of 2024—30 partners moved as a unit',
    outcome: '47 lawyers',
    detail: 'Instant market presence in Philadelphia',
    Icon: ScaleIcon,
    slug: 'polsinelli-holland-knight',
  },
  {
    year: '2024',
    title: 'Paul Hastings ← Vinson & Elkins',
    description: '8 partners and their full finance team—largest Texas practice move ever',
    outcome: '25 lawyers',
    detail: 'Became a Texas powerhouse overnight',
    Icon: BriefcaseIcon,
    slug: 'paul-hastings-vinson-elkins',
  },
];

export function HBRInsight() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg-elevated"
      aria-labelledby="hbr-insight-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Eyebrow */}
        <p
          className={`text-base font-semibold text-purple-700 uppercase tracking-wider mb-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Liftouts happening right now
        </p>

        {/* Headline */}
        <h2
          id="hbr-insight-heading"
          className={`text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight max-w-3xl mb-6 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Not ancient history—these deals happened this year.
        </h2>

        {/* Body text */}
        <p
          className={`text-lg text-text-secondary leading-relaxed max-w-2xl mb-12 transition-all duration-500 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Big Tech is spending billions to acquire teams intact. Law firms are moving 40+ lawyers at once. The pattern is clear: when you need to move fast, you hire a team.
        </p>

        {/* 2025 Examples */}
        <div className="mb-12">
          <h3
            className={`text-xl font-bold text-text-primary mb-6 transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            2025 Examples
          </h3>
          <div id="liftouts" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories2025.map((story, index) => (
              <Link
                key={story.title}
                href={`/case-studies/${story.slug}`}
                className={`block bg-bg-surface rounded-xl p-6 border border-border hover:border-purple-200 hover:shadow-lg transition-all duration-300 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: isVisible ? `${250 + index * 75}ms` : '0ms' }}
              >
                {/* Icon and Year */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <story.Icon className="w-5 h-5 text-purple-700" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-full">
                    {story.year}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-text-primary mb-2 group-hover:text-purple-700 transition-colors">
                  {story.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {story.description}
                </p>

                {/* Outcome - Highlighted */}
                <p className="text-base font-semibold text-purple-700 mb-1">
                  {story.outcome}
                </p>

                {/* Detail */}
                <p className="text-sm text-text-tertiary mb-3">
                  {story.detail}
                </p>

                {/* Read more indicator */}
                <span className="text-sm font-medium text-purple-700 group-hover:underline inline-flex items-center gap-1">
                  Read case study
                  <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 2024 Examples */}
        <div className="mb-10">
          <h3
            className={`text-xl font-bold text-text-primary mb-6 transition-all duration-500 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            2024 Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories2024.map((story, index) => (
              <Link
                key={story.title}
                href={`/case-studies/${story.slug}`}
                className={`block bg-bg-surface rounded-xl p-6 border border-border hover:border-purple-200 hover:shadow-lg transition-all duration-300 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: isVisible ? `${500 + index * 75}ms` : '0ms' }}
              >
                {/* Icon and Year */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <story.Icon className="w-5 h-5 text-amber-700" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                    {story.year}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-text-primary mb-2 group-hover:text-purple-700 transition-colors">
                  {story.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {story.description}
                </p>

                {/* Outcome - Highlighted */}
                <p className="text-base font-semibold text-purple-700 mb-1">
                  {story.outcome}
                </p>

                {/* Detail */}
                <p className="text-sm text-text-tertiary mb-3">
                  {story.detail}
                </p>

                {/* Read more indicator */}
                <span className="text-sm font-medium text-purple-700 group-hover:underline inline-flex items-center gap-1">
                  Read case study
                  <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Citation and Link */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border transition-all duration-500 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-base text-text-tertiary">
            Sources: CNBC, Bloomberg Law, TechCrunch, The American Lawyer (2024-2025)
          </p>

          <Link
            href="/what-is-a-liftout"
            className="text-purple-700 hover:text-purple-600 font-semibold text-lg underline underline-offset-4 min-h-12 inline-flex items-center gap-2 group"
          >
            What is a liftout?
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
