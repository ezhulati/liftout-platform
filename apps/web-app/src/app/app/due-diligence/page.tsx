import { DueDiligenceOverview } from '@/components/due-diligence/DueDiligenceOverview';
import { DueDiligenceChecklist } from '@/components/due-diligence/DueDiligenceChecklist';
import { ReferenceManager } from '@/components/due-diligence/ReferenceManager';
import { Suspense } from 'react';

export default function DueDiligencePage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header - Practical UI: bold headings, proper spacing */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">
          Due diligence management
        </h1>
        <p className="mt-2 text-base font-normal text-text-secondary leading-relaxed">
          Comprehensive evaluation and risk assessment for strategic team acquisition
        </p>
        <div className="mt-4 bg-navy-50 border border-navy-200 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-navy" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-normal text-navy-700">
                <strong className="font-bold">Active evaluation:</strong> Goldman Sachs Strategic Analytics Core team for MedTech Innovations Healthcare AI opportunity
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Overview Section */}
        <Suspense fallback={<div className="animate-pulse h-64 bg-bg-elevated rounded-xl"></div>}>
          <DueDiligenceOverview />
        </Suspense>

        {/* Reference Management */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-6">Reference validation</h2>
          <Suspense fallback={<div className="animate-pulse h-64 bg-bg-elevated rounded-xl"></div>}>
            <ReferenceManager teamId="team-goldman-analytics" />
          </Suspense>
        </div>

        {/* Detailed Checklist */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-6">Detailed evaluation checklist</h2>
          <Suspense fallback={<div className="animate-pulse space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-bg-elevated rounded-xl"></div>)}</div>}>
            <DueDiligenceChecklist />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
