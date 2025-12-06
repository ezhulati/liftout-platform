'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  ArrowLeftIcon,
  EyeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface OpportunityAnalytics {
  opportunityId: string;
  title: string;
  period: string;
  views: {
    total: number;
    change: number;
    unique: number;
    byDay: { date: string; count: number }[];
  };
  applications: {
    total: number;
    change: number;
    pending: number;
    reviewed: number;
    interviewed: number;
    offered: number;
    rejected: number;
  };
  engagement: {
    avgTimeOnPage: string;
    saveRate: number;
    applicationRate: number;
  };
  sources: {
    source: string;
    count: number;
    percentage: number;
  }[];
}

export default function OpportunityAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params?.id as string;

  const { data: analytics, isLoading } = useQuery<OpportunityAnalytics>({
    queryKey: ['opportunity-analytics', opportunityId],
    queryFn: async () => {
      const response = await fetch(`/api/opportunities/${opportunityId}/analytics`);
      if (!response.ok) {
        return {
          opportunityId,
          title: 'Opportunity',
          period: 'Last 30 days',
          views: { total: 0, change: 0, unique: 0, byDay: [] },
          applications: { total: 0, change: 0, pending: 0, reviewed: 0, interviewed: 0, offered: 0, rejected: 0 },
          engagement: { avgTimeOnPage: '-', saveRate: 0, applicationRate: 0 },
          sources: [],
        };
      }
      return response.json();
    },
    enabled: !!opportunityId,
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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push(`/app/opportunities/${opportunityId}`)}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to opportunity
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Opportunity analytics</h1>
            <p className="page-subtitle">Application metrics.</p>
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
          title="Total Views"
          value={analytics?.views.total || 0}
          change={analytics?.views.change}
          icon={EyeIcon}
          subtext={`${analytics?.views.unique || 0} unique`}
        />
        <StatCard
          title="Applications"
          value={analytics?.applications.total || 0}
          change={analytics?.applications.change}
          icon={DocumentTextIcon}
          subtext={`${analytics?.applications.pending || 0} pending`}
        />
        <StatCard
          title="Application Rate"
          value={`${analytics?.engagement.applicationRate || 0}%`}
          icon={UserGroupIcon}
        />
        <StatCard
          title="Save Rate"
          value={`${analytics?.engagement.saveRate || 0}%`}
          icon={ChartBarIcon}
        />
      </div>

      {/* Application Pipeline */}
      <div className="card mb-8">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-medium text-text-primary">Application Pipeline</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {[
              { label: 'Pending', value: analytics?.applications.pending || 0, color: 'bg-gray-200' },
              { label: 'Reviewed', value: analytics?.applications.reviewed || 0, color: 'bg-blue-200' },
              { label: 'Interviewed', value: analytics?.applications.interviewed || 0, color: 'bg-gold-200' },
              { label: 'Offered', value: analytics?.applications.offered || 0, color: 'bg-success-light' },
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

      {/* Traffic Sources */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-medium text-text-primary">Traffic Sources</h2>
        </div>
        <div className="px-6 py-4">
          {analytics?.sources && analytics.sources.length > 0 ? (
            <div className="space-y-3">
              {analytics.sources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-text-primary">{source.source}</span>
                      <span className="text-sm text-text-secondary">{source.count} views</span>
                    </div>
                    <div className="w-full bg-bg-alt rounded-full h-2">
                      <div
                        className="bg-navy h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-4">No traffic data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
