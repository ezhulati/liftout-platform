'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useAdminCompanies } from '@/hooks/admin/useAdminCompanies';

function VerificationBadge({ status }: { status: string }) {
  const config = {
    verified: { label: 'Verified', icon: CheckBadgeIcon, color: 'bg-green-500/10 text-green-400' },
    pending: { label: 'Pending', icon: ClockIcon, color: 'bg-yellow-500/10 text-yellow-400' },
    rejected: { label: 'Rejected', icon: XCircleIcon, color: 'bg-red-500/10 text-red-400' },
  }[status] || { label: status, icon: ClockIcon, color: 'bg-gray-500/10 text-gray-400' };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function StatusBadge({ deletedAt }: { deletedAt: string | null }) {
  if (deletedAt) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-500/10 text-gray-400">
        <TrashIcon className="h-3 w-3" />
        Deleted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
      Active
    </span>
  );
}

export default function CompaniesPage() {
  // Filters
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [status, setStatus] = useState<'active' | 'deleted' | ''>('');
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
  }, [verificationStatus, status]);

  // Fetch companies with hook
  const { data, isLoading, error } = useAdminCompanies({
    query: debouncedQuery || undefined,
    verificationStatus: verificationStatus || undefined,
    status: status || undefined,
    limit,
    offset: (page - 1) * limit,
  });

  const companies = data?.companies || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Company Management</h1>
        <p className="mt-1 text-sm text-gray-400">
          View and manage all platform companies
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
              placeholder="Search by company name..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Verification Status Filter */}
        <div className="relative">
          <select
            value={verificationStatus}
            onChange={(e) => setVerificationStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Verification</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
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
            <option value="deleted">Deleted</option>
          </select>
          <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-400">
        Showing {companies.length} of {total} companies
      </div>

      {/* Companies table */}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Opportunities
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Verification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created
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
                      <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-700 rounded"></div>
                        <div className="h-3 w-48 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-8 w-16 bg-gray-700 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-gray-400">No companies found</p>
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{company.name}</p>
                        <p className="text-sm text-gray-400">
                          {company.industry || 'No industry specified'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {company._count.users}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {company._count.opportunities}
                  </td>
                  <td className="px-6 py-4">
                    <VerificationBadge status={company.verificationStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge deletedAt={company.deletedAt} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatDate(company.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/companies/${company.id}`}
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
