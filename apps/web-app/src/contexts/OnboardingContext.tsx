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
  const { userData } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [profileCompleteness, setProfileCompleteness] = useState<ProfileCompleteness | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get appropriate steps based on user type
  const steps = userData?.type === 'company' ? COMPANY_ONBOARDING_STEPS : TEAM_ONBOARDING_STEPS;

  // Get current step
  const currentStep = progress ? steps.find(step => step.id === progress.currentStep) || steps[0] : null;

  // Check if onboarding is required (new user with incomplete profile)
  const isOnboardingRequired = !progress?.isCompleted && userData && !userData.verified;

  // Check if onboarding is completed
  const isOnboardingCompleted = progress?.isCompleted || false;

  // Initialize onboarding progress for new users
  useEffect(() => {
    if (userData && !isLoading) {
      initializeProgress();
    }
  }, [userData, isLoading]);

  // Load onboarding progress
  useEffect(() => {
    if (userData) {
      loadOnboardingProgress();
    }
  }, [userData]);

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

    // Calculate profile completeness based on user data
    const completeness: ProfileCompleteness = {
      overall: 0,
      sections: {
        basicInfo: 0,
        experience: 0,
        skills: 0,
        preferences: 0,
        verification: 0,
      },
      missingFields: [],
      nextRecommendedAction: '',
    };

    // Basic info (from signup)
    let basicInfoScore = 0;
    if (userData.name) basicInfoScore += 20;
    if (userData.email) basicInfoScore += 20;
    if (userData.type) basicInfoScore += 20;
    if (userData.industry) basicInfoScore += 20;
    if (userData.location) basicInfoScore += 20;
    completeness.sections.basicInfo = basicInfoScore;

    // TODO: Calculate other sections based on actual profile data
    // This would integrate with your user profile API

    // Calculate overall score
    const sectionScores = Object.values(completeness.sections);
    completeness.overall = Math.round(sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length);

    // Determine next recommended action
    if (completeness.overall < 40) {
      completeness.nextRecommendedAction = 'Complete your basic profile information';
    } else if (completeness.overall < 70) {
      completeness.nextRecommendedAction = userData.type === 'company' 
        ? 'Add company verification and post your first opportunity'
        : 'Add your skills and team information';
    } else {
      completeness.nextRecommendedAction = userData.type === 'company'
        ? 'Start browsing teams and posting opportunities'
        : 'Explore liftout opportunities and connect with companies';
    }

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

    const updatedProgress = {
      ...progress,
      completedSteps: [...progress.completedSteps, stepId],
      profileCompleteness: Math.min(progress.profileCompleteness + 15, 100),
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