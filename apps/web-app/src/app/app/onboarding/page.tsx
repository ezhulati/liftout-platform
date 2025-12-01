'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ConversationalOnboarding } from '@/components/onboarding/ConversationalOnboarding';
import { toast } from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isOnboardingCompleted, skipOnboarding } = useOnboarding();

  useEffect(() => {
    // If onboarding is already completed, redirect to dashboard
    if (status === 'authenticated' && isOnboardingCompleted) {
      router.push('/app/dashboard');
    }
  }, [status, isOnboardingCompleted, router]);

  const handleOnboardingComplete = () => {
    toast.success('Welcome to Liftout! Your profile is ready.');
    router.push('/app/dashboard');
  };

  const handleOnboardingSkip = async () => {
    await skipOnboarding();
    toast.success('You can complete your profile anytime from Settings.');
    router.push('/app/dashboard');
  };

  // Show loading while session is being determined
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4 w-10 h-10"></div>
          <p className="text-base text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to signin if not authenticated (shouldn't happen due to AppLayout check)
  if (status === 'unauthenticated' || !session) {
    router.push('/auth/signin');
    return null;
  }

  // If onboarding completed, redirect (effect handles this, but guard just in case)
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

  return (
    <ConversationalOnboarding
      onComplete={handleOnboardingComplete}
      onSkip={handleOnboardingSkip}
    />
  );
}
