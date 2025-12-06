import { NegotiationDashboard } from '@/components/negotiations/NegotiationDashboard';
import { TermSheetManager } from '@/components/negotiations/TermSheetManager';
import { Suspense } from 'react';

export default function NegotiationsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="page-header mb-8">
        <h1 className="page-title">
          Team Acquisition Negotiations
        </h1>
        <p className="page-subtitle">
          Structured negotiation workflow for strategic team liftout deals
        </p>
        <div className="mt-4 bg-success-light border border-success/20 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-normal text-success-dark">
                <strong className="font-bold">Active negotiation:</strong> Goldman Sachs Strategic Analytics Core team acquisition - Round 3 of negotiations in progress
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Deal Overview */}
        <Suspense fallback={<div className="animate-pulse h-64 bg-bg-elevated rounded-xl"></div>}>
          <NegotiationDashboard />
        </Suspense>

        {/* Term Sheet Management */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-6">Term sheet details</h2>
          <Suspense fallback={<div className="animate-pulse h-96 bg-bg-elevated rounded-xl"></div>}>
            <TermSheetManager />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
