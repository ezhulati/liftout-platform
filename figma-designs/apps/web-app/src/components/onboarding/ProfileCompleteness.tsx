'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import Link from 'next/link';

interface ProfileCompletenessProps {
  className?: string;
  showMinimal?: boolean;
}

export function ProfileCompleteness({ className = '', showMinimal = false }: ProfileCompletenessProps) {
  const { userData, isIndividual, isCompany } = useAuth();
  const { progress, isOnboardingCompleted, startOnboarding } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Use the profile completion hook directly for real-time data
  const completion = useProfileCompletion({
    threshold: 80,
    autoUpdate: true,
  });

  if (!userData || !completion.score) {
    return null;
  }

  // Don't show if profile is complete or onboarding is done
  if (completion.score >= 90 || isOnboardingCompleted) {
    return null;
  }

  const nextRecommendedAction = completion.nextSteps[0] || 'Complete your profile to get started';

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-gold';
    return 'text-error';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-gold';
    return 'bg-error';
  };

  if (showMinimal) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {completion.score >= 70 ? (
              <CheckCircleIcon className="h-5 w-5 text-success" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-gold" />
            )}
            <div>
              <p className="text-base font-medium text-text-primary">
                Profile {completion.score}% complete
              </p>
              <p className="text-sm text-text-tertiary">{nextRecommendedAction}</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 hover:text-primary-700 text-base font-medium transition-colors duration-fast touch-target"
          >
            {isExpanded ? 'Hide' : 'View'} details
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <ProfileCompletenessDetails
              completion={completion}
              nextRecommendedAction={nextRecommendedAction}
              onStartOnboarding={startOnboarding}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-primary-50 to-navy-50 border border-primary-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Complete your profile
          </h3>
          <p className="text-base text-text-secondary mb-4">
            A complete profile helps {userData.type === 'company' ? 'teams understand your company' : 'companies find your team'} and improves your chances of successful matches.
          </p>

          {/* Overall Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-medium text-text-secondary">Overall progress</span>
              <span className={`text-base font-bold ${getScoreColor(completion.score)}`}>
                {completion.score}%
              </span>
            </div>
            <div className="w-full bg-bg-alt rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(completion.score)}`}
                style={{ width: `${completion.score}%` }}
              />
            </div>
          </div>

          <ProfileCompletenessDetails
            completion={completion}
            nextRecommendedAction={nextRecommendedAction}
            onStartOnboarding={startOnboarding}
          />
        </div>

        <button
          onClick={() => setIsExpanded(false)}
          className="ml-4 text-text-tertiary hover:text-text-secondary transition-colors duration-fast touch-target"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

interface ProfileCompletenessDetailsProps {
  completion: {
    completionData: {
      score: number;
      breakdown: Record<string, number>;
      recommendations: string[];
      nextSteps: string[];
      missingRequired: string[];
      isComplete: boolean;
      completionLevel: 'incomplete' | 'basic' | 'good' | 'excellent';
    };
    score: number;
    getPriorityImprovements: (limit?: number) => Array<{
      section: string;
      score: number;
      improvement: string;
    }>;
    getCompletionBadge: () => {
      text: string;
      color: string;
      icon: string;
      score: number;
      percentage: string;
    };
    nextSteps: string[];
    missingRequired: string[];
  };
  nextRecommendedAction: string;
  onStartOnboarding: () => void;
}

function ProfileCompletenessDetails({ 
  completion, 
  nextRecommendedAction, 
  onStartOnboarding 
}: ProfileCompletenessDetailsProps) {
  const getSectionIcon = (score: number) => {
    return score >= 80 ? (
      <CheckCircleIcon className="h-4 w-4 text-success" />
    ) : (
      <div className="h-4 w-4 rounded-full border-2 border-border" />
    );
  };

  const priorityImprovements = completion.getPriorityImprovements(5);
  const badge = completion.getCompletionBadge();

  return (
    <div className="space-y-4">
      {/* Completion Badge */}
      <div className="flex items-center space-x-3 p-3 bg-bg-surface bg-opacity-60 rounded-lg">
        <span className="text-2xl">{badge.icon}</span>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-medium text-text-primary">{badge.text} profile</span>
            <span className={`text-sm px-2 py-1 rounded-full ${
              badge.color === 'green' ? 'bg-success-light text-success-dark' :
              badge.color === 'blue' ? 'bg-navy-50 text-navy-800' :
              badge.color === 'yellow' ? 'bg-gold-100 text-gold-800' :
              'bg-error-light text-error-dark'
            }`}>
              {badge.percentage}
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            {completion.missingRequired.length > 0
              ? `Missing: ${completion.missingRequired.slice(0, 3).join(', ')}${completion.missingRequired.length > 3 ? '...' : ''}`
              : 'All required fields completed'
            }
          </p>
        </div>
      </div>

      {/* Priority Improvements */}
      {priorityImprovements.length > 0 && (
        <div>
          <h4 className="text-base font-medium text-text-primary mb-3 flex items-center">
            <SparklesIcon className="h-4 w-4 mr-2 text-primary-500" />
            Priority improvements
          </h4>
          <div className="space-y-2">
            {priorityImprovements.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 bg-bg-surface bg-opacity-40 rounded">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base text-text-secondary">{item.improvement}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-text-tertiary capitalize">{item.section}</span>
                    <span className="text-sm text-text-tertiary">{item.score}% complete</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Action */}
      <div className="bg-bg-surface bg-opacity-50 rounded-lg p-4">
        <h4 className="text-base font-medium text-text-primary mb-2">
          Recommended next step
        </h4>
        <p className="text-base text-text-secondary mb-3">
          {nextRecommendedAction}
        </p>
        <Link
          href="/app/profile"
          className="inline-flex items-center px-4 py-2 text-base font-medium text-primary-700 bg-primary-100 border border-primary-200 rounded-lg hover:bg-primary-200 transition-colors duration-fast"
        >
          Continue setup
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}