'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ShieldCheckIcon, ClockIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: UserGroupIcon,
    title: 'Intact Teams',
    description: 'Hire proven groups who already work well together',
  },
  {
    icon: ClockIcon,
    title: 'Day One Ready',
    description: 'Skip the 6-month team-building phase entirely',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Verified History',
    description: 'Every team comes with documented track records',
  },
  {
    icon: LockClosedIcon,
    title: 'Confidential',
    description: 'NDA-protected throughout the entire process',
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
        <h2 id="trust-heading" className="sr-only">Why choose Liftout</h2>

        {/* Simple 4-column grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`text-center transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
              </div>
              {/* Title */}
              <h3 className="font-semibold text-white text-lg mb-2">
                {feature.title}
              </h3>
              {/* Description */}
              <p className="text-white/70 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
