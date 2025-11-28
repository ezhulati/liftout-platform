import { DueDiligenceOverview } from '@/components/due-diligence/DueDiligenceOverview';
import { DueDiligenceChecklist } from '@/components/due-diligence/DueDiligenceChecklist';
import { ReferenceManager } from '@/components/due-diligence/ReferenceManager';
import { Suspense } from 'react';

export default function DueDiligencePage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">
          Due Diligence Management
        </h1>
        <p className="mt-2 text-lg text-text-secondary">
          Comprehensive evaluation and risk assessment for strategic team acquisition
        </p>
        <div className="mt-4 bg-navy-50 border border-navy-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-navy-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-navy-700">
                <strong>Active Evaluation:</strong> Goldman Sachs Strategic Analytics Core team for MedTech Innovations Healthcare AI opportunity
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Overview Section */}
        <Suspense fallback={<div className="animate-pulse h-64 bg-bg-elevated rounded-lg"></div>}>
          <DueDiligenceOverview />
        </Suspense>

        {/* Reference Management */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Reference Validation</h2>
          <Suspense fallback={<div className="animate-pulse h-64 bg-bg-elevated rounded-lg"></div>}>
            <ReferenceManager teamId="team-goldman-analytics" />
          </Suspense>
        </div>

        {/* Detailed Checklist */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Detailed Evaluation Checklist</h2>
          <Suspense fallback={<div className="animate-pulse space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-bg-elevated rounded"></div>)}</div>}>
            <DueDiligenceChecklist />
          </Suspense>
        </div>
      </div>
    </div>
  );
}