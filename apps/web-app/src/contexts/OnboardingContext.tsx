'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  OnboardingProgress,
  OnboardingStep,
  ProfileCompleteness,
  COMPANY_ONBOARDING_STEPS,
  TEAM_ONBOARDING_STEPS
} from '@/types/onboarding';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface OnboardingProgressData {
  isCompleted: boolean;
  skippedAt: string | null;
  profileCompleteness: number;
  nextSteps: string[];
}

interface OnboardingContextType {
  progress: OnboardingProgress | null;
  steps: OnboardingStep[];
  currentStep: OnboardingStep | null;
  profileCompleteness: ProfileCompleteness | null;
  isOnboardingRequired: boolean;
  isOnboardingCompleted: boolean;
  startOnboarding: () => void;
  completeStep: (stepId: string) => void;
  goToStep: (stepId: string) => void;
  skipOnboarding: () => Promise<void>;
  markOnboardingComplete: () => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { userData, isIndividual, isCompany } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [progressData, setProgressData] = useState<OnboardingProgressData | null>(null);
  const [profileCompleteness, setProfileCompleteness] = useState<ProfileCompleteness | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the profile completion hook
  const profileCompletionData = useProfileCompletion({
    threshold: 80,
    autoUpdate: true,
  });

  // Get appropriate steps based on user type
  const steps = userData?.type === 'company' ? COMPANY_ONBOARDING_STEPS : TEAM_ONBOARDING_STEPS;

  // Get current step
  const currentStep = progress ? steps.find(step => step.id === progress.currentStep) || steps[0] : null;

  // Consider onboarding complete if fetched from database
  const isOnboardingCompleted = Boolean(progressData?.isCompleted);

  // Require onboarding only when not completed and user exists
  const isOnboardingRequired = Boolean(!isOnboardingCompleted && userData && !isLoading);

  // Fetch onboarding progress from database API
  const fetchOnboardingProgress = useCallback(async () => {
    if (!userData) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding/progress');
      if (response.ok) {
        const data: OnboardingProgressData = await response.json();
        setProgressData(data);

        // Update local progress state
        setProgress({
          userId: userData.id,
          userType: userData.type,
          currentStep: steps[0]?.id || '',
          completedSteps: data.isCompleted ? steps.map(s => s.id) : [],
          isCompleted: data.isCompleted,
          startedAt: new Date(),
          profileCompleteness: data.profileCompleteness,
        });

        // Update profile completeness from API
        setProfileCompleteness({
          overall: data.profileCompleteness,
          sections: {
            basicInfo: data.profileCompleteness > 25 ? 100 : data.profileCompleteness * 4,
            experience: data.profileCompleteness > 50 ? 100 : Math.max(0, (data.profileCompleteness - 25) * 4),
            skills: data.profileCompleteness > 75 ? 100 : Math.max(0, (data.profileCompleteness - 50) * 4),
            preferences: data.profileCompleteness === 100 ? 100 : Math.max(0, (data.profileCompleteness - 75) * 4),
            verification: data.isCompleted ? 100 : 0,
          },
          missingFields: data.nextSteps,
          nextRecommendedAction: data.nextSteps[0] || 'Complete your profile to get started',
        });
      }
    } catch (error) {
      console.error('Failed to fetch onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData, steps]);

  // Load onboarding progress on mount
  useEffect(() => {
    if (userData) {
      fetchOnboardingProgress();
    }
  }, [userData, fetchOnboardingProgress]);

  // Update profile completeness when profile completion data changes
  useEffect(() => {
    if (userData && profileCompletionData.score > 0) {
      calculateProfileCompleteness();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, profileCompletionData.score, profileCompletionData.completionData.breakdown, profileCompletionData.nextSteps]);

  const calculateProfileCompleteness = async () => {
    if (!userData) return;

    // Use the profile completion hook data and convert to the onboarding format
    const completeness: ProfileCompleteness = {
      overall: profileCompletionData.score,
      sections: {
        basicInfo: profileCompletionData.completionData.breakdown.basic || 0,
        experience: profileCompletionData.completionData.breakdown.professional || profileCompletionData.completionData.breakdown.experience || 0,
        skills: profileCompletionData.completionData.breakdown.skills || 0,
        preferences: profileCompletionData.completionData.breakdown.preferences || profileCompletionData.completionData.breakdown.hiring || 0,
        verification: progressData?.isCompleted ? 100 : 0,
      },
      missingFields: profileCompletionData.missingRequired,
      nextRecommendedAction: profileCompletionData.nextSteps[0] || 'Complete your profile to get started',
    };

    setProfileCompleteness(completeness);
  };

  const startOnboarding = () => {
    if (!userData || !steps.length) return;

    const newProgress: OnboardingProgress = {
      userId: userData.id,
      userType: userData.type,
      currentStep: steps[0].id,
      completedSteps: [],
      isCompleted: false,
      startedAt: new Date(),
      profileCompleteness: 20,
    };

    setProgress(newProgress);
  };

  const completeStep = async (stepId: string) => {
    if (!progress || !userData) return;

    // Recalculate profile completion after step completion
    profileCompletionData.recalculate();

    const updatedProgress = {
      ...progress,
      completedSteps: [...progress.completedSteps, stepId],
      profileCompleteness: profileCompletionData.score,
    };

    // Find next incomplete step
    const nextStep = steps.find(step =>
      !updatedProgress.completedSteps.includes(step.id) &&
      step.order > (steps.find(s => s.id === stepId)?.order || 0)
    );

    if (nextStep) {
      updatedProgress.currentStep = nextStep.id;
    } else {
      // All steps completed
      updatedProgress.isCompleted = true;
      updatedProgress.completedAt = new Date();
      updatedProgress.currentStep = '';
    }

    setProgress(updatedProgress);
    await calculateProfileCompleteness();
  };

  const goToStep = async (stepId: string) => {
    if (!progress || !userData) return;

    const updatedProgress = {
      ...progress,
      currentStep: stepId,
    };

    setProgress(updatedProgress);
  };

  // Mark onboarding as complete via API
  const markOnboardingComplete = async () => {
    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      });

      if (response.ok) {
        setProgressData(prev => prev ? { ...prev, isCompleted: true } : null);
        if (progress) {
          setProgress({
            ...progress,
            isCompleted: true,
            completedAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Failed to mark onboarding complete:', error);
    }
  };

  // Skip onboarding via API
  const skipOnboarding = async () => {
    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'skip' }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgressData(prev => prev ? { ...prev, skippedAt: data.skippedAt } : null);
        // Note: skipping doesn't complete onboarding, just records the skip
      }
    } catch (error) {
      console.error('Failed to skip onboarding:', error);
    }
  };

  const refreshProgress = async () => {
    await fetchOnboardingProgress();
  };

  const value: OnboardingContextType = {
    progress,
    steps,
    currentStep,
    profileCompleteness,
    isOnboardingRequired,
    isOnboardingCompleted,
    startOnboarding,
    completeStep,
    goToStep,
    skipOnboarding,
    markOnboardingComplete,
    refreshProgress,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
