'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FlagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface FlaggedContent {
  id: string;
  type: string;
  contentId: string;
  reason: string;
  details: string | null;
  severity: string;
  status: string;
  reportedAt: string;
  reportedBy: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
  resolution: string | null;
}

export default function FlaggedContentPage() {
  const [flaggedItems, setFlaggedItems] = useState<FlaggedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('pending');
  const limit = 20;

  useEffect(() => {
    fetchFlaggedContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchFlaggedContent uses page/status which are in deps
  }, [page, status]);

  const fetchFlaggedContent = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', status);
      params.append('limit', String(limit));
      params.append('offset', String((page - 1) * limit));

      const response = await fetch(`/api/admin/moderation/flagged?${params}`);
      if (!response.ok) throw new Error('Failed to fetch flagged content');

      const data = await response.json();
      setFlaggedItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (flagId: string, action: 'approve' | 'reject') => {
    try {
      const resolution = prompt(`Enter resolution note for ${action}:`);
      const response = await fetch('/api/admin/moderation/flagged', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId, action, resolution }),
      });

      if (!response.ok) throw new Error('Failed to resolve flag');

      toast.success(`Flag ${action}d successfully`);
      fetchFlaggedContent();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to resolve flag');
    }
  };

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-500/10 text-gray-400',
      medium: 'bg-yellow-500/10 text-yellow-400',
      high: 'bg-orange-500/10 text-orange-400',
      critical: 'bg-red-500/10 text-red-400',
    };
    return colors[severity] || colors.medium;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Flagged Content</h1>
        <p className="mt-1 text-sm text-gray-400">
          Review content that has been flagged by users
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <span className="text-red-400 font-medium">{total} items</span>
        </div>
      </div>

      {/* Flagged Content List */}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading flagged content...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : flaggedItems.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-300 font-medium">All clear!</p>
            <p className="text-gray-500 text-sm mt-1">No {status} flags to review</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {flaggedItems.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <FlagIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium capitalize">{item.type}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(item.severity)}`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{item.reason}</p>
                      {item.details && (
                        <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Reported {formatDate(item.reportedAt)}
                        {item.reportedBy && ` by ${item.reportedBy.email}`}
                      </p>
                      {item.resolution && (
                        <p className="text-xs text-gray-400 mt-1">
                          Resolution: {item.resolution}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolve(item.id, 'approve')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleResolve(item.id, 'reject')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
