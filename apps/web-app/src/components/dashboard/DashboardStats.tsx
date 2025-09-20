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

const mockTeamStats: StatsData = {
  teamsOrProfiles: 1, // Your team profile
  opportunities: 15, // Available liftout opportunities
  expressionsOfInterest: 3, // Sent expressions of interest
  activeConversations: 2, // Active discussions with companies
  liftoutSuccessRate: 67, // Success rate percentage
  marketReach: 8, // Companies viewing your profile
};

const mockCompanyStats: StatsData = {
  teamsOrProfiles: 24, // Teams browsed/engaged
  opportunities: 5, // Posted liftout opportunities
  expressionsOfInterest: 12, // Received expressions of interest
  activeConversations: 7, // Active team conversations
  liftoutSuccessRate: 80, // Success rate percentage
  marketReach: 156, // Profile views
};

export function DashboardStats({ userType }: DashboardStatsProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', userType],
    queryFn: async () => {
      // This would normally fetch from your API
      // Return role-specific mock data
      return isCompanyUser ? mockCompanyStats : mockTeamStats;
    },
  });

  const isCompanyUser = userType === 'company';

  const teamStats = [
    {
      name: 'Team Profile Views',
      value: stats?.marketReach || 0,
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Available Opportunities',
      value: stats?.opportunities || 0,
      icon: BriefcaseIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Expressions of Interest',
      value: stats?.expressionsOfInterest || 0,
      icon: DocumentTextIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Active Discussions',
      value: stats?.activeConversations || 0,
      icon: UserGroupIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const companyStats = [
    {
      name: 'Active Liftout Opportunities',
      value: stats?.opportunities || 0,
      icon: BriefcaseIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Team Interest Received',
      value: stats?.expressionsOfInterest || 0,
      icon: DocumentTextIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Teams in Discussion',
      value: stats?.activeConversations || 0,
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Success Rate',
      value: `${stats?.liftoutSuccessRate || 0}%`,
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const displayStats = isCompanyUser ? companyStats : teamStats;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat) => (
        <div key={stat.name} className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`${stat.bgColor} rounded-md p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}