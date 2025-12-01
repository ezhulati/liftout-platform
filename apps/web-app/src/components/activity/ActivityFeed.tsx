'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BriefcaseIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

interface ActivityFeedProps {
  limit?: number;
  showFilter?: boolean;
  className?: string;
}

// Demo activities
const DEMO_ACTIVITIES: Activity[] = [
  {
    id: 'demo-1',
    type: 'eoi',
    title: 'New Expression of Interest',
    description: 'TechCorp Industries expressed high interest in your team',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: { eoiId: 'eoi-1', status: 'pending', interestLevel: 'high' },
  },
  {
    id: 'demo-2',
    type: 'interview',
    title: 'Interview Scheduled',
    description: 'Interview with Quantum AI Research Team for Healthcare AI Lead position',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    metadata: { teamName: 'Quantum AI Research Team', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
  },
  {
    id: 'demo-3',
    type: 'application',
    title: 'Application Submitted',
    description: 'TechFlow Data Science Team applied for Lead Data Science Division',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { teamName: 'TechFlow Data Science Team', status: 'submitted' },
  },
  {
    id: 'demo-4',
    type: 'message',
    title: 'New Message',
    description: 'Sarah Johnson: Thanks for your interest! We would love to schedule a call to discuss...',
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { conversationId: 'conv-1', senderName: 'Sarah Johnson' },
  },
  {
    id: 'demo-5',
    type: 'application',
    title: 'Application Accepted',
    description: 'DevOps Excellence Team application for Platform Engineering was accepted',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { teamName: 'DevOps Excellence Team', status: 'accepted' },
  },
  {
    id: 'demo-6',
    type: 'eoi',
    title: 'EOI Declined',
    description: 'Your expression of interest for Startup Inc was declined',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { eoiId: 'eoi-2', status: 'declined' },
  },
];

const ACTIVITY_ICONS: Record<string, typeof BriefcaseIcon> = {
  application: BriefcaseIcon,
  interview: CalendarIcon,
  message: ChatBubbleLeftRightIcon,
  eoi: HeartIcon,
  team: UserGroupIcon,
  document: DocumentTextIcon,
};

const ACTIVITY_COLORS: Record<string, string> = {
  application: 'bg-navy-50 text-navy',
  interview: 'bg-gold-100 text-gold-700',
  message: 'bg-purple-50 text-purple-600',
  eoi: 'bg-pink-50 text-pink-600',
  team: 'bg-success/10 text-success',
  document: 'bg-gray-100 text-gray-600',
};

export function ActivityFeed({ limit = 10, showFilter = false, className = '' }: ActivityFeedProps) {
  const [filter, setFilter] = React.useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['activity', filter, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (filter !== 'all') params.append('type', filter);
      const response = await fetch(`/api/activity?${params}`);
      if (!response.ok) throw new Error('Failed to fetch activity');
      return response.json();
    },
  });

  const activities = data?.activities?.length > 0 ? data.activities : DEMO_ACTIVITIES.slice(0, limit);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (activity: Activity) => {
    const status = activity.metadata?.status as string;
    if (status === 'accepted' || status === 'completed' || status === 'confirmed') {
      return <CheckCircleIcon className="h-3 w-3 text-success" />;
    }
    if (status === 'declined' || status === 'cancelled') {
      return <XCircleIcon className="h-3 w-3 text-red-500" />;
    }
    if (status === 'pending') {
      return <ClockIcon className="h-3 w-3 text-gold-500" />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="h-10 w-10 bg-bg-alt rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-bg-alt rounded" />
              <div className="h-3 w-2/3 bg-bg-alt rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filter */}
      {showFilter && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['all', 'application', 'interview', 'message', 'eoi'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === type
                  ? 'bg-navy text-white'
                  : 'bg-bg-alt text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              {type === 'all' ? 'All' : type === 'eoi' ? 'EOIs' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
            </button>
          ))}
        </div>
      )}

      {/* Activity List */}
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 mx-auto text-text-tertiary mb-3" />
          <p className="text-text-secondary">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((activity: Activity, index: number) => {
            const Icon = ACTIVITY_ICONS[activity.type] || DocumentTextIcon;
            const colorClass = ACTIVITY_COLORS[activity.type] || 'bg-gray-100 text-gray-600';

            return (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 rounded-lg hover:bg-bg-alt transition-colors ${
                  index === 0 ? 'bg-bg-alt' : ''
                }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-medium text-text-primary truncate">
                      {activity.title}
                    </h4>
                    {getStatusIcon(activity)}
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
