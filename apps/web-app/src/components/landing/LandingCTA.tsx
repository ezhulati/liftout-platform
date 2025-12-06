'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

/**
 * Landing CTA Section - Practical UI Guidelines
 *
 * Symmetry Requirements:
 * - Matching character counts for headlines
 * - Equal body text length
 * - Identical button labels length
 * - Same visual weight both sides
 *
 * Copywriting: Verb + Noun labels, sentence case, front-loaded
 * Spacing: 8pt system (py-24 = 96pt, gap-8 = 32pt)
 * Touch targets: min-h-12 (48pt)
 */

export function LandingCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32 dark-section"
      aria-labelledby="cta-heading"
    >
      <div className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Section header - centered, short for CTA */}
        <h2
          id="cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-12 text-center"
        >
          Ready to get started?
        </h2>

        {/* Split CTA - Symmetrical 50/50 grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - For Teams */}
          <div className="bg-white/5 rounded-2xl p-8 lg:p-10 border border-white/10">
            <p className="text-purple-300 text-sm font-semibold uppercase tracking-wide mb-3">
              For teams
            </p>
            <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-4">
              Move forward together
            </h3>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Your best work happened with this team. Why start over alone?
            </p>
            <Link
              href="/auth/signup?type=team"
              className="bg-white text-purple-900 hover:bg-gray-100 font-semibold min-h-12 px-8 py-3 text-lg rounded-lg inline-flex items-center justify-center gap-3 group transition-colors"
            >
              Register your team
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Right - For Companies */}
          <div className="bg-white/5 rounded-2xl p-8 lg:p-10 border border-white/10">
            <p className="text-amber-300 text-sm font-semibold uppercase tracking-wide mb-3">
              For companies
            </p>
            <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-4">
              Hire teams that work
            </h3>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Skip the ramp-up period. Find teams that already gel.
            </p>
            <Link
              href="/auth/signup?type=company"
              className="bg-white text-purple-900 hover:bg-gray-100 font-semibold min-h-12 px-8 py-3 text-lg rounded-lg inline-flex items-center justify-center gap-3 group transition-colors"
            >
              Post an opportunity
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Trust line - centered */}
        <p className="text-white/50 text-base text-center mt-10">
          Free to explore. No commitment required.
        </p>
      </div>
    </section>
  );
}
