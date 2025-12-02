'use client';

import React, { useState } from 'react';
import {
  ClockIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  DocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Badge, Button, Skeleton, EmptyState } from '@/components/ui';
import {
  useDocumentVersions,
  useRestoreVersion,
  formatFileSize,
  formatRelativeTime,
  type DocumentVersion,
} from '@/hooks/useDocuments';
import toast from 'react-hot-toast';

interface DocumentVersionHistoryProps {
  documentId: string;
  documentName?: string;
  canEdit?: boolean;
  onVersionSelect?: (version: DocumentVersion) => void;
  compact?: boolean;
}

export function DocumentVersionHistory({
  documentId,
  documentName,
  canEdit = false,
  onVersionSelect,
  compact = false,
}: DocumentVersionHistoryProps) {
  const [expanded, setExpanded] = useState(!compact);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useDocumentVersions(documentId);

  const restoreVersion = useRestoreVersion();

  const handleRestore = async (version: DocumentVersion) => {
    if (!canEdit) return;

    setRestoringVersionId(version.id);
    try {
      await restoreVersion.mutateAsync({
        documentId,
        versionId: version.id,
      });
      toast.success(`Restored to version ${version.versionNumber}`);
    } catch (err) {
      toast.error('Failed to restore version');
    } finally {
      setRestoringVersionId(null);
    }
  };

  const handleDownload = (version: DocumentVersion) => {
    // In production, this would trigger a download from storageUrl
    if (version.storageUrl && version.storageUrl !== '#') {
      window.open(version.storageUrl, '_blank');
    } else {
      toast.success(`Download started for v${version.versionNumber}`);
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="p-4 border-b border-border">
          <Skeleton variant="text" width="150px" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height="60px" className="rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <EmptyState
          icon={<ClockIcon className="w-10 h-10 text-error" />}
          title="Failed to load versions"
          description="Unable to load version history"
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  const versions = data?.versions || [];
  const document = data?.document;

  if (versions.length === 0) {
    return (
      <div className="card p-6">
        <EmptyState
          icon={<DocumentIcon className="w-10 h-10" />}
          title="No version history"
          description="This document has no previous versions"
        />
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div
        className={`px-4 py-3 border-b border-border flex items-center justify-between ${
          compact ? 'cursor-pointer hover:bg-bg-alt' : ''
        }`}
        onClick={compact ? () => setExpanded(!expanded) : undefined}
      >
        <div className="flex items-center gap-3">
          <ClockIcon className="h-5 w-5 text-text-tertiary" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Version History</h3>
            {document && (
              <p className="text-xs text-text-tertiary">
                {documentName || document.name} • {versions.length} version{versions.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">
            v{document?.currentVersion || versions[0]?.versionNumber}
          </Badge>
          {compact && (
            expanded ? (
              <ChevronUpIcon className="h-4 w-4 text-text-tertiary" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-text-tertiary" />
            )
          )}
        </div>
      </div>

      {/* Version List */}
      {expanded && (
        <div className="divide-y divide-border">
          {versions.map((version, index) => (
            <VersionItem
              key={version.id}
              version={version}
              isLatest={index === 0}
              isCurrent={version.isCurrent || version.versionNumber === document?.currentVersion}
              canEdit={canEdit}
              isRestoring={restoringVersionId === version.id}
              onRestore={() => handleRestore(version)}
              onDownload={() => handleDownload(version)}
              onSelect={onVersionSelect ? () => onVersionSelect(version) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface VersionItemProps {
  version: DocumentVersion;
  isLatest: boolean;
  isCurrent: boolean;
  canEdit: boolean;
  isRestoring: boolean;
  onRestore: () => void;
  onDownload: () => void;
  onSelect?: () => void;
}

function VersionItem({
  version,
  isLatest,
  isCurrent,
  canEdit,
  isRestoring,
  onRestore,
  onDownload,
  onSelect,
}: VersionItemProps) {
  return (
    <div
      className={`px-4 py-3 hover:bg-bg-alt transition-colors ${
        onSelect ? 'cursor-pointer' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Version Info */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isCurrent ? 'bg-success-light' : 'bg-bg-elevated'
          }`}>
            {isCurrent ? (
              <CheckCircleIcon className="h-4 w-4 text-success" />
            ) : (
              <DocumentIcon className="h-4 w-4 text-text-tertiary" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-text-primary">
                Version {version.versionNumber}
              </span>
              {isCurrent && (
                <Badge variant="success" size="sm">Current</Badge>
              )}
              {isLatest && !isCurrent && (
                <Badge variant="info" size="sm">Latest</Badge>
              )}
            </div>

            {version.changeDescription && (
              <p className="text-xs text-text-secondary mb-1 line-clamp-2">
                {version.changeDescription}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
              <span className="flex items-center gap-1">
                <UserCircleIcon className="h-3.5 w-3.5" />
                {version.uploadedBy.firstName} {version.uploadedBy.lastName}
              </span>
              <span>{formatRelativeTime(version.createdAt)}</span>
              <span>{formatFileSize(version.fileSize)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            title="Download this version"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </Button>

          {canEdit && !isCurrent && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRestore();
              }}
              disabled={isRestoring}
              title="Restore this version"
            >
              {isRestoring ? (
                <div className="loading-spinner w-4 h-4" />
              ) : (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Restore
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version timeline for inline display
export function VersionTimeline({
  documentId,
  maxVersions = 3,
}: {
  documentId: string;
  maxVersions?: number;
}) {
  const { data, isLoading } = useDocumentVersions(documentId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width="24px" height="24px" />
        <Skeleton variant="text" width="80px" />
      </div>
    );
  }

  const versions = data?.versions.slice(0, maxVersions) || [];

  if (versions.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1">
        {versions.map((version, i) => (
          <div
            key={version.id}
            className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium border-2 border-bg-surface ${
              i === 0 ? 'bg-success text-white' : 'bg-bg-elevated text-text-secondary'
            }`}
            title={`v${version.versionNumber}`}
            style={{ zIndex: versions.length - i }}
          >
            {version.versionNumber}
          </div>
        ))}
      </div>
      <span className="text-xs text-text-tertiary">
        v{data?.document.currentVersion} ({versions.length} version{versions.length !== 1 ? 's' : ''})
      </span>
    </div>
  );
}

export default DocumentVersionHistory;
