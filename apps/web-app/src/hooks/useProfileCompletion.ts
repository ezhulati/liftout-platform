import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  calculateIndividualProfileCompleteness,
  calculateCompanyProfileCompleteness,
  ProfileCompletenessWeights,
  DEFAULT_INDIVIDUAL_WEIGHTS,
  DEFAULT_COMPANY_WEIGHTS,
} from '@/lib/profile-validation';

export interface ProfileCompletionData {
  score: number;
  breakdown: Record<string, number>;
  recommendations: string[];
  isComplete: boolean;
  completionLevel: 'incomplete' | 'basic' | 'good' | 'excellent';
  missingRequired: string[];
  nextSteps: string[];
}

export interface UseProfileCompletionOptions {
  weights?: ProfileCompletenessWeights | typeof DEFAULT_COMPANY_WEIGHTS;
  threshold?: number; // Minimum score to consider "complete" (default: 80)
  autoUpdate?: boolean; // Whether to automatically recalculate on profile changes
}

export function useProfileCompletion(options: UseProfileCompletionOptions = {}) {
  const { user, isIndividual, isCompany } = useAuth();
  const {
    threshold = 80,
    autoUpdate = true,
  } = options;

  const [completionData, setCompletionData] = useState<ProfileCompletionData>({
    score: 0,
    breakdown: {},
    recommendations: [],
    isComplete: false,
    completionLevel: 'incomplete',
    missingRequired: [],
    nextSteps: [],
  });

  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate profile completion
  const calculateCompletion = useMemo(() => {
    return (profileData?: any) => {
      if (!user) return completionData;

      setIsCalculating(true);

      try {
        const profile = profileData || user.profileData || {};
        let result;

        if (isIndividual) {
          result = calculateIndividualProfileCompleteness(
            {
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ')[1] || '',
              location: user.location || '',
              phone: user.phone || '',
              currentCompany: user.companyName || '',
              currentPosition: user.position || '',
              industry: user.industry || '',
              ...profile,
            },
            options.weights as ProfileCompletenessWeights
          );
        } else if (isCompany) {
          result = calculateCompanyProfileCompleteness(
            {
              companyName: user.companyName || '',
              contactEmail: user.email || '',
              contactPhone: user.phone || '',
              headquarters: user.location || '',
              industry: user.industry || '',
              ...profile,
            },
            options.weights as typeof DEFAULT_COMPANY_WEIGHTS
          );
        } else {
          return completionData;
        }

        // Determine completion level
        let completionLevel: ProfileCompletionData['completionLevel'] = 'incomplete';
        if (result.score >= 90) completionLevel = 'excellent';
        else if (result.score >= 70) completionLevel = 'good';
        else if (result.score >= 40) completionLevel = 'basic';

        // Generate next steps based on lowest scoring sections
        const nextSteps = generateNextSteps(result.breakdown, result.recommendations, isIndividual);

        // Identify missing required fields
        const missingRequired = identifyMissingRequiredFields(profile, isIndividual);

        const newCompletionData: ProfileCompletionData = {
          score: result.score,
          breakdown: result.breakdown,
          recommendations: result.recommendations,
          isComplete: result.score >= threshold,
          completionLevel,
          missingRequired,
          nextSteps,
        };

        setCompletionData(newCompletionData);
        return newCompletionData;
      } catch (error) {
        console.error('Error calculating profile completion:', error);
        return completionData;
      } finally {
        setIsCalculating(false);
      }
    };
  }, [user, isIndividual, isCompany, threshold, options.weights, completionData]);

  // Auto-update when user profile changes
  useEffect(() => {
    if (autoUpdate && user) {
      calculateCompletion();
    }
  }, [user?.profileData, autoUpdate, calculateCompletion]);

  // Manual recalculation
  const recalculate = (profileData?: any) => {
    return calculateCompletion(profileData);
  };

  // Get completion status for specific section
  const getSectionCompletion = (sectionName: string) => {
    return {
      score: completionData.breakdown[sectionName] || 0,
      isComplete: (completionData.breakdown[sectionName] || 0) >= threshold,
    };
  };

  // Get priority improvements (lowest scoring sections)
  const getPriorityImprovements = (limit: number = 3) => {
    const sections = Object.entries(completionData.breakdown)
      .sort(([, a], [, b]) => a - b)
      .slice(0, limit);

    return sections.map(([section, score]) => ({
      section,
      score,
      improvement: getSectionImprovementTips(section, isIndividual),
    }));
  };

  // Check if specific requirements are met
  const checkRequirements = () => {
    if (!user) return { allMet: false, missing: [] };

    const requirements = isIndividual 
      ? ['firstName', 'lastName', 'location', 'currentCompany', 'currentPosition', 'industry']
      : ['companyName', 'description', 'industry', 'companySize', 'website'];

    const missing = requirements.filter(req => {
      const profile = user.profileData || {};
      const value = req.includes('.') 
        ? req.split('.').reduce((obj, key) => obj?.[key], profile)
        : profile[req] || user[req as keyof typeof user];
      return !value;
    });

    return {
      allMet: missing.length === 0,
      missing,
    };
  };

  // Get completion badge/status
  const getCompletionBadge = () => {
    const { score, completionLevel } = completionData;
    
    const badges = {
      incomplete: { text: 'Incomplete', color: 'red', icon: '⚠️' },
      basic: { text: 'Basic', color: 'yellow', icon: '🔄' },
      good: { text: 'Good', color: 'blue', icon: '👍' },
      excellent: { text: 'Excellent', color: 'green', icon: '⭐' },
    };

    return {
      ...badges[completionLevel],
      score,
      percentage: `${score}%`,
    };
  };

  return {
    // Core data
    completionData,
    isCalculating,
    
    // Actions
    recalculate,
    
    // Helpers
    getSectionCompletion,
    getPriorityImprovements,
    checkRequirements,
    getCompletionBadge,
    
    // Convenience getters
    score: completionData.score,
    isComplete: completionData.isComplete,
    completionLevel: completionData.completionLevel,
    recommendations: completionData.recommendations,
    nextSteps: completionData.nextSteps,
    missingRequired: completionData.missingRequired,
  };
}

