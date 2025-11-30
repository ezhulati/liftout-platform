'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  LightBulbIcon,
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import { TeamMatchCard, OpportunityMatchCard } from './MatchScoreCard';
import { TeamComparison } from '@/components/teams/TeamComparison';
import {
  useTeamMatches,
  useOpportunityMatches,
  type TeamMatch,
  type OpportunityMatch,
} from '@/hooks/useMatching';

interface MatchingDashboardProps {
  entityId: string; // Opportunity ID (for company) or Team ID (for team)
  entityType: 'team' | 'company';
  entityName?: string;
}

interface MatchingFilters {
  minScore: number;
  limit: number;
}

export function MatchingDashboard({ entityId, entityType, entityName }: MatchingDashboardProps) {
  const { userData } = useAuth();
  const [filters, setFilters] = useState<MatchingFilters>({
    minScore: 60,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Use the appropriate hook based on entity type
  const teamMatchesQuery = useTeamMatches({
    opportunityId: entityId,
    minScore: filters.minScore,
    limit: filters.limit,
    enabled: entityType === 'company',
  });

  const opportunityMatchesQuery = useOpportunityMatches({
    teamId: entityId,
    minScore: filters.minScore,
    limit: filters.limit,
    enabled: entityType === 'team',
  });

  const isLoading = entityType === 'company'
    ? teamMatchesQuery.isLoading
    : opportunityMatchesQuery.isLoading;

  const isError = entityType === 'company'
    ? teamMatchesQuery.isError
    : opportunityMatchesQuery.isError;

  const refetch = entityType === 'company'
    ? teamMatchesQuery.refetch
    : opportunityMatchesQuery.refetch;

  const matches = entityType === 'company'
    ? teamMatchesQuery.data?.matches || []
    : opportunityMatchesQuery.data?.matches || [];

  const total = entityType === 'company'
    ? teamMatchesQuery.data?.total || 0
    : opportunityMatchesQuery.data?.total || 0;

  const handleFilterChange = (key: keyof MatchingFilters, value: number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExpressInterest = async (teamId: string) => {
    try {
      const response = await fetch('/api/applications/eoi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toType: 'team',
          toId: teamId,
          message: `Interest from matching`,
          interestLevel: 'high',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to express interest');
      }

      toast.success('Interest expressed! The team will be notified.');
    } catch (error) {
      console.error('Express interest error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to express interest');
    }
  };

  const handleApply = (opportunityId: string) => {
    // Navigate to apply page
    window.location.href = `/app/opportunities/${opportunityId}/apply`;
  };

  // Team comparison functionality (for company users)
  const handleToggleTeamSelection = (teamId: string) => {
    setSelectedTeamIds(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : prev.length < 4 ? [...prev, teamId] : prev
    );
  };

  const handleRemoveFromComparison = (teamId: string) => {
    setSelectedTeamIds(prev => prev.filter(id => id !== teamId));
  };

  // Transform selected teams for comparison component
  const comparisonTeams = useMemo(() => {
    if (entityType !== 'company') return [];
    const teamMatches = matches as TeamMatch[];
    return selectedTeamIds
      .map(id => teamMatches.find(m => m.team.id === id))
      .filter((m): m is TeamMatch => m !== undefined)
      .map(match => ({
        id: match.team.id,
        name: match.team.name,
        matchScore: match.score.total,
        size: match.team.memberCount || match.team.size || 0,
        yearsWorking: match.team.yearsWorkingTogether || 0,
        industry: match.team.industry || 'Not specified',
        location: match.team.location || 'Not specified',
        skills: match.team.skills || [],
        achievements: [],
        compensation: {
          min: 0,
          max: 0,
        },
        availability: match.team.availabilityStatus || 'Not specified',
        members: [],
        strengths: match.score.strengths || [],
        considerations: match.score.concerns || [],
        verificationStatus: (match.team.verificationStatus as 'verified' | 'pending' | 'unverified') || 'unverified',
        previousLiftouts: 0,
      }));
  }, [entityType, matches, selectedTeamIds]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-navy to-gold flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">AI-Powered Matching</h2>
            <p className="text-sm font-normal text-text-secondary mt-1">
              {entityType === 'team'
                ? 'Discover opportunities matched to your team\'s capabilities'
                : 'Find teams that excel in the skills you need'
              }
              {entityName && <span className="text-text-tertiary"> for {entityName}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {entityType === 'company' && selectedTeamIds.length >= 2 && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ArrowsRightLeftIcon className="h-4 w-4" />}
              onClick={() => setShowComparison(!showComparison)}
            >
              Compare ({selectedTeamIds.length})
            </Button>
          )}
          {entityType === 'company' && selectedTeamIds.length > 0 && selectedTeamIds.length < 2 && (
            <span className="text-sm text-text-tertiary">
              Select {2 - selectedTeamIds.length} more to compare
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowPathIcon className="h-4 w-4" />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Team Comparison Panel */}
      {showComparison && entityType === 'company' && comparisonTeams.length >= 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">Team Comparison</h3>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<XMarkIcon className="h-4 w-4" />}
              onClick={() => setShowComparison(false)}
            >
              Close
            </Button>
          </div>
          <TeamComparison
            teams={comparisonTeams}
            onRemoveTeam={handleRemoveFromComparison}
            onViewTeam={(teamId) => window.location.href = `/app/teams/${teamId}`}
            onContactTeam={handleExpressInterest}
          />
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="card">
          <div className="px-6 py-4">
            <h3 className="text-sm font-bold text-text-primary mb-4">Matching Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">
                  Minimum Match Score
                </label>
                <select
                  value={filters.minScore}
                  onChange={(e) => handleFilterChange('minScore', parseInt(e.target.value))}
                  className="input-field text-sm"
                >
                  <option value={50}>50% - Show all matches</option>
                  <option value={60}>60% - Good matches</option>
                  <option value={70}>70% - Strong matches</option>
                  <option value={80}>80% - Excellent matches only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">
                  Maximum Results
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className="input-field text-sm"
                >
                  <option value={5}>5 results</option>
                  <option value={10}>10 results</option>
                  <option value={20}>20 results</option>
                  <option value={50}>50 results</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Skeleton variant="rectangular" width="40px" height="40px" className="rounded-lg" />
                  <div>
                    <Skeleton variant="text" width="200px" className="mb-2" />
                    <Skeleton variant="text" width="150px" />
                  </div>
                </div>
                <Skeleton variant="rectangular" width="80px" height="40px" className="rounded-lg" />
              </div>
              <Skeleton variant="text" lines={2} className="mb-4" />
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} variant="rectangular" height="20px" className="rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="card p-6">
          <EmptyState
            icon={<LightBulbIcon className="w-12 h-12 text-error" />}
            title="Failed to load matches"
            description="There was an error loading the matches. Please try again."
            action={
              <Button variant="primary" onClick={() => refetch()}>
                Try Again
              </Button>
            }
          />
        </div>
      )}

      {/* Results */}
      {!isLoading && !isError && (
        <>
          {/* Results Summary */}
          {matches.length > 0 && (
            <div className="text-sm text-text-secondary">
              Showing {matches.length} of {total} matches
            </div>
          )}

          {/* Match Cards */}
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={<LightBulbIcon className="w-12 h-12" />}
                  title="No matches found"
                  description={
                    filters.minScore > 50
                      ? "Try lowering the minimum match score to see more results."
                      : entityType === 'team'
                        ? "No opportunities currently match your team's profile."
                        : "No teams currently match this opportunity's requirements."
                  }
                  action={
                    filters.minScore > 50 ? (
                      <Button
                        variant="outline"
                        onClick={() => handleFilterChange('minScore', 50)}
                      >
                        Show All Matches
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            ) : entityType === 'company' ? (
              // Show team matches for companies
              (matches as TeamMatch[]).map((match, index) => (
                <div key={match.team.id} className="relative">
                  {/* Selection checkbox for comparison */}
                  <div className="absolute top-4 right-4 z-10">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTeamIds.includes(match.team.id)}
                        onChange={() => handleToggleTeamSelection(match.team.id)}
                        disabled={!selectedTeamIds.includes(match.team.id) && selectedTeamIds.length >= 4}
                        className="rounded border-border text-navy focus:ring-navy h-4 w-4"
                      />
                      <span className="text-xs text-text-tertiary">Compare</span>
                    </label>
                  </div>
                  <TeamMatchCard
                    match={match}
                    rank={index + 1}
                    onExpressInterest={handleExpressInterest}
                  />
                </div>
              ))
            ) : (
              // Show opportunity matches for teams
              (matches as OpportunityMatch[]).map((match, index) => (
                <OpportunityMatchCard
                  key={match.opportunity.id}
                  match={match}
                  rank={index + 1}
                  onApply={handleApply}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MatchingDashboard;
