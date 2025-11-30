'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  DocumentTextIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ArrowRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Badge, Button, EmptyState, Skeleton } from '@/components/ui';

interface PipelineApplication {
  id: string;
  teamId: string;
  teamName: string;
  opportunityId: string;
  opportunityTitle: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  teamSize?: number;
  matchScore?: number;
  hasNewActivity?: boolean;
}

interface PipelineColumn {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
  statuses: string[];
}

const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    id: 'new',
    label: 'New',
    color: 'text-navy',
    bgColor: 'bg-navy-50',
    icon: DocumentTextIcon,
    statuses: ['pending', 'submitted'],
  },
  {
    id: 'reviewing',
    label: 'Reviewing',
    color: 'text-gold-700',
    bgColor: 'bg-gold-50',
    icon: EyeIcon,
    statuses: ['under_review', 'reviewing'],
  },
  {
    id: 'interview',
    label: 'Interview',
    color: 'text-navy-700',
    bgColor: 'bg-navy-100',
    icon: CalendarIcon,
    statuses: ['interview', 'interviewing', 'interview_scheduled'],
  },
  {
    id: 'offer',
    label: 'Offer',
    color: 'text-success',
    bgColor: 'bg-success-light',
    icon: CurrencyDollarIcon,
    statuses: ['offer', 'offer_made'],
  },
  {
    id: 'hired',
    label: 'Hired',
    color: 'text-success',
    bgColor: 'bg-success-light',
    icon: CheckCircleIcon,
    statuses: ['accepted'],
  },
];

interface ApplicationPipelineProps {
  applications: PipelineApplication[];
  isLoading?: boolean;
  onMoveApplication?: (applicationId: string, newStatus: string) => Promise<void>;
  showRejected?: boolean;
}

export function ApplicationPipeline({
  applications,
  isLoading,
  onMoveApplication,
  showRejected = false,
}: ApplicationPipelineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedApp, setDraggedApp] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Filter and group applications by column
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        app =>
          app.teamName.toLowerCase().includes(query) ||
          app.opportunityTitle.toLowerCase().includes(query)
      );
    }

    // Filter out rejected/withdrawn unless showing them
    if (!showRejected) {
      filtered = filtered.filter(
        app => !['rejected', 'withdrawn'].includes(app.status)
      );
    }

    return filtered;
  }, [applications, searchQuery, showRejected]);

  // Group applications by pipeline column
  const applicationsByColumn = useMemo(() => {
    const grouped: Record<string, PipelineApplication[]> = {};

    PIPELINE_COLUMNS.forEach(column => {
      grouped[column.id] = filteredApplications.filter(app =>
        column.statuses.includes(app.status)
      );
    });

    // Also track rejected separately
    grouped.rejected = filteredApplications.filter(app =>
      ['rejected', 'withdrawn'].includes(app.status)
    );

    return grouped;
  }, [filteredApplications]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: applications.length,
      new: applicationsByColumn.new?.length || 0,
      reviewing: applicationsByColumn.reviewing?.length || 0,
      interview: applicationsByColumn.interview?.length || 0,
      offer: applicationsByColumn.offer?.length || 0,
      hired: applicationsByColumn.hired?.length || 0,
      rejected: applicationsByColumn.rejected?.length || 0,
    };
  }, [applications.length, applicationsByColumn]);

  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    setDraggedApp(applicationId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDropTarget(columnId);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDropTarget(null);

    if (!draggedApp || !onMoveApplication) return;

    const column = PIPELINE_COLUMNS.find(c => c.id === columnId);
    if (!column) return;

    // Get the first status of the target column
    const newStatus = column.statuses[0];
    await onMoveApplication(draggedApp, newStatus);
    setDraggedApp(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map(column => (
            <div
              key={column.id}
              className="flex-shrink-0 w-72 bg-bg-elevated rounded-lg border border-border p-4"
            >
              <Skeleton variant="text" width="100px" className="mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} variant="rectangular" height="80px" className="rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 w-64 text-sm"
            />
          </div>
          <Badge variant="info" size="sm">
            {stats.total} total
          </Badge>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-navy font-medium">{stats.new} new</span>
          <span className="text-gold-700">{stats.reviewing} reviewing</span>
          <span className="text-navy-700">{stats.interview} interview</span>
          <span className="text-success">{stats.hired} hired</span>
          {stats.rejected > 0 && (
            <span className="text-error">{stats.rejected} rejected</span>
          )}
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map(column => {
          const columnApps = applicationsByColumn[column.id] || [];
          const ColumnIcon = column.icon;
          const isDropping = dropTarget === column.id;

          return (
            <div
              key={column.id}
              className={`flex-shrink-0 w-72 bg-bg-elevated rounded-lg border transition-colors ${
                isDropping ? 'border-navy border-2' : 'border-border'
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-6 w-6 rounded ${column.bgColor} flex items-center justify-center`}>
                      <ColumnIcon className={`h-3.5 w-3.5 ${column.color}`} />
                    </div>
                    <span className="font-medium text-text-primary text-sm">
                      {column.label}
                    </span>
                  </div>
                  <Badge variant="default" size="sm">
                    {columnApps.length}
                  </Badge>
                </div>
              </div>

              {/* Column Content */}
              <div className="p-3 space-y-2 min-h-[200px] max-h-[600px] overflow-y-auto">
                {columnApps.length === 0 ? (
                  <div className="text-center py-8 text-text-tertiary text-sm">
                    No applications
                  </div>
                ) : (
                  columnApps.map(app => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      isDragging={draggedApp === app.id}
                      onDragStart={(e) => handleDragStart(e, app.id)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}

        {/* Rejected Column (optional) */}
        {showRejected && applicationsByColumn.rejected?.length > 0 && (
          <div className="flex-shrink-0 w-72 bg-bg-elevated rounded-lg border border-border opacity-60">
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-error-light flex items-center justify-center">
                    <XCircleIcon className="h-3.5 w-3.5 text-error" />
                  </div>
                  <span className="font-medium text-text-primary text-sm">
                    Rejected
                  </span>
                </div>
                <Badge variant="default" size="sm">
                  {applicationsByColumn.rejected.length}
                </Badge>
              </div>
            </div>
            <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
              {applicationsByColumn.rejected.map(app => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ApplicationCardProps {
  application: PipelineApplication;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

function ApplicationCard({ application, isDragging, onDragStart }: ApplicationCardProps) {
  return (
    <Link
      href={`/app/applications/${application.id}`}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      className={`block p-3 bg-bg-surface rounded-lg border border-border hover:border-navy hover:shadow-sm transition-all cursor-pointer ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded bg-navy-50 flex items-center justify-center flex-shrink-0">
            <UserGroupIcon className="h-3.5 w-3.5 text-navy" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-text-primary text-sm truncate">
              {application.teamName}
            </p>
            {application.teamSize && (
              <p className="text-xs text-text-tertiary">
                {application.teamSize} members
              </p>
            )}
          </div>
        </div>
        {application.hasNewActivity && (
          <span className="h-2 w-2 rounded-full bg-navy flex-shrink-0" />
        )}
      </div>

      <p className="text-xs text-text-secondary line-clamp-1 mb-2">
        {application.opportunityTitle}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-tertiary">
          {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
        </span>
        {application.matchScore && (
          <Badge
            variant={application.matchScore >= 80 ? 'success' : application.matchScore >= 60 ? 'info' : 'warning'}
            size="sm"
          >
            {application.matchScore}% match
          </Badge>
        )}
      </div>
    </Link>
  );
}

export default ApplicationPipeline;
