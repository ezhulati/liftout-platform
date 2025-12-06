'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface TeamAnalytics {
  teamId: string;
  teamName: string;
  period: string;
  views: {
    total: number;
    change: number;
    byDay: { date: string; count: number }[];
  };
  interests: {
    total: number;
    change: number;
    pending: number;
    responded: number;
  };
  conversations: {
    total: number;
    active: number;
    responseRate: number;
    avgResponseTime: string;
  };
  applications: {
    total: number;
    inProgress: number;
    interviews: number;
    offers: number;
  };
  topCompanies: {
    id: string;
    name: string;
    industry: string;
    viewCount: number;
  }[];
}

export default function TeamAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id as string;

  const { data: analytics, isLoading } = useQuery<TeamAnalytics>({
    queryKey: ['team-analytics', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}/analytics`);
      if (!response.ok) {
        // Return mock data if API doesn't exist
        return {
          teamId,
          teamName: 'Team',
          period: 'Last 30 days',
          views: { total: 0, change: 0, byDay: [] },
          interests: { total: 0, change: 0, pending: 0, responded: 0 },
          conversations: { total: 0, active: 0, responseRate: 0, avgResponseTime: '-' },
          applications: { total: 0, inProgress: 0, interviews: 0, offers: 0 },
          topCompanies: [],
        };
      }
      return response.json();
    },
    enabled: !!teamId,
  });

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    subtext,
  }: {
    title: string;
    value: number | string;
    change?: number;
    icon: React.ElementType;
    subtext?: string;
  }) => (
    <div className="card">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">{title}</span>
          <Icon className="h-5 w-5 text-text-tertiary" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            {subtext && <p className="text-xs text-text-tertiary mt-1">{subtext}</p>}
          </div>
          {change !== undefined && (
            <div className={`flex items-center text-sm ${change >= 0 ? 'text-success' : 'text-error'}`}>
              {change >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-64"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-bg-elevated rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-bg-elevated rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push(`/app/teams/${teamId}`)}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to team
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Team analytics</h1>
            <p className="page-subtitle">Performance metrics.</p>
          </div>
          <div className="flex items-center text-sm text-text-tertiary">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {analytics?.period || 'Last 30 days'}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Profile Views"
          value={analytics?.views.total || 0}
          change={analytics?.views.change}
          icon={EyeIcon}
        />
        <StatCard
          title="Interests Received"
          value={analytics?.interests.total || 0}
          change={analytics?.interests.change}
          icon={HeartIcon}
          subtext={`${analytics?.interests.pending || 0} pending`}
        />
        <StatCard
          title="Conversations"
          value={analytics?.conversations.total || 0}
          icon={ChatBubbleLeftRightIcon}
          subtext={`${analytics?.conversations.active || 0} active`}
        />
        <StatCard
          title="Applications"
          value={analytics?.applications.total || 0}
          icon={DocumentTextIcon}
          subtext={`${analytics?.applications.offers || 0} offers`}
        />
      </div>

      {/* Engagement Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Interest Breakdown */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-medium text-text-primary">Interest Breakdown</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Pending Response</span>
                <span className="font-medium text-text-primary">{analytics?.interests.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Responded</span>
                <span className="font-medium text-text-primary">{analytics?.interests.responded || 0}</span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Response Rate</span>
                  <span className="font-medium text-success">
                    {analytics?.interests.total
                      ? Math.round((analytics.interests.responded / analytics.interests.total) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Stats */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-medium text-text-primary">Conversation Stats</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Active Conversations</span>
                <span className="font-medium text-text-primary">{analytics?.conversations.active || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Response Rate</span>
                <span className="font-medium text-text-primary">{analytics?.conversations.responseRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Avg. Response Time</span>
                <span className="font-medium text-text-primary">{analytics?.conversations.avgResponseTime || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Pipeline */}
      <div className="card mb-8">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-medium text-text-primary">Application Pipeline</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {[
              { label: 'Applied', value: analytics?.applications.total || 0, color: 'bg-gray-200' },
              { label: 'In Progress', value: analytics?.applications.inProgress || 0, color: 'bg-blue-200' },
              { label: 'Interviews', value: analytics?.applications.interviews || 0, color: 'bg-gold-200' },
              { label: 'Offers', value: analytics?.applications.offers || 0, color: 'bg-success-light' },
            ].map((stage, i) => (
              <div key={stage.label} className="flex-1 text-center">
                <div className={`h-2 ${stage.color} ${i === 0 ? 'rounded-l' : ''} ${i === 3 ? 'rounded-r' : ''}`}></div>
                <p className="text-2xl font-bold text-text-primary mt-3">{stage.value}</p>
                <p className="text-sm text-text-secondary">{stage.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Viewing Companies */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-medium text-text-primary">Companies Viewing Your Team</h2>
        </div>
        <div className="px-6 py-4">
          {analytics?.topCompanies && analytics.topCompanies.length > 0 ? (
            <div className="space-y-3">
              {analytics.topCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-text-primary">{company.name}</p>
                    <p className="text-sm text-text-tertiary">{company.industry}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-text-primary">{company.viewCount}</p>
                    <p className="text-xs text-text-tertiary">views</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-4">
              No company views yet. Make sure your team is posted to appear in searches.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
