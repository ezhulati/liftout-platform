'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Navigation items that show for team users
const teamNavigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
  { name: 'My Team Profile', href: '/app/teams', icon: UserGroupIcon },
  { name: 'Liftout Opportunities', href: '/app/opportunities', icon: BriefcaseIcon },
  { name: 'AI Matching', href: '/app/ai-matching', icon: CpuChipIcon },
  { name: 'My Applications', href: '/app/applications', icon: DocumentTextIcon },
  { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon },
];

// Navigation items that show for company users
const companyNavigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
  { name: 'Browse Teams', href: '/app/teams', icon: UserGroupIcon },
  { name: 'My Opportunities', href: '/app/opportunities', icon: BriefcaseIcon },
  { name: 'AI Matching', href: '/app/ai-matching', icon: CpuChipIcon },
  { name: 'Team Applications', href: '/app/applications', icon: DocumentTextIcon },
  { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Advanced Search', href: '/app/search', icon: MagnifyingGlassIcon },
];

const companyExtendedNavigation = [
  { name: 'Market Intelligence', href: '/app/market-intelligence', icon: GlobeAltIcon },
  { name: 'Team Discovery', href: '/app/discovery', icon: EyeIcon },
  { name: 'Culture Assessment', href: '/app/culture', icon: AcademicCapIcon },
  { name: 'Due Diligence', href: '/app/due-diligence', icon: ShieldCheckIcon },
  { name: 'Negotiations', href: '/app/negotiations', icon: DocumentCheckIcon },
  { name: 'Legal & Compliance', href: '/app/legal', icon: ScaleIcon },
  { name: 'Integration Tracking', href: '/app/integration', icon: RocketLaunchIcon },
  { name: 'Liftout Analytics', href: '/app/analytics', icon: ChartBarIcon },
  { name: 'Company Profile', href: '/app/company', icon: BuildingOfficeIcon },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/app/settings', icon: CogIcon },
];

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

  const NavLink = ({ item }: { item: { name: string; href: string; icon: React.ComponentType<{ className?: string }> } }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-fast ${
          isActive
            ? 'bg-navy text-white'
            : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
        }`}
      >
        <item.icon
          className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-fast ${
            isActive ? 'text-gold' : 'text-text-tertiary group-hover:text-navy'
          }`}
          aria-hidden="true"
        />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-navy-900/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-base ease-out-quart ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col bg-bg-surface border-r border-border">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/app/dashboard" className="flex items-center">
              <Image
                src="/Liftout-logo-dark.png"
                alt="Liftout"
                width={220}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <button
              type="button"
              className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors duration-fast"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* User type badge */}
          {user && (
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                {isCompanyUser ? (
                  <BuildingOfficeIcon className="h-4 w-4 text-navy" />
                ) : (
                  <UserGroupIcon className="h-4 w-4 text-gold" />
                )}
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  {isCompanyUser ? 'Company Account' : 'Team Account'}
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {currentNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            {isCompanyUser && (
              <>
                <div className="pt-6 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Company Tools
                  </h3>
                </div>
                {companyExtendedNavigation.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </>
            )}

            <div className="pt-6 border-t border-border mt-6">
              {secondaryNavigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-bg-surface border-r border-border">
          {/* Header */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            <Link href="/app/dashboard" className="flex items-center">
              <Image
                src="/Liftout-logo-dark.png"
                alt="Liftout"
                width={220}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* User type badge */}
          {user && (
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                {isCompanyUser ? (
                  <BuildingOfficeIcon className="h-4 w-4 text-navy" />
                ) : (
                  <UserGroupIcon className="h-4 w-4 text-gold" />
                )}
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  {isCompanyUser ? 'Company Account' : 'Team Account'}
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {currentNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            {isCompanyUser && (
              <>
                <div className="pt-6 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Company Tools
                  </h3>
                </div>
                {companyExtendedNavigation.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </>
            )}

            <div className="pt-6 border-t border-border mt-6">
              {secondaryNavigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
