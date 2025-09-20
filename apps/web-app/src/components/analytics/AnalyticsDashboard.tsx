'use client';

import { useState, useEffect } from 'react';
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
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
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
      {/* Header & Performance Grade */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Liftout Analytics Dashboard</h2>
            <p className="text-gray-600 mt-1">
              {analytics.reportingPeriod.type.charAt(0).toUpperCase() + analytics.reportingPeriod.type.slice(1)} Report: {new Date(analytics.reportingPeriod.startDate).toLocaleDateString()} - {new Date(analytics.reportingPeriod.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${getGradeColor(performanceGrade)}`}>
              {performanceGrade}
            </div>
            <p className="text-sm text-gray-500 mt-2">Performance Grade</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total ROI</p>
              <p className="text-2xl font-semibold text-gray-900">{formatPercentage(overallROI)}</p>
              <p className="text-xs text-gray-500">vs {formatPercentage(analytics.roiAnalysis.totalROI)} target</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{formatPercentage(analytics.platformMetrics.successfulLiftouts.successRate)}</p>
              <p className="text-xs text-gray-500">{analytics.platformMetrics.successfulLiftouts.completed} of {analytics.platformMetrics.successfulLiftouts.total} completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Retention (12mo)</p>
              <p className="text-2xl font-semibold text-gray-900">{formatPercentage(analytics.platformMetrics.retentionRates.month12)}</p>
              <p className="text-xs text-gray-500">+{formatPercentage(analytics.platformMetrics.retentionRates.industryComparison)} vs industry</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Time to Hire</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.platformMetrics.timeToHire.average}d</p>
              <p className="text-xs text-gray-500">{formatPercentage(analytics.platformMetrics.timeToHire.benchmarkComparison)} vs benchmark</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Impact Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Impact */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
            Revenue Impact
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Impact</span>
              <span className="text-lg font-semibold text-gray-900">{formatCurrency(analytics.businessOutcomes.revenueGrowth.totalImpact)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quarter over Quarter</span>
              <div className="flex items-center">
                {getTrendIcon(analytics.businessOutcomes.revenueGrowth.quarterOverQuarter)}
                <span className="ml-1 text-sm font-medium">{formatPercentage(analytics.businessOutcomes.revenueGrowth.quarterOverQuarter)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Year over Year</span>
              <div className="flex items-center">
                {getTrendIcon(analytics.businessOutcomes.revenueGrowth.yearOverYear)}
                <span className="ml-1 text-sm font-medium">{formatPercentage(analytics.businessOutcomes.revenueGrowth.yearOverYear)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue per Liftout</span>
              <span className="text-sm font-medium">{formatCurrency(analytics.businessOutcomes.revenueGrowth.revenuePerLiftout)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue Sources</h4>
            <div className="space-y-2">
              {analytics.businessOutcomes.revenueGrowth.revenueBreakdown.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{source.source}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium">{formatCurrency(source.amount)}</span>
                    <span className="text-xs text-gray-500">({formatPercentage(source.percentage)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
            Performance Metrics
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Match Quality Score</span>
              <span className="text-lg font-semibold text-gray-900">{analytics.platformMetrics.matchQuality.averageScore}/100</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Client Satisfaction</span>
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">{analytics.platformMetrics.clientSatisfaction.overall}/10</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Team Productivity Gain</span>
              <span className="text-sm font-medium text-green-600">+{formatPercentage(analytics.businessOutcomes.teamPerformance.productivityGains)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Innovation Index</span>
              <span className="text-sm font-medium">{analytics.businessOutcomes.teamPerformance.innovationIndex}/100</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Stage Efficiency</h4>
            <div className="space-y-2">
              {analytics.platformMetrics.timeToHire.stageBreakdown.slice(0, 3).map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{stage.stage.replace(/_/g, ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium">{stage.averageDays}d</span>
                    <span className={`text-xs ${stage.efficiency > 100 ? 'text-green-600' : 'text-red-600'}`}>
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
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Analysis</h4>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recommendations</h4>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Industry Benchmarks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Industry Benchmarks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Quartile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ranking</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.industryBenchmarks.map((benchmark, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{benchmark.metric}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{benchmark.companyValue}{benchmark.metric.includes('Rate') || benchmark.metric.includes('Time') ? (benchmark.metric.includes('Time') ? 'd' : '%') : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{benchmark.industryAverage}{benchmark.metric.includes('Rate') || benchmark.metric.includes('Time') ? (benchmark.metric.includes('Time') ? 'd' : '%') : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{benchmark.topQuartile}{benchmark.metric.includes('Rate') || benchmark.metric.includes('Time') ? (benchmark.metric.includes('Time') ? 'd' : '%') : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      benchmark.ranking >= 80 ? 'bg-green-100 text-green-800' :
                      benchmark.ranking >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
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

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button className="btn-primary">
          Export Full Report
        </button>
        <button className="btn-secondary">
          Schedule Review Meeting
        </button>
        <button className="btn-secondary">
          Configure Alerts
        </button>
        <button className="btn-secondary">
          Historical Trends
        </button>
      </div>
    </div>
  );
}