'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface DataRequest {
  id: string;
  type: 'export' | 'delete' | 'access';
  status: string;
  requestedAt: string;
  processedAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  notes: string | null;
  exportUrl: string | null;
}

export default function DataRequestsPage() {
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 20;

  useEffect(() => {
    fetchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchRequests uses page/statusFilter which are in deps
  }, [page, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('limit', String(limit));
      params.append('offset', String((page - 1) * limit));

      const response = await fetch(`/api/admin/compliance/requests?${params}`);
      if (!response.ok) throw new Error('Failed to fetch data requests');

      const data = await response.json();
      setRequests(data.requests || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (requestId: string, action: 'process' | 'complete' | 'reject') => {
    try {
      const notes = prompt(`Enter notes for this action (optional):`);
      const response = await fetch('/api/admin/compliance/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action, notes }),
      });

      if (!response.ok) throw new Error('Failed to process request');

      toast.success(`Request ${action === 'process' ? 'marked as processing' : action + 'd'}`);
      fetchRequests();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process request');
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: typeof ClockIcon }> = {
      pending: { color: 'bg-yellow-500/10 text-yellow-400', icon: ClockIcon },
      processing: { color: 'bg-blue-500/10 text-blue-400', icon: ClockIcon },
      completed: { color: 'bg-green-500/10 text-green-400', icon: CheckCircleIcon },
      failed: { color: 'bg-red-500/10 text-red-400', icon: TrashIcon },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  // Stats
  const exportCount = requests.filter(r => r.type === 'export').length;
  const deleteCount = requests.filter(r => r.type === 'delete').length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Data Requests</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage GDPR data export and deletion requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-6 w-6 text-gray-400" />
            <div>
              <p className="text-2xl font-bold text-white">{total}</p>
              <p className="text-sm text-gray-400">Total Requests</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <ArrowDownTrayIcon className="h-6 w-6 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{exportCount}</p>
              <p className="text-sm text-gray-400">Export Requests</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <TrashIcon className="h-6 w-6 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-white">{deleteCount}</p>
              <p className="text-sm text-gray-400">Deletion Requests</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <ClockIcon className="h-6 w-6 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed/Rejected</option>
        </select>
      </div>

      {/* Requests Table */}
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
                Requested
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-6 w-24 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-700 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-8 w-20 bg-gray-700 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-red-400">{error}</p>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No data requests</p>
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">
                        {request.user.firstName} {request.user.lastName}
                      </p>
                      <p className="text-sm text-gray-400">{request.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      request.type === 'export' ? 'bg-blue-500/10 text-blue-400' :
                      request.type === 'delete' ? 'bg-red-500/10 text-red-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {request.type === 'export' ? (
                        <ArrowDownTrayIcon className="h-3 w-3" />
                      ) : request.type === 'delete' ? (
                        <TrashIcon className="h-3 w-3" />
                      ) : (
                        <DocumentTextIcon className="h-3 w-3" />
                      )}
                      {request.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatDate(request.requestedAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleProcess(request.id, 'process')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => handleProcess(request.id, 'reject')}
                            className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'processing' && (
                        <button
                          onClick={() => handleProcess(request.id, 'complete')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {request.exportUrl && (
                        <a
                          href={request.exportUrl}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Download
                        </a>
                      )}
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
