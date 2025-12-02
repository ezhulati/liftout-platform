'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { ButtonGroup, TextLink } from '@/components/ui';

interface OpportunityDiscoveryTutorialProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const tutorialSteps = [
  {
    id: 'search',
    title: 'Search opportunities',
    description: 'Browse liftout opportunities from companies looking for teams like yours.',
    icon: MagnifyingGlassIcon,
    features: [
      'Filter by industry, location, and team size',
      'Search by keywords and skills',
      'See compensation ranges upfront',
      'View company profiles and culture',
    ],
    demo: 'search',
  },
  {
    id: 'filter',
    title: 'Refine your search',
    description: 'Use advanced filters to find opportunities that match your team\'s preferences.',
    icon: FunnelIcon,
    features: [
      'Compensation range filters',
      'Remote, hybrid, and on-site options',
      'Company size and stage',
      'Industry and sector focus',
    ],
    demo: 'filters',
  },
  {
    id: 'evaluate',
    title: 'Evaluate opportunities',
    description: 'Review detailed opportunity profiles including compensation, culture, and requirements.',
    icon: BriefcaseIcon,
    features: [
      'Full opportunity descriptions',
      'Team size and role requirements',
      'Company culture and values',
      'Integration and onboarding plans',
    ],
    demo: 'opportunity',
  },
  {
    id: 'apply',
    title: 'Express interest',
    description: 'Signal your interest confidentially to start discussions with potential employers.',
    icon: HeartIcon,
    features: [
      'Anonymous initial expressions',
      'Control when to reveal your identity',
      'Direct messaging with companies',
      'Schedule calls and interviews',
    ],
    demo: 'apply',
  },
];

const sampleOpportunities = [
  {
    id: '1',
    title: 'Strategic Analytics Team',
    company: 'Goldman Sachs',
    industry: 'Investment Banking',
    location: 'New York, NY',
    type: 'Hybrid',
    teamSize: '6-10',
    compensation: '$180K - $250K',
    match: 95,
  },
  {
    id: '2',
    title: 'Healthcare AI Team',
    company: 'MedTech Innovations',
    industry: 'Healthcare Technology',
    location: 'San Francisco, CA',
    type: 'Remote',
    teamSize: '4-8',
    compensation: '$200K - $300K',
    match: 88,
  },
  {
    id: '3',
    title: 'European Expansion Team',
    company: 'Confidential Fortune 500',
    industry: 'Enterprise Software',
    location: 'Multiple Locations',
    type: 'Flexible',
    teamSize: '8-15',
    compensation: '$175K - $275K',
    match: 82,
  },
];

const filterOptions = [
  { label: 'Industry', options: ['Financial Services', 'Healthcare', 'Technology', 'Consulting'] },
  { label: 'Compensation', options: ['$100K+', '$150K+', '$200K+', '$250K+'] },
  { label: 'Location', options: ['Remote', 'NYC', 'SF Bay Area', 'Boston'] },
];

