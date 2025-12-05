'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    number: '1',
    title: 'Post your team',
    description: 'Showcase what you\'ve built together.',
  },
  {
    number: '2',
    title: 'Stay invisible',
    description: 'Your employer never sees you.',
  },
  {
    number: '3',
    title: 'Get found',
    description: 'Companies come to you.',
  },
  {
    number: '4',
    title: 'Move together',
    description: 'When the fit is right.',
  },
];

export function HowItWorksTeams() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="how-it-works"
      className="py-20 lg:py-28 bg-bg-elevated scroll-mt-20"
      aria-labelledby="how-it-works-teams-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section header - Practical UI: left-aligned */}
        <h2
          id="how-it-works-teams-heading"
          className={`font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          How it works
        </h2>

        {/* Steps grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className={`text-center transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {/* Step number */}
              <div className="w-12 h-12 rounded-full bg-[#4C1D95] flex items-center justify-center mx-auto mb-4">
                <span className="font-heading text-lg font-bold text-white">{step.number}</span>
              </div>

              {/* Content */}
              <h3 className="font-heading text-lg font-bold text-text-primary leading-snug mb-2">
                {step.title}
              </h3>
              <p className="text-text-secondary text-base leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
