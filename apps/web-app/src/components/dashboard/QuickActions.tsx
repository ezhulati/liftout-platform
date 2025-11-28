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
      color: 'bg-navy hover:bg-navy-light',
    },
    {
      name: 'Explore Liftout Opportunities',
      description: 'Discover strategic opportunities',
      href: '/app/opportunities',
      icon: MagnifyingGlassIcon,
      color: 'bg-gold hover:bg-gold-600',
    },
    {
      name: 'Express Interest',
      description: 'Submit to liftout opportunities',
      href: '/app/applications',
      icon: DocumentTextIcon,
      color: 'bg-navy-600 hover:bg-navy-500',
    },
    {
      name: 'Connect with Companies',
      description: 'Build strategic relationships',
      href: '/app/messages',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-gold-700 hover:bg-gold-600',
    },
  ];

  const companyActions = [
    {
      name: 'Post Liftout Opportunity',
      description: 'Attract high-performing teams',
      href: '/app/opportunities/create',
      icon: PlusIcon,
      color: 'bg-navy hover:bg-navy-light',
    },
    {
      name: 'Browse Available Teams',
      description: 'Find teams ready for liftout',
      href: '/app/teams',
      icon: UserGroupIcon,
      color: 'bg-gold hover:bg-gold-600',
    },
    {
      name: 'Review Team Interest',
      description: 'Evaluate expressions of interest',
      href: '/app/opportunities?tab=applications',
      icon: DocumentTextIcon,
      color: 'bg-navy-600 hover:bg-navy-500',
    },
    {
      name: 'Liftout Analytics',
      description: 'Track acquisition metrics',
      href: '/app/analytics',
      icon: BriefcaseIcon,
      color: 'bg-gold-700 hover:bg-gold-600',
    },
  ];

  const actions = isCompanyUser ? companyActions : teamActions;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-5 font-heading">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group relative rounded-xl p-6 border border-border hover:border-gold/30 hover:bg-bg-elevated transition-all duration-base"
          >
            <div>
              <span className={`inline-flex rounded-lg p-3 ${action.color} text-white transition-transform duration-fast group-hover:scale-105`}>
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h4 className="text-base font-semibold text-text-primary group-hover:text-navy">
                <span className="absolute inset-0" aria-hidden="true" />
                {action.name}
              </h4>
              <p className="mt-1 text-base text-text-secondary">{action.description}</p>
            </div>
            <span
              className="pointer-events-none absolute top-5 right-5 text-border group-hover:text-gold transition-colors duration-fast"
              aria-hidden="true"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}