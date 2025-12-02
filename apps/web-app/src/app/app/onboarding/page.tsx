'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ConversationalOnboarding } from '@/components/onboarding/ConversationalOnboarding';
import { toast } from 'react-hot-toast';

export default function OnboardingPage() {
  const { data: session, status, update: updateSession } = useSession();
  const { isOnboardingCompleted, skipOnboarding } = useOnboarding();
  const router = useRouter();
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
    // If onboarding is already completed (DB says so), update session and redirect to dashboard
    // This handles the case where JWT has stale profileCompleted value
    if (isReady && isOnboardingCompleted && !hasRedirected.current) {
      hasRedirected.current = true;
      // Update session to match DB state, then redirect
      updateSession({ profileCompleted: true }).then(() => {
        router.push('/app/dashboard');
      });
    }
  }, [isReady, isOnboardingCompleted, router, updateSession]);

  const handleOnboardingComplete = async () => {
    // Update session to reflect profile completion
    await updateSession({ profileCompleted: true });
    toast.success('Welcome to Liftout! Your profile is ready.');
    // Use router.push to maintain session state (avoid race condition with full page reload)
    router.push('/app/dashboard');
  };

  const handleOnboardingSkip = async () => {
    await skipOnboarding();
    // Update session to reflect profile completion (skip also marks as complete)
    await updateSession({ profileCompleted: true });
    toast.success('You can complete your profile anytime from Settings.');
    // Use router.push to maintain session state (avoid race condition with full page reload)
    router.push('/app/dashboard');
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
    router.push('/auth/signin');
    return null;
  }

  // If onboarding completed, show brief loading while redirect happens
  if (isOnboardingCompleted) {
    // Trigger redirect if not already done
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/app/dashboard');
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
