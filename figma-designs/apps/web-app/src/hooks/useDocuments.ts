import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

interface Document {
  id: string;
  name: string;
  description: string;
  type: string;
  fileType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  status: string;
  confidential: boolean;
  accessControl: {
    type: 'public' | 'restricted' | 'private';
    allowedUsers: string[];
    allowedRoles: string[];
    expiresAt: string | null;
  };
  metadata: {
    opportunityId: string | null;
    applicationId: string | null;
    tags: string[];
    version: string;
  };
  downloadCount: number;
  lastAccessed: string;
}

interface DocumentsFilters {
  search?: string;
  type?: string;
  opportunityId?: string;
  applicationId?: string;
  confidential?: string;
  tags?: string;
}

interface DocumentsResponse {
  documents: Document[];
  total: number;
  filters: {
    types: string[];
    tags: string[];
  };
}

interface CreateDocumentData {
  name: string;
  description?: string;
  type: string;
  fileType: string;
  size?: number;
  confidential?: boolean;
  accessControl?: {
    type: 'public' | 'restricted' | 'private';
    allowedUsers?: string[];
    allowedRoles?: string[];
    expiresAt?: string | null;
  };
  metadata?: {
    opportunityId?: string | null;
    applicationId?: string | null;
    tags?: string[];
    version?: string;
  };
}

interface UpdateDocumentData {
  name?: string;
  description?: string;
  confidential?: boolean;
  accessControl?: {
    type: 'public' | 'restricted' | 'private';
    allowedUsers?: string[];
    allowedRoles?: string[];
    expiresAt?: string | null;
  };
  metadata?: {
    opportunityId?: string | null;
    applicationId?: string | null;
    tags?: string[];
    version?: string;
  };
}

