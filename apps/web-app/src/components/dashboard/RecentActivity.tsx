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

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'liftout_interest',
    title: 'Application status updated',
    description: 'NextGen Financial moved your FinTech Analytics application to "Under Review"',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    href: '/app/applications',
  },
  {
    id: '2',
    type: 'message',
    title: 'Interview scheduled',
    description: 'MedTech Innovations scheduled a technical presentation for Healthcare AI Innovation Lab',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    href: '/app/applications',
  },
  {
    id: '3',
    type: 'team_profile_view',
    title: 'Team profile viewed',
    description: 'DataFlow Analytics viewed your team profile - potential new opportunity match',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    href: '/app/teams',
  },
  {
    id: '4',
    type: 'liftout_opportunity',
    title: 'New opportunity posted',
    description: 'European Market Expansion Team at Confidential Fortune 500 - matches your skills',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    href: '/app/opportunities',
  },
  {
    id: '5',
    type: 'liftout_interest',
    title: 'Application submitted',
    description: 'Successfully submitted application to DataFlow Analytics for Quantitative Analysts role',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    href: '/app/applications',
  }
];

const activityIcons = {
  liftout_interest: DocumentTextIcon,
  team_profile_view: UserGroupIcon,
  message: ChatBubbleLeftRightIcon,
  liftout_opportunity: BriefcaseIcon,
};

const activityColors = {
  liftout_interest: 'text-green-500',
  team_profile_view: 'text-blue-500',
  message: 'text-purple-500',
  liftout_opportunity: 'text-orange-500',
};

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // This would normally fetch from your API
      return mockActivities;
    },
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <Link
            href="/app/activity"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        
        <div className="flow-root">
          <ul className="-mb-8">
            {activities?.map((activity, activityIdx) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];
              
              return (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-100`}>
                          <Icon className={`h-4 w-4 ${colorClass}`} aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div className="min-w-0 flex-1">
                          {activity.href ? (
                            <Link href={activity.href} className="group">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                                {activity.title}
                              </p>
                              <p className="text-sm text-gray-500 group-hover:text-gray-600">
                                {activity.description}
                              </p>
                            </Link>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-gray-900">
                                {activity.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {activity.description}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
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
          <div className="text-center py-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by updating your team profile or browsing liftout opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}