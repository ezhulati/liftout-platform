'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { matchingService } from '@/lib/services/matchingService';
import {
  ChartBarIcon,
  StarIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  TrophyIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { Button, Badge, EmptyState, Skeleton } from '@/components/ui';
import type { TeamOpportunityMatch, MatchingFilters } from '@/lib/services/matchingService';

interface MatchingDashboardProps {
  entityId: string; // Team ID or Company ID
  entityType: 'team' | 'company';
}

const recommendationColors = {
  excellent: 'success',
  good: 'info',
  fair: 'warning',
  poor: 'error',
} as const;

const recommendationIcons = {
  excellent: TrophyIcon,
  good: CheckCircleIcon,
  fair: ExclamationTriangleIcon,
  poor: ExclamationTriangleIcon,
};

export function MatchingDashboard({ entityId, entityType }: MatchingDashboardProps) {
  const { userData } = useAuth();
  const [filters, setFilters] = useState<MatchingFilters>({
    minScore: 60,
    maxResults: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: matches, isLoading, refetch } = useQuery({
    queryKey: ['ai-matches', entityId, entityType, filters],
    queryFn: async () => {
      if (entityType === 'team') {
        return await matchingService.findOpportunitiesForTeam(entityId, filters);
      } else {
        return await matchingService.findTeamsForOpportunity(entityId, filters);
      }
    },
    enabled: !!entityId,
  });

  const handleFilterChange = (key: keyof MatchingFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const isCompanyUser = userData?.type === 'company';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-navy to-gold flex items-center justify-center">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-text-primary">AI-powered matching</h2>
            <p className="text-sm text-text-secondary">
              {entityType === 'team'
                ? 'Discover opportunities perfectly matched to your team\'s capabilities'
                : 'Find teams that excel in the specific skills you need'
              }
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          leftIcon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card">
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-text-primary mb-4">Matching criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label-text mb-2">
                  Minimum match score
                </label>
                <select
                  value={filters.minScore}
                  onChange={(e) => handleFilterChange('minScore', parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={50}>50% - Show all matches</option>
                  <option value={60}>60% - Good matches</option>
                  <option value={70}>70% - Strong matches</option>
                  <option value={80}>80% - Excellent matches</option>
                </select>
              </div>

              <div>
                <label className="label-text mb-2">
                  Maximum results
                </label>
                <select
                  value={filters.maxResults}
                  onChange={(e) => handleFilterChange('maxResults', parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={5}>5 results</option>
                  <option value={10}>10 results</option>
                  <option value={20}>20 results</option>
                  <option value={50}>50 results</option>
                </select>
              </div>

              {entityType === 'company' && (
                <div>
                  <label className="label-text mb-2">
                    Team size range
                  </label>
                  <select
                    value={filters.teamSizeRange ? `${filters.teamSizeRange.min}-${filters.teamSizeRange.max}` : ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        handleFilterChange('teamSizeRange', undefined);
                        return;
                      }
                      const [min, max] = e.target.value.split('-').map(n => parseInt(n));
                      handleFilterChange('teamSizeRange', { min, max });
                    }}
                    className="input-field"
                  >
                    <option value="">Any size</option>
                    <option value="2-5">2-5 members</option>
                    <option value="6-10">6-10 members</option>
                    <option value="11-15">11-15 members</option>
                    <option value="16-20">16+ members</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="card">
          <div className="px-6 py-12 text-center">
            <div className="loading-spinner mx-auto"></div>
            <p className="mt-4 text-sm text-text-tertiary">Analyzing compatibility...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!isLoading && matches && (
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={<LightBulbIcon className="w-12 h-12" />}
                title="No matches found"
                description="Try adjusting your filters to find more potential matches."
              />
            </div>
          ) : (
            matches.map((match, index) => (
              <MatchCard
                key={`${match.team.id}-${match.opportunity.id}`}
                match={match}
                rank={index + 1}
                entityType={entityType}
                isCompanyUser={isCompanyUser}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface MatchCardProps {
  match: TeamOpportunityMatch;
  rank: number;
  entityType: 'team' | 'company';
  isCompanyUser: boolean;
}

function MatchCard({ match, rank, entityType, isCompanyUser }: MatchCardProps) {
  const { team, opportunity, score, recommendation, keyStrengths, potentialConcerns } = match;
  const RecommendationIcon = recommendationIcons[recommendation];

  return (
    <div className="card hover:shadow-lg transition-shadow duration-base">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-navy-100 flex items-center justify-center">
                <span className="text-lg font-bold text-navy">#{rank}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {entityType === 'team' ? (
                  <BriefcaseIcon className="h-5 w-5 text-text-tertiary" />
                ) : (
                  <UserGroupIcon className="h-5 w-5 text-text-tertiary" />
                )}
                <h3 className="text-lg font-medium text-text-primary">
                  {entityType === 'team' ? opportunity.title : team.name}
                </h3>
                <Badge
                  variant={recommendationColors[recommendation]}
                  icon={<RecommendationIcon className="h-3 w-3" />}
                >
                  {recommendation}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary">
                {entityType === 'team' ? opportunity.companyName : `${team.size} members • ${team.industry.join(', ')}`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-navy">{score.total}%</div>
            <div className="text-xs text-text-tertiary">match score</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-primary mb-3">Compatibility breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScoreBar label="Skills" score={score.breakdown.skillsMatch} max={25} />
            <ScoreBar label="Industry" score={score.breakdown.industryMatch} max={20} />
            <ScoreBar label="Experience" score={score.breakdown.experienceMatch} max={15} />
            <ScoreBar label="Compensation" score={score.breakdown.compensationMatch} max={15} />
          </div>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-success mr-1" />
              Key strengths
            </h4>
            <ul className="text-sm text-text-secondary space-y-1">
              {keyStrengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-success rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Concerns */}
          {potentialConcerns.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 text-warning mr-1" />
                Considerations
              </h4>
              <ul className="text-sm text-text-secondary space-y-1">
                {potentialConcerns.map((concern, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-warning rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* AI Reasoning */}
        <div className="mb-6 p-4 bg-bg-alt rounded-lg">
          <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center">
            <SparklesIcon className="h-4 w-4 text-navy mr-1" />
            AI analysis
          </h4>
          <div className="text-sm text-text-secondary space-y-1">
            {score.reasoning.map((reason, index) => (
              <p key={index}>• {reason}</p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-text-tertiary">
            {entityType === 'team' ? (
              <>
                <span>{opportunity.location}</span>
                <span>•</span>
                <span>{opportunity.timeline?.urgency || 'Flexible timeline'}</span>
              </>
            ) : (
              <>
                <span>{team.location.primary}</span>
                <span>•</span>
                <span>{team.dynamics.yearsWorkingTogether} years together</span>
              </>
            )}
          </div>

          <div className="flex space-x-3">
            <Link
              href={entityType === 'team' ? `/app/opportunities/${opportunity.id}` : `/app/teams/${team.id}`}
              className="btn-outline min-h-12"
            >
              View details
            </Link>
            {isCompanyUser && entityType === 'company' && (
              <Button variant="primary" size="md">
                Express interest
              </Button>
            )}
            {!isCompanyUser && entityType === 'team' && (
              <Link
                href={`/app/opportunities/${opportunity.id}/apply`}
                className="btn-primary min-h-12"
              >
                Apply now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  score: number;
  max: number;
}

function ScoreBar({ label, score, max }: ScoreBarProps) {
  const percentage = (score / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-xs text-text-secondary mb-1">
        <span>{label}</span>
        <span>{score}/{max}</span>
      </div>
      <div className="w-full bg-bg-elevated rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-base ${
            percentage >= 80 ? 'bg-success' :
            percentage >= 60 ? 'bg-navy' :
            percentage >= 40 ? 'bg-warning' :
            'bg-error'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
