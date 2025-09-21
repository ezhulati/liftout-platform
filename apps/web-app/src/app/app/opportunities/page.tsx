'use client';

import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { OpportunitiesList } from '@/components/opportunities/OpportunitiesList';
import { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function OpportunitiesPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  
  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const isCompanyUser = session.user.userType === 'company';
  const activeTab = searchParams.get('tab') || 'all';

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
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
Post Liftout Opportunity
          </Link>
        )}
      </div>

      {/* Tabs for company users */}
      {isCompanyUser && (
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <Link
              href="/app/opportunities"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
All Liftout Opportunities
            </Link>
            <Link
              href="/app/opportunities?tab=active"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active
            </Link>
            <Link
              href="/app/opportunities?tab=applications"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
Team Interest
            </Link>
            <Link
              href="/app/opportunities?tab=closed"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'closed'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Closed
            </Link>
          </nav>
        </div>
      )}

      {/* Opportunities list */}
      <Suspense fallback={<div className="loading-spinner mx-auto"></div>}>
        <OpportunitiesList 
          userType={session.user.userType} 
          activeTab={activeTab}
        />
      </Suspense>
    </div>
  );
}