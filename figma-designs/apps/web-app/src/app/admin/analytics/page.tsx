'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    newUsers: number;
    userGrowth: number;
    totalTeams: number;
    newTeams: number;
    teamGrowth: number;
    totalCompanies: number;
    newCompanies: number;
    totalOpportunities: number;
    activeOpportunities: number;
    totalApplications: number;
    newApplications: number;
    applicationGrowth: number;
    successfulMatches: number;
    conversionRate: number;
    activeConversations: number;
    totalMessages: number;
    newMessages: number;
  };
  charts: {
    signupTrend: { label: string; value: number }[];
    userTypeDistribution: { type: string; count: number }[];
    applicationStatusDistribution: { status: string; count: number }[];
  };
  topTeams: { id: string; name: string; applicationCount: number }[];
  recentActivity: {
    newUsers: number;
    newTeams: number;
    newCompanies: number;
    newApplications: number;
    newMessages: number;
  };
  period: number;
}

function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-12">{item.label}</span>
          <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-sm text-white font-medium w-12 text-right">
            {item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  changeType,
  period,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-gray-700">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center gap-1">
          {changeType === 'increase' && (
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
          )}
          {changeType === 'decrease' && (
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
          )}
          <span
            className={`text-sm font-medium ${
              changeType === 'increase'
                ? 'text-green-400'
                : changeType === 'decrease'
                  ? 'text-red-400'
                  : 'text-gray-400'
            }`}
          >
            {change}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400 mt-1">{title}</p>
      </div>
      <p className="text-xs text-gray-500 mt-2">{period}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/analytics?period=${period}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const overview = data?.overview;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
          <p className="mt-1 text-sm text-gray-400">
            Monitor platform performance and user engagement
          </p>
        </div>
        <div className="flex gap-2">
          {(['7', '30', '90'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                period === p
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {p === '7' ? '7 days' : p === '30' ? '30 days' : '90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={overview?.totalUsers?.toLocaleString() || '0'}
          change={`${overview?.userGrowth && overview.userGrowth >= 0 ? '+' : ''}${overview?.userGrowth || 0}%`}
          changeType={
            overview?.userGrowth && overview.userGrowth > 0
              ? 'increase'
              : overview?.userGrowth && overview.userGrowth < 0
                ? 'decrease'
                : 'neutral'
          }
          period={`${overview?.newUsers || 0} new in ${period}d`}
          icon={UsersIcon}
        />
        <MetricCard
          title="Active Teams"
          value={overview?.totalTeams?.toLocaleString() || '0'}
          change={`${overview?.teamGrowth && overview.teamGrowth >= 0 ? '+' : ''}${overview?.teamGrowth || 0}%`}
          changeType={
            overview?.teamGrowth && overview.teamGrowth > 0
              ? 'increase'
              : overview?.teamGrowth && overview.teamGrowth < 0
                ? 'decrease'
                : 'neutral'
          }
          period={`${overview?.newTeams || 0} new in ${period}d`}
          icon={ChartBarIcon}
        />
        <MetricCard
          title="Companies"
          value={overview?.totalCompanies?.toLocaleString() || '0'}
          change={`${overview?.newCompanies || 0} new`}
          changeType={overview?.newCompanies && overview.newCompanies > 0 ? 'increase' : 'neutral'}
          period={`${overview?.activeOpportunities || 0} active opportunities`}
          icon={BuildingOfficeIcon}
        />
        <MetricCard
          title="Applications"
          value={overview?.totalApplications?.toLocaleString() || '0'}
          change={`${overview?.applicationGrowth && overview.applicationGrowth >= 0 ? '+' : ''}${overview?.applicationGrowth || 0}%`}
          changeType={
            overview?.applicationGrowth && overview.applicationGrowth > 0
              ? 'increase'
              : overview?.applicationGrowth && overview.applicationGrowth < 0
                ? 'decrease'
                : 'neutral'
          }
          period={`${overview?.conversionRate || 0}% success rate`}
          icon={DocumentTextIcon}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User registrations chart */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Daily User Registrations</h3>
          {data?.charts?.signupTrend && data.charts.signupTrend.length > 0 ? (
            <SimpleBarChart data={data.charts.signupTrend} />
          ) : (
            <p className="text-gray-500 text-center py-8">No signup data available</p>
          )}
        </div>

        {/* User types */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Users by Type</h3>
          {data?.charts?.userTypeDistribution && data.charts.userTypeDistribution.length > 0 ? (
            <SimpleBarChart
              data={data.charts.userTypeDistribution.map((item) => ({
                label: item.type || 'Unknown',
                value: item.count,
              }))}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No user type data available</p>
          )}
        </div>
      </div>

      {/* Application Status & Top Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application status distribution */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Applications by Status</h3>
          {data?.charts?.applicationStatusDistribution &&
          data.charts.applicationStatusDistribution.length > 0 ? (
            <SimpleBarChart
              data={data.charts.applicationStatusDistribution.map((item) => ({
                label: item.status,
                value: item.count,
              }))}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No application data available</p>
          )}
        </div>

        {/* Top teams */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top Teams by Applications</h3>
          {data?.topTeams && data.topTeams.length > 0 ? (
            <div className="space-y-3">
              {data.topTeams.map((team, index) => (
                <div key={team.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                    <span className="text-white">{team.name}</span>
                  </div>
                  <span className="text-gray-400">{team.applicationCount} apps</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No team data available</p>
          )}
        </div>
      </div>

      {/* Platform activity summary */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Activity Summary (Last {period} days)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div>
            <p className="text-3xl font-bold text-white">{overview?.newUsers || 0}</p>
            <p className="text-sm text-gray-400 mt-1">New Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{overview?.newTeams || 0}</p>
            <p className="text-sm text-gray-400 mt-1">New Teams</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{overview?.newCompanies || 0}</p>
            <p className="text-sm text-gray-400 mt-1">New Companies</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{overview?.newApplications || 0}</p>
            <p className="text-sm text-gray-400 mt-1">Applications</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{overview?.newMessages || 0}</p>
            <p className="text-sm text-gray-400 mt-1">Messages</p>
          </div>
        </div>
      </div>

      {/* Engagement metrics */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Engagement</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{overview?.activeConversations || 0}</p>
              <p className="text-sm text-gray-400">Active Conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <DocumentTextIcon className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{overview?.totalMessages || 0}</p>
              <p className="text-sm text-gray-400">Total Messages</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <BriefcaseIcon className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{overview?.activeOpportunities || 0}</p>
              <p className="text-sm text-gray-400">Active Opportunities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <ArrowTrendingUpIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{overview?.successfulMatches || 0}</p>
              <p className="text-sm text-gray-400">Successful Matches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
