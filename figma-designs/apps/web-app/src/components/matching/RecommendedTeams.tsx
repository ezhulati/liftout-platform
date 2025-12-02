'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  SparklesIcon,
  UserGroupIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface TeamMatch {
  teamId: string;
  team: {
    id: string;
    name: string;
    skills: string[];
    industry: string;
    size: number;
    yearsWorking: number;
    location?: string;
    verificationStatus?: string;
  };
  score: number;
  breakdown: {
    skillsMatch: number;
    industryMatch: number;
    sizeMatch: number;
    compensationMatch: number;
    availabilityMatch: number;
  };
  strengths: string[];
  considerations: string[];
}

interface RecommendedTeamsProps {
  opportunityId?: string;
  limit?: number;
  showBreakdown?: boolean;
  className?: string;
}

export function RecommendedTeams({
  opportunityId,
  limit = 5,
  showBreakdown = false,
  className = '',
}: RecommendedTeamsProps) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['matching', 'teams', opportunityId, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: 'teams',
        limit: limit.toString(),
      });
      if (opportunityId) params.append('opportunityId', opportunityId);

      const response = await fetch(`/api/matching?${params}`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      return response.json();
    },
  });

  const matches: TeamMatch[] = data?.matches || [];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-navy';
    if (score >= 60) return 'text-gold-600';
    return 'text-text-tertiary';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-success/10';
    if (score >= 75) return 'bg-navy/10';
    if (score >= 60) return 'bg-gold-100';
    return 'bg-bg-alt';
  };

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-bg-alt rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-1/3 bg-bg-alt rounded" />
                <div className="h-4 w-2/3 bg-bg-alt rounded" />
              </div>
              <div className="h-10 w-16 bg-bg-alt rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className={`card p-8 text-center ${className}`}>
        <SparklesIcon className="h-12 w-12 mx-auto text-text-tertiary mb-3" />
        <h3 className="text-lg font-medium text-text-primary mb-1">No Matches Yet</h3>
        <p className="text-text-secondary">
          Post an opportunity to see recommended teams based on your requirements.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {matches.map((match, index) => (
        <div
          key={match.teamId}
          className="card p-4 hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => router.push(`/app/teams/${match.teamId}`)}
        >
          <div className="flex items-start gap-4">
            {/* Rank Badge */}
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getScoreBg(match.score)}`}>
              <span className={`text-lg font-bold ${getScoreColor(match.score)}`}>
                #{index + 1}
              </span>
            </div>

            {/* Team Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-text-primary truncate">
                  {match.team.name}
                </h3>
                {match.team.verificationStatus === 'verified' && (
                  <CheckBadgeIcon className="h-5 w-5 text-success flex-shrink-0" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <UserGroupIcon className="h-4 w-4 text-text-tertiary" />
                  {match.team.size} members
                </span>
                <span>{match.team.industry}</span>
                {match.team.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4 text-text-tertiary" />
                    {match.team.location}
                  </span>
                )}
              </div>

              {/* Skills Preview */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {match.team.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-bg-alt rounded text-xs text-text-secondary"
                  >
                    {skill}
                  </span>
                ))}
                {match.team.skills.length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-text-tertiary">
                    +{match.team.skills.length - 4} more
                  </span>
                )}
              </div>

              {/* Strengths */}
              {match.strengths.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {match.strengths.map((strength, i) => (
                    <span
                      key={i}
                      className="text-xs text-success bg-success/10 px-2 py-0.5 rounded"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Match Score */}
            <div className="text-right flex-shrink-0">
              <div className={`text-2xl font-bold ${getScoreColor(match.score)}`}>
                {match.score}%
              </div>
              <p className="text-xs text-text-tertiary">match</p>
            </div>
          </div>

          {/* Breakdown (if enabled) */}
          {showBreakdown && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-2 text-xs text-text-tertiary">
                <ChartBarIcon className="h-4 w-4" />
                Match Breakdown
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(match.breakdown).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="h-1.5 bg-bg-alt rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full ${getScoreBg(value * 100)}`}
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-tertiary capitalize">
                      {key.replace('Match', '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hover Arrow */}
          <ArrowRightIcon className="h-5 w-5 text-text-tertiary absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
