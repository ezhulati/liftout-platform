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
  ChatBubbleLeftRightIcon,
  CogIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

// Navigation items that show for team users (8 items per Figma)
const teamNavigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
  { name: 'My Team', href: '/app/teams', icon: UserGroupIcon },
  { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon, badge: 10 },
  { name: 'Find Companies', href: '/app/find-companies', icon: BuildingOfficeIcon },
  { name: 'Opportunities', href: '/app/opportunities', icon: BriefcaseIcon },
  { name: 'AI Matching', href: '/app/matching', icon: SparklesIcon },
  { name: 'Activity', href: '/app/activity', icon: BellIcon, badge: 10 },
];

// Navigation items that show for company users (8 items per Figma)
const companyNavigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
  { name: 'My Posts', href: '/app/opportunities', icon: BriefcaseIcon },
  { name: 'Messages', href: '/app/messages', icon: ChatBubbleLeftRightIcon, badge: 10 },
  { name: 'Find teams', href: '/app/teams', icon: MagnifyingGlassIcon },
  { name: 'AI Matching', href: '/app/matching', icon: SparklesIcon },
  { name: 'Candidates', href: '/app/applications', icon: UsersIcon },
  { name: 'Activity', href: '/app/activity', icon: BellIcon, badge: 10 },
];

const secondaryNavigation = [
  { name: 'Support', href: '/app/support', icon: QuestionMarkCircleIcon },
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

  // Purple sidebar nav link - Practical UI: 48px touch target, 8pt grid spacing
  const NavLink = ({ item }: { item: { name: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: number } }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    return (
      <Link
        href={item.href}
        className={`group flex items-center justify-between px-4 py-3 min-h-12 text-base font-bold rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-white/15 text-white'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <item.icon
            className={`flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-white/80'}`}
            aria-hidden="true"
          />
          {item.name}
        </div>
        {item.badge && (
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full min-w-6 text-center">
            {item.badge}
          </span>
        )}
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

      {/* Mobile sidebar - Purple Figma design */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-base ease-out-quart ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col bg-[#4C1D95]">
          {/* Header with logo */}
          <div className="flex items-center justify-between h-16 px-4">
            <Link href="/app/dashboard" className="flex items-center">
              <img
                src="/liftout.png"
                alt="Liftout"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <button
              type="button"
              className="p-3 min-h-12 min-w-12 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {currentNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          {/* Bottom section - Support, Settings */}
          <div className="px-3 pb-4 space-y-1">
            {secondaryNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop sidebar - Purple Figma design */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-[#4C1D95]">
          {/* Header with logo */}
          <div className="flex items-center h-16 px-4">
            <Link href="/app/dashboard" className="flex items-center">
              <img
                src="/liftout.png"
                alt="Liftout"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {currentNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          {/* Bottom section - Support, Settings */}
          <div className="px-3 pb-4 space-y-1">
            {secondaryNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
