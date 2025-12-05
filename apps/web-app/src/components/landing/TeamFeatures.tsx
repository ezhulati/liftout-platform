'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  {
    what: 'Keep chemistry',
    means: 'Continue excelling alongside colleagues you trust',
  },
  {
    what: 'Stay confidential',
    means: 'Your employer never knows you\'re looking',
  },
  {
    what: 'Maintain continuity',
    means: 'No solo job searches—we put teams first',
  },
  {
    what: 'Elevate together',
    means: 'Reach the next level without leaving anyone behind',
  },
];

export function TeamFeatures() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="features"
      className="py-20 lg:py-28 bg-bg scroll-mt-20"
      aria-labelledby="team-features-heading"
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Practical UI: left-aligned section header */}
        <h2
          id="team-features-heading"
          className={`font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Why Liftout
        </h2>

        {/* Simple feature list */}
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div
              key={feature.what}
              className={`flex items-center justify-between py-4 border-b border-border last:border-b-0 transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              <span className="font-heading text-lg font-bold text-text-primary">
                {feature.what}
              </span>
              <span className="text-text-secondary text-lg">
                {feature.means}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
