'use client';

import { MagnifyingGlassIcon, ChatBubbleLeftRightIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    number: '1',
    title: 'Browse verified teams',
    description: 'Explore pre-vetted teams with documented track records, verified achievements, and detailed team profiles.',
    icon: MagnifyingGlassIcon,
  },
  {
    number: '2',
    title: 'Connect confidentially',
    description: 'Initiate NDA-protected conversations. Explore fit, discuss expectations, and evaluate culture alignment.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    number: '3',
    title: 'Acquire and integrate',
    description: 'Complete the acquisition with our structured process. We support onboarding and track integration success.',
    icon: RocketLaunchIcon,
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="how-it-works"
      className="py-24 lg:py-32 bg-bg scroll-mt-20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header - left aligned */}
        <div className={`max-w-2xl mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="font-semibold text-base mb-3 text-[#4C1D95]">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Three steps to your next high-performing team
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Our streamlined process makes team acquisition faster and more predictable than traditional hiring or M&A.
          </p>
        </div>

        {/* Steps - grid layout */}
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
              {/* Step number */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#4C1D95] flex items-center justify-center">
                  <span className="font-heading text-lg font-bold text-on-dark">{step.number}</span>
                </div>
                <step.icon className="w-6 h-6 text-[#4C1D95]" aria-hidden="true" />
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
