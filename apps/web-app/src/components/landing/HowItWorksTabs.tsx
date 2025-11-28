'use client';

import { useState } from 'react';
import { BuildingOffice2Icon, UserGroupIcon, ClipboardDocumentListIcon, MagnifyingGlassIcon, RocketLaunchIcon, EyeSlashIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const companySteps = [
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

const teamSteps = [
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

type TabId = 'companies' | 'teams';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'companies', label: 'For Companies', icon: BuildingOffice2Icon },
  { id: 'teams', label: 'For Teams', icon: UserGroupIcon },
];

export function HowItWorksTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('companies');
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const steps = activeTab === 'companies' ? companySteps : teamSteps;
  const accentColor = activeTab === 'companies' ? 'navy' : 'gold';

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
          <p className="font-semibold text-base mb-3 text-navy">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            A streamlined process for both sides
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Whether you're acquiring talent or seeking new opportunities, our platform makes it simple.
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
                    flex items-center gap-2 px-5 py-2.5 rounded-md min-h-11
                    font-medium text-sm transition-all duration-fast
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2
                    ${isActive
                      ? 'bg-bg-surface text-navy shadow-sm'
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  accentColor === 'navy' ? 'bg-navy' : 'bg-gold'
                }`}>
                  <span className={`font-heading text-lg font-bold ${
                    accentColor === 'navy' ? 'text-on-dark' : 'text-on-gold'
                  }`}>{step.number}</span>
                </div>
                <step.icon className={`w-6 h-6 ${
                  accentColor === 'navy' ? 'text-navy' : 'text-gold-dark'
                }`} aria-hidden="true" />
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
