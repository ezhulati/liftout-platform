'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  OnboardingProgress, 
  OnboardingStep, 
  ProfileCompleteness,
  COMPANY_ONBOARDING_STEPS,
  TEAM_ONBOARDING_STEPS 
} from '@/types/onboarding';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

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
  skipOnboarding: () => void;
  refreshProgress: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { userData, isIndividual, isCompany } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
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

  // Consider onboarding complete if progress is complete or the user is already verified
  const isOnboardingCompleted = Boolean(progress?.isCompleted || userData?.verified);

  // Require onboarding only when not completed
  const isOnboardingRequired = Boolean(!isOnboardingCompleted && userData);

  // Initialize onboarding progress for new users
  useEffect(() => {
    if (userData && !isLoading) {
      initializeProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, isLoading]);

  // Load onboarding progress
  useEffect(() => {
    if (userData) {
      loadOnboardingProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  // Update profile completeness when profile completion data changes
  useEffect(() => {
    if (userData && profileCompletionData.score > 0) {
      calculateProfileCompleteness();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, profileCompletionData.score, profileCompletionData.completionData.breakdown, profileCompletionData.nextSteps]);

  const initializeProgress = async () => {
    if (!userData) return;

    // Check if user already has onboarding progress
    const existingProgress = await loadOnboardingProgressFromStorage();
    if (existingProgress) {
      setProgress(existingProgress);
      return;
    }

    // Create new progress for first-time users
    const newProgress: OnboardingProgress = {
      userId: userData.id,
      userType: userData.type,
      currentStep: steps[0]?.id || '',
      completedSteps: [],
      isCompleted: false,
      startedAt: new Date(),
      profileCompleteness: 20, // Basic info from signup
    };

    setProgress(newProgress);
    await saveOnboardingProgress(newProgress);
    await calculateProfileCompleteness();
  };

  const loadOnboardingProgress = async () => {
    setIsLoading(true);
    try {
      const savedProgress = await loadOnboardingProgressFromStorage();
      if (savedProgress) {
        setProgress(savedProgress);
      }
      await calculateProfileCompleteness();
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOnboardingProgressFromStorage = async (): Promise<OnboardingProgress | null> => {
    if (!userData) return null;
    
    // In a real app, this would fetch from your API/database
    // For now, use localStorage as a demo
    try {
      const stored = localStorage.getItem(`onboarding_${userData.id}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const saveOnboardingProgress = async (newProgress: OnboardingProgress) => {
    if (!userData) return;
    
    // In a real app, this would save to your API/database
    // For now, use localStorage as a demo
    localStorage.setItem(`onboarding_${userData.id}`, JSON.stringify(newProgress));
    setProgress(newProgress);
  };

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
        verification: userData.verified ? 100 : 0,
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

    saveOnboardingProgress(newProgress);
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

    await saveOnboardingProgress(updatedProgress);
    await calculateProfileCompleteness();
  };

  const goToStep = async (stepId: string) => {
    if (!progress || !userData) return;

    const updatedProgress = {
      ...progress,
      currentStep: stepId,
    };

    await saveOnboardingProgress(updatedProgress);
  };

  const skipOnboarding = async () => {
    if (!progress || !userData) return;

    const updatedProgress = {
      ...progress,
      isCompleted: true,
      completedAt: new Date(),
      currentStep: '',
    };

    await saveOnboardingProgress(updatedProgress);
  };

  const refreshProgress = async () => {
    await loadOnboardingProgress();
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
