'use client';

import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  userType: string;
}

interface StatsData {
  activePosts: number;
  newMessages: number;
  newTeams: number;
  newCandidates: number;
  // Team-specific
  profileViews?: number;
  opportunities?: number;
  expressionsOfInterest?: number;
  activeConversations?: number;
}

const fallbackTeamStats: StatsData = {
  activePosts: 0,
  newMessages: 0,
  newTeams: 0,
  newCandidates: 0,
  profileViews: 8,
  opportunities: 15,
  expressionsOfInterest: 3,
  activeConversations: 2,
};

const fallbackCompanyStats: StatsData = {
  activePosts: 0,
  newMessages: 0,
  newTeams: 0,
  newCandidates: 0,
};

export function DashboardStats({ userType }: DashboardStatsProps) {
  const isCompanyUser = userType === 'company';

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', userType],
    queryFn: async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            return result.data as StatsData;
          }
        }
        // Fallback to mock data
        return isCompanyUser ? fallbackCompanyStats : fallbackTeamStats;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return isCompanyUser ? fallbackCompanyStats : fallbackTeamStats;
      }
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  // Team user stats
  const teamStats = [
    {
      name: 'Profile Views',
      value: stats?.profileViews || 0,
      icon: ChartBarIcon,
    },
    {
      name: 'New Messages',
      value: stats?.newMessages || 0,
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: 'Available Opportunities',
      value: stats?.opportunities || 0,
      icon: BriefcaseIcon,
    },
    {
      name: 'Interested Companies',
      value: stats?.expressionsOfInterest || 0,
      icon: DocumentTextIcon,
    },
  ];

  // Company user stats - matches Figma exactly
  const companyStats = [
    {
      name: 'Active Posts',
      value: stats?.activePosts || 0,
      icon: UserPlusIcon,
    },
    {
      name: 'New Messages',
      value: stats?.newMessages || 0,
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: 'New Teams',
      value: stats?.newTeams || 0,
      icon: MagnifyingGlassIcon,
    },
    {
      name: 'New Candidates',
      value: stats?.newCandidates || 0,
      icon: UserGroupIcon,
    },
  ];

  const displayStats = isCompanyUser ? companyStats : teamStats;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 skeleton rounded-lg"></div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <div className="h-4 skeleton rounded w-24 mb-2"></div>
                <div className="h-7 skeleton rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat) => (
        <div key={stat.name} className="card hover:shadow-soft transition-all duration-base">
          {/* Icon - matches Figma design */}
          <div className="mb-4">
            <stat.icon className="h-6 w-6 text-text-tertiary" aria-hidden="true" />
          </div>
          {/* Label first, then value - matches Figma */}
          <dl>
            <dt className="text-sm font-normal text-text-tertiary leading-snug">
              {stat.name}
            </dt>
            <dd className="text-3xl font-bold text-text-primary font-heading leading-tight mt-1">
              {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
            </dd>
          </dl>
        </div>
      ))}
    </div>
  );
}