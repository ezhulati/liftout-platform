'use client';

import { useState } from 'react';
import {
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface GDPRRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestType: 'export' | 'delete' | 'access';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processedAt: string | null;
  processedBy: string | null;
}

const mockRequests: GDPRRequest[] = [
  {
    id: '1',
    userId: 'user-123',
    userEmail: 'john@example.com',
    userName: 'John Smith',
    requestType: 'export',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    processedAt: null,
    processedBy: null,
  },
  {
    id: '2',
    userId: 'user-456',
    userEmail: 'jane@example.com',
    userName: 'Jane Doe',
    requestType: 'delete',
    status: 'processing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    processedAt: null,
    processedBy: null,
  },
  {
    id: '3',
    userId: 'user-789',
    userEmail: 'bob@example.com',
    userName: 'Bob Wilson',
    requestType: 'access',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    processedBy: 'Admin User',
  },
];

function RequestTypeBadge({ type }: { type: GDPRRequest['requestType'] }) {
  const config = {
    export: { label: 'Data Export', icon: DocumentArrowDownIcon, color: 'bg-blue-500/10 text-blue-400' },
    delete: { label: 'Data Deletion', icon: TrashIcon, color: 'bg-red-500/10 text-red-400' },
    access: { label: 'Data Access', icon: ShieldCheckIcon, color: 'bg-green-500/10 text-green-400' },
  }[type];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function StatusBadge({ status }: { status: GDPRRequest['status'] }) {
  const config = {
    pending: { label: 'Pending', icon: ClockIcon, color: 'bg-yellow-500/10 text-yellow-400' },
    processing: { label: 'Processing', icon: ClockIcon, color: 'bg-blue-500/10 text-blue-400' },
    completed: { label: 'Completed', icon: CheckCircleIcon, color: 'bg-green-500/10 text-green-400' },
    failed: { label: 'Failed', icon: ExclamationTriangleIcon, color: 'bg-red-500/10 text-red-400' },
  }[status];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export default function GDPRCompliancePage() {
  const [requests] = useState<GDPRRequest[]>(mockRequests);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesSearch =
      search === '' ||
      req.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      req.userName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const processingCount = requests.filter((r) => r.status === 'processing').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleProcess = (id: string) => {
    console.log('Processing request:', id);
    // In production, this would call the API to process the request
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <ClockIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
              <p className="text-sm text-gray-400">Pending Requests</p>
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
              <p className="text-2xl font-bold text-white">
                {requests.filter((r) => r.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-400">Completed (30 days)</p>
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
                  <p className="text-gray-400">No requests found</p>
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{request.userName}</p>
                      <p className="text-sm text-gray-400">{request.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RequestTypeBadge type={request.requestType} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleProcess(request.id)}
                        className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                      >
                        Process
                      </button>
                    )}
                    {request.status === 'processing' && (
                      <span className="text-sm text-gray-500">In progress...</span>
                    )}
                    {request.status === 'completed' && request.requestType === 'export' && (
                      <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
