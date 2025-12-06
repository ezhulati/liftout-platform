'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { LegalOverview, DocumentsList, ComplianceChecklist, RiskAssessment } from '@/components/legal';

type TabType = 'overview' | 'documents' | 'compliance' | 'risk';

const tabs: { id: TabType; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', name: 'Overview', icon: ChartBarIcon },
  { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
  { id: 'compliance', name: 'Compliance', icon: ShieldCheckIcon },
  { id: 'risk', name: 'Risk Assessment', icon: ExclamationTriangleIcon },
];

export default function LegalPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const isCompanyUser = session?.user?.userType === 'company';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Legal & compliance</h1>
        <p className="page-subtitle">
          {isCompanyUser
            ? 'Legal documents and compliance tracking.'
            : 'Legal requirements and compliance status.'}
        </p>
      </div>

      {/* Tab Navigation - Practical UI: 48px touch targets */}
      <div className="border-b border-border mb-8">
        <nav className="-mb-px flex flex-wrap gap-2 sm:gap-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-2 border-b-2 font-bold text-sm min-h-12 transition-colors duration-fast
                  ${
                    activeTab === tab.id
                      ? 'border-navy text-navy'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }
                `}
              >
                <Icon
                  className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-navy' : 'text-text-tertiary group-hover:text-text-secondary'
                  }`}
                  aria-hidden="true"
                />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <LegalOverview />}
        {activeTab === 'documents' && <DocumentsList />}
        {activeTab === 'compliance' && <ComplianceChecklist />}
        {activeTab === 'risk' && <RiskAssessment />}
      </div>
    </div>
  );
}
