'use client';

import {
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  MapIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  {
    name: 'Team discovery',
    description: 'Browse verified high-performing teams filtered by industry, skills, location, and availability.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Due diligence tools',
    description: 'Access comprehensive reference checks, performance verification, and cultural fit assessments before deciding.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Confidential process',
    description: 'Discrete exploration and negotiation that protects sensitive information and maintains professional relationships.',
    icon: LockClosedIcon,
  },
  {
    name: 'Integration planning',
    description: 'Structured onboarding roadmaps, success metrics, and milestone tracking for seamless team transitions.',
    icon: MapIcon,
  },
  {
    name: 'Market intelligence',
    description: 'Industry-specific compensation benchmarks, talent flow trends, and competitive landscape insights.',
    icon: ChartBarIcon,
  },
  {
    name: 'Success analytics',
    description: 'Track ROI on team acquisitions, monitor integration outcomes, and measure long-term business impact.',
    icon: ArrowTrendingUpIcon,
  },
];

const steps = [
  {
    step: '01',
    title: 'Define your needs',
    description: 'Specify the team profile, skills, and strategic objectives for your acquisition.',
  },
  {
    step: '02',
    title: 'Discover teams',
    description: 'Browse verified teams that match your criteria, all with documented track records.',
  },
  {
    step: '03',
    title: 'Due diligence',
    description: 'Conduct reference checks, cultural assessments, and performance verification.',
  },
  {
    step: '04',
    title: 'Integrate and succeed',
    description: 'Execute a structured transition with onboarding support and success tracking.',
  },
];

export function CompanyFeatures() {
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="features"
      className="py-20 lg:py-28 bg-bg-elevated scroll-mt-20"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={featuresRef as React.RefObject<HTMLDivElement>}
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-500 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="text-gold-700 font-semibold tracking-wider uppercase text-sm mb-4">
            Platform features
          </p>
          <h2
            id="features-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-6"
          >
            Everything you need to acquire proven teams
          </h2>
          <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed">
            Our platform streamlines the entire team acquisition process, from discovery through
            successful integration.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.name}
              className={`group relative bg-bg-surface rounded-xl p-8 border border-border hover:border-navy/40 transition-all duration-500 ease-out-quart hover:shadow-lg ${
                featuresVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: featuresVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {/* Icon container */}
              <div className="w-14 h-14 rounded-lg bg-navy flex items-center justify-center mb-6 transition-all duration-base ease-out-quart group-hover:bg-navy-600 group-hover:shadow-navy group-hover:scale-105">
                <feature.icon className="w-7 h-7 text-gold" aria-hidden="true" />
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
                className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-navy/0 via-navy/60 to-navy/0 opacity-0 group-hover:opacity-100 transition-opacity duration-base rounded-full"
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
              How team acquisition works
            </h3>
            <p className="font-body text-text-secondary leading-relaxed">
              A streamlined process designed for strategic, confidential talent acquisition.
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
                <div className="w-16 h-16 rounded-full bg-navy mx-auto mb-4 flex items-center justify-center shadow-navy">
                  <span className="font-heading text-xl font-bold text-gold">{item.step}</span>
                </div>
                {/* Connector line (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-navy/20" aria-hidden="true" />
                )}
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
