'use client';

import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { OpportunitiesList } from '@/components/opportunities/OpportunitiesList';
import { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function OpportunitiesContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const isCompanyUser = session.user.userType === 'company';
  const activeTab = searchParams?.get('tab') || 'all';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">
            {isCompanyUser ? 'Liftout Opportunities' : 'Browse Liftout Opportunities'}
          </h1>
          <p className="page-subtitle">
            {isCompanyUser
              ? 'Post strategic team acquisition opportunities and manage incoming team expressions of interest'
              : 'Discover strategic opportunities for your team to join new organizations and accelerate growth'
            }
          </p>
        </div>
        {isCompanyUser && (
          <Link
            href="/app/opportunities/create"
            className="btn-primary min-h-12 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post liftout opportunity
          </Link>
        )}
      </div>

      {/* Tabs for company users */}
      {isCompanyUser && (
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8">
            <Link
              href="/app/opportunities"
              className={`py-3 px-1 border-b-2 font-medium text-sm min-h-12 transition-colors duration-fast ${
                activeTab === 'all'
                  ? 'border-navy text-navy'
                  : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
              }`}
            >
              All Liftout Opportunities
            </Link>
            <Link
              href="/app/opportunities?tab=active"
              className={`py-3 px-1 border-b-2 font-medium text-sm min-h-12 transition-colors duration-fast ${
                activeTab === 'active'
                  ? 'border-navy text-navy'
                  : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
              }`}
            >
              Active
            </Link>
            <Link
              href="/app/opportunities?tab=applications"
              className={`py-3 px-1 border-b-2 font-medium text-sm min-h-12 transition-colors duration-fast ${
                activeTab === 'applications'
                  ? 'border-navy text-navy'
                  : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
              }`}
            >
              Team Interest
            </Link>
            <Link
              href="/app/opportunities?tab=closed"
              className={`py-3 px-1 border-b-2 font-medium text-sm min-h-12 transition-colors duration-fast ${
                activeTab === 'closed'
                  ? 'border-navy text-navy'
                  : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
              }`}
            >
              Closed
            </Link>
          </nav>
        </div>
      )}

      {/* Opportunities list */}
      <OpportunitiesList
        userType={session.user.userType}
        activeTab={activeTab}
      />
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-96 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    }>
      <OpportunitiesContent />
    </Suspense>
  );
}