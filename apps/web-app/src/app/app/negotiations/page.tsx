import { NegotiationDashboard } from '@/components/negotiations/NegotiationDashboard';
import { TermSheetManager } from '@/components/negotiations/TermSheetManager';
import { Suspense } from 'react';

export default function NegotiationsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Team Acquisition Negotiations
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Structured negotiation workflow for strategic team liftout deals
        </p>
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Active Negotiation:</strong> Goldman Sachs Strategic Analytics Core team acquisition - Round 3 of negotiations in progress
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Deal Overview */}
        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>}>
          <NegotiationDashboard />
        </Suspense>

        {/* Term Sheet Management */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Term Sheet Details</h2>
          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
            <TermSheetManager />
          </Suspense>
        </div>
      </div>
    </div>
  );
}