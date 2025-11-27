import Link from 'next/link';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

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
  return (
    <section
      id="features"
      className="py-20 lg:py-28 bg-bg-elevated scroll-mt-20"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header - left-aligned for readability (Practical UI) */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <p className="text-gold-700 font-semibold tracking-wider uppercase text-xs mb-4">
            Why teams over individuals
          </p>
          <h2
            id="features-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-6"
          >
            Lower risk than M&A. Faster than building from scratch.
          </h2>
          <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed max-w-prose">
            Teams that already work together outperform new hires by 40% in their first year. Skip the forming, storming, and norming.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <article
              key={feature.name}
              className="group relative bg-bg-surface rounded-xl p-6 border border-border hover:border-navy/30 transition-all duration-base ease-out-quart hover:shadow-lg"
            >
              {/* Icon container - 48px = 6 * 8pt grid for touch target */}
              <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center mb-4 transition-all duration-base ease-out-quart group-hover:bg-navy-600 group-hover:shadow-navy">
                <feature.icon className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>

              {/* Feature title - sentence case per Practical UI */}
              <h3 className="font-heading text-lg font-bold text-text-primary leading-snug mb-2">
                {feature.name}
              </h3>

              {/* Feature description - proper line height for readability */}
              <p className="font-body text-text-secondary leading-relaxed text-sm">
                {feature.description}
              </p>

              {/* Subtle hover accent line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-base rounded-full"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        {/* Bottom CTA section - left-aligned */}
        <div className="mt-16 lg:mt-20">
          <p className="text-text-secondary mb-6 text-base">
            Join 200+ companies already hiring teams, not individuals.
          </p>
          <Link
            href="/auth/signup"
            className="btn-secondary min-h-[48px] px-8 py-3 text-lg font-semibold inline-flex items-center gap-3 group"
          >
            Create free account
            <svg
              className="w-5 h-5 transition-transform duration-fast ease-out-quart group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
