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
import { Skeleton, EmptyState } from '@/components/ui';
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
      {/* Header - Practical UI: bold headings, 48pt+ touch targets, proper spacing */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-navy to-gold flex items-center justify-center shadow-sm">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary font-heading">AI matches</h2>
              <p className="text-sm text-text-secondary mt-0.5">
                {isCompanyUser ? 'Top matching teams' : 'Top opportunities for you'}
              </p>
            </div>
          </div>
          {entityId && (
            <Link
              href={`/app/matching?${isCompanyUser ? 'opportunityId' : 'teamId'}=${entityId}`}
              className="text-base font-medium text-navy hover:text-navy-dark flex items-center gap-2 min-h-12 px-3 transition-colors"
            >
              View all
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Content - Practical UI: 8pt spacing system, proper typography */}
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height="72px" className="rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-base text-text-secondary">Failed to load matches</p>
          </div>
        ) : matches.length === 0 ? (
          <EmptyState
            icon={isCompanyUser ? <UserGroupIcon className="w-12 h-12" /> : <BriefcaseIcon className="w-12 h-12" />}
            title={!entityId
              ? (isCompanyUser ? "No opportunities posted yet" : "No team profile yet")
              : "No matches yet"
            }
            description={!entityId
              ? (isCompanyUser
                  ? "Post an opportunity to start finding teams"
                  : "Create a team profile to get discovered by companies"
                )
              : "As more teams and opportunities join, you'll see matches here"
            }
            action={
              !entityId && (
                <Link
                  href={isCompanyUser ? "/app/opportunities/create" : "/app/teams/create"}
                  className="btn-primary min-h-12 px-6"
                >
                  {isCompanyUser ? "Post opportunity" : "Create team"}
                </Link>
              )
            }
          />
        ) : (
          <div className="space-y-4">
            {entityName && (
              <p className="text-sm font-medium text-text-secondary mb-4">
                Matches for <span className="text-text-primary">{entityName}</span>
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
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-navy hover:bg-bg-alt transition-all duration-fast group min-h-[72px]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      match.type === 'opportunity' ? 'bg-gold-50' : 'bg-navy-50'
                    }`}>
                      {match.type === 'opportunity' ? (
                        <BriefcaseIcon className="h-5 w-5 text-gold" />
                      ) : (
                        <UserGroupIcon className="h-5 w-5 text-navy" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-text-primary group-hover:text-navy transition-colors truncate">
                        {match.name}
                      </h3>
                      {match.industry && (
                        <p className="text-sm text-text-secondary mt-0.5 truncate">{match.industry}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${
                      recommendation.label === 'Excellent Match'
                        ? 'bg-success-light text-success-dark'
                        : recommendation.label === 'Good Match'
                        ? 'bg-navy-50 text-navy-800'
                        : 'bg-gold-100 text-gold-800'
                    }`}>
                      {match.score}%
                    </span>
                    <ChevronRightIcon className="h-5 w-5 text-text-tertiary group-hover:text-navy transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA - Practical UI: 48pt touch target, clear visual hierarchy */}
        <div className="mt-6 pt-6 border-t border-border">
          <Link
            href="/app/matching"
            className="flex items-center justify-center gap-2 w-full min-h-12 py-3 text-base font-medium text-navy hover:text-navy-dark hover:bg-navy-50 rounded-xl transition-colors"
          >
            <SparklesIcon className="h-5 w-5" />
            Explore AI-powered matching
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MatchingPreview;
