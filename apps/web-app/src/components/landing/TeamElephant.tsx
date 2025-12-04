'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function TeamElephant() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg-elevated"
      aria-labelledby="team-elephant-heading"
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* The question */}
        <p
          className={`font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          &ldquo;Won&apos;t teams just leave again?&rdquo;
        </p>

        {/* The answer */}
        <div
          className={`space-y-6 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="font-body text-xl text-text-secondary leading-relaxed">
            Teams leave because of mutual dissatisfaction—wrong fit, broken promises, missing growth.
          </p>
          <p className="font-body text-xl text-text-secondary leading-relaxed">
            They&apos;re looking for a <em className="text-text-primary font-semibold not-italic">home</em>, not a stepping stone.
          </p>
          <p className="font-body text-xl text-text-primary leading-relaxed font-medium">
            If you&apos;re that home, you get loyalty that was forged before they even walked in the door.
          </p>
        </div>
      </div>
    </section>
  );
}
