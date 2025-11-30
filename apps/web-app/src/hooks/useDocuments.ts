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