import Link from 'next/link';
import { BuildingOfficeIcon, UserGroupIcon, CheckIcon } from '@heroicons/react/24/outline';

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Subtle diagonal gradient - left side navy tint, right side gold tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-50/40 via-transparent to-gold-50/30" />
        {/* Decorative blobs */}
        <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-navy/5 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-72 h-72 rounded-full bg-gold/5 blur-3xl" />
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 pt-[120px] lg:pt-[140px] relative z-10 w-full">

        {/* Center brand tagline - above the split */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-gold-600 font-semibold tracking-wider uppercase text-xs mb-4">
            The Strategic Team Acquisition Platform
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight max-w-4xl mx-auto">
            Where proven teams meet growth opportunities
          </h1>
          <p className="mt-6 text-text-secondary text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            The smart alternative to individual hiring and costly acquisitions. Connect with intact, high-performing teams ready for new challenges.
          </p>
        </div>

        {/* Equal Split Hero - Two Columns */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-0 max-w-5xl mx-auto">

          {/* LEFT SIDE - For Companies */}
          <div className="group relative bg-bg-surface rounded-2xl lg:rounded-r-none p-8 lg:p-10 border border-border lg:border-r-0 shadow-sm hover:shadow-lg transition-shadow duration-base">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-navy/0 via-navy to-navy/0 rounded-full" aria-hidden="true" />

            {/* Icon badge */}
            <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center mb-6 shadow-navy">
              <BuildingOfficeIcon className="w-7 h-7 text-gold" aria-hidden="true" />
            </div>

            {/* Eyebrow */}
            <p className="text-navy font-semibold tracking-wider uppercase text-xs mb-3">
              For Companies
            </p>

            {/* Headline - their pain point */}
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary leading-tight tracking-tight mb-4">
              Tired of hiring individuals that don&apos;t gel?
            </h2>

            {/* Value prop */}
            <p className="font-body text-text-secondary leading-relaxed mb-6">
              Acquire proven, intact teams that hit the ground running. Zero team-building phase,
              verified track records, immediate productivity.
            </p>

            {/* USPs with checkmarks */}
            <div className="space-y-3 mb-8">
              {[
                'Browse verified high-performing teams',
                'Due diligence tools & reference checks',
                'Confidential negotiation process',
              ].map((usp) => (
                <div key={usp} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-navy" aria-hidden="true" />
                  </div>
                  <span className="text-text-secondary text-sm">{usp}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/for-companies"
              className="btn-primary min-h-[48px] px-6 py-3 text-base font-semibold inline-flex items-center gap-2 group/btn"
            >
              Acquire Proven Teams
              <svg
                className="w-4 h-4 transition-transform duration-fast ease-out-quart group-hover/btn:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* RIGHT SIDE - For Teams */}
          <div className="group relative bg-bg-surface rounded-2xl lg:rounded-l-none p-8 lg:p-10 border border-border shadow-sm hover:shadow-lg transition-shadow duration-base">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0 rounded-full" aria-hidden="true" />

            {/* Icon badge */}
            <div className="w-14 h-14 rounded-xl bg-gold flex items-center justify-center mb-6 shadow-gold">
              <UserGroupIcon className="w-7 h-7 text-navy-900" aria-hidden="true" />
            </div>

            {/* Eyebrow */}
            <p className="text-gold-700 font-semibold tracking-wider uppercase text-xs mb-3">
              For Teams
            </p>

            {/* Headline - their pain point */}
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary leading-tight tracking-tight mb-4">
              Ready for a new challenge together?
            </h2>

            {/* Value prop */}
            <p className="font-body text-text-secondary leading-relaxed mb-6">
              Move as a unit. Keep what works, elevate your opportunities.
              Access companies actively seeking proven teams like yours.
            </p>

            {/* USPs with checkmarks */}
            <div className="space-y-3 mb-8">
              {[
                'Showcase your collective achievements',
                'AI-powered opportunity matching',
                'Confidential exploration & negotiation',
              ].map((usp) => (
                <div key={usp} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-gold-700" aria-hidden="true" />
                  </div>
                  <span className="text-text-secondary text-sm">{usp}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/for-teams"
              className="btn-secondary min-h-[48px] px-6 py-3 text-base font-semibold inline-flex items-center gap-2 group/btn"
            >
              Register Your Team
              <svg
                className="w-4 h-4 transition-transform duration-fast ease-out-quart group-hover/btn:translate-x-1"
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

        {/* Bottom trust/social proof */}
        <div className="mt-16 lg:mt-20 text-center">
          <p className="text-text-tertiary text-sm mb-5 font-medium">
            Trusted by forward-thinking organizations across industries
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-text-tertiary">
            {['Finance', 'Technology', 'Healthcare', 'Consulting', 'Legal'].map((industry) => (
              <div key={industry} className="flex items-center gap-2 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-gold/60" aria-hidden="true" />
                <span>{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block" aria-hidden="true">
        <div className="w-6 h-10 rounded-full border-2 border-navy-300 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-navy-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
