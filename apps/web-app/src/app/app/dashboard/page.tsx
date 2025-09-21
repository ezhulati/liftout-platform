'use client';

import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecommendedTeams } from '@/components/dashboard/RecommendedTeams';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { DashboardOnboarding } from '@/components/dashboard/DashboardOnboarding';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    return null;
  }

  const user = session.user;
  
  // Debug logging to check user object structure
  console.log('Dashboard user object:', user);
  
  const isCompanyUser = user.userType === 'company';
  const firstName = user.firstName || user.name?.split(' ')[0] || user.name || 'User';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {firstName}!
        </h1>
        <p className="page-subtitle">
          {isCompanyUser 
            ? 'Manage your opportunities and find the perfect teams'
            : 'Discover opportunities and connect with amazing teams'
          }
        </p>
      </div>

      {/* Onboarding and Profile Completeness */}
      <DashboardOnboarding />

      {/* Dashboard stats */}
      <DashboardStats userType={user.userType || 'individual'} />

      {/* Quick actions */}
      <QuickActions userType={user.userType || 'individual'} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <RecentActivity />
        
        {/* Upcoming deadlines or recommended content */}
        {isCompanyUser ? (
          <UpcomingDeadlines />
        ) : (
          <RecommendedTeams />
        )}
      </div>
    </div>
  );
}