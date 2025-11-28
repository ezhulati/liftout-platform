'use client';

import {
  UserGroupIcon,
  SparklesIcon,
  EyeSlashIcon,
  ScaleIcon,
  HeartIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  {
    name: 'Team profile',
    description: 'Showcase collective achievements, collaboration history, and combined expertise. Let your track record speak for itself.',
    icon: UserGroupIcon,
  },
  {
    name: 'AI-powered matching',
    description: 'Intelligent matching connects you with companies actively seeking your specific combination of skills and experience.',
    icon: SparklesIcon,
  },
  {
    name: 'Confidential browsing',
    description: 'Explore opportunities without exposing your current employment. Your identity stays protected until you choose to engage.',
    icon: EyeSlashIcon,
  },
  {
    name: 'Negotiation support',
    description: 'Tools and guidance to structure fair collective compensation packages. Leverage your combined value effectively.',
    icon: ScaleIcon,
  },
  {
    name: 'Culture fit assessment',
    description: 'Evaluate potential employers before committing. Ensure the company aligns with your team values and working style.',
    icon: HeartIcon,
  },
  {
    name: 'Transition coordination',
    description: 'Manage the logistics of moving together smoothly. Coordinated onboarding and integration support.',
    icon: TruckIcon,
  },
];

const steps = [
  {
    step: '01',
    title: 'Create your profile',
    description: 'Showcase your team achievements, dynamics, and collective expertise.',
  },
  {
    step: '02',
    title: 'Get matched',
    description: 'AI connects you with companies seeking teams with your skills.',
  },
  {
    step: '03',
    title: 'Evaluate opportunities',
    description: 'Explore companies, assess culture fit, and review terms confidentially.',
  },
  {
    step: '04',
    title: 'Move together',
    description: 'Transition as a unit with coordinated onboarding and support.',
  },
];

export function TeamFeatures() {
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="features"
      className="py-20 lg:py-28 bg-bg-elevated scroll-mt-20"
      aria-labelledby="team-features-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={featuresRef as React.RefObject<HTMLDivElement>}
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-500 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Eyebrow */}
          <p className="text-gold-700 font-semibold tracking-wider uppercase text-sm mb-4">
            Platform features
          </p>

          {/* Headline */}
          <h2
            id="team-features-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-6"
          >
            Everything you need to move together
          </h2>

          {/* Description */}
          <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed">
            From showcasing your team to securing your next opportunity, we support every step
            of your collective journey.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.name}
              className={`group relative bg-bg-surface rounded-xl p-8 border border-border hover:border-gold/40 transition-all duration-500 ease-out-quart hover:shadow-lg ${
                featuresVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: featuresVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {/* Icon container */}
              <div className="w-14 h-14 rounded-lg bg-gold flex items-center justify-center mb-6 transition-all duration-base ease-out-quart group-hover:bg-gold-dark group-hover:shadow-gold group-hover:scale-105">
                <feature.icon className="w-7 h-7 text-navy-900" aria-hidden="true" />
              </div>

              {/* Feature title */}
              <h3 className="font-heading text-xl font-bold text-text-primary leading-snug mb-3">
                {feature.name}
              </h3>

              {/* Feature description */}
              <p className="font-body text-text-secondary leading-relaxed text-base">
                {feature.description}
              </p>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-base rounded-full"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        {/* How it works section */}
        <div
          ref={stepsRef as React.RefObject<HTMLDivElement>}
          className="mt-20 lg:mt-28"
        >
          <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-500 ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-4">
              Your journey to the next chapter
            </h3>
            <p className="font-body text-text-secondary leading-relaxed">
              A confidential, team-first process designed for high-performing groups.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={`text-center transition-all duration-500 ${
                  stepsVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: stepsVisible ? `${(index + 1) * 150}ms` : '0ms' }}
              >
                {/* Step number */}
                <div className="w-16 h-16 rounded-full bg-gold mx-auto mb-4 flex items-center justify-center shadow-gold">
                  <span className="font-heading text-xl font-bold text-navy-900">{item.step}</span>
                </div>
                {/* Title */}
                <h4 className="font-heading text-lg font-bold text-text-primary mb-2">
                  {item.title}
                </h4>
                {/* Description */}
                <p className="font-body text-text-secondary text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
