'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  UserGroupIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'liftout_interest' | 'team_profile_view' | 'message' | 'liftout_opportunity';
  title: string;
  description: string;
  createdAt: string;
  href?: string;
}

// Helper to generate activity dates relative to now (called inside component to avoid hydration issues)
function generateMockActivities(): Activity[] {
  const now = Date.now();
  return [
    {
      id: '1',
      type: 'liftout_interest',
      title: 'Application status updated',
      description: 'NextGen Financial moved your FinTech Analytics application to "Under Review"',
      createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      href: '/app/applications',
    },
    {
      id: '2',
      type: 'message',
      title: 'Interview scheduled',
      description: 'MedTech Innovations scheduled a technical presentation for Healthcare AI Innovation Lab',
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      href: '/app/applications',
    },
    {
      id: '3',
      type: 'team_profile_view',
      title: 'Team profile viewed',
      description: 'DataFlow Analytics viewed your team profile - potential new opportunity match',
      createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
      href: '/app/teams',
    },
    {
      id: '4',
      type: 'liftout_opportunity',
      title: 'New opportunity posted',
      description: 'European Market Expansion Team at Confidential Fortune 500 - matches your skills',
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      href: '/app/opportunities',
    },
    {
      id: '5',
      type: 'liftout_interest',
      title: 'Application submitted',
      description: 'Successfully submitted application to DataFlow Analytics for Quantitative Analysts role',
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      href: '/app/applications',
    }
  ];
}

const activityIcons = {
  liftout_interest: DocumentTextIcon,
  team_profile_view: UserGroupIcon,
  message: ChatBubbleLeftRightIcon,
  liftout_opportunity: BriefcaseIcon,
};

const activityColors = {
  liftout_interest: 'text-success',
  team_profile_view: 'text-navy',
  message: 'text-gold-700',
  liftout_opportunity: 'text-gold',
};

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/activity?limit=5');
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        if (data.activities && data.activities.length > 0) {
          // Transform API response to match Activity interface
          return data.activities.map((a: any) => ({
            id: a.id,
            type: mapActivityType(a.type),
            title: a.title,
            description: a.description,
            createdAt: a.timestamp,
            href: getActivityHref(a.type, a.metadata),
          }));
        }
        throw new Error('No activities');
      } catch {
        // Fallback to mock data
        return generateMockActivities();
      }
    },
    staleTime: 30000, // 30 seconds
  });

  function mapActivityType(type: string): Activity['type'] {
    const typeMap: Record<string, Activity['type']> = {
      'application': 'liftout_interest',
      'interview': 'liftout_opportunity',
      'message': 'message',
      'eoi': 'team_profile_view',
    };
    return typeMap[type] || 'liftout_interest';
  }

  function getActivityHref(type: string, metadata: any): string {
    switch (type) {
      case 'application':
        return '/app/applications';
      case 'interview':
        return '/app/applications';
      case 'message':
        return metadata?.conversationId ? `/app/messages/${metadata.conversationId}` : '/app/messages';
      case 'eoi':
        return '/app/teams';
      default:
        return '/app/dashboard';
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-5 font-heading">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex animate-pulse">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 skeleton rounded-full"></div>
              </div>
              <div className="ml-4 flex-1">
                <div className="h-4 skeleton rounded w-48 mb-2"></div>
                <div className="h-3 skeleton rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        {/* Section heading - Practical UI: bold weight */}
        <h3 className="text-lg font-bold text-text-primary font-heading">Recent Activity</h3>
        {/* Tertiary action - underlined link style */}
        <Link
          href="/app/applications"
          className="text-base font-normal text-navy hover:text-navy-600 underline underline-offset-4 transition-colors duration-fast min-h-12 flex items-center"
        >
          View all
        </Link>
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {activities?.map((activity: Activity, activityIdx: number) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-bg-surface bg-bg-elevated">
                        <Icon className={`h-4 w-4 ${colorClass}`} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div className="min-w-0 flex-1">
                        {activity.href ? (
                          <Link href={activity.href} className="group min-h-12 block">
                            {/* Practical UI: bold for emphasis, regular for body */}
                            <p className="text-base font-bold text-text-primary group-hover:text-navy transition-colors duration-fast leading-snug">
                              {activity.title}
                            </p>
                            <p className="text-sm font-normal text-text-secondary group-hover:text-text-primary transition-colors duration-fast leading-relaxed mt-0.5">
                              {activity.description}
                            </p>
                          </Link>
                        ) : (
                          <>
                            <p className="text-base font-bold text-text-primary leading-snug">
                              {activity.title}
                            </p>
                            <p className="text-sm font-normal text-text-secondary leading-relaxed mt-0.5">
                              {activity.description}
                            </p>
                          </>
                        )}
                      </div>
                      {/* Timestamp - small text */}
                      <div className="whitespace-nowrap text-right text-sm font-normal text-text-tertiary">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {(!activities || activities.length === 0) && (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <svg
              className="h-7 w-7 text-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-text-primary mb-1">No recent activity</h4>
          <p className="text-base text-text-secondary">
            Get started by updating your team profile or browsing liftout opportunities.
          </p>
        </div>
      )}
    </div>
  );
}