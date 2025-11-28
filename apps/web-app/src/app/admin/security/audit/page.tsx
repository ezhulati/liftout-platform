'use client';

import { useState, useEffect } from 'react';
import {
  DocumentMagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface AuditLogEntry {
  id: string;
  action: string;
  userId: string;
  resourceType: string;
  resourceId: string | null;
  createdAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  newValues?: Record<string, unknown>;
}

function ActionIcon({ action }: { action: string }) {
  if (action.includes('view') || action.includes('login')) {
    return <EyeIcon className="h-4 w-4" />;
  }
  if (action.includes('edit') || action.includes('update')) {
    return <PencilSquareIcon className="h-4 w-4" />;
  }
  if (action.includes('delete') || action.includes('ban')) {
    return <TrashIcon className="h-4 w-4" />;
  }
  if (action.includes('approve') || action.includes('verify')) {
    return <ShieldCheckIcon className="h-4 w-4" />;
  }
  return <DocumentMagnifyingGlassIcon className="h-4 w-4" />;
}

function ActionBadge({ action }: { action: string }) {
  let color = 'bg-gray-500/10 text-gray-400';

  if (action.includes('delete') || action.includes('ban') || action.includes('reject')) {
    color = 'bg-red-500/10 text-red-400';
  } else if (action.includes('approve') || action.includes('verify')) {
    color = 'bg-green-500/10 text-green-400';
  } else if (action.includes('edit') || action.includes('update')) {
    color = 'bg-blue-500/10 text-blue-400';
  } else if (action.includes('suspend')) {
    color = 'bg-yellow-500/10 text-yellow-400';
  }

  const formatAction = (action: string) => {
    return action
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' - ');
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${color}`}>
      <ActionIcon action={action} />
      {formatAction(action)}
    </span>
  );
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('/api/admin/audit');
        if (response.ok) {
          const data = await response.json();
          setLogs(data.logs || []);
        }
      } catch (error) {
        // Use mock data for development
        setLogs([
          {
            id: '1',
            action: 'user.view',
            userId: 'admin-1',
            resourceType: 'user',
            resourceId: 'user-123',
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0',
            user: { email: 'admin@liftout.com', firstName: 'Admin', lastName: 'User' },
          },
          {
            id: '2',
            action: 'verification.team.approve',
            userId: 'admin-1',
            resourceType: 'team',
            resourceId: 'team-456',
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0',
            user: { email: 'admin@liftout.com', firstName: 'Admin', lastName: 'User' },
          },
          {
            id: '3',
            action: 'user.suspend',
            userId: 'admin-1',
            resourceType: 'user',
            resourceId: 'user-789',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0',
            user: { email: 'admin@liftout.com', firstName: 'Admin', lastName: 'User' },
            newValues: { reason: 'Violation of terms of service' },
          },
          {
            id: '4',
            action: 'admin.login',
            userId: 'admin-1',
            resourceType: 'session',
            resourceId: null,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0',
            user: { email: 'admin@liftout.com', firstName: 'Admin', lastName: 'User' },
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const filteredLogs = filter
    ? logs.filter(
        (log) =>
          log.action.toLowerCase().includes(filter.toLowerCase()) ||
          log.user?.email.toLowerCase().includes(filter.toLowerCase()) ||
          log.resourceType.toLowerCase().includes(filter.toLowerCase())
      )
    : logs;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="mt-1 text-sm text-gray-400">
          View all admin actions and system events
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <DocumentMagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by action, user, or resource..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
          <FunnelIcon className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Log entries */}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading audit logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center">
            <DocumentMagnifyingGlassIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No audit logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {log.user?.firstName} {log.user?.lastName}
                        </span>
                        <ActionBadge action={log.action} />
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {log.resourceType && (
                          <>
                            Target: <span className="text-gray-300">{log.resourceType}</span>
                            {log.resourceId && (
                              <span className="text-gray-500"> ({log.resourceId})</span>
                            )}
                          </>
                        )}
                      </p>
                      {log.newValues && Object.keys(log.newValues).length > 0 && (
                        <div className="mt-2 text-xs text-gray-500 bg-gray-900 rounded px-2 py-1">
                          {JSON.stringify(log.newValues)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ClockIcon className="h-3 w-3" />
                      {formatDateTime(log.createdAt)}
                    </div>
                    {log.ipAddress && (
                      <p className="text-xs text-gray-600 mt-1">IP: {log.ipAddress}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
