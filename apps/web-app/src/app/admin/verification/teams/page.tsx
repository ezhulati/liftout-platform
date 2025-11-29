'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  useAdminTeams,
  useVerifyTeam,
  useRejectTeamVerification,
} from '@/hooks/admin/useAdminTeams';

export default function TeamVerificationPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch only pending teams
  const { data, isLoading, refetch } = useAdminTeams({
    verificationStatus: 'pending',
    limit,
    offset: (page - 1) * limit,
  });

  const verifyTeam = useVerifyTeam();
  const rejectTeam = useRejectTeamVerification();

  const teams = data?.teams || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleVerify = async (teamId: string, teamName: string) => {
    try {
      await verifyTeam.mutateAsync(teamId);
      toast.success(`${teamName} has been verified`);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to verify team');
    }
  };

  const handleReject = async (teamId: string, teamName: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await rejectTeam.mutateAsync({ teamId, reason: reason || undefined });
      toast.success(`${teamName} verification rejected`);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject verification');
    }
  };

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
        <h1 className="text-2xl font-bold text-white">Team Verification</h1>
        <p className="mt-1 text-sm text-gray-400">
          Review and verify team profiles pending approval
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <ClockIcon className="h-5 w-5 text-yellow-400" />
          <span className="text-yellow-400 font-medium">{total} pending</span>
        </div>
      </div>

      {/* Teams List */}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Submitted
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
                      <div className="h-4 w-32 bg-gray-700 rounded"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-8 w-32 bg-gray-700 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : teams.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <CheckBadgeIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-300 font-medium">All caught up!</p>
                  <p className="text-gray-500 text-sm mt-1">No teams pending verification</p>
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{team.name}</p>
                        <p className="text-sm text-gray-400">{team.industry || 'No industry'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {team._count.members}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatDate(team.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/teams/${team.id}`}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title="View details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleVerify(team.id, team.name)}
                        disabled={verifyTeam.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                      >
                        <CheckBadgeIcon className="h-4 w-4" />
                        Verify
                      </button>
                      <button
                        onClick={() => handleReject(team.id, team.name)}
                        disabled={rejectTeam.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
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
