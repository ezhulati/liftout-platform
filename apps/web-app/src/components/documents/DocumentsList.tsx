'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  DocumentIcon,
  EyeIcon,
  DownloadIcon,
  ShareIcon,
  TrashIcon,
  LockClosedIcon,
  GlobeAltIcon,
  UsersIcon,
  ClockIcon,
  TagIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { LockClosedIcon as LockClosedIconSolid } from '@heroicons/react/24/solid';
import { useDocuments, useDownloadDocument, useDeleteDocument } from '@/hooks/useDocuments';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

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
      return <GlobeAltIcon className="h-4 w-4" />;
    case 'restricted':
      return <UsersIcon className="h-4 w-4" />;
    case 'private':
      return <LockClosedIcon className="h-4 w-4" />;
    default:
      return <LockClosedIcon className="h-4 w-4" />;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface DocumentsListProps {
  opportunityId?: string;
  applicationId?: string;
  showUpload?: boolean;
}

export function DocumentsList({ opportunityId, applicationId, showUpload = true }: DocumentsListProps) {
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});
  
  const { data: documentsResponse, isLoading, error } = useDocuments({
    search: searchValue,
    type: activeFilters.type as string,
    opportunityId: opportunityId || (activeFilters.opportunityId as string),
    applicationId: applicationId || (activeFilters.applicationId as string),
    confidential: activeFilters.confidential as string,
    tags: Array.isArray(activeFilters.tags) ? activeFilters.tags.join(',') : undefined,
  });

  const downloadMutation = useDownloadDocument();
  const deleteMutation = useDeleteDocument();

  const documents = documentsResponse?.documents || [];
  const filterMetadata = documentsResponse?.filters || { types: [], tags: [] };

  // Filter groups for the SearchAndFilter component
  const filterGroups = useMemo(() => [
    {
      label: 'Document Type',
      key: 'type',
      type: 'select' as const,
      options: filterMetadata.types.map(type => ({ 
        label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), 
        value: type 
      }))
    },
    {
      label: 'Confidentiality',
      key: 'confidential',
      type: 'select' as const,
      options: [
        { label: 'Confidential Only', value: 'true' },
        { label: 'Non-Confidential Only', value: 'false' }
      ]
    },
    {
      label: 'Tags',
      key: 'tags',
      type: 'multi-select' as const,
      options: filterMetadata.tags.map(tag => ({ label: tag, value: tag }))
    },
    ...(session?.user.userType === 'company' ? [{
      label: 'Access Level',
      key: 'accessLevel',
      type: 'select' as const,
      options: [
        { label: 'Public Documents', value: 'public' },
        { label: 'Restricted Documents', value: 'restricted' },
        { label: 'My Documents', value: 'private' }
      ]
    }] : [])
  ], [filterMetadata, session?.user.userType]);

  const handleFilterChange = (filterKey: string, value: string | string[]) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchValue('');
  };

  const handleDownload = async (documentId: string, documentName: string) => {
    try {
      const result = await downloadMutation.mutateAsync(documentId);
      toast.success(`Downloading ${documentName}`);
      // In a real implementation, this would trigger the actual download
      console.log('Download URL:', result.downloadUrl);
    } catch (error: any) {
      toast.error(error.message || 'Failed to download document');
    }
  };

  const handleDelete = async (documentId: string, documentName: string) => {
    if (window.confirm(`Are you sure you want to delete "${documentName}"?`)) {
      try {
        await deleteMutation.mutateAsync(documentId);
        toast.success('Document deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete document');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Documents</h2>
          <p className="text-sm text-gray-600">
            Secure document sharing for liftout transactions
          </p>
        </div>
        {showUpload && (
          <Link href="/app/documents/upload" className="btn-primary flex items-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            Upload Document
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchPlaceholder="Search documents by name, description, or tags..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultCount={documents.length}
      />

      {/* Documents List */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchValue || Object.keys(activeFilters).length > 0
                ? 'Try adjusting your search criteria or filters.'
                : 'Upload your first document to get started.'}
            </p>
            {showUpload && (!searchValue && Object.keys(activeFilters).length === 0) && (
              <div className="mt-6">
                <Link href="/app/documents/upload" className="btn-primary">
                  Upload Document
                </Link>
              </div>
            )}
          </div>
        ) : (
          documents.map((document) => (
            <div key={document.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                      {getFileIcon(document.fileType)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {document.name}
                      </h3>
                      <span className={classNames(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getDocumentTypeColor(document.type)
                      )}>
                        {document.type.replace('_', ' ')}
                      </span>
                      {document.confidential && (
                        <LockClosedIconSolid className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    {document.description && (
                      <p className="text-gray-700 mb-3 line-clamp-2">{document.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm text-gray-600">
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
                        <span>
                          {formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {document.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {document.metadata.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {document.metadata.tags.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            +{document.metadata.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {document.accessControl.expiresAt && (
                      <div className="flex items-center text-sm text-orange-600">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>
                          Expires {formatDistanceToNow(new Date(document.accessControl.expiresAt), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <button
                    onClick={() => handleDownload(document.id, document.name)}
                    disabled={downloadMutation.isPending}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Download"
                  >
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                  
                  <Link
                    href={`/app/documents/${document.id}`}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="View Details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>

                  {document.uploadedBy === session?.user.id && (
                    <>
                      <Link
                        href={`/app/documents/${document.id}/share`}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Share"
                      >
                        <ShareIcon className="h-5 w-5" />
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(document.id, document.name)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </>
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