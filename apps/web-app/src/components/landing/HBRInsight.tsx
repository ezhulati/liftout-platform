'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { SparklesIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const successStories = [
  {
    year: '2025',
    title: 'Meta ← Scale AI',
    description: 'Hired founder Alexandr Wang to lead superintelligence',
    outcome: '$14.3B for 49% stake + CEO',
    detail: 'Instant world-class AI leadership',
    Icon: SparklesIcon,
  },
  {
    year: '2025',
    title: 'Google ← Windsurf',
    description: 'Poached CEO, co-founder, and 40 engineers from under OpenAI',
    outcome: '$2.4B talent deal for DeepMind',
    detail: 'Derailed a $3B competitor acquisition',
    Icon: ChartBarIcon,
  },
  {
    year: '2025',
    title: 'Crowell ← Reed Smith',
    description: '16 partners + 24 associates moved as one unit',
    outcome: '40 lawyers in healthcare litigation',
    detail: 'Became premier health practice overnight',
    Icon: ArrowTrendingUpIcon,
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
        {/* Eyebrow - Practical UI: 16px minimum */}
        <p
          className={`text-base font-semibold text-purple-700 uppercase tracking-wider mb-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Liftouts happening right now
        </p>

        {/* Headline - Quote style */}
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

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {successStories.map((story, index) => (
            <article
              key={story.title}
              className={`bg-bg-surface rounded-xl p-6 border border-border hover:border-purple-200 hover:shadow-lg transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? `${200 + index * 100}ms` : '0ms' }}
            >
              {/* Icon and Year */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <story.Icon className="w-5 h-5 text-purple-700" aria-hidden="true" />
                </div>
                <span className="text-base font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                  {story.year}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {story.title}
              </h3>

              {/* Description */}
              <p className="text-base text-text-secondary mb-3">
                {story.description}
              </p>

              {/* Outcome - Highlighted */}
              <p className="text-lg font-semibold text-purple-700 mb-2">
                {story.outcome}
              </p>

              {/* Detail - Practical UI: 16px minimum */}
              <p className="text-base text-text-tertiary">
                {story.detail}
              </p>
            </article>
          ))}
        </div>

        {/* Citation and Link */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border transition-all duration-500 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-base text-text-tertiary">
            Sources: CNBC, Above the Law, TechCrunch (2025)
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
