'use client';

import Link from 'next/link';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { RecommendedTeams } from '@/components/dashboard/RecommendedTeams';
import { useSession } from 'next-auth/react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  const isCompanyUser = user.userType === 'company';
  const firstName = user.firstName || user.name?.split(' ')[0] || user.name || 'User';

  return (
    <div className="space-y-6">
      {/* Page header with action button - matches Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">
            Welcome, {firstName}
          </h1>
          <p className="text-base font-normal text-text-secondary mt-1 leading-relaxed">
            Your dashboard shows a glimpse of everything.
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

      {/* Dashboard stats - 4 cards in a row */}
      <DashboardStats userType={user.userType || 'individual'} />

      {/* Two-column layout - matches Figma: Teams wider (2/3), Activity narrower (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended teams/opportunities - wider column (2/3) */}
        <div className="lg:col-span-2">
          {isCompanyUser ? (
            <RecommendedTeams />
          ) : (
            <RecommendedOpportunities />
          )}
        </div>

        {/* Recent activity - narrower column (1/3) */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
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