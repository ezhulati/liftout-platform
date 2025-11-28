'use client';

import { useState, useEffect } from 'react';
import { documentService } from '@/lib/services/documentService';
import type { SecureDocument, DocumentShare } from '@/lib/services/documentService';
import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface SecureDocumentViewerProps {
  documentIds: string[];
  currentUserId: string;
  conversationId?: string;
  onDocumentAction?: (documentId: string, action: 'view' | 'download' | 'share') => void;
  showAccessControls?: boolean;
  showAuditLog?: boolean;
  className?: string;
}

interface DocumentWithAccess extends SecureDocument {
  canView: boolean;
  canDownload: boolean;
  canShare: boolean;
  accessReason?: string;
}

export function SecureDocumentViewer({
  documentIds,
  currentUserId,
  conversationId,
  onDocumentAction,
  showAccessControls = true,
  showAuditLog = false,
  className = '',
}: SecureDocumentViewerProps) {
  const [documents, setDocuments] = useState<DocumentWithAccess[]>([]);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalDoc, setShareModalDoc] = useState<DocumentWithAccess | null>(null);
  const [shareOptions, setShareOptions] = useState({
    recipientEmails: '',
    shareType: 'view' as 'view' | 'download' | 'edit',
    expiresInDays: 7,
    passwordProtected: false,
    notifyOnAccess: true,
    customMessage: '',
  });

  useEffect(() => {
    loadDocuments();
  }, [documentIds, currentUserId]);

  const loadDocuments = async () => {
    setIsLoading(true);
    const loadedDocs: DocumentWithAccess[] = [];

    for (const documentId of documentIds) {
      try {
        const doc = await documentService.getSecureDocument(documentId, currentUserId, 'view');
        if (doc) {
          const docWithAccess: DocumentWithAccess = {
            ...doc,
            canView: true, // If we got the document, we can view it
            canDownload: await checkDocumentAccess(doc, 'download'),
            canShare: await checkDocumentAccess(doc, 'share'),
          };
          loadedDocs.push(docWithAccess);
        }
      } catch (error) {
        // Document exists but user doesn't have access
        const limitedDoc: DocumentWithAccess = {
          id: documentId,
          filename: 'Restricted Document',
          originalFilename: 'Access Denied',
          fileType: 'application/octet-stream',
          fileSize: 0,
          encryptedUrl: '',
          accessLevel: 'confidential',
          virusScanned: false,
          uploadedBy: 'unknown',
          uploadedAt: new Date().toISOString(),
          downloadCount: 0,
          documentType: 'other',
          version: 1,
          checksum: '',
          isExpired: false,
          complianceLabels: [],
          isLegalPrivileged: true,
          jurisdictions: [],
          reviewStatus: 'pending',
          accessLog: [],
          sharedWith: [],
          regulatoryClassification: 'restricted',
          canView: false,
          canDownload: false,
          canShare: false,
          accessReason: error instanceof Error ? error.message : 'Access denied',
        };
        loadedDocs.push(limitedDoc);
      }
    }

    setDocuments(loadedDocs);
    setIsLoading(false);
  };

  const checkDocumentAccess = async (doc: SecureDocument, action: string): Promise<boolean> => {
    // Check if user uploaded the document
    if (doc.uploadedBy === currentUserId) {
      return true;
    }

    // Check if document is shared with user
    const isSharedWithUser = doc.sharedWith?.some(share => 
      share.sharedWithUserId === currentUserId && 
      (!share.expiresAt || share.expiresAt > new Date()) &&
      (action === 'view' || share.shareType === action || share.shareType === 'edit')
    );

    if (isSharedWithUser) {
      return true;
    }

    // Check access level permissions
    if (doc.accessLevel === 'public') {
      return true;
    }

    if (doc.accessLevel === 'legal_only') {
      return currentUserId.includes('legal'); // Simplified check
    }

    return false;
  };

  const handleDocumentAction = async (doc: DocumentWithAccess, action: 'view' | 'download' | 'share') => {
    if (!doc.canView && action !== 'share') {
      return;
    }

    try {
      if (action === 'download' && doc.canDownload) {
        // In a real implementation, this would trigger a secure download
        const downloadDoc = await documentService.getSecureDocument(doc.id!, currentUserId, 'download');
        if (downloadDoc?.encryptedUrl) {
          window.open(downloadDoc.encryptedUrl, '_blank');
        }
      } else if (action === 'share' && doc.canShare) {
        setShareModalDoc(doc);
      } else if (action === 'view' && doc.canView) {
        // Open document viewer - would integrate with secure viewer
        console.log('Opening secure document viewer for:', doc.id);
      }

      onDocumentAction?.(doc.id!, action);
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  const handleShare = async () => {
    if (!shareModalDoc) return;

    try {
      const recipientEmails = shareOptions.recipientEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      if (recipientEmails.length === 0) {
        alert('Please enter at least one recipient email');
        return;
      }

      const expiresAt = shareOptions.expiresInDays > 0 
        ? new Date(Date.now() + shareOptions.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined;

      // Would convert emails to user IDs in real implementation
      const recipientUserIds = recipientEmails; // Simplified

      await documentService.shareDocument(shareModalDoc.id!, currentUserId, {
        recipientUserIds,
        shareType: shareOptions.shareType,
        expiresAt,
        notifyOnAccess: shareOptions.notifyOnAccess,
        passwordProtected: shareOptions.passwordProtected,
        customMessage: shareOptions.customMessage,
      });

      setShareModalDoc(null);
      // Reload documents to show updated sharing info
      await loadDocuments();
    } catch (error) {
      console.error('Error sharing document:', error);
      alert('Failed to share document. Please try again.');
    }
  };

  const toggleExpanded = (docId: string) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedDocs(newExpanded);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'legal_only':
        return <ShieldCheckIcon className="h-4 w-4 text-error" />;
      case 'confidential':
        return <LockClosedIcon className="h-4 w-4 text-gold" />;
      default:
        return <EyeIcon className="h-4 w-4 text-navy" />;
    }
  };

  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case 'legal_only':
        return 'bg-error-light text-error-dark';
      case 'confidential':
        return 'bg-gold-100 text-gold-800';
      case 'parties_only':
        return 'bg-navy-50 text-navy-800';
      default:
        return 'bg-bg-alt text-text-primary';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'nda':
      case 'contract':
        return '📋';
      case 'term_sheet':
        return '📊';
      case 'due_diligence':
        return '🔍';
      case 'reference':
        return '👥';
      case 'compliance':
        return '⚖️';
      default:
        return '📄';
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-bg-elevated rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {documents.length === 0 ? (
        <div className="text-center py-8">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-text-tertiary" />
          <h3 className="mt-2 text-sm font-medium text-text-primary">No documents</h3>
          <p className="mt-1 text-sm text-text-tertiary">No documents are available for this conversation.</p>
        </div>
      ) : (
        documents.map((doc) => (
          <div key={doc.id} className="border border-border rounded-lg">
            {/* Document Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-2xl">{getDocumentTypeIcon(doc.documentType || 'other')}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-sm font-medium truncate ${
                        doc.canView ? 'text-text-primary' : 'text-text-tertiary'
                      }`}>
                        {doc.canView ? doc.originalFilename : 'Restricted Document'}
                      </h3>
                      
                      {doc.canView && (
                        <button
                          onClick={() => toggleExpanded(doc.id!)}
                          className="text-text-tertiary hover:text-text-secondary"
                        >
                          {expandedDocs.has(doc.id!) ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-2">
                        {getSecurityIcon(doc.accessLevel)}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSecurityBadgeColor(doc.accessLevel)}`}>
                          {doc.accessLevel.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      {doc.canView && (
                        <>
                          <span className="text-xs text-text-tertiary">
                            {formatFileSize(doc.fileSize)}
                          </span>
                          
                          {doc.documentType && (
                            <span className="text-xs px-2 py-1 rounded-full bg-bg-alt text-text-primary">
                              {doc.documentType.replace('_', ' ').toUpperCase()}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {!doc.canView && doc.accessReason && (
                      <p className="text-xs text-error mt-1">{doc.accessReason}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {doc.canView && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDocumentAction(doc, 'view')}
                      className="btn-sm bg-navy text-white hover:bg-navy-700 inline-flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>

                    {doc.canDownload && (
                      <button
                        onClick={() => handleDocumentAction(doc, 'download')}
                        className="btn-sm bg-navy-600 text-white hover:bg-navy-700 inline-flex items-center"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    )}

                    {doc.canShare && (
                      <button
                        onClick={() => handleDocumentAction(doc, 'share')}
                        className="btn-sm bg-success text-white hover:bg-success/90 inline-flex items-center"
                      >
                        <ShareIcon className="h-4 w-4 mr-1" />
                        Share
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Legal and Compliance Notices */}
              {doc.canView && doc.isLegalPrivileged && (
                <div className="mt-3 p-3 bg-error-light border border-error/20 rounded-lg">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-error mr-2" />
                    <div className="text-sm text-error-dark">
                      <p className="font-medium">Legally Privileged Document</p>
                      <p className="mt-1">
                        This document contains legally privileged information. Access and use are restricted and monitored.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Expanded Details */}
            {doc.canView && expandedDocs.has(doc.id!) && (
              <div className="border-t border-border p-4 bg-bg-alt">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Document Details</h4>
                    <dl className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <dt className="text-text-tertiary">Uploaded by:</dt>
                        <dd className="text-text-primary">{doc.uploadedBy}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-text-tertiary">Upload date:</dt>
                        <dd className="text-text-primary">{formatDate(doc.uploadedAt)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-text-tertiary">Version:</dt>
                        <dd className="text-text-primary">{doc.version}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-text-tertiary">Downloads:</dt>
                        <dd className="text-text-primary">{doc.downloadCount}</dd>
                      </div>
                      {doc.expiresAt && (
                        <div className="flex justify-between">
                          <dt className="text-text-tertiary">Expires:</dt>
                          <dd className="text-text-primary flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {formatDate(doc.expiresAt)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {showAccessControls && doc.sharedWith && doc.sharedWith.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-2">Shared With</h4>
                      <div className="space-y-1">
                        {doc.sharedWith.slice(0, 3).map((share, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-text-primary">{share.sharedWithUserId}</span>
                            <span className="text-text-tertiary">{share.shareType}</span>
                          </div>
                        ))}
                        {doc.sharedWith.length > 3 && (
                          <p className="text-xs text-text-tertiary">
                            +{doc.sharedWith.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {doc.complianceLabels && doc.complianceLabels.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">Compliance Labels</h4>
                    <div className="flex flex-wrap gap-1">
                      {doc.complianceLabels.map((label, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-full bg-gold-100 text-gold-800"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* Share Modal */}
      {shareModalDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Share Document</h3>
              <button
                onClick={() => setShareModalDoc(null)}
                className="text-text-tertiary hover:text-text-secondary"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Recipient Emails (comma-separated)
                </label>
                <textarea
                  value={shareOptions.recipientEmails}
                  onChange={(e) => setShareOptions({ ...shareOptions, recipientEmails: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-navy"
                  rows={3}
                  placeholder="user1@company.com, user2@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Permission Level
                </label>
                <select
                  value={shareOptions.shareType}
                  onChange={(e) => setShareOptions({ ...shareOptions, shareType: e.target.value as any })}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-navy"
                >
                  <option value="view">View Only</option>
                  <option value="download">View & Download</option>
                  <option value="edit">Full Access</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Expires In (days)
                </label>
                <input
                  type="number"
                  value={shareOptions.expiresInDays}
                  onChange={(e) => setShareOptions({ ...shareOptions, expiresInDays: parseInt(e.target.value) })}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-navy"
                  min="1"
                  max="365"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={shareOptions.notifyOnAccess}
                    onChange={(e) => setShareOptions({ ...shareOptions, notifyOnAccess: e.target.checked })}
                    className="rounded border-border text-navy focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-text-secondary">Notify me when accessed</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={shareOptions.passwordProtected}
                    onChange={(e) => setShareOptions({ ...shareOptions, passwordProtected: e.target.checked })}
                    className="rounded border-border text-navy focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-text-secondary">Password protect link</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Custom Message (optional)
                </label>
                <textarea
                  value={shareOptions.customMessage}
                  onChange={(e) => setShareOptions({ ...shareOptions, customMessage: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-navy"
                  rows={2}
                  placeholder="Add a message for recipients..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShareModalDoc(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="btn-primary"
              >
                Share Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}