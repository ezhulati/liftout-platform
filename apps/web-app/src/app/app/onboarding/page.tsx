'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  const router = useRouter();
  const { isOnboardingCompleted, isOnboardingRequired } = useOnboarding();

  // Redirect to dashboard if onboarding is already completed
  useEffect(() => {
    if (isOnboardingCompleted) {
      router.replace('/app/dashboard');
    }
  }, [isOnboardingCompleted, router]);

  const handleComplete = () => {
    router.push('/app/dashboard');
  };

  const handleSkip = () => {
    router.push('/app/dashboard');
  };

  // Show loading state while checking onboarding status
  if (!isOnboardingRequired && !isOnboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4 w-10 h-10"></div>
          <p className="text-base text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // If completed, show loading while redirecting
  if (isOnboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4 w-10 h-10"></div>
          <p className="text-base text-text-secondary">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <OnboardingWizard onComplete={handleComplete} onSkip={handleSkip} />;
}
