'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  LiftoutAnalytics, 
  calculateOverallROI, 
  getPerformanceGrade,
  identifyKeyInsights,
  generateRecommendations,
  mockLiftoutAnalytics 
} from '@/lib/analytics';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsDashboardProps {
  companyId?: string;
  period?: string;
}

export function AnalyticsDashboard({ companyId, period }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<LiftoutAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  useEffect(() => {
    setTimeout(() => {
      setAnalytics(mockLiftoutAnalytics);
      setIsLoading(false);
    }, 500);
  }, [companyId, period]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-bg-alt rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-alt rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const overallROI = calculateOverallROI(analytics);
  const performanceGrade = getPerformanceGrade(analytics);
  const insights = identifyKeyInsights(analytics);
  const recommendations = generateRecommendations(analytics);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-success-dark bg-success-light';
      case 'B': return 'text-navy bg-navy-50';
      case 'C': return 'text-gold-800 bg-gold-100';
      case 'D': return 'text-gold-800 bg-gold-100';
      case 'F': return 'text-error-dark bg-error-light';
      default: return 'text-text-secondary bg-bg-alt';
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUpIcon className="h-4 w-4 text-success" />;
    if (change < 0) return <ArrowDownIcon className="h-4 w-4 text-error" />;
    return <div className="h-4 w-4"></div>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="space-y-8">
      {/* Header & Performance Grade - Practical UI: bold headings, proper spacing */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary font-heading leading-tight">Liftout analytics dashboard</h2>
            <p className="text-base font-normal text-text-secondary mt-2 leading-relaxed">
              {analytics.reportingPeriod.type.charAt(0).toUpperCase() + analytics.reportingPeriod.type.slice(1)} Report: {new Date(analytics.reportingPeriod.startDate).toLocaleDateString()} - {new Date(analytics.reportingPeriod.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl text-2xl font-bold ${getGradeColor(performanceGrade)}`}>
              {performanceGrade}
            </div>
            <p className="text-sm font-bold text-text-tertiary mt-2">Performance grade</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview - Practical UI: consistent card styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-success" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Total ROI</p>
              <p className="text-xl font-bold text-text-primary mt-1">{formatPercentage(overallROI)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">vs {formatPercentage(analytics.roiAnalysis.totalROI)} target</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-navy" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Success rate</p>
              <p className="text-xl font-bold text-text-primary mt-1">{formatPercentage(analytics.platformMetrics.successfulLiftouts.successRate)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">{analytics.platformMetrics.successfulLiftouts.completed} of {analytics.platformMetrics.successfulLiftouts.total} completed</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-gold" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Retention (12mo)</p>
              <p className="text-xl font-bold text-text-primary mt-1">{formatPercentage(analytics.platformMetrics.retentionRates.month12)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">+{formatPercentage(analytics.platformMetrics.retentionRates.industryComparison)} vs industry</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-gold" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Time to hire</p>
              <p className="text-xl font-bold text-text-primary mt-1">{analytics.platformMetrics.timeToHire.average}d</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">{formatPercentage(analytics.platformMetrics.timeToHire.benchmarkComparison)} vs benchmark</span>
          </div>
        </div>
      </div>

      {/* Business Impact Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Impact */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-success" aria-hidden="true" />
            Revenue impact
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Total impact</span>
              <span className="text-lg font-semibold text-text-primary">{formatCurrency(analytics.businessOutcomes.revenueGrowth.totalImpact)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Quarter over quarter</span>
              <div className="flex items-center">
                {getTrendIcon(analytics.businessOutcomes.revenueGrowth.quarterOverQuarter)}
                <span className="ml-1 text-sm font-medium">{formatPercentage(analytics.businessOutcomes.revenueGrowth.quarterOverQuarter)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Year over year</span>
              <div className="flex items-center">
                {getTrendIcon(analytics.businessOutcomes.revenueGrowth.yearOverYear)}
                <span className="ml-1 text-sm font-medium">{formatPercentage(analytics.businessOutcomes.revenueGrowth.yearOverYear)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Revenue per liftout</span>
              <span className="text-sm font-medium">{formatCurrency(analytics.businessOutcomes.revenueGrowth.revenuePerLiftout)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-text-secondary mb-3">Revenue sources</h4>
            <div className="space-y-2">
              {analytics.businessOutcomes.revenueGrowth.revenueBreakdown.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">{source.source}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium">{formatCurrency(source.amount)}</span>
                    <span className="text-xs text-text-tertiary">({formatPercentage(source.percentage)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-navy" aria-hidden="true" />
            Performance metrics
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Match quality score</span>
              <span className="text-lg font-semibold text-text-primary">{analytics.platformMetrics.matchQuality.averageScore}/100</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Client satisfaction</span>
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-gold fill-current" />
                <span className="ml-1 text-sm font-medium">{analytics.platformMetrics.clientSatisfaction.overall}/10</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Team productivity gain</span>
              <span className="text-sm font-medium text-success">+{formatPercentage(analytics.businessOutcomes.teamPerformance.productivityGains)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Innovation index</span>
              <span className="text-sm font-medium">{analytics.businessOutcomes.teamPerformance.innovationIndex}/100</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-text-secondary mb-3">Stage efficiency</h4>
            <div className="space-y-2">
              {analytics.platformMetrics.timeToHire.stageBreakdown.slice(0, 3).map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">{stage.stage.replace(/_/g, ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium">{stage.averageDays}d</span>
                    <span className={`text-xs ${stage.efficiency > 100 ? 'text-success' : 'text-error'}`}>
                      {formatPercentage(stage.efficiency - 100)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <LightBulbIcon className="h-5 w-5 text-gold" aria-hidden="true" />
          Key insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-text-secondary mb-3">Performance analysis</h4>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-navy rounded-full mt-2"></div>
                  </div>
                  <p className="ml-3 text-sm text-text-secondary">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-text-secondary mb-3">Recommendations</h4>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-4 w-4 text-success mt-0.5" />
                  </div>
                  <p className="ml-3 text-sm text-text-secondary">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Industry Benchmarks */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Industry benchmarks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-bg-alt">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">Your performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">Industry average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">Top quartile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">Ranking</th>
              </tr>
            </thead>
            <tbody className="bg-bg-surface divide-y divide-border">
              {analytics.industryBenchmarks.map((benchmark, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{benchmark.metric}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{benchmark.companyValue}{benchmark.metric.includes('Rate') || benchmark.metric.includes('Time') ? (benchmark.metric.includes('Time') ? 'd' : '%') : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-tertiary">{benchmark.industryAverage}{benchmark.metric.includes('Rate') || benchmark.metric.includes('Time') ? (benchmark.metric.includes('Time') ? 'd' : '%') : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-tertiary">{benchmark.topQuartile}{benchmark.metric.includes('Rate') || benchmark.metric.includes('Time') ? (benchmark.metric.includes('Time') ? 'd' : '%') : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      benchmark.ranking >= 80 ? 'bg-success-light text-success-dark' :
                      benchmark.ranking >= 60 ? 'bg-gold-100 text-gold-800' :
                      'bg-error-light text-error-dark'
                    }`}>
                      {benchmark.ranking}th percentile
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons - Practical UI: 48px touch targets */}
      <div className="flex flex-wrap gap-4">
        <button onClick={() => toast.success('Report exported successfully')} className="btn-primary min-h-12 transition-colors duration-fast">
          Export full report
        </button>
        <button onClick={() => toast.success('Meeting invitation sent')} className="btn-outline min-h-12 transition-colors duration-fast">
          Schedule review meeting
        </button>
        <button onClick={() => toast.success('Alert preferences saved')} className="btn-outline min-h-12 transition-colors duration-fast">
          Configure alerts
        </button>
        <button onClick={() => toast.success('Loading historical data...')} className="btn-outline min-h-12 transition-colors duration-fast">
          Historical trends
        </button>
      </div>
    </div>
  );
}