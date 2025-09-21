'use client';

import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ProfileCompleteness } from '@/components/onboarding/ProfileCompleteness';
import { toast } from 'react-hot-toast';

export function DashboardOnboarding() {
  const { 
    isOnboardingRequired, 
    isOnboardingCompleted, 
    profileCompleteness,
    startOnboarding 
  } = useOnboarding();
  const [showWizard, setShowWizard] = useState(false);

  // Don't show anything if onboarding is fully completed
  if (isOnboardingCompleted && (profileCompleteness?.overall ?? 0) >= 90) {
    return null;
  }

  const handleStartOnboarding = () => {
    setShowWizard(true);
    startOnboarding();
  };

  const handleOnboardingComplete = () => {
    setShowWizard(false);
    toast.success('Welcome to Liftout! Your profile is now set up.');
  };

  const handleOnboardingSkip = () => {
    setShowWizard(false);
    toast.success('You can complete your profile anytime from your dashboard.');
  };

  return (
    <>
      {/* Profile Completeness Indicator */}
      {!isOnboardingCompleted && (
        <ProfileCompleteness 
          className="mb-6"
          showMinimal={!isOnboardingRequired}
        />
      )}

      {/* Onboarding Wizard */}
      {showWizard && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </>
  );
}