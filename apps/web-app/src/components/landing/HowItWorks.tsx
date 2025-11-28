'use client';

import { MagnifyingGlassIcon, ChatBubbleLeftRightIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    number: '01',
    title: 'Browse verified teams',
    description: 'Explore 500+ pre-vetted teams with documented track records, verified achievements, and detailed team profiles.',
    icon: MagnifyingGlassIcon,
  },
  {
    number: '02',
    title: 'Connect confidentially',
    description: 'Initiate NDA-protected conversations. Explore fit, discuss expectations, and evaluate culture alignment.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    number: '03',
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
      className="py-20 lg:py-28 bg-bg scroll-mt-20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header - left-aligned per Practical UI */}
        <div className={`max-w-3xl mb-16 lg:mb-20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-gold-700 font-semibold tracking-wider uppercase text-xs mb-4">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-6"
          >
            Three steps to your next high-performing team
          </h2>
          <p className="font-body text-lg text-text-secondary leading-relaxed">
            Our streamlined process makes team acquisition faster and more predictable than traditional hiring or M&A.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-24 left-[calc(16.67%-12px)] right-[calc(16.67%-12px)] h-0.5 bg-gradient-to-r from-navy/20 via-gold/40 to-navy/20" aria-hidden="true" />

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
                {/* Step number badge */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-navy flex items-center justify-center mb-6 shadow-navy">
                  <span className="font-heading text-lg font-bold text-gold">{step.number}</span>
                </div>

                {/* Icon - positioned as decorative element */}
                <div className="absolute top-0 right-0 w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center" aria-hidden="true">
                  <step.icon className="w-6 h-6 text-gold-700" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-bold text-text-primary leading-snug mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
