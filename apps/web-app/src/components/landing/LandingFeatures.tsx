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
            What we built
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            The first platform where teams can confidentially signal they&apos;re open to opportunities—and companies can find them.
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
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-purple-100">
                <feature.icon className="w-6 h-6 text-[#4C1D95]" aria-hidden="true" />
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl font-bold text-text-primary leading-snug mb-3">
                {feature.name}
              </h3>

              {/* Description - Practical UI: 18px body text */}
              <p className="text-text-secondary text-lg leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        {/* Bottom CTA - Practical UI: Primary button with shimmer, 48pt target */}
        <div className={`mt-16 transition-all duration-500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            href="/auth/signup"
            className="group relative min-h-12 px-8 py-3 text-lg inline-flex items-center gap-2 bg-[#4C1D95] text-white font-semibold rounded-lg shadow-lg shadow-purple-900/25 hover:shadow-xl hover:shadow-purple-900/30 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="relative">Browse verified teams</span>
            <ArrowRightIcon className="w-5 h-5 relative transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
