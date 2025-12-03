'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isOnboardingCompleted } = useOnboarding();

  const handleComplete = () => {
    router.push('/app/dashboard');
  };

  const handleSkip = () => {
    router.push('/app/dashboard');
  };

  // Show loading while session loads
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

  // If already completed, show option to go to dashboard or redo onboarding
  if (isOnboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Onboarding Complete</h1>
          <p className="text-base text-text-secondary mb-6">
            You&apos;ve already completed the onboarding process. Would you like to go through it again or head to your dashboard?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/app/dashboard')}
              className="btn-primary min-h-12 px-6"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline min-h-12 px-6"
            >
              Restart Onboarding
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <OnboardingWizard onComplete={handleComplete} onSkip={handleSkip} />;
}
