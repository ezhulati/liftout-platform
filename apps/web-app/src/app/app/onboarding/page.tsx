'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationalOnboarding } from '@/components/onboarding/ConversationalOnboarding';
import { toast } from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { userData: user } = useAuth();
  const { isOnboardingCompleted, skipOnboarding } = useOnboarding();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(false);

      // If onboarding is already completed, redirect to dashboard
      if (isOnboardingCompleted) {
        router.push('/app/dashboard');
        return;
      }
    }
  }, [user, isOnboardingCompleted, router]);

  const handleOnboardingComplete = () => {
    toast.success('Welcome to Liftout! Your profile is ready.');
    router.push('/app/dashboard');
  };

  const handleOnboardingSkip = async () => {
    await skipOnboarding();
    toast.success('You can complete your profile anytime from Settings.');
    router.push('/app/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4 w-10 h-10"></div>
          <p className="text-base text-text-secondary">Loading...</p>
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
    <ConversationalOnboarding
      onComplete={handleOnboardingComplete}
      onSkip={handleOnboardingSkip}
    />
  );
}
