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
import { Button, Badge, Skeleton, Alert } from '@/components/ui';

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
        <div className="space-y-4 p-6">
          <Skeleton variant="text" width="200px" />
          <Skeleton variant="text" lines={3} />
        </div>
      </div>
    );
  }

  if (!matchResult) return null;

  const getScoreVariant = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent match';
    if (score >= 60) return 'Good match';
    if (score >= 40) return 'Fair match';
    return 'Poor match';
  };

  return (
    <div className="space-y-6">
      {/* Overall Match Score */}
      <div className="card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-text-primary">
                Team compatibility analysis
              </h3>
              <p className="text-sm text-text-tertiary mt-1">
                {mockTeam.name} × {mockOpportunity.title}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={getScoreVariant(matchResult.score)} size="lg">
                {matchResult.score}% {getScoreLabel(matchResult.score)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Breakdown */}
      <div className="card">
        <div className="px-6 py-4">
          <h4 className="text-md font-medium text-text-primary mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-navy" />
            Compatibility breakdown
          </h4>
          <div className="space-y-4">
            {matchResult.reasons.map((reason: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text-secondary">{reason.factor}</span>
                    <span className="text-sm text-text-tertiary">{reason.score}%</span>
                  </div>
                  <div className="w-full bg-bg-elevated rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-base ${
                        reason.score >= 80 ? 'bg-success' :
                        reason.score >= 60 ? 'bg-warning' : 'bg-error'
                      }`}
                      style={{ width: `${reason.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings */}
      {matchResult.warnings.length > 0 && (
        <div className="card border-l-4 border-warning">
          <div className="px-6 py-4">
            <h4 className="text-md font-medium text-text-primary mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-warning" />
              Areas of concern
            </h4>
            <div className="space-y-3">
              {matchResult.warnings.map((warning: any, index: number) => (
                <Alert key={index} variant="warning">
                  <p className="font-medium">{warning.description}</p>
                  <p className="mt-1 opacity-90">{warning.suggestion}</p>
                </Alert>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="card">
        <div className="px-6 py-4">
          <h4 className="text-md font-medium text-text-primary mb-4 flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2 text-gold" />
            AI-powered insights
          </h4>
          <div className="space-y-4">
            {matchResult.insights.map((insight: any, index: number) => (
              <div key={index} className="bg-bg-alt rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {insight.type === 'success_prediction' && <ArrowTrendingUpIcon className="h-5 w-5 text-success" />}
                    {insight.type === 'timeline_estimate' && <ClockIcon className="h-5 w-5 text-navy" />}
                    {insight.type === 'market_intelligence' && <ChartBarIcon className="h-5 w-5 text-gold" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-text-primary">{insight.title}</h5>
                      <span className="text-xs text-text-tertiary">{insight.confidence}% confidence</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{insight.description}</p>
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
          <h4 className="text-md font-medium text-text-primary mb-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-success" />
            Recommended next steps
          </h4>
          <div className="space-y-2">
            {matchResult.recommendedActions.map((action: string, index: number) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-success rounded-full"></div>
                </div>
                <p className="ml-3 text-sm text-text-secondary">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button variant="primary" fullWidth>
          Express interest in opportunity
        </Button>
        <Button variant="outline">
          Request more information
        </Button>
      </div>
    </div>
  );
}