export function OpportunityDiscoveryTutorial({ onComplete, onSkip }: OpportunityDiscoveryTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [expressedInterest, setExpressedInterest] = useState<Set<string>>(new Set());

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const allStepsCompleted = completedSteps.size === tutorialSteps.length;

  const handleNextStep = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (opportunityId: string) => {
    setExpressedInterest(prev => {
      const newSet = new Set(prev);
      if (newSet.has(opportunityId)) {
        newSet.delete(opportunityId);
      } else {
        newSet.add(opportunityId);
      }
      return newSet;
    });
  };

  const renderDemo = () => {
    switch (step.demo) {
      case 'search':
        return (
          <div className="bg-bg-surface border border-border rounded-xl p-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities by title, company, or industry..."
                className="input-field pl-10"
              />
            </div>
            {searchQuery && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-text-tertiary">Showing results for "{searchQuery}"</p>
                {sampleOpportunities.map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between p-3 bg-bg-alt rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                        <BriefcaseIcon className="h-5 w-5 text-navy" />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">{opp.title}</p>
                        <p className="text-sm text-text-tertiary">{opp.company} • {opp.location}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-success">{opp.match}% match</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'filters':
        return (
          <div className="bg-bg-surface border border-border rounded-xl p-4 space-y-4">
            {filterOptions.map((filter) => (
              <div key={filter.label}>
                <label className="label-text">{filter.label}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filter.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedFilters(prev => ({
                        ...prev,
                        [filter.label]: prev[filter.label] === option ? '' : option,
                      }))}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                        selectedFilters[filter.label] === option
                          ? 'bg-navy text-white'
                          : 'bg-bg-alt text-text-secondary hover:bg-navy-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {Object.values(selectedFilters).some(v => v) && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-text-secondary">
                  <span className="font-bold">{sampleOpportunities.length} opportunities</span> match your filters
                </p>
              </div>
            )}
          </div>
        );

      case 'opportunity':
        const opportunity = sampleOpportunities[0];
        return (
          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            <div className="p-4 bg-navy-50 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center">
                    <BuildingOffice2Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">{opportunity.title}</h4>
                    <p className="text-sm text-text-secondary">{opportunity.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-success">{opportunity.match}%</span>
                  <p className="text-xs text-text-tertiary">Match score</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-text-tertiary" />
                  <div>
                    <p className="text-sm text-text-tertiary">Compensation</p>
                    <p className="font-bold text-text-primary">{opportunity.compensation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-text-tertiary" />
                  <div>
                    <p className="text-sm text-text-tertiary">Location</p>
                    <p className="font-bold text-text-primary">{opportunity.location}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy bg-navy-50 px-2 py-1 rounded">{opportunity.industry}</span>
                <span className="text-xs font-bold text-text-tertiary bg-bg-alt px-2 py-1 rounded">{opportunity.type}</span>
                <span className="text-xs font-bold text-text-tertiary bg-bg-alt px-2 py-1 rounded">{opportunity.teamSize} members</span>
              </div>
              <button className="btn-primary min-h-12 w-full">
                View full details
              </button>
            </div>
          </div>
        );

      case 'apply':
        return (
          <div className="space-y-3">
            {sampleOpportunities.map((opp) => (
              <div key={opp.id} className="bg-bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                      <BriefcaseIcon className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{opp.title}</p>
                      <p className="text-sm text-text-tertiary">{opp.company} • {opp.compensation}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleInterest(opp.id)}
                    className={`min-h-12 px-4 rounded-xl font-bold transition-colors flex items-center gap-2 ${
                      expressedInterest.has(opp.id)
                        ? 'bg-success text-white'
                        : 'bg-bg-alt text-text-secondary hover:bg-navy-50'
                    }`}
                  >
                    {expressedInterest.has(opp.id) ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5" />
                        Interested
                      </>
                    ) : (
                      <>
                        <HeartIcon className="h-5 w-5" />
                        Express interest
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
            {expressedInterest.size > 0 && (
              <div className="bg-success-light border border-success rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-success" />
                  <p className="text-success-dark font-bold">
                    You've expressed interest in {expressedInterest.size} opportunit{expressedInterest.size > 1 ? 'ies' : 'y'}!
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SparklesIcon className="mx-auto h-12 w-12 text-navy" />
        <h3 className="mt-2 text-lg font-bold text-text-primary">
          Discover opportunities
        </h3>
        <p className="mt-1 text-base text-text-secondary">
          Learn how to find and evaluate liftout opportunities for your team.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          {tutorialSteps.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-navy'
                  : completedSteps.has(index)
                  ? 'bg-success'
                  : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center">
            <step.icon className="h-6 w-6 text-navy" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-navy">Step {currentStep + 1} of {tutorialSteps.length}</span>
              {completedSteps.has(currentStep) && (
                <CheckCircleIcon className="h-5 w-5 text-success" />
              )}
            </div>
            <h4 className="text-lg font-bold text-text-primary mt-1">{step.title}</h4>
            <p className="text-base text-text-secondary mt-1">{step.description}</p>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-bg-alt rounded-xl p-4">
          <p className="text-sm font-bold text-text-primary mb-3">What you can do:</p>
          <ul className="space-y-2">
            {step.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircleIcon className="h-4 w-4 text-success flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Demo */}
        <div>
          <p className="text-sm font-bold text-text-primary mb-3">Try it out:</p>
          {renderDemo()}
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="text-link min-h-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <ButtonGroup>
            {isLastStep && allStepsCompleted ? (
              <button onClick={onComplete} className="btn-primary min-h-12">
                Complete tutorial
              </button>
            ) : (
              <button onClick={handleNextStep} className="btn-primary min-h-12 flex items-center">
                {isLastStep ? 'Finish' : 'Next step'}
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            )}
            {onSkip && (
              <TextLink onClick={onSkip}>
                Skip tutorial
              </TextLink>
            )}
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
