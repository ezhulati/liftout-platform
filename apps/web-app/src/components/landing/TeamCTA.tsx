'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function TeamCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 lg:py-28 overflow-hidden dark-section"
      aria-labelledby="team-cta-heading"
    >
      {/* Practical UI: left-aligned text for readability */}
      <div className={`relative z-10 max-w-3xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Emotional close */}
        <h2
          id="team-cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-on-dark tracking-tight leading-tight mb-6"
        >
          Your next opportunity should not break up what you have built.
        </h2>

        <p className="font-body text-white/90 text-xl leading-relaxed mb-4 max-w-2xl">
          You&apos;ve spent years building trust, refining processes, achieving together.
        </p>

        <p className="font-body text-white text-xl leading-relaxed font-medium mb-10 max-w-2xl">
          Companies value that. Find the right one.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/auth/signup?type=team"
            className="btn-primary-on-dark gap-3 px-8 py-3 text-lg group"
          >
            Register your team
            <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          <Link
            href="/app/opportunities"
            className="inline-flex items-center justify-center px-4 py-3 text-lg text-white/80 underline underline-offset-4 hover:text-white transition-colors min-h-12"
          >
            Browse opportunities
          </Link>
        </div>

        {/* Trust badges */}
        <p className="text-white/60 text-base mb-8">
          Free &bull; Confidential &bull; No credit card
        </p>

        {/* Sign in */}
        <p className="text-white/70 text-base">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-white underline underline-offset-4 transition-colors hover:text-white/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
