'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function LandingElephant() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32 bg-bg-elevated"
      aria-labelledby="elephant-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* The Question */}
        <h2
          id="elephant-heading"
          className={`font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          &ldquo;Won&apos;t they just leave together too?&rdquo;
        </h2>

        {/* The Answer */}
        <div
          className={`mt-8 space-y-6 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="text-text-secondary text-lg leading-relaxed max-w-prose">
            Teams don&apos;t leave on a whim. They leave because something broke&mdash;wrong culture fit, broken promises, dead-end growth paths.
          </p>
          <p className="text-text-secondary text-lg leading-relaxed max-w-prose">
            They&apos;re not looking for another stepping stone. They&apos;re looking for a <strong className="text-text-primary font-semibold">home</strong>.
          </p>
          <p className="text-text-primary text-lg leading-relaxed font-medium max-w-prose">
            Be that home, and you inherit loyalty forged through years of working together&mdash;before they ever walked through your door.
          </p>
        </div>

        {/* Supporting stat */}
        <p className={`mt-10 text-text-tertiary text-base max-w-prose transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Research shows only 20% of job changers are serial hoppers. The other 80% just want a better situation.
        </p>
      </div>
    </section>
  );
}
