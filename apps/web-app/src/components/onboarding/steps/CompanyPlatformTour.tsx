'use client';

import { useState } from 'react';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { ButtonGroup } from '@/components/ui';

interface CompanyPlatformTourProps {
  onComplete: () => void;
}

const tourSteps = [
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'Your command center for managing liftout activities. See key metrics, recent activity, and quick actions at a glance.',
    icon: HomeIcon,
    features: [
      'Overview of active opportunities',
      'Team interest notifications',
      'Quick access to common actions',
      'Performance metrics and insights',
    ],
    tip: 'Check your dashboard daily to stay on top of new team interests and opportunity updates.',
  },
  {
    id: 'discover',
    title: 'Discover Teams',
    description: 'Find and evaluate high-performing teams that match your liftout needs.',
    icon: MagnifyingGlassIcon,
    features: [
      'Advanced search and filtering',
      'Team cohesion and performance scores',
      'Verified team profiles',
      'Save teams to your shortlist',
    ],
    tip: 'Use the cohesion score to identify teams that work well together and are more likely to succeed after a liftout.',
  },
  {
    id: 'opportunities',
    title: 'Manage Opportunities',
    description: 'Create, edit, and track your liftout opportunities. See which teams have expressed interest.',
    icon: BriefcaseIcon,
    features: [
      'Create detailed opportunity listings',
      'Track team applications and interest',
      'Manage opportunity status and timeline',
      'Compare candidates side by side',
    ],
    tip: 'Keep your opportunities updated with accurate compensation ranges to attract the right teams.',
  },
  {
    id: 'messaging',
    title: 'Secure Messaging',
    description: 'Communicate confidentially with teams through our encrypted messaging system.',
    icon: ChatBubbleLeftRightIcon,
    features: [
      'End-to-end encrypted conversations',
      'Share documents securely',
      'Schedule meetings and calls',
      'Keep all communication organized',
    ],
    tip: 'Use the messaging system for all sensitive discussions to maintain confidentiality.',
  },
  {
    id: 'documents',
    title: 'Document Center',
    description: 'Securely share and receive documents for due diligence and negotiations.',
    icon: DocumentTextIcon,
    features: [
      'Secure document upload and sharing',
      'Version control and tracking',
      'Access controls and expiration',
      'NDA and contract templates',
    ],
    tip: 'Set expiration dates on sensitive documents to maintain security.',
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    description: 'Track your liftout performance and get actionable insights.',
    icon: ChartBarIcon,
    features: [
      'Opportunity performance metrics',
      'Team engagement analytics',
      'Market benchmarking data',
      'ROI tracking and reporting',
    ],
    tip: 'Review analytics weekly to understand which opportunities attract the best teams.',
  },
  {
    id: 'settings',
    title: 'Company Settings',
    description: 'Manage your company profile, team access, and notification preferences.',
    icon: Cog6ToothIcon,
    features: [
      'Update company profile and branding',
      'Manage team member access',
      'Configure notification settings',
      'Security and privacy controls',
    ],
    tip: 'Keep your company profile updated to make a strong impression on teams.',
  },
];

export function CompanyPlatformTour({ onComplete }: CompanyPlatformTourProps) {
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
          Explore the key features that will help you find and acquire top teams.
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
          "Companies can quickly gain capacity without all the headaches of a merger or acquisition. Teams can hit the ground running—no need for members to get acquainted or establish shared values and group norms."
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
