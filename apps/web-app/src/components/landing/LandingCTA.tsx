import Link from 'next/link';

export function LandingCTA() {
  return (
    <section
      className="relative py-20 lg:py-28 bg-navy overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background decorative elements - subtle, not distracting */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Soft gold glows */}
        <div className="absolute top-0 left-[25%] w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-[25%] w-80 h-80 rounded-full bg-gold/8 blur-3xl" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(38, 50%, 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(38, 50%, 55%) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Eyebrow - uppercase, wide tracking */}
        <p className="text-gold font-semibold tracking-wider uppercase text-xs mb-4">
          Ready to Transform Your Growth?
        </p>

        {/* Main headline
            - White text on navy background (high contrast)
            - font-heading (Playfair Display)
            - leading-tight (1.1)
            - tracking-tight (-0.02em)
        */}
        <h2
          id="cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-6"
        >
          Join the future of
          <span className="block text-gold mt-2">strategic talent acquisition</span>
        </h2>

        {/* Description
            - text-navy-200 for readable contrast on dark bg
            - leading-relaxed (1.6)
            - max-w for optimal reading width
        */}
        <p className="font-body text-navy-200 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          Whether you're a company seeking proven teams or a high-performing team exploring new opportunities,
          Liftout connects you with the right strategic partnerships.
        </p>

        {/* Dual CTA buttons
            - High contrast gold button (primary action)
            - White outline button (secondary action)
            - Both have 48px+ min-height for touch targets
            - Proper spacing with gap-4 (32px)
        */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {/* Primary CTA - Gold (high contrast) */}
          <Link
            href="/auth/signup?type=company"
            className="group btn-secondary min-h-[52px] px-8 py-3 text-lg font-semibold inline-flex items-center justify-center gap-3"
          >
            Acquire Proven Teams
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

          {/* Secondary CTA - White outline on navy */}
          <Link
            href="/auth/signup?type=team"
            className="group min-h-[52px] px-8 py-3 rounded-lg text-lg font-semibold inline-flex items-center justify-center gap-3 border-2 border-white/40 text-white bg-transparent hover:bg-white/10 hover:border-white/60 transition-all duration-fast ease-out-quart"
          >
            Join as a Team
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

        {/* Sign in link - subtle but accessible */}
        <p className="text-navy-300 text-sm">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-gold hover:text-gold-300 underline underline-offset-4 transition-colors duration-fast"
          >
            Sign in here
          </Link>
        </p>

        {/* Trust indicators section
            - Separated by border
            - Subtle text hierarchy
        */}
        <div className="mt-16 pt-8 border-t border-navy-600">
          <p className="text-navy-400 text-xs mb-6 uppercase tracking-wider font-semibold">
            Trusted by forward-thinking organizations
          </p>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12 text-navy-400">
            {['Finance', 'Technology', 'Healthcare', 'Consulting'].map((industry) => (
              <div
                key={industry}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-gold/50" aria-hidden="true" />
                <span>{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
