'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  FlagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  CompactStatCard,
  SeverityBadge,
  ContentTypeIcon,
  FilterButtons,
  LoadingSpinner,
  EmptyState,
  formatTimeAgo,
  type SeverityLevel,
} from '@/components/admin/shared';

// ============================================
// TYPES
// ============================================

interface ModerationItem {
  id: string;
  type: string;
  contentId: string;
  reason: string;
  details: string | null;
  severity: SeverityLevel;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  reportedAt: string;
  reportedBy: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
  resolution: string | null;
  content: {
    id: string;
    preview: string;
  };
}

type FilterStatus = 'pending' | 'approved' | 'rejected' | 'all';

const FILTER_OPTIONS = ['pending', 'approved', 'rejected', 'all'] as const;

// ============================================
// MODERATION ITEM CARD
// ============================================

interface ModerationItemCardProps {
  item: ModerationItem;
  onAction: (id: string, action: 'approve' | 'reject') => void;
}

function ModerationItemCard({ item, onAction }: ModerationItemCardProps) {
  const isPending = item.status === 'pending';
  const reporterName = item.reportedBy?.firstName && item.reportedBy?.lastName
    ? `${item.reportedBy.firstName} ${item.reportedBy.lastName}`
    : item.reportedBy?.email;

  const severityIconClass = item.severity === 'critical'
    ? 'bg-red-500/10 text-red-400'
    : item.severity === 'high'
      ? 'bg-orange-500/10 text-orange-400'
      : 'bg-gray-700 text-gray-400';

  return (
    <div
      className={`rounded-xl border p-6 transition-colors ${
        isPending
          ? 'border-gray-700 bg-gray-800/50'
          : 'border-gray-800 bg-gray-900/50 opacity-75'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${severityIconClass}`}>
            <ContentTypeIcon type={item.type} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-white capitalize">
                {item.type}
              </span>
              <SeverityBadge severity={item.severity} />
            </div>
            <p className="text-sm text-gray-300">{item.reason}</p>
            {item.details && (
              <p className="mt-1 text-sm text-gray-500">{item.details}</p>
            )}
            {item.content?.preview && (
              <p className="mt-2 text-sm text-gray-500 truncate">
                Preview: {item.content.preview}
              </p>
            )}
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span>{formatTimeAgo(item.reportedAt)}</span>
              {reporterName && <span>Reported by: {reporterName}</span>}
            </div>
            {item.resolution && (
              <p className="mt-2 text-xs text-gray-600">
                Resolution: {item.resolution}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPending ? (
            <>
              <button
                onClick={() => onAction(item.id, 'approve')}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
              >
                <CheckCircleIcon className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={() => onAction(item.id, 'reject')}
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
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ModerationQueuePage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [total, setTotal] = useState(0);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }
      params.append('limit', '50');

      const response = await fetch(`/api/admin/moderation/flagged?${params}`);
      if (!response.ok) throw new Error('Failed to fetch moderation items');

      const data = await response.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const resolution = prompt(`Enter resolution notes (optional):`);
      const response = await fetch('/api/admin/moderation/flagged', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId: id, action, resolution }),
      });

      if (!response.ok) throw new Error('Failed to process flag');

      toast.success(`Flag ${action}d successfully`);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process flag');
    }
  };

  // Compute stats from items
  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const approvedCount = items.filter((i) => i.status === 'approved').length;
  const rejectedCount = items.filter((i) => i.status === 'rejected').length;

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CompactStatCard
          title="Total Flags"
          value={total}
          icon={FlagIcon}
          iconBgClass="bg-gray-500/10"
          iconColorClass="text-gray-400"
        />
        <CompactStatCard
          title="Pending Review"
          value={pendingCount}
          icon={ExclamationTriangleIcon}
          iconBgClass="bg-yellow-500/10"
          iconColorClass="text-yellow-400"
        />
        <CompactStatCard
          title="Approved"
          value={approvedCount}
          icon={CheckCircleIcon}
          iconBgClass="bg-green-500/10"
          iconColorClass="text-green-400"
        />
        <CompactStatCard
          title="Rejected"
          value={rejectedCount}
          icon={XCircleIcon}
          iconBgClass="bg-red-500/10"
          iconColorClass="text-red-400"
        />
      </div>

      {/* Filters */}
      <FilterButtons
        options={FILTER_OPTIONS}
        selected={filter}
        onChange={setFilter}
      />

      {/* Items list */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-12 text-center">
            <LoadingSpinner className="mx-auto" />
            <p className="text-gray-400 mt-4">Loading moderation queue...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-12 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={CheckCircleIcon}
            iconColorClass="text-green-400"
            title="No items to review"
            description={
              filter === 'pending'
                ? 'All flagged content has been reviewed'
                : `No ${filter} items found`
            }
          />
        ) : (
          items.map((item) => (
            <ModerationItemCard
              key={item.id}
              item={item}
              onAction={handleAction}
            />
          ))
        )}
      </div>
    </div>
  );
}
