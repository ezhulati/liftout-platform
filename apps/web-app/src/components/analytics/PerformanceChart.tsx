'use client';

import React from 'react';
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface ChartDataPoint {
  period: string;
  value: number;
  label?: string;
}

interface PerformanceChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: 'bar' | 'line' | 'area';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  valueFormatter?: (value: number) => string;
  showTrend?: boolean;
  height?: number;
}

export function PerformanceChart({
  title,
  data,
  type = 'bar',
  color = 'blue',
  valueFormatter = (value) => value.toString(),
  showTrend = true,
  height = 200
}: PerformanceChartProps) {
  const colorClasses = {
    blue: {
      primary: 'bg-blue-500',
      light: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-500'
    },
    green: {
      primary: 'bg-green-500',
      light: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-500'
    },
    yellow: {
      primary: 'bg-yellow-500',
      light: 'bg-yellow-100',
      text: 'text-yellow-600',
      border: 'border-yellow-500'
    },
    red: {
      primary: 'bg-red-500',
      light: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-500'
    },
    purple: {
      primary: 'bg-purple-500',
      light: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-500'
    }
  };

  const colors = colorClasses[color];

  // Calculate trend
  const trend = showTrend && data.length >= 2 ? (() => {
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const change = ((lastValue - firstValue) / firstValue) * 100;
    return {
      value: Math.abs(change),
      direction: change >= 0 ? 'up' : 'down',
      isPositive: change >= 0
    };
  })() : null;

  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% padding
  const scaledMax = maxValue + padding;

  // Generate chart based on type
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <div className="flex items-end justify-between h-full space-x-2">
            {data.map((point, index) => {
              const heightPercentage = (point.value / scaledMax) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full ${colors.primary} rounded-t transition-all duration-300 hover:opacity-80`}
                    style={{ height: `${heightPercentage}%` }}
                    title={`${point.period}: ${valueFormatter(point.value)}`}
                  />
                </div>
              );
            })}
          </div>
        );

      case 'line':
        return (
          <div className="relative h-full">
            <svg
              width="100%"
              height="100%"
              className="overflow-visible"
              viewBox={`0 0 100 100`}
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={colors.text}
                points={data.map((point, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - ((point.value - minValue) / range) * 100;
                  return `${x},${y}`;
                }).join(' ')}
              />
              {data.map((point, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((point.value - minValue) / range) * 100;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="currentColor"
                    className={colors.text}
                  />
                );
              })}
            </svg>
          </div>
        );

      case 'area':
        return (
          <div className="relative h-full">
            <svg
              width="100%"
              height="100%"
              className="overflow-visible"
              viewBox={`0 0 100 100`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" className={colors.text} stopOpacity={0.3} />
                  <stop offset="100%" className={colors.text} stopOpacity={0} />
                </linearGradient>
              </defs>
              <polygon
                fill={`url(#gradient-${color})`}
                points={[
                  '0,100',
                  ...data.map((point, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = 100 - ((point.value - minValue) / range) * 100;
                    return `${x},${y}`;
                  }),
                  '100,100'
                ].join(' ')}
              />
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={colors.text}
                points={data.map((point, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - ((point.value - minValue) / range) * 100;
                  return `${x},${y}`;
                }).join(' ')}
              />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            {trend.value.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }} className="mb-4">
        {renderChart()}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500">
        {data.map((point, index) => (
          <span key={index} className="text-center">
            {point.period}
          </span>
        ))}
      </div>

      {/* Values below labels */}
      <div className="flex justify-between text-xs font-medium text-gray-700 mt-1">
        {data.map((point, index) => (
          <span key={index} className="text-center">
            {valueFormatter(point.value)}
          </span>
        ))}
      </div>
    </div>
  );
}

// Specialized chart components
export function LiftoutPerformanceChart({ data }: { data: Array<{ period: string; count: number; value: number }> }) {
  const chartData = data.map(d => ({
    period: d.period,
    value: d.value,
    label: `${d.count} liftouts`
  }));

  return (
    <PerformanceChart
      title="Liftout Performance"
      data={chartData}
      type="area"
      color="green"
      valueFormatter={(value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(value)}
    />
  );
}

export function EngagementChart({ data }: { data: Array<{ period: string; views: number; interest: number }> }) {
  const chartData = data.map(d => ({
    period: d.period,
    value: d.views,
    label: `${d.interest} interests`
  }));

  return (
    <PerformanceChart
      title="Profile Engagement"
      data={chartData}
      type="bar"
      color="blue"
      valueFormatter={(value) => value.toLocaleString()}
    />
  );
}

export function TeamGrowthChart({ data }: { data: Array<{ period: string; change: number }> }) {
  const chartData = data.map(d => ({
    period: d.period,
    value: d.change
  }));

  return (
    <PerformanceChart
      title="Team Growth Rate"
      data={chartData}
      type="line"
      color="purple"
      valueFormatter={(value) => `${value.toFixed(1)}%`}
    />
  );
}