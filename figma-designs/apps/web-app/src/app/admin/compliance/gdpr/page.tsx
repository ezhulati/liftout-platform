'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface GDPRRequest {
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

function RequestTypeBadge({ type }: { type: GDPRRequest['type'] }) {
  const config: Record<string, { label: string; icon: typeof DocumentArrowDownIcon; color: string }> = {
    export: { label: 'Data Export', icon: DocumentArrowDownIcon, color: 'bg-blue-500/10 text-blue-400' },
    delete: { label: 'Data Deletion', icon: TrashIcon, color: 'bg-red-500/10 text-red-400' },
    access: { label: 'Data Access', icon: EyeIcon, color: 'bg-green-500/10 text-green-400' },
  };

  const cfg = config[type] || config.access;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; icon: typeof ClockIcon; color: string }> = {
    pending: { label: 'Pending', icon: ClockIcon, color: 'bg-yellow-500/10 text-yellow-400' },
    processing: { label: 'Processing', icon: ClockIcon, color: 'bg-blue-500/10 text-blue-400' },
    completed: { label: 'Completed', icon: CheckCircleIcon, color: 'bg-green-500/10 text-green-400' },
    failed: { label: 'Failed', icon: ExclamationTriangleIcon, color: 'bg-red-500/10 text-red-400' },
  };

  const cfg = config[status] || config.pending;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export default function GDPRCompliancePage() {
  const [requests, setRequests] = useState<GDPRRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchRequests uses filter which is in deps
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }
      params.append('limit', '50');

      const response = await fetch(`/api/admin/compliance/requests?${params}`);
      if (!response.ok) throw new Error('Failed to fetch GDPR requests');

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

  const filteredRequests = requests.filter((req) => {
    if (search === '') return true;
    return (
      req.user.email.toLowerCase().includes(search.toLowerCase()) ||
      req.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      req.user.lastName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const processingCount = requests.filter((r) => r.status === 'processing').length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">GDPR Compliance</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage data export, deletion, and access requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-500/10">
              <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{total}</p>
              <p className="text-sm text-gray-400">Total Requests</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <ClockIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <ClockIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{processingCount}</p>
              <p className="text-sm text-gray-400">Processing</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedCount}</p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'processing', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Requests list */}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Request Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
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
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <ShieldCheckIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No GDPR requests found</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {request.user.firstName} {request.user.lastName}
                        </p>
                        <p className="text-sm text-gray-400">{request.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RequestTypeBadge type={request.type} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} />
                      {request.notes && (
                        <p className="text-xs text-gray-500 mt-1">{request.notes}</p>
                      )}
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
        )}
      </div>

      {/* Legal notice */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-4">
        <div className="flex gap-3">
          <ShieldCheckIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            <p className="font-medium text-gray-300">GDPR Compliance Notice</p>
            <p className="mt-1">
              Data export requests must be fulfilled within 30 days. Data deletion requests
              will anonymize user data while preserving required financial records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