// Helper functions
function generateNextSteps(
  breakdown: Record<string, number>,
  recommendations: string[],
  isIndividual: boolean
): string[] {
  const steps: string[] = [];
  
  // Sort sections by lowest score first
  const sortedSections = Object.entries(breakdown)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3);

  sortedSections.forEach(([section, score]) => {
    if (score < 80) {
      const tip = getSectionImprovementTips(section, isIndividual);
      if (tip) steps.push(tip);
    }
  });

  // Add general recommendations
  recommendations.slice(0, 2).forEach(rec => {
    if (!steps.includes(rec)) {
      steps.push(rec);
    }
  });

  return steps.slice(0, 5); // Limit to 5 next steps
}

function getSectionImprovementTips(section: string, isIndividual: boolean): string {
  const individualTips: Record<string, string> = {
    basic: 'Complete your basic profile information (name, location, contact)',
    professional: 'Add your current company, position, and years of experience',
    skills: 'List your key skills with proficiency levels',
    experience: 'Add your work history and achievements',
    portfolio: 'Showcase your best projects and work samples',
    preferences: 'Set your career preferences and availability',
  };

  const companyTips: Record<string, string> = {
    basic: 'Complete company information (name, description, industry)',
    culture: 'Define your mission, vision, and company values',
    team: 'Introduce your leadership team and key personnel',
    benefits: 'List employee benefits and company perks',
    offices: 'Add your office locations and details',
    achievements: 'Highlight company awards and milestones',
    hiring: 'Set preferences for team hiring and liftouts',
  };

  const tips = isIndividual ? individualTips : companyTips;
  return tips[section] || 'Complete this section for a better profile';
}

function identifyMissingRequiredFields(profile: any, isIndividual: boolean): string[] {
  const missing: string[] = [];

  if (isIndividual) {
    const required = [
      { field: 'firstName', label: 'First Name' },
      { field: 'lastName', label: 'Last Name' },
      { field: 'location', label: 'Location' },
      { field: 'currentCompany', label: 'Current Company' },
      { field: 'currentPosition', label: 'Current Position' },
      { field: 'industry', label: 'Industry' },
    ];

    required.forEach(({ field, label }) => {
      if (!profile[field]) {
        missing.push(label);
      }
    });

    if (!profile.skills || profile.skills.length === 0) {
      missing.push('Skills');
    }

    if (!profile.experiences || profile.experiences.length === 0) {
      missing.push('Work Experience');
    }
  } else {
    const required = [
      { field: 'companyName', label: 'Company Name' },
      { field: 'description', label: 'Company Description' },
      { field: 'industry', label: 'Industry' },
      { field: 'companySize', label: 'Company Size' },
      { field: 'website', label: 'Website' },
      { field: 'mission', label: 'Mission Statement' },
      { field: 'vision', label: 'Vision Statement' },
    ];

    required.forEach(({ field, label }) => {
      if (!profile[field]) {
        missing.push(label);
      }
    });

    if (!profile.values || profile.values.length < 3) {
      missing.push('Company Values (minimum 3)');
    }

    if (!profile.offices || profile.offices.length === 0) {
      missing.push('Office Locations');
    }
  }

  return missing;
}

// Convenience hook for individual profiles
export function useIndividualProfileCompletion(options?: UseProfileCompletionOptions) {
  const { isIndividual } = useAuth();
  const completion = useProfileCompletion({
    ...options,
    weights: options?.weights || DEFAULT_INDIVIDUAL_WEIGHTS,
  });

  if (!isIndividual) {
    console.warn('useIndividualProfileCompletion used for non-individual user');
  }

  return completion;
}

// Convenience hook for company profiles
export function useCompanyProfileCompletion(options?: UseProfileCompletionOptions) {
  const { isCompany } = useAuth();
  const completion = useProfileCompletion({
    ...options,
    weights: options?.weights || DEFAULT_COMPANY_WEIGHTS,
  });

  if (!isCompany) {
    console.warn('useCompanyProfileCompletion used for non-company user');
  }

  return completion;
}