import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { Suspense } from 'react';

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">
          Liftout Success Analytics
        </h1>
        <p className="mt-2 text-lg text-text-secondary">
          Comprehensive performance tracking and business impact analysis
        </p>
        <div className="mt-4 bg-success-light border border-success/20 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-success">
                <strong>Q3 2024 Performance:</strong> 268% ROI with 100% success rate across 6 completed liftouts generating $12.5M revenue impact
              </p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="animate-pulse h-96 bg-bg-elevated rounded-lg"></div>}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}