'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  DocumentIcon,
  DownloadIcon,
  ShareIcon,
  EyeIcon,
  LockClosedIcon,
  GlobeAltIcon,
  UsersIcon,
  ClockIcon,
  TagIcon,
  CalendarDaysIcon,
  UserIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { LockClosedIcon as LockClosedIconSolid } from '@heroicons/react/24/solid';
import { useDocument, useDownloadDocument } from '@/hooks/useDocuments';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

function getFileIcon(fileType: string) {
  switch (fileType) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'ppt':
    case 'pptx':
      return '📋';
    default:
      return '📄';
  }
}

function getDocumentTypeColor(type: string) {
  switch (type) {
    case 'team_profile':
      return 'bg-blue-100 text-blue-800';
    case 'legal_document':
      return 'bg-purple-100 text-purple-800';
    case 'term_sheet':
      return 'bg-green-100 text-green-800';
    case 'nda':
      return 'bg-orange-100 text-orange-800';
    case 'presentation':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getAccessIcon(accessType: string) {
  switch (accessType) {
    case 'public':
      return <GlobeAltIcon className="h-5 w-5 text-green-600" />;
    case 'restricted':
      return <UsersIcon className="h-5 w-5 text-blue-600" />;
    case 'private':
      return <LockClosedIcon className="h-5 w-5 text-red-600" />;
    default:
      return <LockClosedIcon className="h-5 w-5 text-red-600" />;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface DocumentViewerProps {
  documentId: string;
}

export function DocumentViewer({ documentId }: DocumentViewerProps) {
  const { data: session } = useSession();
  const { data: document, isLoading, error } = useDocument(documentId);
  const downloadMutation = useDownloadDocument();
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      const result = await downloadMutation.mutateAsync(documentId);
      toast.success(`Downloading ${document.name}`);
      // In a real implementation, this would trigger the actual download
      console.log('Download URL:', result.downloadUrl);
    } catch (error: any) {
      toast.error(error.message || 'Failed to download document');
    }
  };

  if (isLoading) {
    return (
      <div className="card max-w-4xl">
        <div className="animate-pulse p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="card max-w-4xl">
        <div className="p-6 text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            {error ? 'You do not have permission to view this document.' : 'Document not found.'}
          </p>
        </div>
      </div>
    );
  }

  const isOwner = document.uploadedBy === session?.user.id;
  const isExpired = document.accessControl.expiresAt && new Date(document.accessControl.expiresAt) < new Date();

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-3xl">
                  {getFileIcon(document.fileType)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">
                    {document.name}
                  </h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentTypeColor(document.type)}`}>
                    {document.type.replace('_', ' ')}
                  </span>
                  {document.confidential && (
                    <LockClosedIconSolid className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                {document.description && (
                  <p className="text-gray-700 mb-4">{document.description}</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <DocumentIcon className="h-4 w-4 mr-2" />
                    <span>{formatFileSize(document.size)}</span>
                  </div>
                  <div className="flex items-center">
                    {getAccessIcon(document.accessControl.type)}
                    <span className="ml-2 capitalize">{document.accessControl.type}</span>
                  </div>
                  <div className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    <span>{document.downloadCount} downloads</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>v{document.metadata.version}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 ml-6">
              <button
                onClick={handleDownload}
                disabled={downloadMutation.isPending || isExpired}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                {downloadMutation.isPending ? 'Downloading...' : 'Download'}
              </button>
              
              {isOwner && (
                <Link
                  href={`/app/documents/${document.id}/share`}
                  className="btn-secondary flex items-center"
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </Link>
              )}
            </div>
          </div>

          {/* Expiration Warning */}
          {isExpired && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Access Expired</h4>
                  <p className="text-sm text-red-700">
                    This document's access has expired. Contact the document owner to request renewed access.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {document.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {document.metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Preview */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Document Preview</h2>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h3>
            <p className="text-gray-600 mb-4">
              Document preview is not available in the demo. In a real implementation, 
              this would show a secure preview of the document content.
            </p>
            <button
              onClick={handleDownload}
              disabled={downloadMutation.isPending || isExpired}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download to View
            </button>
          </div>
        </div>
      </div>

      {/* Document Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Information */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upload Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Uploaded by</span>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">
                  {isOwner ? 'You' : 'Document Owner'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Upload date</span>
              <span className="text-sm text-gray-900">
                {formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last updated</span>
              <span className="text-sm text-gray-900">
                {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">File type</span>
              <span className="text-sm text-gray-900 uppercase">
                {document.fileType}
              </span>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Access Control</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Access level</span>
              <div className="flex items-center space-x-2">
                {getAccessIcon(document.accessControl.type)}
                <span className="text-sm text-gray-900 capitalize">
                  {document.accessControl.type}
                </span>
              </div>
            </div>
            
            {document.accessControl.expiresAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Expires</span>
                <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                  <span className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(document.accessControl.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Confidential</span>
              <span className={`text-sm ${document.confidential ? 'text-red-600' : 'text-gray-900'}`}>
                {document.confidential ? 'Yes' : 'No'}
              </span>
            </div>
            
            {document.accessControl.allowedRoles.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Allowed roles</span>
                <div className="space-y-1">
                  {document.accessControl.allowedRoles.map((role, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      {role === 'individual' ? 'Team Members' : 'Company Users'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      {(document.metadata.opportunityId || document.metadata.applicationId) && (
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Related Items</h3>
          </div>
          <div className="p-6 space-y-4">
            {document.metadata.opportunityId && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Related opportunity</span>
                <Link
                  href={`/app/opportunities/${document.metadata.opportunityId}`}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View Opportunity
                </Link>
              </div>
            )}
            
            {document.metadata.applicationId && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Related application</span>
                <Link
                  href={`/app/applications/${document.metadata.applicationId}`}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View Application
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}