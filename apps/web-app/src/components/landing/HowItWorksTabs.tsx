'use client';

import { useState } from 'react';
import { BuildingOffice2Icon, UserGroupIcon, ClipboardDocumentListIcon, MagnifyingGlassIcon, RocketLaunchIcon, EyeSlashIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const companySteps = [
  {
    number: '1',
    title: 'Describe your ambition',
    description: 'What could a proven team help you achieve? Market expansion? New capability? Tell us the outcome, not just the job description.',
    icon: ClipboardDocumentListIcon,
  },
  {
    number: '2',
    title: 'Browse proven chemistry',
    description: 'Every team has documented tenure together, verified achievements, and real references—not interview personas.',
    icon: MagnifyingGlassIcon,
  },
  {
    number: '3',
    title: 'Skip the storming phase',
    description: 'Integrate a team that\'s already past the forming-storming-norming stages. Due diligence and onboarding support included.',
    icon: RocketLaunchIcon,
  },
];

const teamSteps = [
  {
    number: '1',
    title: 'Signal together',
    description: 'Showcase what makes your team exceptional—your chemistry, track record, and readiness for something new.',
    icon: UserGroupIcon,
  },
  {
    number: '2',
    title: 'Explore in safety',
    description: 'Browse opportunities confidentially. Control your visibility—go anonymous until you\'re ready to reveal.',
    icon: EyeSlashIcon,
  },
  {
    number: '3',
    title: 'Take the leap together',
    description: 'When you find the right fit, negotiate as a collective and transition with support. No one gets left behind.',
    icon: ArrowTrendingUpIcon,
  },
];

type TabId = 'companies' | 'teams';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'companies', label: 'For Companies', icon: BuildingOffice2Icon },
  { id: 'teams', label: 'For Teams', icon: UserGroupIcon },
];

export function HowItWorksTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('companies');
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const steps = activeTab === 'companies' ? companySteps : teamSteps;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="how-it-works"
      className="py-24 lg:py-32 bg-bg scroll-mt-20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`max-w-2xl mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-4">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            A new way to hire. A new way to move.
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Built for confidentiality from day one.
          </p>
        </div>

        {/* Tabs */}
        <div className={`mb-12 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div
            role="tablist"
            className="inline-flex bg-bg-elevated rounded-lg p-1 gap-1"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-md min-h-12
                    font-medium text-base transition-all duration-fast
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 focus-visible:ring-offset-2
                    ${isActive
                      ? 'bg-bg-surface text-[#4C1D95] shadow-sm'
                      : 'text-text-tertiary hover:text-text-primary'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <article
              key={`${activeTab}-${step.number}`}
              className={`relative transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 2) * 150}ms` : '0ms' }}
            >
              {/* Step number and icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#4C1D95] flex items-center justify-center">
                  <span className="font-heading text-lg font-bold text-white">{step.number}</span>
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
