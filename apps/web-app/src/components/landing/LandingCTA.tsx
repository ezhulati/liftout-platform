'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function LandingCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32 dark-section"
      aria-labelledby="cta-heading"
    >
      <div className={`max-w-4xl mx-auto px-6 lg:px-8 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h2
          id="cta-heading"
          className="font-heading text-3xl sm:text-4xl font-bold text-on-dark tracking-tight leading-tight mb-6"
        >
          Ready to hire a team that works from day one?
        </h2>

        <p className="text-on-dark-muted text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
          Join 150+ companies who've discovered a smarter alternative to individual hiring.
        </p>

        {/* Single primary CTA - white button on dark bg for contrast (Practical UI) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/auth/signup"
            className="btn-primary-on-dark gap-2 px-8 py-4 text-lg group"
          >
            Browse verified teams
            <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/for-teams"
            className="btn-secondary-on-dark px-8 py-4 text-lg"
          >
            List your team
          </Link>
        </div>

        {/* Simple trust line */}
        <p className="text-on-dark-subtle text-sm text-center mx-auto">
          Free to explore · No credit card required · NDA-protected
        </p>
      </div>
    </section>
  );
}
