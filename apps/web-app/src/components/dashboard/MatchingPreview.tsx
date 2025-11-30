'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import {
  SparklesIcon,
  ArrowRightIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Badge, Skeleton, EmptyState } from '@/components/ui';
import { getMatchRecommendation } from '@/hooks/useMatching';

interface MatchPreviewItem {
  id: string;
  name: string;
  score: number;
  industry: string | null;
  type: 'team' | 'opportunity';
}

export function MatchingPreview() {
  const { data: session } = useSession();
  const isCompanyUser = session?.user?.userType === 'company';

  // For team users, get their first team and matching opportunities
  // For company users, get their first opportunity and matching teams
  const { data, isLoading, error } = useQuery({
    queryKey: ['matching-preview', session?.user?.id, isCompanyUser],
    queryFn: async () => {
      if (!isCompanyUser) {
        // Get user's teams first
        const teamsRes = await fetch('/api/teams?myTeams=true&limit=1');
        if (!teamsRes.ok) return { matches: [], entityId: null, entityName: null };
        const teamsData = await teamsRes.json();
        const team = teamsData.teams?.[0];
        if (!team) return { matches: [], entityId: null, entityName: null };

        // Get matching opportunities
        const matchesRes = await fetch(`/api/matching/opportunities?teamId=${team.id}&minScore=50&limit=3`);
        if (!matchesRes.ok) return { matches: [], entityId: team.id, entityName: team.name };
        const matchesData = await matchesRes.json();

        const matches: MatchPreviewItem[] = (matchesData.data?.matches || []).map((m: any) => ({
          id: m.opportunity.id,
          name: m.opportunity.title,
          score: m.score.total,
          industry: m.opportunity.industry,
          type: 'opportunity' as const,
        }));

        return { matches, entityId: team.id, entityName: team.name };
      } else {
        // Get company's opportunities first
        const oppsRes = await fetch('/api/opportunities?myOpportunities=true&limit=1');
        if (!oppsRes.ok) return { matches: [], entityId: null, entityName: null };
        const oppsData = await oppsRes.json();
        const opp = oppsData.opportunities?.[0];
        if (!opp) return { matches: [], entityId: null, entityName: null };

        // Get matching teams
        const matchesRes = await fetch(`/api/matching/teams?opportunityId=${opp.id}&minScore=50&limit=3`);
        if (!matchesRes.ok) return { matches: [], entityId: opp.id, entityName: opp.title };
        const matchesData = await matchesRes.json();

        const matches: MatchPreviewItem[] = (matchesData.data?.matches || []).map((m: any) => ({
          id: m.team.id,
          name: m.team.name,
          score: m.score.total,
          industry: m.team.industry,
          type: 'team' as const,
        }));

        return { matches, entityId: opp.id, entityName: opp.title };
      }
    },
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000,
  });

  const matches = data?.matches || [];
  const entityId = data?.entityId;
  const entityName = data?.entityName;

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-navy to-gold flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">AI Matches</h2>
              <p className="text-xs text-text-tertiary">
                {isCompanyUser ? 'Top matching teams' : 'Top opportunities for you'}
              </p>
            </div>
          </div>
          {entityId && (
            <Link
              href={`/app/matching?${isCompanyUser ? 'opportunityId' : 'teamId'}=${entityId}`}
              className="text-sm text-navy hover:text-navy-dark flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height="60px" className="rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-sm text-text-tertiary">Failed to load matches</p>
          </div>
        ) : matches.length === 0 ? (
          <EmptyState
            icon={isCompanyUser ? <UserGroupIcon className="w-10 h-10" /> : <BriefcaseIcon className="w-10 h-10" />}
            title={!entityId
              ? (isCompanyUser ? "No opportunities posted yet" : "No team profile yet")
              : "No matches found"
            }
            description={!entityId
              ? (isCompanyUser
                  ? "Post an opportunity to start matching with teams"
                  : "Create a team profile to discover matching opportunities"
                )
              : "Try updating your profile to improve match quality"
            }
            action={
              !entityId && (
                <Link
                  href={isCompanyUser ? "/app/opportunities/create" : "/app/teams/create"}
                  className="btn-primary text-sm py-2 px-4"
                >
                  {isCompanyUser ? "Post Opportunity" : "Create Team"}
                </Link>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {entityName && (
              <p className="text-xs text-text-tertiary mb-2">
                Matches for <span className="font-medium text-text-secondary">{entityName}</span>
              </p>
            )}
            {matches.map((match) => {
              const recommendation = getMatchRecommendation(match.score);
              const detailUrl = match.type === 'opportunity'
                ? `/app/opportunities/${match.id}`
                : `/app/teams/${match.id}`;

              return (
                <Link
                  key={match.id}
                  href={detailUrl}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-navy hover:bg-bg-alt transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      match.type === 'opportunity' ? 'bg-gold-50' : 'bg-navy-50'
                    }`}>
                      {match.type === 'opportunity' ? (
                        <BriefcaseIcon className="h-4 w-4 text-gold" />
                      ) : (
                        <UserGroupIcon className="h-4 w-4 text-navy" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-text-primary group-hover:text-navy transition-colors">
                        {match.name}
                      </h3>
                      {match.industry && (
                        <p className="text-xs text-text-tertiary">{match.industry}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        recommendation.label === 'Excellent Match' ? 'success' :
                        recommendation.label === 'Good Match' ? 'info' :
                        'warning'
                      }
                      size="sm"
                    >
                      {match.score}%
                    </Badge>
                    <ChevronRightIcon className="h-4 w-4 text-text-tertiary group-hover:text-navy transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Link to full matching page */}
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href="/app/matching"
            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-navy hover:text-navy-dark transition-colors"
          >
            <SparklesIcon className="h-4 w-4" />
            Explore AI-powered matching
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MatchingPreview;
