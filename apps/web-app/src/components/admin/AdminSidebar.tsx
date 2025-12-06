'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  FlagIcon,
  CreditCardIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  LockClosedIcon,
  CogIcon,
  XMarkIcon,
  Bars3Icon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

// Main navigation items
const mainNavigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'User Management', href: '/admin/users', icon: UsersIcon },
  { name: 'Team Management', href: '/admin/teams', icon: UserGroupIcon },
  { name: 'Company Management', href: '/admin/companies', icon: BuildingOfficeIcon },
];

// Verification section
const verificationNavigation = [
  { name: 'Company Verification', href: '/admin/verification/companies', icon: BuildingOfficeIcon },
  { name: 'Team Verification', href: '/admin/verification/teams', icon: UserGroupIcon },
];

// Moderation section
const moderationNavigation = [
  { name: 'Moderation Queue', href: '/admin/moderation', icon: FlagIcon },
  { name: 'Flagged Content', href: '/admin/moderation/flagged', icon: ExclamationTriangleIcon },
];

// Operations section
const operationsNavigation = [
  { name: 'Applications', href: '/admin/applications', icon: ClipboardDocumentListIcon },
  { name: 'Billing', href: '/admin/billing', icon: CreditCardIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
];

// Security & Compliance section
const securityNavigation = [
  { name: 'Audit Log', href: '/admin/security/audit', icon: DocumentMagnifyingGlassIcon },
  { name: 'Security', href: '/admin/security', icon: LockClosedIcon },
  { name: 'GDPR Compliance', href: '/admin/compliance/gdpr', icon: ShieldCheckIcon },
  { name: 'Data Requests', href: '/admin/compliance/requests', icon: DocumentTextIcon },
];

// Settings section
const settingsNavigation = [
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = session?.user;

  const NavLink = ({
    item,
  }: {
    item: { name: string; href: string; icon: React.ComponentType<{ className?: string }> };
  }) => {
    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
        className={`group flex items-center px-3 py-2.5 min-h-11 text-sm font-medium rounded-lg transition-all duration-fast ${
          isActive
            ? 'bg-red-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <item.icon
          className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-fast ${
            isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
          }`}
          aria-hidden="true"
        />
        {item.name}
      </Link>
    );
  };

  const NavSection = ({
    title,
    items,
  }: {
    title: string;
    items: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }>;
  }) => (
    <div className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {items.map((item) => (
        <NavLink key={item.name} item={item} />
      ))}
    </div>
  );

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-gray-800">
        <Link href="/admin" className="flex items-center group">
          <div className="relative bg-gray-900 rounded-lg px-3 py-1.5 border border-gray-700 group-hover:border-gray-600 transition-all duration-300">
            <img
              src="/liftout-logo-all-white.svg"
              alt="Liftout"
              className="h-7 w-auto"
            />
          </div>
          <span className="ml-2 text-xs font-bold text-red-500 uppercase tracking-wider">
            Admin
          </span>
        </Link>
      </div>

      {/* Admin badge */}
      {user && (
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-red-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Super Admin
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-300 truncate">{user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main */}
        <div className="space-y-1">
          {mainNavigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </div>

        {/* Verification */}
        <NavSection title="Verification" items={verificationNavigation} />

        {/* Moderation */}
        <NavSection title="Moderation" items={moderationNavigation} />

        {/* Operations */}
        <NavSection title="Operations" items={operationsNavigation} />

        {/* Security & Compliance */}
        <NavSection title="Security & Compliance" items={securityNavigation} />

        {/* Settings */}
        <div className="pt-4 border-t border-gray-800">
          {settingsNavigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-800">
        <Link
          href="/app/dashboard"
          className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Exit Admin Panel
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="p-2.5 rounded-lg bg-gray-900 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-base ease-out-quart ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-gray-900">
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gray-900">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
