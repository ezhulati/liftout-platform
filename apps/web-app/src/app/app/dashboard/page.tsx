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
      {/* Page header with action button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your team activity at a glance.</p>
        </div>
        {/* Primary action button based on user type */}
        {isCompanyUser ? (
          <Link
            href="/app/opportunities/create"
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post opportunity
          </Link>
        ) : (
          <Link
            href="/app/opportunities"
            className="btn-primary"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
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
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        {/* Section heading - Practical UI: bold weight */}
        <h2 className="text-lg font-bold text-text-primary font-heading">Recommended for you</h2>
        {/* Tertiary action - underlined link style */}
        <Link
          href="/app/opportunities"
          className="text-base font-normal text-navy hover:text-navy-600 underline underline-offset-4 transition-colors duration-fast min-h-12 flex items-center"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {opportunities.map((opp) => (
          <Link
            key={opp.id}
            href={`/app/opportunities/${opp.id}`}
            className="block p-4 rounded-xl border border-border hover:border-purple-300 hover:shadow-soft transition-all duration-base min-h-12"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-text-primary truncate leading-snug">{opp.title}</h3>
                <p className="text-sm font-normal text-text-secondary mt-1 leading-relaxed">{opp.company}</p>
                <div className="flex items-center gap-2 mt-2 text-sm font-normal text-text-tertiary">
                  <span>{opp.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{opp.teamSize} people</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="badge badge-success text-xs">
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