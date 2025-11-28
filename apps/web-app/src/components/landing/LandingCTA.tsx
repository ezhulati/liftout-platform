'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function LandingCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32"
      style={{ backgroundColor: 'hsl(220, 65%, 15%)' }}
      aria-labelledby="cta-heading"
    >
      <div className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Left-aligned content */}
        <div className="max-w-2xl">
          <h2
            id="cta-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-6"
          >
            Ready to build your team the smarter way?
          </h2>

          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Discover a better alternative to individual hiring. Browse teams
            with verified track records who are ready to deliver from day one.
            Free to explore.
          </p>

          {/* CTA buttons - action-oriented, left aligned */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white text-navy-900 font-semibold hover:bg-white/90 transition-colors min-h-[48px] group"
            >
              Start exploring free
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors min-h-[48px]"
            >
              Sign in
            </Link>
          </div>

          {/* Trust reassurances */}
          <div className="flex flex-wrap gap-6 text-white/60 text-base">
            <span>No credit card required</span>
            <span>Free to browse</span>
            <span>Pay only on success</span>
          </div>
        </div>
      </div>
    </section>
  );
}