export function useDocuments(filters?: DocumentsFilters) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['documents', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.opportunityId) params.append('opportunityId', filters.opportunityId);
      if (filters?.applicationId) params.append('applicationId', filters.applicationId);
      if (filters?.confidential) params.append('confidential', filters.confidential);
      if (filters?.tags) params.append('tags', filters.tags);

      const response = await fetch(`/api/documents?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      return data as DocumentsResponse;
    },
    enabled: !!session,
  });
}

export function useDocument(documentId: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${documentId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      const data = await response.json();
      return data.document as Document;
    },
    enabled: !!session && !!documentId,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (documentData: CreateDocumentData) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email)) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockDocument: Document = {
          id: `demo-doc-${Date.now()}`,
          name: documentData.name,
          description: documentData.description || '',
          type: documentData.type,
          fileType: documentData.fileType,
          size: documentData.size || 0,
          uploadedBy: session?.user?.id || 'demo-user',
          uploadedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
          confidential: documentData.confidential || false,
          accessControl: {
            type: documentData.accessControl?.type || 'private',
            allowedUsers: documentData.accessControl?.allowedUsers || [],
            allowedRoles: documentData.accessControl?.allowedRoles || [],
            expiresAt: documentData.accessControl?.expiresAt || null,
          },
          metadata: {
            opportunityId: documentData.metadata?.opportunityId ?? null,
            applicationId: documentData.metadata?.applicationId ?? null,
            tags: documentData.metadata?.tags || [],
            version: documentData.metadata?.version || '1.0',
          },
          downloadCount: 0,
          lastAccessed: new Date().toISOString(),
        };
        console.log('[Demo] Created document:', mockDocument.id);
        return mockDocument;
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create document');
      }

      const data = await response.json();
      return data.document as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateDocumentData & { id: string }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || id.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Updated document ${id}`);
        return { id, ...updates, updatedAt: new Date().toISOString() } as Document;
      }

      const response = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update document');
      }

      const data = await response.json();
      return data.document as Document;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', data.id] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (documentId: string) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || documentId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Deleted document ${documentId}`);
        return { id: documentId };
      }

      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete document');
      }

      return { id: documentId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDownloadDocument() {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (documentId: string) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || documentId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Downloaded document ${documentId}`);
        return { success: true, documentId, downloadUrl: '#demo-download' };
      }

      const response = await fetch(`/api/documents/${documentId}?download=true`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to download document');
      }

      const data = await response.json();

      // In a real implementation, this would trigger a file download
      // For demo purposes, we'll return the download info
      return data;
    },
  });
}

export function useShareDocument() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      documentId,
      accessControl
    }: {
      documentId: string;
      accessControl: {
        type: 'public' | 'restricted' | 'private';
        allowedUsers?: string[];
        allowedRoles?: string[];
        expiresAt?: string | null;
      }
    }) => {
      // Demo user handling
      if (isDemoUser(session?.user?.email) || documentId.startsWith('demo-')) {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`[Demo] Updated sharing for document ${documentId}`);
        return { id: documentId, accessControl } as Document;
      }

      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessControl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update document sharing');
      }

      const data = await response.json();
      return data.document as Document;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', data.id] });
    },
  });
}

// ============================================
// VERSION MANAGEMENT HOOKS
// ============================================

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  filename: string;
  fileSize: number;
  storageUrl: string;
  checksum?: string;
  changeDescription?: string;
  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  createdAt: string;
  isCurrent?: boolean;
}

interface VersionsResponse {
  document: {
    id: string;
    name: string;
    currentVersion: number;
    uploadedBy: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  versions: DocumentVersion[];
  total: number;
}

interface UploadVersionData {
  filename: string;
  fileSize: number;
  storageUrl: string;
  checksum?: string;
  changeDescription?: string;
}

// Fetch document versions
export function useDocumentVersions(documentId: string, enabled = true) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['document-versions', documentId],
    queryFn: async () => {
      // Demo document handling
      if (documentId.startsWith('demo-') || documentId.startsWith('doc_')) {
        return getDemoVersions(documentId);
      }

      const response = await fetch(`/api/documents/${documentId}/versions`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch versions');
      }
      const data = await response.json();
      return data.data as VersionsResponse;
    },
    enabled: enabled && !!documentId && !!session,
    staleTime: 30000,
  });
}

// Fetch single version
export function useDocumentVersion(documentId: string, versionId: string, enabled = true) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['document-version', documentId, versionId],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${documentId}/versions/${versionId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch version');
      }
      const data = await response.json();
      return data.data as DocumentVersion & {
        document: { id: string; name: string; currentVersion: number };
      };
    },
    enabled: enabled && !!documentId && !!versionId && !!session,
    staleTime: 60000,
  });
}

// Upload new version
export function useUploadVersion() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      documentId,
      ...data
    }: UploadVersionData & { documentId: string }) => {
      // Demo document handling
      if (isDemoUser(session?.user?.email) || documentId.startsWith('demo-') || documentId.startsWith('doc_')) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newVersion: DocumentVersion = {
          id: `ver-${Date.now()}`,
          versionNumber: Math.floor(Math.random() * 5) + 2,
          filename: data.filename,
          fileSize: data.fileSize,
          storageUrl: data.storageUrl,
          changeDescription: data.changeDescription || 'New version uploaded',
          uploadedBy: {
            id: session?.user?.id || 'demo-user',
            firstName: session?.user?.firstName || 'Demo',
            lastName: session?.user?.lastName || 'User',
          },
          createdAt: new Date().toISOString(),
          isCurrent: true,
        };
        console.log(`[Demo] Uploaded new version for document ${documentId}`);
        return { version: newVersion };
      }

      const response = await fetch(`/api/documents/${documentId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload version');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document-versions', variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Restore a previous version
export function useRestoreVersion() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      documentId,
      versionId,
    }: {
      documentId: string;
      versionId: string;
    }) => {
      // Demo document handling
      if (isDemoUser(session?.user?.email) || documentId.startsWith('demo-') || documentId.startsWith('doc_')) {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log(`[Demo] Restored version ${versionId} for document ${documentId}`);
        return { success: true, restoredFromVersion: parseInt(versionId.split('-')[1] || '1') };
      }

      const response = await fetch(`/api/documents/${documentId}/versions/${versionId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to restore version');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document-versions', variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Demo versions generator
function getDemoVersions(documentId: string): VersionsResponse {
  const versions: DocumentVersion[] = [
    {
      id: 'ver-3',
      versionNumber: 3,
      filename: 'document-v3.pdf',
      fileSize: 2500000,
      storageUrl: '#',
      changeDescription: 'Added performance metrics section',
      uploadedBy: {
        id: '1',
        firstName: 'Demo',
        lastName: 'User',
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isCurrent: true,
    },
    {
      id: 'ver-2',
      versionNumber: 2,
      filename: 'document-v2.pdf',
      fileSize: 2200000,
      storageUrl: '#',
      changeDescription: 'Updated team composition details',
      uploadedBy: {
        id: '1',
        firstName: 'Demo',
        lastName: 'User',
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isCurrent: false,
    },
    {
      id: 'ver-1',
      versionNumber: 1,
      filename: 'document-v1.pdf',
      fileSize: 1800000,
      storageUrl: '#',
      changeDescription: 'Initial version',
      uploadedBy: {
        id: '1',
        firstName: 'Demo',
        lastName: 'User',
      },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      isCurrent: false,
    },
  ];

  return {
    document: {
      id: documentId,
      name: 'TechFlow Team Profile.pdf',
      currentVersion: 3,
      uploadedBy: {
        id: '1',
        firstName: 'Demo',
        lastName: 'User',
      },
    },
    versions,
    total: versions.length,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Get document type label
export function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    nda: 'NDA',
    contract: 'Contract',
    term_sheet: 'Term Sheet',
    due_diligence: 'Due Diligence',
    team_profile: 'Team Profile',
    performance_report: 'Performance Report',
    compliance: 'Compliance',
    reference: 'Reference',
    proposal: 'Proposal',
    presentation: 'Presentation',
    other: 'Other',
    legal_document: 'Legal Document',
  };
  return labels[type] || type;
}

// Get access level badge variant
export function getAccessLevelVariant(level: string): 'info' | 'warning' | 'error' | 'success' {
  switch (level) {
    case 'public': return 'success';
    case 'internal': return 'info';
    case 'confidential': return 'warning';
    case 'restricted':
    case 'legal_only': return 'error';
    default: return 'info';
  }
}