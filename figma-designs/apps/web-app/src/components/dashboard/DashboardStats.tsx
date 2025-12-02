'use client';

import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  userType: string;
}

interface StatsData {
  teamsOrProfiles: number;
  opportunities: number;
  expressionsOfInterest: number;
  activeConversations: number;
  liftoutSuccessRate?: number;
  marketReach?: number;
}

const fallbackTeamStats: StatsData = {
  teamsOrProfiles: 1,
  opportunities: 15,
  expressionsOfInterest: 3,
  activeConversations: 2,
  liftoutSuccessRate: 67,
  marketReach: 8,
};

const fallbackCompanyStats: StatsData = {
  teamsOrProfiles: 24,
  opportunities: 5,
  expressionsOfInterest: 12,
  activeConversations: 7,
  liftoutSuccessRate: 80,
  marketReach: 156,
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

  const teamStats = [
    {
      name: 'Team Profile Views',
      value: stats?.marketReach || 0,
      icon: ChartBarIcon,
      color: 'text-navy',
      bgColor: 'bg-navy-50',
    },
    {
      name: 'Available Opportunities',
      value: stats?.opportunities || 0,
      icon: BriefcaseIcon,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      name: 'Expressions of Interest',
      value: stats?.expressionsOfInterest || 0,
      icon: DocumentTextIcon,
      color: 'text-gold-700',
      bgColor: 'bg-gold-50',
    },
    {
      name: 'Active Discussions',
      value: stats?.activeConversations || 0,
      icon: UserGroupIcon,
      color: 'text-navy-600',
      bgColor: 'bg-navy-100',
    },
  ];

  const companyStats = [
    {
      name: 'Active Liftout Opportunities',
      value: stats?.opportunities || 0,
      icon: BriefcaseIcon,
      color: 'text-navy',
      bgColor: 'bg-navy-50',
    },
    {
      name: 'Team Interest Received',
      value: stats?.expressionsOfInterest || 0,
      icon: DocumentTextIcon,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      name: 'Teams in Discussion',
      value: stats?.activeConversations || 0,
      icon: UserGroupIcon,
      color: 'text-gold-700',
      bgColor: 'bg-gold-50',
    },
    {
      name: 'Success Rate',
      value: `${stats?.liftoutSuccessRate || 0}%`,
      icon: ChartBarIcon,
      color: 'text-navy-600',
      bgColor: 'bg-navy-100',
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
        <div key={stat.name} className="card group min-h-[120px]">
          <div className="flex items-start gap-4">
            {/* Icon container - 48px min touch target */}
            <div className="flex-shrink-0">
              <div className={`${stat.bgColor} rounded-xl p-3 min-w-12 min-h-12 flex items-center justify-center transition-transform duration-fast group-hover:scale-105`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
            </div>
            {/* Content - Practical UI typography */}
            <div className="flex-1 min-w-0">
              <dl>
                {/* Stat value - prominent, bold */}
                <dd className="text-2xl font-bold text-text-primary font-heading leading-tight">
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </dd>
                {/* Stat label - regular weight, secondary color */}
                <dt className="text-base font-normal text-text-secondary mt-1 leading-snug">
                  {stat.name}
                </dt>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}