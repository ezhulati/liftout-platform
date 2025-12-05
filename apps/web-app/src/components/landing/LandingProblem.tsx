'use client';

import { UserGroupIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const stages = [
  {
    title: 'Where you came from',
    description: 'Real teammates. Shared wins. People who had your back.',
    Icon: UserGroupIcon,
    variant: 'positive',
  },
  {
    title: 'The job search',
    description: 'Alone. Scared. Starting over with strangers.',
    Icon: UserIcon,
    variant: 'negative',
  },
  {
    title: 'Where you\'re going',
    description: '"We\'re a family!" Personality tests. Fingers crossed.',
    Icon: SparklesIcon,
    variant: 'positive',
  },
];

export function LandingProblem() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg-elevated"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section header - Practical UI: left-aligned */}
        <div className={`mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2
            id="problem-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Something doesn&apos;t add up
          </h2>
        </div>

        {/* Three-column journey */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {stages.map((stage, index) => (
            <div
              key={stage.title}
              className={`text-center transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms' }}
            >
              {/* Icon container */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  stage.variant === 'positive'
                    ? 'bg-[#4C1D95]'
                    : 'bg-gray-200'
                }`}
              >
                <stage.Icon
                  className={`w-8 h-8 ${
                    stage.variant === 'positive' ? 'text-white' : 'text-gray-400'
                  }`}
                  aria-hidden="true"
                />
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl font-semibold text-text-primary mb-3">
                {stage.title}
              </h3>

              {/* Description */}
              <p className="text-text-secondary text-lg leading-relaxed">
                {stage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Provocative closing question - Practical UI: left-aligned */}
        <div
          className={`mt-16 transition-all duration-500 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-xl lg:text-2xl font-heading font-semibold text-text-primary mb-4">
            Why does hiring break up great teams?
          </p>
          <p className="text-text-secondary text-lg">
            It doesn&apos;t have to.
          </p>
        </div>
      </div>
    </section>
  );
}
