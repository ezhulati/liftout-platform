'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  emailVerified: boolean;
  createdAt: string;
  lastActive: string | null;
  suspendedAt: string | null;
  suspendedReason: string | null;
  bannedAt: string | null;
  bannedReason: string | null;
  deletedAt: string | null;
  isDemo: boolean;
  profile: {
    profilePhotoUrl: string | null;
  } | null;
}

function UserTypeBadge({ type }: { type: string }) {
  const config = {
    individual: { label: 'Individual', icon: UserGroupIcon, color: 'bg-blue-500/10 text-blue-400' },
    company: { label: 'Company', icon: BuildingOfficeIcon, color: 'bg-green-500/10 text-green-400' },
    admin: { label: 'Admin', icon: ShieldCheckIcon, color: 'bg-red-500/10 text-red-400' },
  }[type] || { label: type, icon: UserCircleIcon, color: 'bg-gray-500/10 text-gray-400' };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
      <BeakerIcon className="h-3 w-3" />
      Demo
    </span>
  );
}

function StatusBadge({ user }: { user: User }) {
  if (user.deletedAt) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-500/10 text-gray-400">
        <TrashIcon className="h-3 w-3" />
        Deleted
      </span>
    );
  }
  if (user.bannedAt) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400">
        <NoSymbolIcon className="h-3 w-3" />
        Banned
      </span>
    );
  }
  if (user.suspendedAt) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400">
        <ExclamationTriangleIcon className="h-3 w-3" />
        Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
      Active
    </span>
  );
}

export default function UsersPage() {
  // Filters
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [userType, setUserType] = useState('');
  const [status, setStatus] = useState<'active' | 'suspended' | 'banned' | 'deleted' | ''>('');
  const [demoFilter, setDemoFilter] = useState<'all' | 'demo' | 'real'>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [userType, status, demoFilter]);

  // Fetch users with hook
  const { data, isLoading } = useAdminUsers({
    query: debouncedQuery || undefined,
    userType: userType || undefined,
    status: status || undefined,
    isDemo: demoFilter === 'all' ? undefined : demoFilter === 'demo',
    limit,
    offset: (page - 1) * limit,
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="mt-1 text-sm text-gray-400">
          View and manage all platform users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* User Type Filter */}
        <div className="relative">
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="individual">Individual</option>
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>
          <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
            <option value="deleted">Deleted</option>
          </select>
          <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Demo/Real Filter */}
        <div className="relative">
          <select
            value={demoFilter}
            onChange={(e) => setDemoFilter(e.target.value as typeof demoFilter)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            <option value="real">Real Users Only</option>
            <option value="demo">Demo Users Only</option>
          </select>
          <BeakerIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-400">
        Showing {users.length} of {total} users
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-700 rounded"></div>
                        <div className="h-3 w-48 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-8 w-16 bg-gray-700 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-gray-400">No users found</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-800/30 transition-colors ${user.isDemo ? 'bg-purple-500/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                          {user.profile?.profilePhotoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element -- Dynamic user avatar */
                            <img
                              src={user.profile.profilePhotoUrl}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        {user.isDemo && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center" title="Demo Account">
                            <BeakerIcon className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          {user.isDemo && <DemoBadge />}
                        </div>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <UserTypeBadge type={user.userType} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge user={user} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {formatTimeAgo(user.lastActive)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
