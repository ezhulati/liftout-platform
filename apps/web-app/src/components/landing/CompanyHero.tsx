import Link from 'next/link';
import { BuildingOfficeIcon, CheckIcon } from '@heroicons/react/24/outline';

export function CompanyHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Subtle diagonal gradient - navy tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-50/40 via-transparent to-gold-50/10" />
        {/* Decorative shapes */}
        <div className="absolute top-20 right-[10%] w-96 h-96 rounded-full bg-navy/5 blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-80 h-80 rounded-full bg-gold/5 blur-3xl" />
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 pt-[120px] lg:pt-[160px] relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Copy */}
          <div>
            {/* Icon badge */}
            <div className="w-16 h-16 rounded-xl bg-navy flex items-center justify-center mb-8 shadow-navy">
              <BuildingOfficeIcon className="w-8 h-8 text-gold" aria-hidden="true" />
            </div>

            {/* Eyebrow */}
            <p className="text-navy font-semibold tracking-wider uppercase text-xs mb-4">
              For Companies
            </p>

            {/* Pain Point Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
              Tired of hiring individuals that{' '}
              <span className="text-navy">never gel?</span>
            </h1>

            {/* Solution */}
            <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed mb-8 max-w-xl">
              Acquire proven, intact teams that hit the ground running. Zero team-building phase,
              verified track records, immediate productivity.
            </p>

            {/* USPs */}
            <div className="space-y-4 mb-10">
              {[
                'Zero team-building phase with immediate productivity',
                'Verified track records with quantifiable performance history',
                'Lower risk than M&A as a strategic alternative',
                'Competitive advantage by acquiring proven talent',
              ].map((usp) => (
                <div key={usp} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3 text-navy" aria-hidden="true" />
                  </div>
                  <span className="text-text-secondary text-base leading-snug">{usp}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup?type=company"
                className="btn-primary min-h-[52px] px-8 py-3 text-lg font-semibold inline-flex items-center justify-center gap-3 group"
              >
                Browse teams
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
              <Link
                href="#features"
                className="min-h-[52px] px-8 py-3 rounded-lg text-lg font-semibold inline-flex items-center justify-center gap-2 border-2 border-border text-text-primary bg-transparent hover:bg-bg-elevated hover:border-border-hover transition-all duration-fast ease-out-quart"
              >
                View features
              </Link>
            </div>
          </div>

          {/* Right - Visual/Stats */}
          <div className="relative">
            {/* Stats card */}
            <div className="bg-bg-surface rounded-2xl p-8 lg:p-10 border border-border shadow-lg">
              <h3 className="font-heading text-xl font-bold text-text-primary mb-6">
                Why companies choose Liftout
              </h3>

              <div className="space-y-6">
                {[
                  { stat: '3x', label: 'Faster time to productivity vs individual hiring' },
                  { stat: '67%', label: 'Lower integration risk compared to M&A' },
                  { stat: '85%', label: 'Team retention rate after 2 years' },
                  { stat: '40%', label: 'Cost savings vs building teams from scratch' },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline gap-4">
                    <span className="font-heading text-3xl lg:text-4xl font-bold text-navy">{item.stat}</span>
                    <span className="text-text-secondary text-base leading-snug">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Trust badge */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-text-tertiary text-sm mb-3">Trusted by industry leaders</p>
                <div className="flex flex-wrap gap-4 text-text-tertiary">
                  {['Finance', 'Technology', 'Healthcare', 'Consulting'].map((industry) => (
                    <div key={industry} className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-2 h-2 rounded-full bg-gold/60" aria-hidden="true" />
                      <span>{industry}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
