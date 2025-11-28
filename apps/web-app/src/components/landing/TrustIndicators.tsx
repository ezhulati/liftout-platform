'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const stats = [
  {
    value: '500+',
    label: 'Verified teams',
    description: 'Pre-vetted and ready',
  },
  {
    value: '$2.1B',
    label: 'Transaction value',
    description: 'Successful acquisitions',
  },
  {
    value: '89%',
    label: 'Satisfaction rate',
    description: 'Companies and teams',
  },
  {
    value: '3x',
    label: 'Faster productivity',
    description: 'Versus individual hiring',
  },
];

export function TrustIndicators() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 lg:py-20 bg-navy-900"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 id="trust-heading" className="sr-only">Platform statistics</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
            >
              {/* Value - large, white */}
              <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              {/* Label - white, semibold */}
              <div className="font-semibold text-white text-sm mb-1">
                {stat.label}
              </div>
              {/* Description - white with opacity */}
              <div className="text-white/70 text-xs">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
