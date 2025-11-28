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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Legal & Compliance</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {isCompanyUser
            ? 'Manage legal documents, compliance checks, and risk assessments for team acquisitions'
            : 'Review legal requirements and compliance status for your team\'s liftout process'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm min-h-12
                  ${
                    activeTab === tab.id
                      ? 'border-navy text-navy'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-hover'
                  }
                `}
              >
                <Icon
                  className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-navy' : 'text-text-tertiary group-hover:text-text-secondary'
                  }`}
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
