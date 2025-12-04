'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  {
    what: 'Confidential profiles',
    means: 'Your employer never knows',
  },
  {
    what: 'AI matching',
    means: 'Companies find you',
  },
  {
    what: 'Negotiation tools',
    means: 'Fair collective compensation',
  },
  {
    what: 'Transition support',
    means: 'Smooth landing together',
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
        <h2
          id="team-features-heading"
          className={`font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-10 text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          What you get
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
