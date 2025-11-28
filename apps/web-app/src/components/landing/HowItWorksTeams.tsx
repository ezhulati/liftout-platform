'use client';

import { UserGroupIcon, EyeSlashIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    number: '1',
    title: 'Build your profile',
    description: 'Showcase your team\'s expertise, achievements, and chemistry. Highlight what makes you work well together.',
    icon: UserGroupIcon,
  },
  {
    number: '2',
    title: 'Explore confidentially',
    description: 'Browse opportunities from companies seeking proven teams. Your current employer never knows.',
    icon: EyeSlashIcon,
  },
  {
    number: '3',
    title: 'Move together',
    description: 'Negotiate as a collective, transition with support, and start your next chapter intact.',
    icon: ArrowTrendingUpIcon,
  },
];

export function HowItWorksTeams() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="how-it-works"
      className="py-24 lg:py-32 bg-bg scroll-mt-20"
      aria-labelledby="how-it-works-teams-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`max-w-2xl mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="font-semibold text-base mb-3 text-gold-dark">
            How it works
          </p>
          <h2
            id="how-it-works-teams-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Your path to the next chapter together
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Don't leave your team behind. Move as a unit and access opportunities that value your collective strength.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className={`relative transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms' }}
            >
              {/* Step number and icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                  <span className="font-heading text-lg font-bold text-on-gold">{step.number}</span>
                </div>
                <step.icon className="w-6 h-6 text-gold-dark" aria-hidden="true" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-bold text-text-primary leading-snug mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
