'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getDemoDataForUser } from '@/lib/demo-accounts';
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  CogIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
  RocketLaunchIcon,
  EyeIcon,
  ScaleIcon,
  AcademicCapIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

// Navigation items that show for team users
const teamNavigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon, current: false },
  { name: 'My Team Profile', href: '/app/teams', icon: UserGroupIcon, current: false },
  { name: 'Liftout Opportunities', href: '/app/opportunities', icon: BriefcaseIcon, current: false },
  { name: 'AI Matching', href: '/app/ai-matching', icon: CpuChipIcon, current: false },
  { name: 'My Applications', href: '/app/applications', icon: DocumentTextIcon, current: false },
  { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon, current: false },
];

// Navigation items that show for company users
const companyNavigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon, current: false },
  { name: 'Browse Teams', href: '/app/teams', icon: UserGroupIcon, current: false },
  { name: 'My Opportunities', href: '/app/opportunities', icon: BriefcaseIcon, current: false },
  { name: 'AI Matching', href: '/app/ai-matching', icon: CpuChipIcon, current: false },
  { name: 'Team Applications', href: '/app/applications', icon: DocumentTextIcon, current: false },
  { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon, current: false },
  { name: 'Advanced Search', href: '/app/search', icon: MagnifyingGlassIcon, current: false },
];

const companyExtendedNavigation = [
  { name: 'Market Intelligence', href: '/app/market-intelligence', icon: GlobeAltIcon, current: false },
  { name: 'Team Discovery', href: '/app/discovery', icon: EyeIcon, current: false },
  { name: 'Culture Assessment', href: '/app/culture', icon: AcademicCapIcon, current: false },
  { name: 'Due Diligence', href: '/app/due-diligence', icon: ShieldCheckIcon, current: false },
  { name: 'Negotiations', href: '/app/negotiations', icon: DocumentCheckIcon, current: false },
  { name: 'Legal & Compliance', href: '/app/legal', icon: ScaleIcon, current: false },
  { name: 'Integration Tracking', href: '/app/integration', icon: RocketLaunchIcon, current: false },
  { name: 'Liftout Analytics', href: '/app/analytics', icon: ChartBarIcon, current: false },
  { name: 'Company Profile', href: '/app/company', icon: BuildingOfficeIcon, current: false },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/app/settings', icon: CogIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user data from NextAuth session
  const user = session?.user;
  const demoData = user?.email ? getDemoDataForUser(user.email) : null;
  const userType = user?.userType || demoData?.userType || 'individual';
  
  const isCompanyUser = userType === 'company';

  const currentNavigation = isCompanyUser ? companyNavigation : teamNavigation;
  const navigationWithCurrent = currentNavigation.map((item) => ({
    ...item,
    current: pathname === item.href,
  }));

  const companyExtendedNavigationWithCurrent = companyExtendedNavigation.map((item) => ({
    ...item,
    current: pathname === item.href,
  }));

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-50 flex" style={{ display: sidebarOpen ? 'flex' : 'none' }}>
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-shrink-0 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-gray-900">Liftout</h1>
              {user && (
                <div className="flex items-center">
                  {isCompanyUser ? (
                    <BuildingOfficeIcon className="h-4 w-4 text-blue-500 mr-1" />
                  ) : (
                    <UserGroupIcon className="h-4 w-4 text-green-500 mr-1" />
                  )}
                  <span className="text-xs text-gray-500 font-medium">
                    {isCompanyUser ? 'Company' : 'Team'}
                  </span>
                </div>
              )}
            </div>
            <nav className="mt-5 flex-shrink-0 h-full divide-y divide-gray-200 overflow-y-auto">
              <div className="px-2 space-y-1">
                {navigationWithCurrent.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium border-l-4'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
              {isCompanyUser && (
                <div className="mt-6 pt-6">
                  <div className="px-2 space-y-1">
                    {companyExtendedNavigationWithCurrent.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center px-2 py-2 text-sm font-medium border-l-4'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6 pt-6">
                <div className="px-2 space-y-1">
                  {secondaryNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <item.icon
                        className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
          <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto border-r border-gray-200">
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Liftout</h1>
            {user && (
              <div className="flex items-center">
                {isCompanyUser ? (
                  <BuildingOfficeIcon className="h-4 w-4 text-blue-500 mr-1" />
                ) : (
                  <UserGroupIcon className="h-4 w-4 text-green-500 mr-1" />
                )}
                <span className="text-xs text-gray-500 font-medium">
                  {isCompanyUser ? 'Company' : 'Team'}
                </span>
              </div>
            )}
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigationWithCurrent.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium border-l-4'
                )}
              >
                <item.icon
                  className={classNames(
                    item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
            {isCompanyUser && (
              <>
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Company Tools
                  </h3>
                  <div className="mt-2 space-y-1">
                    {companyExtendedNavigationWithCurrent.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center px-2 py-2 text-sm font-medium border-l-4'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="border-t border-gray-200 mt-6 pt-6">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon
                    className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}