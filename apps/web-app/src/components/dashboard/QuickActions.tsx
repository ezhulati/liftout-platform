'use client';

import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface QuickActionsProps {
  userType: string;
}

export function QuickActions({ userType }: QuickActionsProps) {
  const isCompanyUser = userType === 'company';

  const teamActions = [
    {
      name: 'Update Team Profile',
      description: 'Enhance your liftout appeal',
      href: '/app/teams/create',
      icon: UserGroupIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Explore Liftout Opportunities',
      description: 'Discover strategic opportunities',
      href: '/app/opportunities',
      icon: MagnifyingGlassIcon,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Express Interest',
      description: 'Submit to liftout opportunities',
      href: '/app/applications',
      icon: DocumentTextIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      name: 'Connect with Companies',
      description: 'Build strategic relationships',
      href: '/app/messages',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  const companyActions = [
    {
      name: 'Post Liftout Opportunity',
      description: 'Attract high-performing teams',
      href: '/app/opportunities/create',
      icon: PlusIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Browse Available Teams',
      description: 'Find teams ready for liftout',
      href: '/app/teams',
      icon: UserGroupIcon,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Review Team Interest',
      description: 'Evaluate expressions of interest',
      href: '/app/opportunities?tab=applications',
      icon: DocumentTextIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      name: 'Liftout Analytics',
      description: 'Track acquisition metrics',
      href: '/app/analytics',
      icon: BriefcaseIcon,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  const actions = isCompanyUser ? companyActions : teamActions;

  return (
    <div className="card">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group relative rounded-lg p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 hover:bg-gray-50 transition-colors"
            >
              <div>
                <span className={`inline-flex rounded-lg p-3 ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H5v2h10.586l-4.293 4.293z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}