'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ShieldCheckIcon, ClockIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// Features with quantified benefits (#43, #89 - benefits over features)
const features = [
  {
    icon: UserGroupIcon,
    title: 'Intact Teams',
    description: 'Hire proven groups who already work well together',
    stat: '3+ years',
    statLabel: 'avg. team tenure',
  },
  {
    icon: ClockIcon,
    title: 'Day One Ready',
    description: 'Skip the 6-month team-building phase entirely',
    stat: '6 months',
    statLabel: 'faster to productivity',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Verified History',
    description: 'Every team comes with documented track records',
    stat: '100%',
    statLabel: 'background verified',
  },
  {
    icon: LockClosedIcon,
    title: 'Confidential',
    description: 'NDA-protected throughout the entire process',
    stat: 'Zero',
    statLabel: 'confidentiality breaches',
  },
];

// Establishment stats (#82 - prove you are established)
const establishmentStats = [
  { value: '2024', label: 'Founded' },
  { value: '$47M+', label: 'Team compensation facilitated' },
  { value: '150+', label: 'Teams successfully matched' },
  { value: '12', label: 'Industries served' },
];

export function TrustIndicators() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28"
      style={{ backgroundColor: 'hsl(220, 65%, 15%)' }}
      aria-labelledby="trust-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 id="trust-heading" className="sr-only">Why choose Liftout</h2>

        {/* Establishment stats bar (#82) */}
        <div className={`mb-16 pb-12 border-b border-white/10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {establishmentStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-500`}
                style={{ transitionDelay: isVisible ? `${index * 75}ms` : '0ms' }}
              >
                <div className="font-heading text-3xl lg:text-4xl font-bold text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards with stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`text-center lg:text-left p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 4) * 100}ms` : '0ms' }}
            >
              {/* Icon */}
              <div className="flex justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-gold" aria-hidden="true" />
                </div>
              </div>
              {/* Title */}
              <div className="font-semibold text-white text-lg mb-2">
                {feature.title}
              </div>
              {/* Stat highlight */}
              <div className="mb-2">
                <span className="text-gold font-bold text-xl">{feature.stat}</span>
                <span className="text-white/50 text-sm ml-1">{feature.statLabel}</span>
              </div>
              {/* Description */}
              <div className="text-white/70 text-sm leading-relaxed">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
