'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ShieldCheckIcon, ClockIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: UserGroupIcon,
    title: 'Proven chemistry',
    description: 'Years of trust you can\'t recreate with offsites.',
  },
  {
    icon: ClockIcon,
    title: 'No storming phase',
    description: 'Skip the awkward months. They already gel.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Real track records',
    description: 'Documented achievements, not interview personas.',
  },
  {
    icon: LockClosedIcon,
    title: 'Complete discretion',
    description: 'Your employer never sees you. Explore safely.',
  },
];

export function TrustIndicators() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-24 dark-section"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section label - Practical UI: 16px minimum */}
        <p className="text-white/60 text-base font-semibold uppercase tracking-wider mb-10 text-center">
          What makes Liftout different
        </p>
        <h2 id="trust-heading" className="sr-only">Why choose Liftout</h2>

        {/* Practical UI: Left-align text, 18px body, proper icon sizing */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
            >
              {/* Icon - with label nearby per Practical UI */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
              </div>
              {/* Title */}
              <h3 className="font-semibold text-white text-xl mb-2">
                {feature.title}
              </h3>
              {/* Description - 18px minimum */}
              <p className="text-white/80 text-lg leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
