'use client';

import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { OnboardingStep } from '@/types/onboarding';

// Import step components
import { CompanyProfileSetup } from './steps/CompanyProfileSetup';
import { ProfileSetup } from './steps/ProfileSetup';
import {
  CompanyVerification,
  FirstOpportunityCreation,
  TeamDiscoveryTutorial,
  CompanyPlatformTour,
  TeamFormation,
  SkillsExperience,
  LiftoutPreferences,
  OpportunityDiscoveryTutorial,
  TeamPlatformTour,
} from './steps';

interface OnboardingWizardProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

// Conversational prompts for each step
const stepPrompts: Record<string, { greeting: string; subtext: string }> = {
  'ProfileSetup': {
    greeting: "First, let's get to know you",
    subtext: "A complete profile helps companies understand your background and connect with the right opportunities.",
  },
  'TeamFormation': {
    greeting: "Now, let's set up your team",
    subtext: "Teams that move together get better opportunities. Create a team or join one you've been invited to.",
  },
  'SkillsExperience': {
    greeting: "What are you great at?",
    subtext: "Highlighting your skills helps us match you with opportunities where you'll thrive.",
  },
  'LiftoutPreferences': {
    greeting: "What are you looking for?",
    subtext: "Tell us your preferences so we can surface the most relevant opportunities for you.",
  },
  'OpportunityDiscoveryTutorial': {
    greeting: "Let's explore opportunities",
    subtext: "Here's how to discover and evaluate the best matches for your team.",
  },
  'TeamPlatformTour': {
    greeting: "You're almost ready!",
    subtext: "Let's take a quick tour of the key features you'll use every day.",
  },
  'CompanyProfileSetup': {
    greeting: "Tell us about your company",
    subtext: "A compelling profile attracts top teams looking for their next opportunity.",
  },
  'CompanyVerification': {
    greeting: "Let's verify your company",
    subtext: "Verification builds trust and helps teams feel confident engaging with you.",
  },
  'FirstOpportunityCreation': {
    greeting: "Post your first opportunity",
    subtext: "Describe the team you're looking for and what makes this role compelling.",
  },
  'TeamDiscoveryTutorial': {
    greeting: "Discover amazing teams",
    subtext: "Learn how to find, evaluate, and connect with high-performing teams.",
  },
  'CompanyPlatformTour': {
    greeting: "You're all set!",
    subtext: "Let's explore the tools you'll use to find your next great team.",
  },
};

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const { userData } = useAuth();
  const {
    progress,
    steps,
    currentStep,
    completeStep,
    goToStep,
    skipOnboarding,
    isOnboardingCompleted,
  } = useOnboarding();

  const [isVisible, setIsVisible] = useState(!isOnboardingCompleted);
  const [showWelcome, setShowWelcome] = useState(true);

  if (!isVisible || isOnboardingCompleted || !currentStep || !progress) {
    return null;
  }

  const currentStepIndex = steps.findIndex(step => step.id === currentStep.id);
  const totalSteps = steps.length;
  const completedStepsCount = progress.completedSteps.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Get first name for personalization
  const firstName = userData?.name?.split(' ')[0] || 'there';
  const isCompany = userData?.type === 'company';

  const handleStepComplete = async () => {
    await completeStep(currentStep.id);

    // Check if all required steps are completed
    const allRequiredCompleted = steps
      .filter(step => step.required)
      .every(step => [...progress.completedSteps, currentStep.id].includes(step.id));

    if (allRequiredCompleted) {
      onComplete?.();
    }
  };

  const handleSkip = async () => {
    await skipOnboarding();
    setIsVisible(false);
    onSkip?.();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleStartOnboarding = () => {
    setShowWelcome(false);
  };

  const canGoBack = currentStepIndex > 0;
  const canSkipStep = !currentStep.required;

  const goToPreviousStep = () => {
    if (canGoBack) {
      const previousStep = steps[currentStepIndex - 1];
      goToStep(previousStep.id);
    }
  };

  const renderStepComponent = () => {
    const commonProps = {
      onComplete: handleStepComplete,
      onSkip: canSkipStep ? handleStepComplete : undefined,
    };

    switch (currentStep.component) {
      case 'CompanyProfileSetup':
        return <CompanyProfileSetup {...commonProps} />;
      case 'CompanyVerification':
        return <CompanyVerification {...commonProps} />;
      case 'FirstOpportunityCreation':
        return <FirstOpportunityCreation {...commonProps} />;
      case 'TeamDiscoveryTutorial':
        return <TeamDiscoveryTutorial {...commonProps} />;
      case 'CompanyPlatformTour':
        return <CompanyPlatformTour {...commonProps} />;
      case 'ProfileSetup':
        return <ProfileSetup {...commonProps} />;
      case 'TeamFormation':
        return <TeamFormation {...commonProps} />;
      case 'SkillsExperience':
        return <SkillsExperience {...commonProps} />;
      case 'LiftoutPreferences':
        return <LiftoutPreferences {...commonProps} />;
      case 'OpportunityDiscoveryTutorial':
        return <OpportunityDiscoveryTutorial {...commonProps} />;
      case 'TeamPlatformTour':
        return <TeamPlatformTour {...commonProps} />;
      default:
        return <div>Step component not found</div>;
    }
  };

  // Get conversational copy for current step
  const stepCopy = stepPrompts[currentStep.component] || {
    greeting: currentStep.title,
    subtext: currentStep.description,
  };

  // Welcome screen for first-time users
  if (showWelcome && currentStepIndex === 0) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-gradient-to-br from-navy-50 via-bg to-bg">
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-lg w-full text-center">
            {/* Animated icon */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 mx-auto bg-navy rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20 animate-pulse">
                <RocketLaunchIcon className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-md">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Welcome copy */}
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Welcome to Liftout, {firstName}!
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              {isCompany
                ? "Let's set up your company profile so you can start discovering high-performing teams ready for their next chapter."
                : "Let's get you set up so you can discover amazing opportunities and connect with companies looking for talented teams like yours."
              }
            </p>

            {/* Time estimate */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-surface rounded-full border border-border mb-8">
              <span className="text-sm text-text-tertiary">Takes about</span>
              <span className="text-sm font-bold text-text-primary">5-7 minutes</span>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <button
                onClick={handleStartOnboarding}
                className="w-full btn-primary min-h-14 text-base font-bold flex items-center justify-center gap-2"
              >
                Let's get started
                <ArrowRightIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleSkip}
                className="w-full text-link min-h-12 text-base"
              >
                I'll do this later
              </button>
            </div>

            {/* HBR Insight */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-text-tertiary mb-3">From Harvard Business Review</p>
              <blockquote className="text-sm text-text-secondary italic leading-relaxed">
                "The advantages of long-standing relationships and trust help an experienced team make an impact much faster than could a group of people brought together for the first time."
              </blockquote>
              <p className="text-xs text-text-tertiary mt-2">— Boris Groysberg & Robin Abrahams, HBR</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-bg">
      <div className="min-h-screen flex flex-col">
        {/* Simplified Header with progress */}
        <div className="bg-bg-surface border-b border-border px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-tertiary">Setting up your profile</p>
                  <p className="text-base font-bold text-text-primary">
                    {progressPercent}% complete
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-alt rounded-lg transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-border rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-navy to-navy-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step dots - minimal */}
        <div className="bg-bg-surface border-b border-border px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              {steps.map((step, index) => {
                const isCompleted = progress.completedSteps.includes(step.id);
                const isCurrent = step.id === currentStep.id;

                return (
                  <button
                    key={step.id}
                    onClick={() => (index <= currentStepIndex || isCompleted) && goToStep(step.id)}
                    disabled={index > currentStepIndex && !isCompleted}
                    className="group relative"
                    title={step.title}
                  >
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-success scale-100'
                          : isCurrent
                          ? 'bg-navy scale-125 ring-4 ring-navy/20'
                          : 'bg-border group-hover:bg-border-dark'
                      }`}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="px-2 py-1 bg-text-primary text-white text-xs font-medium rounded whitespace-nowrap">
                        {step.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Conversational */}
        <div className="flex-1 px-6 py-10 overflow-y-auto">
          <div className="max-w-xl mx-auto">
            {/* Conversational header */}
            <div className="text-center mb-10">
              <p className="text-sm font-medium text-navy mb-2">
                Step {currentStepIndex + 1} of {totalSteps}
              </p>
              <h1 className="text-2xl font-bold text-text-primary mb-3">
                {stepCopy.greeting}
              </h1>
              <p className="text-base text-text-secondary leading-relaxed max-w-md mx-auto">
                {stepCopy.subtext}
              </p>
            </div>

            {/* Step Component - clean container */}
            <div className="bg-bg-surface rounded-2xl border border-border p-8 shadow-sm">
              {renderStepComponent()}
            </div>
          </div>
        </div>

        {/* Simplified Footer */}
        <div className="bg-bg-surface border-t border-border px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              {canGoBack && (
                <button
                  onClick={goToPreviousStep}
                  className="text-link min-h-12 flex items-center gap-2"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSkip}
                className="text-sm text-text-tertiary hover:text-text-secondary min-h-12"
              >
                Finish later
              </button>
              {canSkipStep && (
                <button
                  onClick={handleStepComplete}
                  className="text-link min-h-12 flex items-center gap-1"
                >
                  <span>Skip this step</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}