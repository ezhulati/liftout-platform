import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { OpportunitiesList } from '@/components/opportunities/OpportunitiesList';
import { Suspense } from 'react';

interface PageProps {
  searchParams: { tab?: string };
}

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  const isCompanyUser = session.user.userType === 'company';
  const activeTab = searchParams.tab || 'all';

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