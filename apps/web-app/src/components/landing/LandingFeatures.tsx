'use client';

import Link from 'next/link';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// USP highlighted first, then supporting features
const features = [
  {
    name: 'Day-one productivity',
    description: 'Skip the 6-month team-building phase. Teams arrive ready to deliver from their first week - no storming, no norming.',
    icon: RocketLaunchIcon,
    isUSP: true,
  },
  {
    name: 'Proven track records',
    description: 'Every team includes documented achievements, client references, and quantifiable outcomes you can verify.',
    icon: ShieldCheckIcon,
    isUSP: false,
  },
  {
    name: 'Teams that work',
    description: 'Hire teams with 3+ years working together. Established trust, tested processes, real chemistry.',
    icon: UserGroupIcon,
    isUSP: false,
  },
  {
    name: 'Lower risk than M&A',
    description: 'Enter new markets or add capabilities faster than acquisitions, with less risk than individual hires.',
    icon: BriefcaseIcon,
    isUSP: false,
  },
  {
    name: 'Confidential process',
    description: 'Explore opportunities discreetly. Current employers and sensitive data stay protected throughout.',
    icon: ChatBubbleLeftRightIcon,
    isUSP: false,
  },
  {
    name: 'Integration support',
    description: 'Track onboarding progress, measure team performance, and ensure successful transitions.',
    icon: ChartBarIcon,
    isUSP: false,
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
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.name}
              className={`group bg-bg-surface rounded-lg p-8 border transition-all duration-500 ${
                feature.isUSP
                  ? 'border-navy/30 ring-1 ring-navy/10'
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

              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300 ${
                feature.isUSP
                  ? 'bg-navy text-white'
                  : 'bg-navy/10 text-navy group-hover:bg-navy group-hover:text-white'
              }`}>
                <feature.icon
                  className="w-5 h-5"
                  aria-hidden="true"
                />
              </div>

              {/* Feature title */}
              <h3 className="font-heading text-lg font-bold text-text-primary leading-snug mb-2">
                {feature.name}
              </h3>

              {/* Feature description */}
              <p className="text-text-secondary leading-relaxed text-base">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 transition-all duration-500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-text-secondary mb-6">
            Ready to hire teams, not individuals?
          </p>
          <Link
            href="/auth/signup"
            className="btn-outline inline-flex items-center gap-2"
          >
            Create free account
          </Link>
        </div>
      </div>
    </section>
  );
}
