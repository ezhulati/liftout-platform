'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ConversationalOnboarding } from '@/components/onboarding/ConversationalOnboarding';
import { toast } from 'react-hot-toast';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const { isOnboardingCompleted, skipOnboarding } = useOnboarding();
  const hasRedirected = useRef(false);
  const [isReady, setIsReady] = useState(false);

  // Wait for both session and onboarding status to be determined
  useEffect(() => {
    if (status === 'authenticated') {
      // Give OnboardingContext time to fetch from API
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    // If onboarding is already completed, redirect to dashboard
    if (isReady && isOnboardingCompleted && !hasRedirected.current) {
      hasRedirected.current = true;
      window.location.href = '/app/dashboard';
    }
  }, [isReady, isOnboardingCompleted]);

  const handleOnboardingComplete = () => {
    toast.success('Welcome to Liftout! Your profile is ready.');
    window.location.href = '/app/dashboard';
  };

  const handleOnboardingSkip = async () => {
    await skipOnboarding();
    toast.success('You can complete your profile anytime from Settings.');
    window.location.href = '/app/dashboard';
  };

  // Show loading while session is being determined
  if (status === 'loading' || !isReady) {
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
    window.location.href = '/auth/signin';
    return null;
  }

  // If onboarding completed, show brief loading while redirect happens
  if (isOnboardingCompleted) {
    // Trigger redirect if not already done
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      window.location.href = '/app/dashboard';
    }
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
