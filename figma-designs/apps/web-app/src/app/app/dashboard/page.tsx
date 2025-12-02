'use client';

import Link from 'next/link';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecommendedTeams } from '@/components/dashboard/RecommendedTeams';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { DashboardOnboarding } from '@/components/dashboard/DashboardOnboarding';
import { MatchingPreview } from '@/components/dashboard/MatchingPreview';
import { UpcomingInterviews } from '@/components/dashboard/UpcomingInterviews';
import { EOISummary } from '@/components/dashboard/EOISummary';
import { useSession } from 'next-auth/react';
import { RocketLaunchIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    return null;
  }

  const user = session.user;
  const profileIncomplete = user.profileCompleted === false;
  
  // Debug logging to check user object structure
  
  const isCompanyUser = user.userType === 'company';
  const firstName = user.firstName || user.name?.split(' ')[0] || user.name || 'User';

  return (
    <div className="space-y-6">
      {/* Profile Completion Banner - shown until profile is complete */}
      {profileIncomplete && (
        <div className="bg-gradient-to-r from-navy to-navy-dark rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <RocketLaunchIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Complete your profile to unlock all features</h2>
              <p className="text-white/80 mt-1">
                {isCompanyUser
                  ? 'Set up your company profile to start posting opportunities and connecting with teams.'
                  : 'Add your skills and experience to get matched with the best opportunities.'}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/app/onboarding"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-navy font-semibold rounded-lg hover:bg-white/90 transition-colors min-h-12"
                >
                  Complete profile
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/app/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors min-h-12"
                >
                  Edit profile manually
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page header - Practical UI: bold headings, regular body, 8pt spacing system */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-base font-normal text-text-secondary mt-2 leading-relaxed max-w-2xl">
          {isCompanyUser
            ? 'Manage your opportunities and find the perfect teams'
            : 'Discover opportunities and connect with top companies'
          }
        </p>
      </div>

      {/* Onboarding and Profile Completeness - only show if profile is complete */}
      {!profileIncomplete && <DashboardOnboarding />}

      {/* Dashboard stats */}
      <DashboardStats userType={user.userType || 'individual'} />

      {/* Quick actions */}
      <QuickActions userType={user.userType || 'individual'} />

      {/* AI Matching Preview */}
      <MatchingPreview />

      {/* Interviews and EOI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingInterviews />
        <EOISummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <RecentActivity />

        {/* Upcoming deadlines or recommended content */}
        {isCompanyUser ? (
          <RecommendedTeams />
        ) : (
          <UpcomingDeadlines />
        )}
      </div>
    </div>
  );
}