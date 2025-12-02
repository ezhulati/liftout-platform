'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { RecommendedTeams } from '@/components/dashboard/RecommendedTeams';
import { DashboardOnboarding } from '@/components/dashboard/DashboardOnboarding';
import { useSession } from 'next-auth/react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Only redirect NEW users (first login) to onboarding
  // Use isNewUser flag which is set only on first OAuth sign-in
  // Don't redirect returning users with incomplete profiles (they see inline prompt instead)
  useEffect(() => {
    if (status === 'authenticated' && session?.isNewUser && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/app/onboarding');
    }
  }, [status, session?.isNewUser, router]);

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

  // Show loading while redirecting new users to onboarding
  if (session?.isNewUser) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  const user = session.user;
  const isCompanyUser = user.userType === 'company';
  const firstName = user.firstName || user.name?.split(' ')[0] || user.name || 'User';

  return (
    <div className="space-y-6">
      {/* Page header with action button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-base font-normal text-text-secondary mt-1 leading-relaxed">
            {isCompanyUser
              ? 'Manage your opportunities and find the perfect teams'
              : 'Discover opportunities and connect with top companies'
            }
          </p>
        </div>
        {/* Primary action button based on user type */}
        {isCompanyUser ? (
          <Link
            href="/app/opportunities/create"
            className="inline-flex items-center gap-2 px-5 py-3 min-h-12 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-lg transition-colors duration-fast shadow-sm whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5" />
            Post opportunity
          </Link>
        ) : (
          <Link
            href="/app/opportunities"
            className="inline-flex items-center gap-2 px-5 py-3 min-h-12 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-lg transition-colors duration-fast shadow-sm whitespace-nowrap"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Browse opportunities
          </Link>
        )}
      </div>

      {/* Onboarding and Profile Completeness */}
      <DashboardOnboarding />

      {/* Dashboard stats - 4 cards in a row */}
      <DashboardStats userType={user.userType || 'individual'} />

      {/* Two-column layout for activity and recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <RecentActivity />

        {/* Recommended teams/opportunities based on user type */}
        {isCompanyUser ? (
          <RecommendedTeams />
        ) : (
          <RecommendedOpportunities />
        )}
      </div>
    </div>
  );
}

// Recommended Opportunities component for team users
function RecommendedOpportunities() {
  const opportunities = [
    {
      id: '1',
      title: 'Senior Product Team',
      company: 'Apex Ventures',
      location: 'New York, NY',
      teamSize: '4-6',
      matchScore: 92,
    },
    {
      id: '2',
      title: 'AI/ML Engineering Team',
      company: 'MedTech Innovations',
      location: 'Boston, MA',
      teamSize: '3-5',
      matchScore: 88,
    },
    {
      id: '3',
      title: 'Growth Marketing Team',
      company: 'TechForward Inc.',
      location: 'San Francisco, CA',
      teamSize: '2-4',
      matchScore: 85,
    },
  ];

  return (
    <div className="bg-bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">Recommended for You</h2>
        <Link
          href="/app/opportunities"
          className="text-sm font-medium text-purple-700 hover:text-purple-800"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {opportunities.map((opp) => (
          <Link
            key={opp.id}
            href={`/app/opportunities/${opp.id}`}
            className="block p-4 rounded-lg border border-border hover:border-purple-300 hover:bg-bg-elevated transition-all duration-fast"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-primary truncate">{opp.title}</h3>
                <p className="text-sm text-text-secondary mt-0.5">{opp.company}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
                  <span>{opp.location}</span>
                  <span>•</span>
                  <span>{opp.teamSize} people</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-light text-success-dark">
                  {opp.matchScore}% match
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}