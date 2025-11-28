'use client';

import { useState } from 'react';
import {
  FlagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserCircleIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface ModerationItem {
  id: string;
  contentType: 'team' | 'opportunity' | 'message' | 'profile';
  contentId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  reportedBy: string | null;
  createdAt: string;
  preview?: string;
}

const mockItems: ModerationItem[] = [
  {
    id: '1',
    contentType: 'team',
    contentId: 'team-123',
    reason: 'Inappropriate team description',
    severity: 'medium',
    status: 'pending',
    reportedBy: 'user@example.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    preview: 'Team Alpha - Looking for opportunities...',
  },
  {
    id: '2',
    contentType: 'opportunity',
    contentId: 'opp-456',
    reason: 'Potential spam/scam posting',
    severity: 'high',
    status: 'pending',
    reportedBy: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    preview: 'Urgent: High-paying remote position...',
  },
  {
    id: '3',
    contentType: 'message',
    contentId: 'msg-789',
    reason: 'Harassment reported',
    severity: 'critical',
    status: 'pending',
    reportedBy: 'victim@example.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    preview: '[Message content hidden for review]',
  },
];

function ContentTypeIcon({ type }: { type: ModerationItem['contentType'] }) {
  const icons = {
    team: UserGroupIcon,
    opportunity: BriefcaseIcon,
    message: ChatBubbleLeftRightIcon,
    profile: UserCircleIcon,
  };
  const Icon = icons[type] || FlagIcon;
  return <Icon className="h-5 w-5" />;
}

function SeverityBadge({ severity }: { severity: ModerationItem['severity'] }) {
  const config = {
    low: { label: 'Low', color: 'bg-gray-500/10 text-gray-400' },
    medium: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-400' },
    high: { label: 'High', color: 'bg-orange-500/10 text-orange-400' },
    critical: { label: 'Critical', color: 'bg-red-500/10 text-red-400' },
  }[severity];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      {severity === 'critical' && <ExclamationTriangleIcon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}

export default function ModerationQueuePage() {
  const [items, setItems] = useState<ModerationItem[]>(mockItems);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const handleApprove = (id: string) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, status: 'approved' as const } : item
    ));
  };

  const handleReject = (id: string) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, status: 'rejected' as const } : item
    ));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Moderation Queue</h1>
          <p className="mt-1 text-sm text-gray-400">
            Review flagged content and take appropriate action
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400">
            <FlagIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{pendingCount} pending</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
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

      {/* Items list */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-12 text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-300 font-medium">No items to review</p>
            <p className="text-gray-500 text-sm mt-1">
              {filter === 'pending'
                ? 'All flagged content has been reviewed'
                : `No ${filter} items found`}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-6 transition-colors ${
                item.status === 'pending'
                  ? 'border-gray-700 bg-gray-800/50'
                  : 'border-gray-800 bg-gray-900/50 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    item.severity === 'critical'
                      ? 'bg-red-500/10 text-red-400'
                      : item.severity === 'high'
                        ? 'bg-orange-500/10 text-orange-400'
                        : 'bg-gray-700 text-gray-400'
                  }`}>
                    <ContentTypeIcon type={item.contentType} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white capitalize">
                        {item.contentType}
                      </span>
                      <SeverityBadge severity={item.severity} />
                    </div>
                    <p className="text-sm text-gray-300">{item.reason}</p>
                    {item.preview && (
                      <p className="mt-2 text-sm text-gray-500 truncate">
                        Preview: {item.preview}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatTimeAgo(item.createdAt)}</span>
                      {item.reportedBy && (
                        <span>Reported by: {item.reportedBy}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        Reject
                      </button>
                      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                        <EyeIcon className="h-4 w-4" />
                        View
                      </button>
                    </>
                  ) : (
                    <span className={`text-sm font-medium ${
                      item.status === 'approved' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
