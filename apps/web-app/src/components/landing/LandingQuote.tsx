'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function LandingQuote() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32 bg-bg-elevated"
      aria-labelledby="quote-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Practical UI: Left-align long quotes for readability */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Decorative quote icon */}
          <svg
            className="w-12 h-12 mb-8 text-[#4C1D95]/20"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          {/* Quote - left-aligned for readability per Practical UI */}
          <blockquote
            id="quote-heading"
            className="font-heading text-2xl md:text-3xl font-semibold text-text-primary mb-8 leading-relaxed max-w-prose"
          >
            &ldquo;Stars do not develop in a vacuum; their performance depends heavily on the people with whom they work. If they can bring some of that firm-specific relational capital with them, their chances of maintaining their exceptional performance increase dramatically.&rdquo;
          </blockquote>

          {/* Attribution with HBR logo */}
          <div className="flex items-center gap-4 mb-8">
            <Image
              src="/harvard-business-review-logo-png_seeklogo-339979.png"
              alt="Harvard Business Review"
              width={100}
              height={28}
              className="opacity-60 grayscale"
            />
            <p className="text-text-tertiary text-base">
              Boris Groysberg, Harvard Business School — &ldquo;Chasing Stars&rdquo;
            </p>
          </div>

          {/* Transition */}
          <p className="text-text-secondary text-lg font-medium">
            Don&apos;t leave your best work behind. Bring it with you.
          </p>
        </div>
      </div>
    </section>
  );
}
