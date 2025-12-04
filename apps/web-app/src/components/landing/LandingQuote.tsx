'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function LandingQuote() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg-elevated"
      aria-labelledby="quote-heading"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Decorative quote icon */}
          <svg
            className="w-12 h-12 mx-auto mb-8 text-[#4C1D95]/20"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          {/* Quote */}
          <blockquote
            id="quote-heading"
            className="font-heading text-2xl md:text-3xl font-semibold text-text-primary mb-8 leading-relaxed"
          >
            &ldquo;Gallup found that the more employees who could say they have a best friend at work, the better the company performed. The best teams are built on real relationships.&rdquo;
          </blockquote>

          {/* Attribution */}
          <p className="text-text-tertiary text-base">
            Research from Gallup workplace studies
          </p>
        </div>
      </div>
    </section>
  );
}
