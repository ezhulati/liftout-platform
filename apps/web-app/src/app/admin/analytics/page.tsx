'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Simple bar chart component (using Recharts in production)
function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-8">{item.label}</span>
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
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock data
  const metrics = {
    users: { value: 1247, change: '+12.5%', changeType: 'increase' as const },
    teams: { value: 89, change: '+8.3%', changeType: 'increase' as const },
    opportunities: { value: 124, change: '-2.1%', changeType: 'decrease' as const },
    applications: { value: 342, change: '+24.7%', changeType: 'increase' as const },
  };

  const userGrowthData = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 52 },
    { label: 'Wed', value: 38 },
    { label: 'Thu', value: 65 },
    { label: 'Fri', value: 48 },
    { label: 'Sat', value: 32 },
    { label: 'Sun', value: 28 },
  ];

  const topIndustriesData = [
    { label: 'Tech', value: 342 },
    { label: 'Finance', value: 287 },
    { label: 'Consult', value: 156 },
    { label: 'Health', value: 98 },
    { label: 'Legal', value: 67 },
  ];

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
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                period === p
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {p === '7d' ? '7 days' : p === '30d' ? '30 days' : '90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={metrics.users.value.toLocaleString()}
          change={metrics.users.change}
          changeType={metrics.users.changeType}
          period={`vs previous ${period}`}
          icon={UsersIcon}
        />
        <MetricCard
          title="Active Teams"
          value={metrics.teams.value}
          change={metrics.teams.change}
          changeType={metrics.teams.changeType}
          period={`vs previous ${period}`}
          icon={ChartBarIcon}
        />
        <MetricCard
          title="Open Opportunities"
          value={metrics.opportunities.value}
          change={metrics.opportunities.change}
          changeType={metrics.opportunities.changeType}
          period={`vs previous ${period}`}
          icon={ClockIcon}
        />
        <MetricCard
          title="Applications"
          value={metrics.applications.value}
          change={metrics.applications.change}
          changeType={metrics.applications.changeType}
          period={`vs previous ${period}`}
          icon={CurrencyDollarIcon}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User registrations chart */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Daily User Registrations</h3>
          <SimpleBarChart data={userGrowthData} />
        </div>

        {/* Top industries */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Teams by Industry</h3>
          <SimpleBarChart data={topIndustriesData} />
        </div>
      </div>

      {/* Platform health */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Platform Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-green-400">99.9%</p>
            <p className="text-sm text-gray-400 mt-1">Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">142ms</p>
            <p className="text-sm text-gray-400 mt-1">Avg. Response Time</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-sm text-gray-400 mt-1">Error Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">67%</p>
            <p className="text-sm text-gray-400 mt-1">DAU/MAU Ratio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
