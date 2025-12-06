'use client';

import React, { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  SparklesIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { MatchingDashboard } from '@/components/matching';
import { Button, Skeleton, EmptyState } from '@/components/ui';

interface SimpleTeam {
  id: string;
  name: string;
  industry: string | null;
  memberCount: number;
}

interface SimpleOpportunity {
  id: string;
  title: string;
  company: { name: string };
  industry: string | null;
}

function MatchingContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTeamId = searchParams?.get('teamId');
  const selectedOpportunityId = searchParams?.get('opportunityId');

  const isCompanyUser = session?.user?.userType === 'company';

  // Fetch user's teams (for individual/team users)
  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ['my-teams-for-matching'],
    queryFn: async () => {
      const response = await fetch('/api/teams?myTeams=true');
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      return data.teams as SimpleTeam[];
    },
    enabled: !isCompanyUser && status === 'authenticated',
  });

  // Fetch company's opportunities (for company users)
  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['my-opportunities-for-matching'],
    queryFn: async () => {
      const response = await fetch('/api/opportunities?myOpportunities=true');
      if (!response.ok) throw new Error('Failed to fetch opportunities');
      const data = await response.json();
      return data.opportunities as SimpleOpportunity[];
    },
    enabled: isCompanyUser && status === 'authenticated',
  });

  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const handleSelectTeam = (teamId: string) => {
    router.push(`/app/matching?teamId=${teamId}`);
  };

  const handleSelectOpportunity = (opportunityId: string) => {
    router.push(`/app/matching?opportunityId=${opportunityId}`);
  };

  // Team user view - select a team to find matching opportunities
  if (!isCompanyUser) {
    const isLoading = teamsLoading;
    const myTeams = teamsData || [];

    // Show team selector if no team selected
    if (!selectedTeamId) {
      return (
        <div className="space-y-6">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">AI Matching</h1>
            <p className="page-subtitle">Smart team-company recommendations.</p>
          </div>

          {/* Team Selection */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-lg font-bold text-text-primary mb-2">
                Select Your Team
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Choose a team to discover matching opportunities
              </p>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height="72px" className="rounded-lg" />
                  ))}
                </div>
              ) : myTeams.length === 0 ? (
                <EmptyState
                  icon={<UserGroupIcon className="w-12 h-12" />}
                  title="No team profile yet"
                  description="Post a team profile to get discovered by companies looking for intact teams."
                  action={
                    <Link href="/app/teams/create" className="btn-primary">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Create team profile
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {myTeams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleSelectTeam(team.id)}
                      className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-navy hover:bg-bg-alt transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center">
                          <UserGroupIcon className="h-5 w-5 text-navy" />
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">{team.name}</h3>
                          <p className="text-sm text-text-secondary">
                            {team.memberCount} members • {team.industry || 'No industry set'}
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-text-tertiary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Show matching dashboard for selected team
    const selectedTeam = myTeams.find((t) => t.id === selectedTeamId);

    return (
      <div className="space-y-6">
        {/* Back navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/app/matching')}
          >
            ← Back to team selection
          </Button>
        </div>

        {/* Matching Dashboard */}
        <MatchingDashboard
          entityId={selectedTeamId}
          entityType="team"
          entityName={selectedTeam?.name}
        />
      </div>
    );
  }

  // Company user view - select an opportunity to find matching teams
  const isLoading = opportunitiesLoading;
  const myOpportunities = opportunitiesData || [];

  // Show opportunity selector if no opportunity selected
  if (!selectedOpportunityId) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">AI Matching</h1>
          <p className="page-subtitle">Smart team-company recommendations.</p>
        </div>

        {/* Opportunity Selection */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-lg font-bold text-text-primary mb-2">
              Select an Opportunity
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              Choose an opportunity to discover matching teams
            </p>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rectangular" height="72px" className="rounded-lg" />
                ))}
              </div>
            ) : myOpportunities.length === 0 ? (
              <EmptyState
                icon={<BriefcaseIcon className="w-12 h-12" />}
                title="No opportunities posted yet"
                description="Post an opportunity to start finding intact teams ready to move together."
                action={
                  <Link href="/app/opportunities/create" className="btn-primary">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Post opportunity
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {myOpportunities.map((opportunity) => (
                  <button
                    key={opportunity.id}
                    onClick={() => handleSelectOpportunity(opportunity.id)}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-navy hover:bg-bg-alt transition-all duration-200 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gold-50 flex items-center justify-center">
                        <BriefcaseIcon className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary">{opportunity.title}</h3>
                        <p className="text-sm text-text-secondary">
                          {opportunity.company?.name || 'Your company'} • {opportunity.industry || 'No industry set'}
                        </p>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-text-tertiary" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show matching dashboard for selected opportunity
  const selectedOpportunity = myOpportunities.find((o) => o.id === selectedOpportunityId);

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/app/matching')}
        >
          ← Back to opportunity selection
        </Button>
      </div>

      {/* Matching Dashboard */}
      <MatchingDashboard
        entityId={selectedOpportunityId}
        entityType="company"
        entityName={selectedOpportunity?.title}
      />
    </div>
  );
}

export default function MatchingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-96 flex items-center justify-center">
          <div className="loading-spinner w-12 h-12"></div>
        </div>
      }
    >
      <MatchingContent />
    </Suspense>
  );
}
