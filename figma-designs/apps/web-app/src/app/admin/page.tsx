'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UsersIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface DashboardMetrics {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    activeThisWeek: number;
  };
  teams: {
    total: number;
    verified: number;
    pendingVerification: number;
  };
  companies: {
    total: number;
    verified: number;
    pendingVerification: number;
  };
  opportunities: {
    total: number;
    active: number;
  };
  applications: {
    total: number;
  };
  moderation: {
    pendingFlags: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    createdAt: string;
    user?: {
      email: string;
      firstName: string;
      lastName: string;
    };
  }>;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  href,
  color = 'gray',
}: {
  title: string;
  value: number | string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue';
}) {
  const colorClasses = {
    gray: 'bg-gray-800 border-gray-700',
    red: 'bg-red-900/20 border-red-800/50',
    yellow: 'bg-yellow-900/20 border-yellow-800/50',
    green: 'bg-green-900/20 border-green-800/50',
    blue: 'bg-blue-900/20 border-blue-800/50',
  };

  const iconColors = {
    gray: 'text-gray-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
  };

  const Content = () => (
    <div className={`rounded-xl border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {change && (
            <div className="mt-2 flex items-center gap-1">
              {changeType === 'increase' && (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
              )}
              {changeType === 'decrease' && (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
              )}
              <span
                className={`text-sm ${
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
          )}
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className={`h-6 w-6 ${iconColors[color]}`} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-90 transition-opacity">
        <Content />
      </Link>
    );
  }

  return <Content />;
}

