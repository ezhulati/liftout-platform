'use client';

import Link from 'next/link';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// USP highlighted first, then supporting features (#13)
// Benefits over features (#89)
// Quantified where possible (#43)
const features = [
  {
    name: 'Day-one productivity',
    description: 'Skip the 6-month team-building phase. Teams arrive ready to deliver from their first week.',
    icon: RocketLaunchIcon,
    isUSP: true,
    stat: '6 months saved',
  },
  {
    name: 'Proven track records',
    description: 'Every team includes documented achievements, client references, and quantifiable outcomes.',
    icon: ShieldCheckIcon,
    isUSP: false,
    stat: '100% verified',
  },
  {
    name: 'Teams that work',
    description: 'Hire teams with 3+ years working together. Established trust, tested processes, real chemistry.',
    icon: UserGroupIcon,
    isUSP: false,
    stat: '3+ years avg',
  },
  {
    name: 'Lower risk than M&A',
    description: 'Enter new markets or add capabilities faster than acquisitions, with less integration risk.',
    icon: BriefcaseIcon,
    isUSP: false,
    stat: '92% retention',
  },
  {
    name: 'Confidential process',
    description: 'Explore opportunities discreetly. Current employers and sensitive data stay protected.',
    icon: ChatBubbleLeftRightIcon,
    isUSP: false,
    stat: 'NDA protected',
  },
  {
    name: 'Integration support',
    description: 'Track onboarding progress, measure team performance, and ensure successful transitions.',
    icon: ChartBarIcon,
    isUSP: false,
    stat: '12-month tracking',
  },
];

export function LandingFeatures() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="features"
      className="py-24 lg:py-32 bg-bg-elevated scroll-mt-20"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header - left aligned */}
        <div className={`max-w-2xl mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-navy font-semibold text-base mb-3">
            Why teams over individuals
          </p>
          <h2
            id="features-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Lower risk than M&A. Faster than building from scratch.
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Teams that already work together outperform new hires by 40% in their first year.
            Here's why companies are switching to team acquisition.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.name}
              className={`group bg-bg-surface rounded-xl p-8 border transition-all duration-500 hover:shadow-lg ${
                feature.isUSP
                  ? 'border-navy/30 ring-1 ring-navy/10 lg:col-span-1 lg:row-span-1'
                  : 'border-border hover:border-navy/20'
              } ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {/* USP badge */}
              {feature.isUSP && (
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-navy/10 text-navy mb-4">
                  Key differentiator
                </span>
              )}

              {/* Icon and stat row */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  feature.isUSP
                    ? 'bg-navy text-white'
                    : 'bg-navy/10 text-navy group-hover:bg-navy group-hover:text-white'
                }`}>
                  <feature.icon
                    className="w-6 h-6"
                    aria-hidden="true"
                  />
                </div>
                {/* Stat badge */}
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  feature.isUSP
                    ? 'bg-success/10 text-success'
                    : 'bg-navy/5 text-navy'
                }`}>
                  {feature.stat}
                </span>
              </div>

              {/* Feature title */}
              <h3 className="font-heading text-xl font-bold text-text-primary leading-snug mb-3">
                {feature.name}
              </h3>

              {/* Feature description */}
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        {/* Comparison callout */}
        <div className={`mt-16 p-8 bg-bg-surface rounded-2xl border border-border transition-all duration-500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-text-tertiary text-sm uppercase tracking-wider mb-2">Traditional Hiring</p>
              <p className="text-3xl font-bold text-text-primary mb-1">6-12 months</p>
              <p className="text-text-secondary text-sm">to build team chemistry</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-4xl">→</span>
            </div>
            <div>
              <p className="text-navy text-sm uppercase tracking-wider font-semibold mb-2">With Liftout</p>
              <p className="text-3xl font-bold text-navy mb-1">Day 1</p>
              <p className="text-text-secondary text-sm">productive from the start</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-500 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div>
            <p className="text-text-secondary mb-1">
              Ready to hire teams, not individuals?
            </p>
            <p className="text-text-tertiary text-sm">
              Free to explore. No credit card required.
            </p>
          </div>
          <Link
            href="/auth/signup"
            className="btn-primary inline-flex items-center gap-2 group"
          >
            Browse verified teams
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
