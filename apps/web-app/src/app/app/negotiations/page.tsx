import { NegotiationDashboard } from '@/components/negotiations/NegotiationDashboard';
import { TermSheetManager } from '@/components/negotiations/TermSheetManager';
import { Suspense } from 'react';

export default function NegotiationsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="page-header mb-8">
        <h1 className="page-title">Negotiations</h1>
        <p className="page-subtitle">Active offer negotiations.</p>
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
