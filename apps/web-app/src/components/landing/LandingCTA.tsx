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
      {/* Practical UI: Left-align body text on desktop */}
      <div className={`max-w-4xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h2
          id="cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-on-dark tracking-tight leading-tight mb-6 text-center lg:text-left"
        >
          A team board, not a job board
        </h2>

        <p className="text-white/90 text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl text-center lg:text-left">
          Job searching alone is daunting. There&apos;s a better way. Teams can take that journey together with people who&apos;ve helped them succeed. Companies get proven chemistry instead of hoping for the best.
        </p>

        {/* Practical UI: Primary (solid) + Tertiary (underlined), left-aligned on desktop */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
          {/* Primary button - solid fill on dark, Verb+Noun label */}
          <Link
            href="/auth/signup"
            className="group relative min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center gap-2 bg-white text-[#4C1D95] font-bold rounded-lg shadow-lg shadow-white/20 hover:bg-white/95 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-900/5 to-transparent" />
            <span className="relative">Find teams</span>
            <ArrowRightIcon className="w-5 h-5 relative transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {/* Tertiary button - underlined text */}
          <Link
            href="/for-teams"
            className="inline-flex items-center justify-center px-4 py-3 text-lg text-white/80 underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white/60 transition-colors min-h-12"
          >
            List your team
          </Link>
        </div>

        {/* Simple trust line - Practical UI: 16px minimum for small text */}
        <p className="text-white/60 text-base text-center lg:text-left">
          This didn&apos;t exist before. Now it does.
        </p>
      </div>
    </section>
  );
}