function ActionCard({
  title,
  count,
  description,
  href,
  icon: Icon,
  priority = 'normal',
}: {
  title: string;
  count: number;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  priority?: 'normal' | 'high' | 'critical';
}) {
  const priorityClasses = {
    normal: 'border-gray-700 hover:border-gray-600',
    high: 'border-yellow-800/50 hover:border-yellow-700/50 bg-yellow-900/10',
    critical: 'border-red-800/50 hover:border-red-700/50 bg-red-900/10',
  };

  const iconColors = {
    normal: 'text-gray-400',
    high: 'text-yellow-400',
    critical: 'text-red-400',
  };

  return (
    <Link
      href={href}
      className={`block rounded-lg border p-4 transition-colors ${priorityClasses[priority]}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${iconColors[priority]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-white">{count}</p>
            <p className="text-sm font-medium text-gray-300">{title}</p>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <ClockIcon className="h-5 w-5 text-gray-600" />
        </div>
      </div>
    </Link>
  );
}

function RecentActivityItem({
  activity,
}: {
  activity: {
    id: string;
    action: string;
    createdAt: string;
    user?: {
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}) {
  const formatAction = (action: string) => {
    const actionMap: Record<string, { label: string; color: string }> = {
      'user.view': { label: 'Viewed user', color: 'text-gray-400' },
      'user.edit': { label: 'Edited user', color: 'text-blue-400' },
      'user.suspend': { label: 'Suspended user', color: 'text-yellow-400' },
      'user.ban': { label: 'Banned user', color: 'text-red-400' },
      'verification.company.approve': { label: 'Approved company', color: 'text-green-400' },
      'verification.company.reject': { label: 'Rejected company', color: 'text-red-400' },
      'verification.team.approve': { label: 'Approved team', color: 'text-green-400' },
      'verification.team.reject': { label: 'Rejected team', color: 'text-red-400' },
      'moderation.approve': { label: 'Approved content', color: 'text-green-400' },
      'moderation.reject': { label: 'Rejected content', color: 'text-red-400' },
      'admin.login': { label: 'Admin login', color: 'text-gray-400' },
    };

    return actionMap[action] || { label: action, color: 'text-gray-400' };
  };

  const { label, color } = formatAction(activity.action);
  const timeAgo = formatTimeAgo(new Date(activity.createdAt));

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-800 last:border-0">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${color}`}>{label}</p>
        {activity.user && (
          <p className="text-xs text-gray-500 truncate">
            by {activity.user.firstName} {activity.user.lastName}
          </p>
        )}
      </div>
      <span className="text-xs text-gray-600">{timeAgo}</span>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-800 rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Failed to load dashboard metrics</p>
      </div>
    );
  }

  const pendingTotal =
    metrics.teams.pendingVerification +
    metrics.companies.pendingVerification +
    metrics.moderation.pendingFlags;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Platform overview and pending actions
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={metrics.users.total.toLocaleString()}
          change={`+${metrics.users.newThisWeek} this week`}
          changeType="increase"
          icon={UsersIcon}
          href="/admin/users"
        />
        <StatCard
          title="Active Teams"
          value={metrics.teams.total}
          change={`${metrics.teams.verified} verified`}
          changeType="neutral"
          icon={UserGroupIcon}
          href="/admin/verification/teams"
          color="blue"
        />
        <StatCard
          title="Companies"
          value={metrics.companies.total}
          change={`${metrics.companies.verified} verified`}
          changeType="neutral"
          icon={BuildingOfficeIcon}
          href="/admin/verification/companies"
          color="green"
        />
        <StatCard
          title="Open Opportunities"
          value={metrics.opportunities.active}
          change={`${metrics.opportunities.total} total`}
          changeType="neutral"
          icon={BriefcaseIcon}
          href="/admin/applications"
        />
      </div>

      {/* Pending actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Pending Actions</h2>
        {pendingTotal === 0 ? (
          <div className="rounded-lg border border-gray-700 p-8 text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-300 font-medium">All caught up!</p>
            <p className="text-gray-500 text-sm mt-1">No pending actions require your attention.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.teams.pendingVerification > 0 && (
              <ActionCard
                title="Team Verifications"
                count={metrics.teams.pendingVerification}
                description="Teams awaiting verification review"
                href="/admin/verification/teams"
                icon={UserGroupIcon}
                priority={metrics.teams.pendingVerification > 10 ? 'high' : 'normal'}
              />
            )}
            {metrics.companies.pendingVerification > 0 && (
              <ActionCard
                title="Company Verifications"
                count={metrics.companies.pendingVerification}
                description="Companies awaiting verification review"
                href="/admin/verification/companies"
                icon={BuildingOfficeIcon}
                priority={metrics.companies.pendingVerification > 5 ? 'high' : 'normal'}
              />
            )}
            {metrics.moderation.pendingFlags > 0 && (
              <ActionCard
                title="Moderation Queue"
                count={metrics.moderation.pendingFlags}
                description="Flagged content requiring review"
                href="/admin/moderation"
                icon={FlagIcon}
                priority={metrics.moderation.pendingFlags > 5 ? 'critical' : 'high'}
              />
            )}
          </div>
        )}
      </div>

      {/* Two column layout for activity and quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-700 bg-gray-800/50">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Recent Admin Activity</h2>
            </div>
            <div className="px-6 py-4">
              {metrics.recentActivity.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">No recent activity</p>
              ) : (
                <div className="divide-y divide-gray-800">
                  {metrics.recentActivity.slice(0, 10).map((activity) => (
                    <RecentActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              )}
              <Link
                href="/admin/security/audit"
                className="block mt-4 text-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                View full audit log
              </Link>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Platform Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">New Users Today</span>
                <span className="text-sm font-semibold text-white">{metrics.users.newToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Active This Week</span>
                <span className="text-sm font-semibold text-white">
                  {metrics.users.activeThisWeek}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Total Applications</span>
                <span className="text-sm font-semibold text-white">{metrics.applications.total}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/admin/users"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white py-2 transition-colors"
              >
                <UsersIcon className="h-4 w-4" />
                Manage Users
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white py-2 transition-colors"
              >
                <ArrowTrendingUpIcon className="h-4 w-4" />
                View Analytics
              </Link>
              <Link
                href="/admin/security/audit"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white py-2 transition-colors"
              >
                <ClipboardDocumentListIcon className="h-4 w-4" />
                Audit Log
              </Link>
              <Link
                href="/admin/compliance/gdpr"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white py-2 transition-colors"
              >
                <ExclamationTriangleIcon className="h-4 w-4" />
                GDPR Requests
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
