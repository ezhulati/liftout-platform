'use client';

import { ClipboardDocumentListIcon, MagnifyingGlassIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    number: '1',
    title: 'Define your need',
    description: 'Specify the team capabilities, size, and expertise you\'re seeking. Set your strategic goals and timeline.',
    icon: ClipboardDocumentListIcon,
  },
  {
    number: '2',
    title: 'Discover verified teams',
    description: 'Browse pre-vetted teams with documented track records. Filter by industry, skills, and culture alignment.',
    icon: MagnifyingGlassIcon,
  },
  {
    number: '3',
    title: 'Acquire with confidence',
    description: 'Complete due diligence, negotiate terms, and integrate your new team with our structured support.',
    icon: RocketLaunchIcon,
  },
];

export function HowItWorksCompanies() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="how-it-works"
      className="py-24 lg:py-32 bg-bg scroll-mt-20"
      aria-labelledby="how-it-works-companies-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`max-w-2xl mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="font-semibold text-base mb-3 text-navy">
            How it works
          </p>
          <h2
            id="how-it-works-companies-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Acquire proven teams in three steps
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Skip the months of individual hiring. Get a ready-to-perform team with established chemistry and a track record of success.
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
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                  <span className="font-heading text-lg font-bold text-on-dark">{step.number}</span>
                </div>
                <step.icon className="w-6 h-6 text-navy" aria-hidden="true" />
              </div>

              {/* Content - Practical UI: 18px body text minimum */}
              <h3 className="font-heading text-xl font-bold text-text-primary leading-snug mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
