'use client';

import Link from 'next/link';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function VerificationDashboard() {
  // Mock data - in production would fetch from API
  const stats = {
    companies: { pending: 5, verified: 38, rejected: 2 },
    teams: { pending: 12, verified: 67, rejected: 10 },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Verification Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Review and approve company and team verification requests
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Companies */}
        <Link
          href="/admin/verification/companies"
          className="block rounded-xl border border-gray-700 bg-gray-800/50 p-6 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <BuildingOfficeIcon className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Company Verification</h2>
              <p className="text-sm text-gray-400">
                {stats.companies.pending} pending reviews
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-400">
                <ClockIcon className="h-4 w-4" />
                <span className="text-xl font-bold">{stats.companies.pending}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Pending</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-400">
                <CheckCircleIcon className="h-4 w-4" />
                <span className="text-xl font-bold">{stats.companies.verified}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Verified</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-400">
                <XCircleIcon className="h-4 w-4" />
                <span className="text-xl font-bold">{stats.companies.rejected}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Rejected</p>
            </div>
          </div>
        </Link>

        {/* Teams */}
        <Link
          href="/admin/verification/teams"
          className="block rounded-xl border border-gray-700 bg-gray-800/50 p-6 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <UserGroupIcon className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Team Verification</h2>
              <p className="text-sm text-gray-400">
                {stats.teams.pending} pending reviews
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-400">
                <ClockIcon className="h-4 w-4" />
                <span className="text-xl font-bold">{stats.teams.pending}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Pending</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-400">
                <CheckCircleIcon className="h-4 w-4" />
                <span className="text-xl font-bold">{stats.teams.verified}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Verified</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-400">
                <XCircleIcon className="h-4 w-4" />
                <span className="text-xl font-bold">{stats.teams.rejected}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Rejected</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
