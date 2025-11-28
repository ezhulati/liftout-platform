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

const features = [
  {
    name: 'Proven teams',
    description: 'Hire teams with 3+ years working together. Established trust, tested processes, real results.',
    icon: UserGroupIcon,
  },
  {
    name: 'Verified track records',
    description: 'Every team includes documented achievements, client references, and quantifiable outcomes.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Day-one productivity',
    description: 'Skip the 6-month team-building phase. Teams arrive ready to deliver from their first week.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Lower risk expansion',
    description: 'Enter new markets or add capabilities faster than M&A, with less risk than individual hires.',
    icon: BriefcaseIcon,
  },
  {
    name: 'Confidential process',
    description: 'Explore opportunities discreetly. Current employers and sensitive data stay protected.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Integration support',
    description: 'Track onboarding progress, measure team performance, and ensure successful transitions.',
    icon: ChartBarIcon,
  },
];

export function LandingFeatures() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="features"
      className="py-20 lg:py-28 bg-bg-elevated scroll-mt-20"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header - left aligned */}
        <div className={`max-w-2xl mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-navy font-semibold text-sm mb-3">
            Why teams over individuals
          </p>
          <h2
            id="features-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Lower risk than M&A. Faster than building from scratch.
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Teams that already work together outperform new hires by 40% in their first year. Skip the forming, storming, and norming.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.name}
              className={`group bg-bg-surface rounded-lg p-6 border border-border hover:border-navy/30 transition-all duration-300 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center mb-4 group-hover:bg-navy transition-colors duration-300">
                <feature.icon
                  className="w-5 h-5 text-navy group-hover:text-white transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>

              {/* Feature title */}
              <h3 className="font-heading text-lg font-bold text-text-primary leading-snug mb-2">
                {feature.name}
              </h3>

              {/* Feature description */}
              <p className="text-text-secondary leading-relaxed text-sm">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 transition-all duration-500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-text-secondary mb-6">
            Join 200+ companies already hiring teams, not individuals.
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
