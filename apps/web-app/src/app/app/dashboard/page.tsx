import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecommendedTeams } from '@/components/dashboard/RecommendedTeams';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { DashboardOnboarding } from '@/components/dashboard/DashboardOnboarding';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  const isCompanyUser = session.user.userType === 'company';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {session.user.firstName}!
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
      <DashboardStats userType={session.user.userType} />

      {/* Quick actions */}
      <QuickActions userType={session.user.userType} />

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