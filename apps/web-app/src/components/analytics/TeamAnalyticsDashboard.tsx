'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  CurrencyDollarIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { 
  TeamAnalytics, 
  TeamMetrics, 
  TeamBenchmark,
  teamAnalyticsService 
} from '@/lib/team-analytics';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface TeamAnalyticsDashboardProps {
  teamId: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    period: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-navy-50 text-navy',
    green: 'bg-success-light text-success-dark',
    yellow: 'bg-gold-100 text-gold-800',
    red: 'bg-error-light text-error-dark',
    purple: 'bg-gold-100 text-gold-800'
  };

  const trendIcon = trend?.direction === 'up'
    ? <ArrowUpIcon className="h-4 w-4 text-success" />
    : trend?.direction === 'down'
    ? <ArrowDownIcon className="h-4 w-4 text-error" />
    : <MinusIcon className="h-4 w-4 text-text-tertiary" />;

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {subtitle && (
            <p className="text-sm text-text-tertiary mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              {trendIcon}
              <span className={`ml-1 ${
                trend.direction === 'up' ? 'text-success' :
                trend.direction === 'down' ? 'text-error' : 'text-text-secondary'
              }`}>
                {Math.abs(trend.value)}% {trend.period}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export function TeamAnalyticsDashboard({ teamId }: TeamAnalyticsDashboardProps) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [benchmarks, setBenchmarks] = useState<TeamBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'benchmarks' | 'trends'>('overview');

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, benchmarkData] = await Promise.all([
        teamAnalyticsService.getTeamAnalytics(teamId),
        teamAnalyticsService.getTeamBenchmarks(teamId)
      ]);
      
      setAnalytics(analyticsData);
      setBenchmarks(benchmarkData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load team analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-bg-alt rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-bg-alt rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-bg-alt rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No analytics available</h3>
        <p className="text-text-secondary">Analytics data is not available for this team yet.</p>
      </div>
    );
  }

  const { metrics } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Team analytics</h2>
        <button
          onClick={loadAnalytics}
          className="btn-outline min-h-12"
        >
          Refresh data
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'performance', label: 'Performance' },
            { id: 'benchmarks', label: 'Benchmarks' },
            { id: 'trends', label: 'Trends' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm min-h-11 ${
                activeTab === tab.id
                  ? 'border-navy text-navy'
                  : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Members"
              value={metrics.totalMembers}
              subtitle={`${metrics.activeMembers} active`}
              icon={<UsersIcon className="h-6 w-6" />}
              trend={{
                value: metrics.memberGrowthRate,
                direction: metrics.memberGrowthRate > 0 ? 'up' : 'down',
                period: 'this quarter'
              }}
              color="blue"
            />

            <MetricCard
              title="Liftout Success Rate"
              value={formatPercentage(metrics.liftoutSuccessRate)}
              subtitle={`${metrics.totalLiftouts} total liftouts`}
              icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
              trend={{
                value: 12.5,
                direction: 'up',
                period: 'vs last quarter'
              }}
              color="green"
            />

            <MetricCard
              title="Avg Liftout Value"
              value={formatCurrency(metrics.avgLiftoutValue)}
              subtitle="Per successful liftout"
              icon={<CurrencyDollarIcon className="h-6 w-6" />}
              trend={{
                value: 8.3,
                direction: 'up',
                period: 'vs industry avg'
              }}
              color="yellow"
            />

            <MetricCard
              title="Team Cohesion"
              value={`${metrics.teamCohesion.toFixed(1)}/100`}
              subtitle={`${metrics.avgTenure.toFixed(1)} months avg tenure`}
              icon={<StarIcon className="h-6 w-6" />}
              trend={{
                value: 5.2,
                direction: 'up',
                period: 'improving'
              }}
              color="purple"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Profile Views"
              value={metrics.profileViews.toLocaleString()}
              subtitle="Last 30 days"
              icon={<EyeIcon className="h-6 w-6" />}
              color="blue"
            />

            <MetricCard
              title="Expressions of Interest"
              value={metrics.expressionsOfInterest}
              subtitle={`${formatPercentage(metrics.opportunityResponseRate)} response rate`}
              icon={<HeartIcon className="h-6 w-6" />}
              color="green"
            />

            <MetricCard
              title="Last Activity"
              value={formatDistanceToNow(metrics.lastActivityDate, { addSuffix: true })}
              subtitle="Team engagement"
              icon={<CalendarIcon className="h-6 w-6" />}
              color="purple"
            />
          </div>

          {/* Role Distribution */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Team composition</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">{metrics.membersByRole.leader}</div>
                <div className="text-sm text-text-secondary">Leaders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">{metrics.membersByRole.admin}</div>
                <div className="text-sm text-text-secondary">Admins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-secondary">{metrics.membersByRole.member}</div>
                <div className="text-sm text-text-secondary">Members</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Client satisfaction</h3>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-text-primary">{metrics.clientSatisfaction.toFixed(1)}</div>
                <div className="ml-2 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${
                        star <= metrics.clientSatisfaction ? 'text-gold' : 'text-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-text-secondary mt-2">Based on recent client feedback</p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Communication score</h3>
              <div className="text-3xl font-bold text-text-primary">{metrics.communicationScore}/100</div>
              <div className="w-full bg-bg-alt rounded-full h-2 mt-2">
                <div
                  className="bg-navy h-2 rounded-full"
                  style={{ width: `${metrics.communicationScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-text-secondary mt-2">Team collaboration effectiveness</p>
            </div>
          </div>

          {/* Performance History */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Recent performance history</h3>
            <div className="space-y-3">
              {analytics.performanceHistory.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <div>
                    <div className="text-sm font-medium text-text-primary">{event.description}</div>
                    <div className="text-xs text-text-tertiary">
                      {formatDistanceToNow(new Date(event.recordedAt), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-success">
                    {event.metricType === 'liftout' ? formatCurrency(event.value) : event.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Benchmarks Tab */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-medium text-text-primary">Industry benchmarks</h3>
              <p className="text-sm text-text-secondary">How your team compares to industry standards</p>
            </div>
            <div className="divide-y divide-border">
              {benchmarks.map((benchmark, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-text-primary capitalize">
                      {benchmark.metric.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-text-tertiary">{benchmark.percentile}th percentile</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-text-secondary">Your team</div>
                      <div className="font-semibold text-navy">
                        {benchmark.metric.includes('Rate') || benchmark.metric.includes('Cohesion')
                          ? formatPercentage(benchmark.value)
                          : formatCurrency(benchmark.value)}
                      </div>
                    </div>
                    <div>
                      <div className="text-text-secondary">Industry avg</div>
                      <div className="font-semibold">
                        {benchmark.metric.includes('Rate') || benchmark.metric.includes('Cohesion')
                          ? formatPercentage(benchmark.industryAverage)
                          : formatCurrency(benchmark.industryAverage)}
                      </div>
                    </div>
                    <div>
                      <div className="text-text-secondary">Top performer</div>
                      <div className="font-semibold text-success">
                        {benchmark.metric.includes('Rate') || benchmark.metric.includes('Cohesion')
                          ? formatPercentage(benchmark.topPerformer)
                          : formatCurrency(benchmark.topPerformer)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liftout Performance Trend */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Liftout performance</h3>
              <div className="space-y-3">
                {analytics.trends.liftoutPerformance.map((period, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{period.period}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{period.count} liftouts</div>
                      <div className="text-xs text-text-tertiary">{formatCurrency(period.value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Trends */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Engagement trends</h3>
              <div className="space-y-3">
                {analytics.trends.engagementTrends.map((period, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{period.period}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{period.views} views</div>
                      <div className="text-xs text-text-tertiary">{period.interest} interests</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}