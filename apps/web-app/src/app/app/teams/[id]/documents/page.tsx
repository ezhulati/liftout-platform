'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  DocumentTextIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ArrowLeftIcon,
  FolderIcon,
  EyeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  visibility: 'team' | 'companies' | 'public';
  url?: string;
}

interface Team {
  id: string;
  name: string;
  documents: Document[];
}

export default function TeamDocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const teamId = params?.id as string;

  const [isDragging, setIsDragging] = useState(false);

  const { data: team, isLoading } = useQuery<Team>({
    queryKey: ['team-documents', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) throw new Error('Failed to fetch team');
      const data = await response.json();
      return {
        id: data.team.id,
        name: data.team.name,
        documents: data.team.documents || [],
      };
    },
    enabled: !!teamId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`/api/teams/${teamId}/documents`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload document');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Document uploaded');
      queryClient.invalidateQueries({ queryKey: ['team-documents', teamId] });
    },
    onError: () => {
      toast.error('Failed to upload document');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/teams/${teamId}/documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Document deleted');
      queryClient.invalidateQueries({ queryKey: ['team-documents', teamId] });
    },
    onError: () => {
      toast.error('Failed to delete document');
    },
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => uploadMutation.mutate(file));
  }, [uploadMutation]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => uploadMutation.mutate(file));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('image')) return 'IMG';
    if (type.includes('word') || type.includes('doc')) return 'DOC';
    if (type.includes('sheet') || type.includes('excel') || type.includes('xls')) return 'XLS';
    if (type.includes('presentation') || type.includes('ppt')) return 'PPT';
    return 'FILE';
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-64"></div>
          <div className="h-32 bg-bg-elevated rounded"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-bg-elevated rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push(`/app/teams/${teamId}`)}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to team
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Documents</h1>
        <p className="text-text-secondary mt-1">Team documents and files.</p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`card mb-6 border-2 border-dashed transition-colors ${
          isDragging ? 'border-navy bg-navy-50' : 'border-border'
        }`}
      >
        <div className="px-6 py-8 text-center">
          <ArrowUpTrayIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <p className="text-text-primary font-medium mb-1">
            Drag and drop files here
          </p>
          <p className="text-text-secondary text-sm mb-4">
            or click to browse
          </p>
          <label className="btn-primary cursor-pointer">
            Select Files
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          <p className="text-xs text-text-tertiary mt-4">
            Supported: PDF, Word, Excel, PowerPoint, Images (Max 10MB)
          </p>
        </div>
      </div>

      {/* Documents List */}
      {team?.documents && team.documents.length > 0 ? (
        <div className="space-y-2">
          {team.documents.map((doc) => (
            <div key={doc.id} className="card">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-navy-50 flex items-center justify-center text-xs font-bold text-navy">
                    {getFileIcon(doc.type)}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{doc.name}</p>
                    <div className="flex items-center gap-3 text-xs text-text-tertiary">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      <span className="flex items-center">
                        {doc.visibility === 'team' ? (
                          <><LockClosedIcon className="h-3 w-3 mr-1" /> Team only</>
                        ) : doc.visibility === 'companies' ? (
                          <><EyeIcon className="h-3 w-3 mr-1" /> Companies</>
                        ) : (
                          <><EyeIcon className="h-3 w-3 mr-1" /> Public</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.url && (
                    <a
                      href={doc.url}
                      download
                      className="p-2 text-text-tertiary hover:text-navy rounded hover:bg-navy-50"
                      title="Download"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(doc.id)}
                    className="p-2 text-text-tertiary hover:text-error rounded hover:bg-error/10"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FolderIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No documents yet</h3>
          <p className="text-text-secondary">
            Upload documents like case studies, portfolios, or credentials
          </p>
        </div>
      )}
    </div>
  );
}
