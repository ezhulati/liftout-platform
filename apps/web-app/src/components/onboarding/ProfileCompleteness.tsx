'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ProfileCompletenessProps {
  className?: string;
  showMinimal?: boolean;
}

export function ProfileCompleteness({ className = '', showMinimal = false }: ProfileCompletenessProps) {
  const { user } = useAuth();
  const { profileCompleteness, progress, isOnboardingCompleted, startOnboarding } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!profileCompleteness || !user) {
    return null;
  }

  const { overall, sections, missingFields, nextRecommendedAction } = profileCompleteness;

  // Don't show if profile is complete or onboarding is done
  if (overall >= 90 || isOnboardingCompleted) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (showMinimal) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {overall >= 70 ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                Profile {overall}% complete
              </p>
              <p className="text-xs text-gray-500">{nextRecommendedAction}</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {isExpanded ? 'Hide' : 'View'} Details
          </button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ProfileCompletenessDetails 
              sections={sections}
              overall={overall}
              nextRecommendedAction={nextRecommendedAction}
              onStartOnboarding={startOnboarding}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Complete Your Profile
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            A complete profile helps {user.type === 'company' ? 'teams understand your company' : 'companies find your team'} and improves your chances of successful matches.
          </p>

          {/* Overall Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className={`text-sm font-bold ${getScoreColor(overall)}`}>
                {overall}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(overall)}`}
                style={{ width: `${overall}%` }}
              />
            </div>
          </div>

          <ProfileCompletenessDetails 
            sections={sections}
            overall={overall}
            nextRecommendedAction={nextRecommendedAction}
            onStartOnboarding={startOnboarding}
          />
        </div>

        <button
          onClick={() => setIsExpanded(false)}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

interface ProfileCompletenessDetailsProps {
  sections: {
    basicInfo: number;
    experience: number;
    skills: number;
    preferences: number;
    verification: number;
  };
  overall: number;
  nextRecommendedAction: string;
  onStartOnboarding: () => void;
}

function ProfileCompletenessDetails({ 
  sections, 
  overall, 
  nextRecommendedAction, 
  onStartOnboarding 
}: ProfileCompletenessDetailsProps) {
  const getSectionIcon = (score: number) => {
    return score >= 80 ? (
      <CheckCircleIcon className="h-4 w-4 text-green-500" />
    ) : (
      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    );
  };

  const sectionNames = {
    basicInfo: 'Basic Information',
    experience: 'Experience',
    skills: 'Skills & Technologies',
    preferences: 'Preferences',
    verification: 'Verification',
  };

  return (
    <div className="space-y-4">
      {/* Section Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(sections).map(([key, score]) => (
          <div key={key} className="flex items-center space-x-3">
            {getSectionIcon(score)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {sectionNames[key as keyof typeof sectionNames]}
                </span>
                <span className="text-xs text-gray-500">{score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Action */}
      <div className="bg-white bg-opacity-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Recommended Next Step
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          {nextRecommendedAction}
        </p>
        <button
          onClick={onStartOnboarding}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 border border-primary-200 rounded-lg hover:bg-primary-200 transition-colors"
        >
          Continue Setup
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}