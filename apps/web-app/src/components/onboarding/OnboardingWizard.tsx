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
  const { user } = useAuth();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to Liftout, {user?.name}!
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Let's get you set up to {user?.type === 'company' ? 'find amazing teams' : 'discover great opportunities'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {completedRequiredSteps} of {totalSteps} required steps completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
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
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                        : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : isAccessible
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                    {step.required && (
                      <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStep.title}
              </h2>
              <p className="text-gray-600">
                {currentStep.description}
              </p>
            </div>

            {/* Step Component */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {renderStepComponent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {canGoBack && (
                <button
                  onClick={goToPreviousStep}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip Setup
              </button>
              {canSkipStep && (
                <button
                  onClick={handleStepComplete}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span>Skip Step</span>
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