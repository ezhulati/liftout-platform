'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  EyeIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { ButtonGroup, TextLink } from '@/components/ui';

interface TeamDiscoveryTutorialProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const tutorialSteps = [
  {
    id: 'search',
    title: 'Search for teams',
    description: 'Use our powerful search to find teams that match your needs. Filter by industry, size, skills, and availability.',
    icon: MagnifyingGlassIcon,
    features: [
      'Keyword search across team profiles',
      'Industry-specific filters',
      'Location and remote preferences',
      'Availability timeline filtering',
    ],
    demo: {
      type: 'search',
      placeholder: 'Search teams by skills, industry, or expertise...',
    },
  },
  {
    id: 'filter',
    title: 'Refine your results',
    description: 'Use advanced filters to narrow down teams that perfectly match your liftout requirements.',
    icon: FunnelIcon,
    features: [
      'Team size (2-50+ members)',
      'Years working together',
      'Previous liftout experience',
      'Compensation expectations',
    ],
    demo: {
      type: 'filters',
      filters: [
        { label: 'Team Size', options: ['2-5', '6-10', '11-20', '20+'] },
        { label: 'Industry', options: ['Fintech', 'Healthcare', 'Enterprise'] },
        { label: 'Availability', options: ['Immediate', '1-3 months', '3-6 months'] },
      ],
    },
  },
  {
    id: 'evaluate',
    title: 'Evaluate team profiles',
    description: 'Review detailed team profiles including track record, skills, cohesion metrics, and references.',
    icon: UserGroupIcon,
    features: [
      'Team composition and roles',
      'Performance history and achievements',
      'Client testimonials and references',
      'Team cohesion and collaboration scores',
    ],
    demo: {
      type: 'profile',
      team: {
        name: 'Alpha Analytics Team',
        size: 8,
        industry: 'Financial Services',
        cohesion: 95,
        rating: 4.8,
      },
    },
  },
  {
    id: 'engage',
    title: 'Express interest',
    description: 'Found a great team? Express your interest to start a confidential conversation.',
    icon: HeartIcon,
    features: [
      'Anonymous initial interest',
      'Secure messaging system',
      'Document sharing for due diligence',
      'Scheduled introductory calls',
    ],
    demo: {
      type: 'interest',
    },
  },
];

const sampleTeams = [
  {
    id: '1',
    name: 'Quantum Analytics',
    industry: 'Fintech',
    size: 6,
    cohesion: 92,
    skills: ['Data Science', 'ML', 'Python'],
    available: 'Immediate',
  },
  {
    id: '2',
    name: 'HealthTech Innovators',
    industry: 'Healthcare',
    size: 8,
    cohesion: 88,
    skills: ['Healthcare IT', 'Compliance', 'Cloud'],
    available: '1-3 months',
  },
  {
    id: '3',
    name: 'Enterprise Solutions',
    industry: 'Enterprise Software',
    size: 12,
    cohesion: 95,
    skills: ['Enterprise', 'SaaS', 'Sales'],
    available: 'Immediate',
  },
];

export function TeamDiscoveryTutorial({ onComplete, onSkip }: TeamDiscoveryTutorialProps) {
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
    if (isLastStep) {
      // All steps completed
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (teamId: string) => {
    setExpressedInterest(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const renderDemo = () => {
    switch (step.demo.type) {
      case 'search':
        return (
          <div className="bg-bg-surface border border-border rounded-xl p-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={step.demo.placeholder}
                className="input-field pl-10"
              />
            </div>
            {searchQuery && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-text-tertiary">Showing results for "{searchQuery}"</p>
                {sampleTeams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-3 bg-bg-alt rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-navy" />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">{team.name}</p>
                        <p className="text-sm text-text-tertiary">{team.industry} • {team.size} members</p>
                      </div>
                    </div>
                    <span className="text-sm text-success">{team.cohesion}% cohesion</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'filters':
        return (
          <div className="bg-bg-surface border border-border rounded-xl p-4 space-y-4">
            {step.demo.filters?.map((filter) => (
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
                  <span className="font-bold">{sampleTeams.length} teams</span> match your filters
                </p>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            <div className="p-4 bg-navy-50 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">{step.demo.team?.name}</h4>
                    <p className="text-sm text-text-secondary">{step.demo.team?.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gold">
                  <StarIcon className="h-5 w-5 fill-current" />
                  <span className="font-bold">{step.demo.team?.rating}</span>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-tertiary">Team Size</p>
                  <p className="font-bold text-text-primary">{step.demo.team?.size} members</p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">Cohesion Score</p>
                  <p className="font-bold text-success">{step.demo.team?.cohesion}%</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary min-h-12 flex-1">
                  <EyeIcon className="h-5 w-5 mr-2" />
                  View full profile
                </button>
              </div>
            </div>
          </div>
        );

      case 'interest':
        return (
          <div className="space-y-3">
            {sampleTeams.map((team) => (
              <div key={team.id} className="bg-bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{team.name}</p>
                      <p className="text-sm text-text-tertiary">{team.size} members • {team.available}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleInterest(team.id)}
                    className={`min-h-12 px-4 rounded-xl font-bold transition-colors flex items-center gap-2 ${
                      expressedInterest.has(team.id)
                        ? 'bg-success text-white'
                        : 'bg-bg-alt text-text-secondary hover:bg-navy-50'
                    }`}
                  >
                    {expressedInterest.has(team.id) ? (
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
                    You've expressed interest in {expressedInterest.size} team{expressedInterest.size > 1 ? 's' : ''}!
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
          Discover teams
        </h3>
        <p className="mt-1 text-base text-text-secondary">
          Learn how to find and evaluate the perfect teams for your liftout needs.
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
