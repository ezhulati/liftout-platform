import Link from 'next/link';

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg">
      {/* Background decorative elements - subtle, not distracting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Subtle gradient overlay from right */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-navy-50/40 to-transparent" />
        {/* Gold accent lines - positioned on 8-point grid */}
        <div className="absolute top-[25%] right-0 w-[33%] h-px bg-gradient-to-l from-gold/40 to-transparent" />
        <div className="absolute bottom-[33%] left-0 w-[25%] h-px bg-gradient-to-r from-gold/30 to-transparent" />
      </div>

      {/* Main content container - 8-point grid spacing */}
      {/* pt-[120px] accounts for fixed header (80px) + extra breathing room (40px) */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 pt-[120px] lg:pt-[140px] relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left content column */}
          <div className="animate-fade-in-up">
            {/* Eyebrow text - uppercase, wide letter-spacing, small size */}
            <p className="text-gold-600 font-semibold tracking-wider uppercase text-xs mb-4">
              Strategic Team Acquisition
            </p>

            {/* Main headline
                - font-heading (Playfair Display)
                - text-4xl on mobile scales to text-5xl on larger screens
                - line-height: 1.1 (tight) for large headlines
                - letter-spacing: -0.02em (tight) for large text
                - max-w-heading (40ch) for optimal headline width
            */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-5xl font-bold text-text-primary leading-tight tracking-tight mb-6 max-w-heading">
              <span className="block">Struggling to build</span>
              <span className="block">high-performing teams?</span>
              <span className="block mt-3 text-gold-600">Acquire them instead.</span>
            </h1>

            {/* Subheadline
                - font-body (Source Sans 3)
                - text-lg base, text-xl on larger screens
                - line-height: 1.6 (relaxed) for body text
                - max-w-prose (65ch) for optimal reading width
                - text-secondary for proper hierarchy
            */}
            <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed max-w-xl mb-8">
              Stop hiring individuals and hoping they gel. Liftout connects you with intact,
              proven teams that already work brilliantly together.
            </p>

            {/* USP highlights - 8-point grid spacing */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10">
              {['Instant Productivity', 'Proven Track Records', 'Zero Team-Building Phase'].map((usp, index) => (
                <div
                  key={usp}
                  className="flex items-center gap-3 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  {/* Gold bullet - 8px size */}
                  <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" aria-hidden="true" />
                  <span className="text-text-secondary font-medium text-base">{usp}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons
                - 44px minimum height (touch-target)
                - 8-point padding (px-8 = 64px, py-4 = 32px)
                - High contrast gold button primary
                - Outline button for secondary action
            */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup"
                className="btn-secondary min-h-[48px] px-8 py-3 text-lg font-semibold inline-flex items-center justify-center"
              >
                Request Early Access
              </Link>
              <Link
                href="/auth/signin"
                className="btn-outline min-h-[48px] px-8 py-3 text-lg font-semibold inline-flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>

            {/* Social proof snippet - tertiary text */}
            <p className="mt-10 text-text-tertiary text-sm font-medium">
              Join leading companies already transforming their growth strategy
            </p>
          </div>

          {/* Right visual column - hidden on mobile */}
          <div
            className="relative hidden lg:block opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <div className="aspect-square max-w-lg mx-auto relative">
              {/* Premium visual card with navy gradient */}
              <div className="absolute inset-0 rounded-2xl bg-navy shadow-2xl overflow-hidden">
                {/* Inner glow effects */}
                <div className="absolute inset-0" aria-hidden="true">
                  <div className="absolute top-[25%] left-[25%] w-32 h-32 rounded-full bg-gold/10 blur-2xl" />
                  <div className="absolute bottom-[33%] right-[25%] w-40 h-40 rounded-full bg-gold/15 blur-3xl" />
                </div>

                {/* Content overlay */}
                <div className="relative h-full flex flex-col items-center justify-center p-10 text-center">
                  <div className="space-y-8">
                    {/* Team avatars representation */}
                    <div className="flex justify-center -space-x-3" aria-label="Team of 4 members">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-14 h-14 rounded-full bg-navy-600 border-4 border-navy flex items-center justify-center opacity-0 animate-scale-in"
                          style={{ animationDelay: `${0.4 + i * 0.1}s`, animationFillMode: 'forwards' }}
                        >
                          <span className="text-gold-300 text-lg font-semibold">{i}</span>
                        </div>
                      ))}
                    </div>

                    {/* Visual headline */}
                    <div>
                      <p className="font-heading text-2xl font-bold mb-2 text-white leading-tight">
                        Complete Teams
                      </p>
                      <p className="text-navy-200 text-sm leading-relaxed">
                        Proven collaboration &bull; Established trust &bull; Ready to perform
                      </p>
                    </div>

                    {/* Stats showcase - 8-point grid */}
                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-navy-600">
                      {[
                        { value: '85%', label: 'Faster Integration' },
                        { value: '3x', label: 'Productivity Gain' },
                        { value: '90%', label: 'Retention Rate' },
                      ].map((stat, index) => (
                        <div
                          key={stat.label}
                          className="opacity-0 animate-fade-in"
                          style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'forwards' }}
                        >
                          <p className="text-gold font-heading text-2xl font-bold leading-none">{stat.value}</p>
                          <p className="text-navy-300 text-xs mt-1 leading-snug">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge card - positioned with transform */}
              <div
                className="absolute -bottom-4 -left-4 bg-bg-surface p-4 rounded-xl shadow-lg border border-border opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
              >
                <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1 font-medium">Team Verified</p>
                <p className="text-text-primary font-semibold text-base">4+ Years Together</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - centered at bottom */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="w-6 h-10 rounded-full border-2 border-navy-300 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-navy-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
