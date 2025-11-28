'use client';

import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
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

  if (!isVisible || isOnboardingCompleted || !currentStep || !progress) {
    return null;
  }

  const currentStepIndex = steps.findIndex(step => step.id === currentStep.id);
  const totalSteps = steps.filter(step => step.required).length;
  const completedRequiredSteps = progress.completedSteps.filter(stepId => 
    steps.find(step => step.id === stepId)?.required
  ).length;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-bg-surface border-b border-border px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Welcome to Liftout, {userData?.name}!
              </h1>
              <p className="text-base text-text-secondary mt-1">
                Let's get you set up to {userData?.type === 'company' ? 'find amazing teams' : 'discover great opportunities'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-text-tertiary hover:text-text-primary transition-colors touch-target"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-bg-surface border-b border-border px-6 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-medium text-text-secondary">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-base text-text-tertiary">
                {completedRequiredSteps} of {totalSteps} required steps completed
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-navy h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="bg-bg-surface border-b border-border px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <nav className="flex space-x-4">
              {steps.map((step, index) => {
                const isCompleted = progress.completedSteps.includes(step.id);
                const isCurrent = step.id === currentStep.id;
                const isAccessible = index <= currentStepIndex || isCompleted;

                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && goToStep(step.id)}
                    disabled={!isAccessible}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isCurrent
                        ? 'bg-navy-50 text-navy border-2 border-navy/20'
                        : isCompleted
                        ? 'bg-success-light text-success-dark hover:bg-success-light/80'
                        : isAccessible
                        ? 'bg-bg-alt text-text-secondary hover:bg-bg-elevated'
                        : 'bg-bg-alt/50 text-text-tertiary cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                    {step.required && (
                      <span className="text-sm bg-error-light text-error px-1 rounded">
                        Required
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                {currentStep.title}
              </h2>
              <p className="text-text-secondary">
                {currentStep.description}
              </p>
            </div>

            {/* Step Component */}
            <div className="card p-6">
              {renderStepComponent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-bg-surface border-t border-border px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {canGoBack && (
                <button
                  onClick={goToPreviousStep}
                  className="btn-outline flex items-center space-x-2"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSkip}
                className="text-link"
              >
                Skip setup
              </button>
              {canSkipStep && (
                <button
                  onClick={handleStepComplete}
                  className="btn-outline flex items-center space-x-2"
                >
                  <span>Skip step</span>
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