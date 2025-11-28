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

const features = [
  {
    name: 'Day-one productivity',
    description: 'Skip the 6-month team-building phase. Teams arrive ready to deliver from their first week.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Proven track records',
    description: 'Every team includes documented achievements, client references, and quantifiable outcomes.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Teams that work',
    description: 'Hire teams with 3+ years working together. Established trust, tested processes, real chemistry.',
    icon: UserGroupIcon,
  },
  {
    name: 'Lower risk than M&A',
    description: 'Enter new markets or add capabilities faster than acquisitions, with less integration risk.',
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
      className="py-24 lg:py-32 bg-bg-elevated scroll-mt-20"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`max-w-2xl mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2
            id="features-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Why hire teams over individuals
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Teams that already work together outperform new hires by 40% in their first year.
          </p>
        </div>

        {/* Features grid - consistent 3-column */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.name}
              className={`bg-bg-surface rounded-xl p-8 border border-border transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'hsl(220, 70%, 50%, 0.1)' }}>
                <feature.icon className="w-6 h-6 text-navy" aria-hidden="true" />
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl font-bold text-text-primary leading-snug mb-3">
                {feature.name}
              </h3>

              {/* Description */}
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 transition-all duration-500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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
