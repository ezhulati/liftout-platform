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
    name: 'Intact Team Acquisition',
    description: 'Hire complete, high-performing teams with established relationships and proven collaboration patterns.',
    icon: UserGroupIcon,
  },
  {
    name: 'Verified Performance',
    description: 'Access teams with documented track records, client testimonials, and quantifiable achievements.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Immediate Productivity',
    description: 'Teams hit the ground running with existing processes, trust, and institutional knowledge intact.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Strategic Expansion',
    description: 'Rapidly enter new markets or capabilities without the risks of mergers or individual hiring.',
    icon: BriefcaseIcon,
  },
  {
    name: 'Confidential Process',
    description: 'Discrete exploration and negotiation protecting current employment and sensitive information.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Success Analytics',
    description: 'Track integration outcomes, team performance, and measure the impact of your investments.',
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
        {/* Section header
            - Centered text, max-width for readability
            - Proper spacing using 8-point grid
        */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          {/* Eyebrow - uppercase, wide tracking, small */}
          <p className="text-gold-600 font-semibold tracking-wider uppercase text-xs mb-4">
            Why Liftout
          </p>

          {/* Section headline
              - font-heading (Playfair Display)
              - leading-tight (1.1) for headings
              - tracking-tight (-0.02em) for large text
          */}
          <h2
            id="features-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-6"
          >
            The smart alternative to mergers and individual hiring
          </h2>

          {/* Section description
              - font-body (Source Sans 3)
              - leading-relaxed (1.6) for body text
              - text-secondary for hierarchy
          */}
          <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed">
            Strategic team acquisition delivers lower risk, faster integration, and immediate business impact.
          </p>
        </div>

        {/* Features grid
            - 8-point grid spacing (gap-8 = 64px, gap-10 = 80px)
            - Cards with varied border-radius (rounded-xl = 24px)
            - Proper padding inside cards (p-8 = 64px)
        */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.name}
              className="group relative bg-bg-surface rounded-xl p-8 border border-border hover:border-gold/40 transition-all duration-base ease-out-quart hover:shadow-lg opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'forwards',
              }}
            >
              {/* Icon container
                  - 56px = 7 * 8px grid
                  - rounded-lg (16px) for variation
              */}
              <div className="w-14 h-14 rounded-lg bg-navy flex items-center justify-center mb-6 transition-colors duration-base ease-out-quart group-hover:bg-navy-600">
                <feature.icon className="w-7 h-7 text-gold" aria-hidden="true" />
              </div>

              {/* Feature title
                  - font-heading
                  - text-xl (1.563rem per Major Third scale)
                  - leading-snug (1.3) for subheadings
              */}
              <h3 className="font-heading text-xl font-bold text-text-primary leading-snug mb-3">
                {feature.name}
              </h3>

              {/* Feature description
                  - font-body
                  - leading-relaxed (1.6)
                  - text-secondary
              */}
              <p className="font-body text-text-secondary leading-relaxed text-base">
                {feature.description}
              </p>

              {/* Subtle hover accent line - decorative */}
              <div
                className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-base rounded-full"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        {/* Bottom CTA section
            - Generous spacing (mt-16 = 128px, lg:mt-20 = 160px)
            - Centered
        */}
        <div className="mt-16 lg:mt-20 text-center">
          <p className="text-text-secondary mb-6 text-base">
            Ready to transform your talent strategy?
          </p>
          <Link
            href="/auth/signup"
            className="btn-secondary min-h-[48px] px-8 py-3 text-lg font-semibold inline-flex items-center gap-3"
          >
            Get Started Today
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
