'use client';

import { useState, useEffect } from 'react';
import { calculateTeamOpportunityMatch, getTopMatches } from '@/lib/matching';
import {
  ChartBarIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

// Mock data for demonstration
const mockTeam = {
  id: '1',
  name: 'Strategic Analytics Core',
  industry: 'Financial Services',
  specialization: 'Quantitative Risk Management',
  size: 5,
  location: 'New York, NY',
  remoteStatus: 'hybrid' as const,
  yearsWorkingTogether: 3.5,
  trackRecord: 'Led $2B risk assessment for major investment bank, developed proprietary ML models for credit risk, 99.2% accuracy on fraud detection systems',
  liftoutExperience: 'experienced' as const,
  currentEmployer: 'Goldman Sachs',
  availabilityTimeline: 'medium_term',
  compensationExpectation: {
    min: 200000,
    max: 280000,
    currency: 'USD',
  },
  skills: ['Quantitative Finance', 'Risk Management', 'Python', 'Machine Learning', 'Financial Modeling'],
  successfulLiftouts: 1,
};

const mockOpportunity = {
  id: '1',
  title: 'Healthcare AI Innovation Team',
  industry: 'Healthcare Technology',
  location: 'Boston, MA',
  workStyle: 'hybrid' as const,
  compensation: {
    min: 220000,
    max: 300000,
    currency: 'USD',
    type: 'total_package' as const,
  },
  commitment: {
    duration: 'Permanent',
    startDate: 'Q2 2025',
  },
  teamSize: {
    min: 4,
    max: 7,
  },
  skills: ['Machine Learning', 'Computer Vision', 'Python', 'Healthcare AI', 'Data Science'],
  liftoutType: 'capability_building' as const,
  confidential: false,
  company: {
    name: 'MedTech Innovations',
  },
};

export function MatchingInsights() {
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const result = calculateTeamOpportunityMatch(mockTeam, mockOpportunity);
      setMatchResult(result);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!matchResult) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className="space-y-6">
      {/* Overall Match Score */}
      <div className="card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Team Compatibility Analysis
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {mockTeam.name} × {mockOpportunity.title}
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(matchResult.score)}`}>
                {matchResult.score}% {getScoreLabel(matchResult.score)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Breakdown */}
      <div className="card">
        <div className="px-6 py-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
            Compatibility Breakdown
          </h4>
          <div className="space-y-4">
            {matchResult.reasons.map((reason: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{reason.factor}</span>
                    <span className="text-sm text-gray-500">{reason.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        reason.score >= 80 ? 'bg-green-500' :
                        reason.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${reason.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings */}
      {matchResult.warnings.length > 0 && (
        <div className="card border-l-4 border-yellow-400">
          <div className="px-6 py-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Areas of Concern
            </h4>
            <div className="space-y-3">
              {matchResult.warnings.map((warning: any, index: number) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-800">{warning.description}</p>
                      <p className="text-sm text-yellow-700 mt-1">{warning.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="card">
        <div className="px-6 py-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2 text-purple-500" />
            AI-Powered Insights
          </h4>
          <div className="space-y-4">
            {matchResult.insights.map((insight: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {insight.type === 'success_prediction' && <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />}
                    {insight.type === 'timeline_estimate' && <ClockIcon className="h-5 w-5 text-blue-500" />}
                    {insight.type === 'market_intelligence' && <ChartBarIcon className="h-5 w-5 text-purple-500" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-900">{insight.title}</h5>
                      <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="card">
        <div className="px-6 py-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
            Recommended Next Steps
          </h4>
          <div className="space-y-2">
            {matchResult.recommendedActions.map((action: string, index: number) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="ml-3 text-sm text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button className="btn-primary flex-1">
          Express Interest in Opportunity
        </button>
        <button className="btn-secondary">
          Request More Information
        </button>
      </div>
    </div>
  );
}