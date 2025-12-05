'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function LandingElephant() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg-elevated"
      aria-labelledby="elephant-heading"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left - The Question */}
          <div className="lg:col-span-2">
            <p
              className={`font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              &ldquo;Won&apos;t they just leave together too?&rdquo;
            </p>
            <p className={`mt-4 text-text-tertiary text-base transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              The elephant in the room. Let&apos;s address it.
            </p>
          </div>

          {/* Right - The Answer */}
          <div className="lg:col-span-3">
            <div
              className={`space-y-6 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <p className="text-text-secondary text-xl leading-relaxed">
                Teams leave because of mutual dissatisfaction&mdash;wrong fit, broken promises, missing growth.
              </p>
              <p className="text-text-secondary text-xl leading-relaxed">
                They&apos;re looking for a <em className="text-text-primary font-semibold not-italic">home</em>, not a stepping stone.
              </p>
              <p className="text-text-primary text-xl leading-relaxed font-medium">
                If you&apos;re that home, you get loyalty that was forged before they even walked in the door.
              </p>
            </div>

            {/* Supporting data */}
            <div className={`mt-8 pt-8 border-t border-border transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-text-tertiary text-base">
                Research shows only ~20% of job changers are &quot;mercenary hoppers.&quot; Most people just want a better situation and will stay when they find it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
