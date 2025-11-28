'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ShieldCheckIcon, ClockIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const trustReassurances = [
  { icon: ShieldCheckIcon, text: 'NDA-protected conversations' },
  { icon: ClockIcon, text: 'Free to explore' },
  { icon: CreditCardIcon, text: 'No credit card required' },
];

export function LandingCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ backgroundColor: 'hsl(220, 65%, 15%)' }}
      aria-labelledby="cta-heading"
    >
      {/* Background decorative elements */}
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

      <div className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Eyebrow */}
        <p className="text-gold font-semibold tracking-wider uppercase text-xs mb-4">
          Ready to transform your growth?
        </p>

        {/* Main headline */}
        <h2
          id="cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6 max-w-3xl mx-auto"
        >
          Start acquiring proven teams
          <span className="block text-gold mt-2">today</span>
        </h2>

        {/* Description */}
        <p className="font-body text-white/90 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
          Whether you are a company seeking proven teams or a high-performing team exploring new opportunities, Liftout connects you with the right strategic partnerships.
        </p>

        {/* Trust reassurances - horizontal on desktop */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {trustReassurances.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-white/80">
              <item.icon className="w-5 h-5 text-gold" aria-hidden="true" />
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Single focused CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Link
            href="/auth/signup"
            className="group btn-secondary min-h-[52px] px-10 py-4 text-lg font-semibold inline-flex items-center justify-center gap-3"
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

        {/* Sign in link */}
        <p className="text-white/70 text-sm">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-gold hover:text-gold-300 underline underline-offset-4 transition-colors duration-fast"
          >
            Sign in here
          </Link>
        </p>

        {/* Trust indicators section */}
        <div className={`mt-16 pt-8 border-t border-white/20 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-white/60 text-xs mb-6 uppercase tracking-wider font-semibold">
            Trusted by forward-thinking organizations
          </p>
          <div className="flex flex-wrap gap-8 lg:gap-12 text-white/70 justify-center">
            {['Finance', 'Technology', 'Healthcare', 'Consulting'].map((industry) => (
              <div
                key={industry}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
                <span>{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
