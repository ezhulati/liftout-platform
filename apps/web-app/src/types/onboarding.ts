export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  required: boolean;
  completed: boolean;
  order: number;
}

export interface OnboardingProgress {
  userId: string;
  userType: 'company' | 'individual';
  currentStep: string;
  completedSteps: string[];
  isCompleted: boolean;
  completedAt?: Date;
  startedAt: Date;
  profileCompleteness: number; // 0-100
}

export interface ProfileCompleteness {
  overall: number;
  sections: {
    basicInfo: number;
    experience: number;
    skills: number;
    preferences: number;
    verification: number;
  };
  missingFields: string[];
  nextRecommendedAction: string;
}

// Company-specific onboarding steps
export const COMPANY_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'company-profile',
    title: 'Complete Company Profile',
    description: 'Set up your company information, culture, and hiring goals',
    component: 'CompanyProfileSetup',
    required: true,
    completed: false,
    order: 1,
  },
  {
    id: 'verification',
    title: 'Verify Your Company',
    description: 'Upload verification documents to build trust with teams',
    component: 'CompanyVerification',
    required: true,
    completed: false,
    order: 2,
  },
  {
    id: 'first-opportunity',
    title: 'Post Your First Opportunity',
    description: 'Create your first liftout opportunity to attract teams',
    component: 'FirstOpportunityCreation',
    required: false,
    completed: false,
    order: 3,
  },
  {
    id: 'team-discovery',
    title: 'Discover Teams',
    description: 'Learn how to search and evaluate available teams',
    component: 'TeamDiscoveryTutorial',
    required: false,
    completed: false,
    order: 4,
  },
  {
    id: 'platform-tour',
    title: 'Platform Tour',
    description: 'Explore key features and best practices',
    component: 'CompanyPlatformTour',
    required: false,
    completed: false,
    order: 5,
  },
];

// Team/Individual onboarding steps
export const TEAM_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'profile-setup',
    title: 'Create Your Profile',
    description: 'Set up your professional profile and experience',
    component: 'ProfileSetup',
    required: true,
    completed: false,
    order: 1,
  },
  {
    id: 'team-formation',
    title: 'Form or Join a Team',
    description: 'Create a new team or join an existing one',
    component: 'TeamFormation',
    required: true,
    completed: false,
    order: 2,
  },
  {
    id: 'skills-experience',
    title: 'Add Skills & Experience',
    description: 'Showcase your expertise and track record',
    component: 'SkillsExperience',
    required: true,
    completed: false,
    order: 3,
  },
  {
    id: 'liftout-preferences',
    title: 'Set Liftout Preferences',
    description: 'Define your availability and compensation expectations',
    component: 'LiftoutPreferences',
    required: true,
    completed: false,
    order: 4,
  },
  {
    id: 'opportunity-discovery',
    title: 'Explore Opportunities',
    description: 'Learn how to find and apply to liftout opportunities',
    component: 'OpportunityDiscoveryTutorial',
    required: false,
    completed: false,
    order: 5,
  },
  {
    id: 'platform-tour',
    title: 'Platform Tour',
    description: 'Discover platform features and best practices',
    component: 'TeamPlatformTour',
    required: false,
    completed: false,
    order: 6,
  },
];

export type OnboardingStepComponent = 
  | 'CompanyProfileSetup'
  | 'CompanyVerification'
  | 'FirstOpportunityCreation'
  | 'TeamDiscoveryTutorial'
  | 'CompanyPlatformTour'
  | 'ProfileSetup'
  | 'TeamFormation'
  | 'SkillsExperience'
  | 'LiftoutPreferences'
  | 'OpportunityDiscoveryTutorial'
  | 'TeamPlatformTour';