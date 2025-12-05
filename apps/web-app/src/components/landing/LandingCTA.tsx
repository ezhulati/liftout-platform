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
      <div className={`max-w-6xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Practical UI: left-aligned section header */}
        <h2
          id="cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-on-dark tracking-tight leading-tight mb-12"
        >
          Ready to take your careers to new heights?
        </h2>

        {/* Split CTA - Two columns for each audience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left - Teams (primary CTA) */}
          <div className="bg-white/5 rounded-2xl p-8 lg:p-10 border border-white/10">
            <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-4">
              Progress alongside trusted colleagues
            </h3>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Take your career to new levels with colleagues who bring out your best. Confidentially explore what&apos;s next—together.
            </p>
            <Link
              href="/auth/signup?type=team"
              className="btn-primary-on-dark min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center gap-3 group"
            >
              Register your team
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Right - Companies (secondary button style) */}
          <div className="bg-white/5 rounded-2xl p-8 lg:p-10 border border-white/10">
            <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-4">
              Hire chemistry, not hope
            </h3>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Stop crossing your fingers that new hires will gel. Find teams that already have.
            </p>
            <Link
              href="/auth/signup?type=company"
              className="btn-secondary-on-dark min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center gap-2 group"
            >
              Browse verified teams
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Practical UI: left-aligned pioneer message */}
        <p className="text-white/60 text-base">
          We&apos;re building the first marketplace for team-based hiring. Early movers are shaping how it works.
        </p>
      </div>
    </section>
  );
}
