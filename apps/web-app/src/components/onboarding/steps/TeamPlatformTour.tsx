'use client';

import { useState } from 'react';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { ButtonGroup } from '@/components/ui';

interface TeamPlatformTourProps {
  onComplete: () => void;
}

const tourSteps = [
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'Your command center for managing liftout activities. Track team profile views, opportunity matches, and company interest.',
    icon: HomeIcon,
    features: [
      'Overview of opportunity matches',
      'Team profile performance metrics',
      'Recent company interest notifications',
      'Quick access to common actions',
    ],
    tip: 'Check your dashboard regularly to see which companies are viewing your team profile.',
  },
  {
    id: 'opportunities',
    title: 'Browse Opportunities',
    description: 'Discover liftout opportunities from companies looking for teams like yours.',
    icon: BriefcaseIcon,
    features: [
      'Search and filter opportunities',
      'View compensation and requirements',
      'See company profiles and culture',
      'Express interest confidentially',
    ],
    tip: 'Set up notifications to be alerted when new opportunities match your preferences.',
  },
  {
    id: 'team-profile',
    title: 'Team Profile',
    description: 'Showcase your team\'s expertise, achievements, and what makes you work well together.',
    icon: UserGroupIcon,
    features: [
      'Highlight team cohesion and history',
      'Showcase combined expertise',
      'Feature key achievements',
      'Control profile visibility',
    ],
    tip: 'Star performers don\'t operate in a vacuum—they succeed as part of a team. Show companies what makes yours work.',
  },
  {
    id: 'messaging',
    title: 'Secure Messaging',
    description: 'Communicate confidentially with potential employers through encrypted messaging.',
    icon: ChatBubbleLeftRightIcon,
    features: [
      'End-to-end encrypted conversations',
      'Share documents securely',
      'Schedule meetings and calls',
      'Manage multiple discussions',
    ],
    tip: 'Keep all sensitive discussions on the platform to maintain confidentiality.',
  },
  {
    id: 'documents',
    title: 'Document Center',
    description: 'Securely share credentials, portfolios, and references with interested companies.',
    icon: DocumentTextIcon,
    features: [
      'Secure document upload',
      'Access controls and expiration',
      'Track who viewed documents',
      'NDA and contract management',
    ],
    tip: 'Prepare key documents in advance to speed up the due diligence process.',
  },
  {
    id: 'analytics',
    title: 'Team Analytics',
    description: 'Understand how companies engage with your team profile and track your liftout journey.',
    icon: ChartBarIcon,
    features: [
      'Profile view analytics',
      'Company interest tracking',
      'Opportunity match insights',
      'Activity timeline',
    ],
    tip: 'Use analytics to optimize your profile based on what attracts company interest.',
  },
  {
    id: 'settings',
    title: 'Team Settings',
    description: 'Manage team members, preferences, and notification settings.',
    icon: Cog6ToothIcon,
    features: [
      'Manage team member access',
      'Update team information',
      'Configure notification settings',
      'Privacy and visibility controls',
    ],
    tip: 'Ensure all team members have accepted their invitations for a complete profile.',
  },
];

export function TeamPlatformTour({ onComplete }: TeamPlatformTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const progress = ((completedSteps.size + 1) / tourSteps.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SparklesIcon className="mx-auto h-12 w-12 text-navy" />
        <h3 className="mt-2 text-lg font-bold text-text-primary">
          Platform tour
        </h3>
        <p className="mt-1 text-base text-text-secondary">
          Explore the key features that will help your team find the right opportunity.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Tour progress</span>
          <span className="font-bold text-navy">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-bg-alt rounded-full overflow-hidden">
          <div
            className="h-full bg-navy transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {tourSteps.map((s, index) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => goToStep(index)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-10 ${
                index === currentStep
                  ? 'bg-navy text-white'
                  : completedSteps.has(index)
                  ? 'bg-success-light text-success-dark'
                  : 'bg-bg-alt text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{s.title}</span>
              {completedSteps.has(index) && (
                <CheckCircleIcon className="h-4 w-4" />
              )}
            </button>
          );
        })}
      </div>

      {/* Current Step Content */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        {/* Step Header */}
        <div className="bg-navy-50 p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center">
              <step.icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy">Step {currentStep + 1} of {tourSteps.length}</p>
              <h4 className="text-xl font-bold text-text-primary">{step.title}</h4>
            </div>
          </div>
          <p className="mt-4 text-base text-text-secondary">{step.description}</p>
        </div>

        {/* Features */}
        <div className="p-6">
          <h5 className="text-base font-bold text-text-primary mb-4">Key features:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {step.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-bg-alt rounded-lg"
              >
                <CheckCircleIcon className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-sm text-text-secondary">{feature}</span>
              </div>
            ))}
          </div>

          {/* Pro Tip */}
          <div className="mt-6 bg-gold-50 border border-gold-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <SparklesIcon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-gold-900">Pro tip</p>
                <p className="text-sm text-gold-800 mt-1">{step.tip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="px-6 pb-6">
          <div className="border-2 border-dashed border-border rounded-xl p-8 bg-bg-alt">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy-100 rounded-xl flex items-center justify-center mb-4">
                <step.icon className="h-8 w-8 text-navy" />
              </div>
              <p className="text-base font-bold text-text-primary">{step.title} Preview</p>
              <p className="text-sm text-text-tertiary mt-1">
                You'll explore this feature after completing onboarding
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HBR Insight */}
      <div className="p-4 bg-bg-alt rounded-xl border-l-4 border-navy">
        <p className="text-xs text-text-tertiary mb-2 uppercase tracking-wide">Harvard Business Review</p>
        <p className="text-sm text-text-secondary leading-relaxed">
          "There's no need for team members to get acquainted with one another or establish shared values, mutual accountability, or group norms. Instead, the team can hit the ground running."
        </p>
        <p className="text-xs text-text-tertiary mt-2">— Groysberg & Abrahams on Liftouts</p>
      </div>

      {/* Navigation */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-link min-h-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <ButtonGroup>
            <button onClick={handleNext} className="btn-primary min-h-12 flex items-center">
              {isLastStep ? (
                <>
                  Complete tour
                  <CheckCircleIcon className="h-5 w-5 ml-2" />
                </>
              ) : (
                <>
                  Next feature
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
