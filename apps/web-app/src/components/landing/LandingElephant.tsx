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
                Teams don&apos;t leave on a whim. They leave because something broke&mdash;wrong culture fit, promises that weren&apos;t kept, growth paths that dead-ended.
              </p>
              <p className="text-text-secondary text-xl leading-relaxed">
                They&apos;re not looking for another stepping stone. They&apos;re looking for a <em className="text-text-primary font-semibold not-italic">home</em>.
              </p>
              <p className="text-text-primary text-xl leading-relaxed font-medium">
                If you&apos;re that home? You inherit loyalty that was forged through years of working together&mdash;before they ever walked through your door.
              </p>
            </div>

            {/* Supporting data */}
            <div className={`mt-8 pt-8 border-t border-border transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-text-tertiary text-base">
                The research backs this up: only about 20% of job changers are serial hoppers. The other 80% just want a better situation. Find it, and they stay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
