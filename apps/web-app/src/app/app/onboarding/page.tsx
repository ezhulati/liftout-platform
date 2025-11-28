'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { toast } from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { userData: user } = useAuth();
  const { isOnboardingCompleted, isOnboardingRequired, startOnboarding } = useOnboarding();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      
      // If onboarding is already completed, redirect to dashboard
      if (isOnboardingCompleted) {
        router.push('/app/dashboard');
        return;
      }
      
      // Start onboarding for new users
      if (isOnboardingRequired) {
        startOnboarding();
      }
    }
  }, [user, isOnboardingCompleted, isOnboardingRequired, startOnboarding, router]);

  const handleOnboardingComplete = () => {
    toast.success('Welcome to Liftout! Your profile is now set up.');
    router.push('/app/dashboard');
  };

  const handleOnboardingSkip = () => {
    toast.success('You can complete your profile anytime from your dashboard.');
    router.push('/app/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-base text-text-secondary">Loading your onboarding experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  if (isOnboardingCompleted) {
    router.push('/app/dashboard');
    return null;
  }

  return (
    <OnboardingWizard
      onComplete={handleOnboardingComplete}
      onSkip={handleOnboardingSkip}
    />
  );
}