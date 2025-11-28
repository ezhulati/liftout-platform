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
      color: 'bg-navy',
    },
    {
      name: 'Explore Liftout Opportunities',
      description: 'Discover strategic opportunities',
      href: '/app/opportunities',
      icon: MagnifyingGlassIcon,
      color: 'bg-gold',
    },
    {
      name: 'Express Interest',
      description: 'Submit to liftout opportunities',
      href: '/app/applications',
      icon: DocumentTextIcon,
      color: 'bg-navy',
    },
    {
      name: 'Connect with Companies',
      description: 'Build strategic relationships',
      href: '/app/messages',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-gold',
    },
  ];

  const companyActions = [
    {
      name: 'Post Liftout Opportunity',
      description: 'Attract high-performing teams',
      href: '/app/opportunities/create',
      icon: PlusIcon,
      color: 'bg-navy',
    },
    {
      name: 'Browse Available Teams',
      description: 'Find teams ready for liftout',
      href: '/app/teams',
      icon: UserGroupIcon,
      color: 'bg-gold',
    },
    {
      name: 'Review Team Interest',
      description: 'Evaluate expressions of interest',
      href: '/app/opportunities?tab=applications',
      icon: DocumentTextIcon,
      color: 'bg-navy',
    },
    {
      name: 'Liftout Analytics',
      description: 'Track acquisition metrics',
      href: '/app/analytics',
      icon: BriefcaseIcon,
      color: 'bg-gold',
    },
  ];

  const actions = isCompanyUser ? companyActions : teamActions;

  return (
    <div className="card">
      {/* Section heading - Practical UI: h3 for card sections */}
      <h3 className="text-lg font-bold text-text-primary mb-6 font-heading">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group relative rounded-xl p-5 border border-border hover:border-navy/30 hover:bg-bg-elevated transition-all duration-base min-h-[140px] flex flex-col"
          >
            {/* Icon - 48px touch target, consistent backgrounds */}
            <div className="flex-shrink-0">
              <span className={`inline-flex rounded-xl p-3 min-w-12 min-h-12 items-center justify-center ${action.color} text-white transition-transform duration-fast group-hover:scale-105`}>
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            {/* Content - Practical UI typography */}
            <div className="mt-4 flex-1">
              <h4 className="text-base font-bold text-text-primary group-hover:text-navy leading-snug">
                <span className="absolute inset-0" aria-hidden="true" />
                {action.name}
              </h4>
              <p className="mt-1 text-sm font-normal text-text-secondary leading-relaxed">{action.description}</p>
            </div>
            {/* Arrow indicator */}
            <span
              className="pointer-events-none absolute top-5 right-5 text-border group-hover:text-navy transition-colors duration-fast"
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