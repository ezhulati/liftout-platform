'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Onboarding is disabled - redirect to dashboard
export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4 w-10 h-10"></div>
        <p className="text-base text-text-secondary">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
