'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  ArrowLeftIcon,
  EyeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface CompanyAnalytics {
  period: string;
  profile: {
    views: number;
    viewsChange: number;
    uniqueVisitors: number;
  };
  opportunities: {
    total: number;
    active: number;
    applications: number;
    applicationsChange: number;
    avgApplicationsPerOpp: number;
  };
  teams: {
    viewed: number;
    saved: number;
    contacted: number;
  };
  pipeline: {
    inReview: number;
    interviewing: number;
    offersMade: number;
    offersAccepted: number;
    hires: number;
  };
  topOpportunities: {
    id: string;
    title: string;
    applications: number;
    views: number;
  }[];
}

export default function CompanyAnalyticsPage() {
  const router = useRouter();

  const { data: analytics, isLoading } = useQuery<CompanyAnalytics>({
    queryKey: ['company-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/company/analytics');
      if (!response.ok) {
        // Return mock data if API doesn't exist
        return {
          period: 'Last 30 days',
          profile: { views: 0, viewsChange: 0, uniqueVisitors: 0 },
          opportunities: { total: 0, active: 0, applications: 0, applicationsChange: 0, avgApplicationsPerOpp: 0 },
          teams: { viewed: 0, saved: 0, contacted: 0 },
          pipeline: { inReview: 0, interviewing: 0, offersMade: 0, offersAccepted: 0, hires: 0 },
          topOpportunities: [],
        };
      }
      return response.json();
    },
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
          onClick={() => router.push('/app/company')}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to company
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2" />
              Company Analytics
            </h1>
            <p className="mt-2 text-text-secondary">
              Track your hiring activity and engagement
            </p>
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
          value={analytics?.profile.views || 0}
          change={analytics?.profile.viewsChange}
          icon={EyeIcon}
          subtext={`${analytics?.profile.uniqueVisitors || 0} unique`}
        />
        <StatCard
          title="Active Opportunities"
          value={analytics?.opportunities.active || 0}
          icon={BriefcaseIcon}
          subtext={`${analytics?.opportunities.total || 0} total`}
        />
        <StatCard
          title="Applications"
          value={analytics?.opportunities.applications || 0}
          change={analytics?.opportunities.applicationsChange}
          icon={DocumentTextIcon}
        />
        <StatCard
          title="Teams Contacted"
          value={analytics?.teams.contacted || 0}
          icon={UserGroupIcon}
          subtext={`${analytics?.teams.saved || 0} saved`}
        />
      </div>

      {/* Hiring Pipeline */}
      <div className="card mb-8">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-medium text-text-primary">Hiring Pipeline</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {[
              { label: 'In Review', value: analytics?.pipeline.inReview || 0, color: 'bg-gray-200' },
              { label: 'Interviewing', value: analytics?.pipeline.interviewing || 0, color: 'bg-blue-200' },
              { label: 'Offers Made', value: analytics?.pipeline.offersMade || 0, color: 'bg-gold-200' },
              { label: 'Accepted', value: analytics?.pipeline.offersAccepted || 0, color: 'bg-success-light' },
              { label: 'Hires', value: analytics?.pipeline.hires || 0, color: 'bg-navy-100' },
            ].map((stage, i) => (
              <div key={stage.label} className="flex-1 text-center">
                <div className={`h-2 ${stage.color} ${i === 0 ? 'rounded-l' : ''} ${i === 4 ? 'rounded-r' : ''}`}></div>
                <p className="text-2xl font-bold text-text-primary mt-3">{stage.value}</p>
                <p className="text-sm text-text-secondary">{stage.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-medium text-text-primary">Team Engagement</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Teams Viewed</span>
                <span className="font-medium text-text-primary">{analytics?.teams.viewed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Teams Saved</span>
                <span className="font-medium text-text-primary">{analytics?.teams.saved || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Teams Contacted</span>
                <span className="font-medium text-text-primary">{analytics?.teams.contacted || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-medium text-text-primary">Opportunity Performance</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Total Opportunities</span>
                <span className="font-medium text-text-primary">{analytics?.opportunities.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Active Opportunities</span>
                <span className="font-medium text-text-primary">{analytics?.opportunities.active || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Avg. Applications/Opp</span>
                <span className="font-medium text-text-primary">
                  {analytics?.opportunities.avgApplicationsPerOpp?.toFixed(1) || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-medium text-text-primary">Top Performing Opportunities</h2>
        </div>
        <div className="px-6 py-4">
          {analytics?.topOpportunities && analytics.topOpportunities.length > 0 ? (
            <div className="space-y-3">
              {analytics.topOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => router.push(`/app/opportunities/${opp.id}`)}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-bg-alt rounded px-2 -mx-2"
                >
                  <div>
                    <p className="font-medium text-text-primary">{opp.title}</p>
                    <p className="text-sm text-text-tertiary">{opp.views} views</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-text-primary">{opp.applications}</p>
                    <p className="text-xs text-text-tertiary">applications</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-4">
              No opportunity data yet. Create opportunities to see analytics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
