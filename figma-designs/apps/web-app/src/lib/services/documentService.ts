import type { MessageAttachment } from '@/lib/messaging';

const DEMO_DOCUMENTS = [
  {
    id: 'demo-doc-001',
    filename: 'team-performance-report.pdf',
    originalFilename: 'Team Performance Report Q4 2024.pdf',
    fileType: 'application/pdf',
    fileSize: 2456789,
    encryptedUrl: '#',
    accessLevel: 'parties_only' as const,
    virusScanned: true,
    uploadedBy: 'demo-user-001',
    uploadedAt: new Date().toISOString(),
    downloadCount: 5,
    documentType: 'due_diligence' as const,
    version: 1,
    checksum: 'sha256:abc123...',
    isExpired: false,
    complianceLabels: ['confidential'],
    isLegalPrivileged: false,
    jurisdictions: ['US'],
    reviewStatus: 'approved' as const,
    accessLog: [],
    sharedWith: [],
    regulatoryClassification: 'confidential' as const,
  },
  {
    id: 'demo-doc-002',
    filename: 'nda-agreement.pdf',
    originalFilename: 'Non-Disclosure Agreement.pdf',
    fileType: 'application/pdf',
    fileSize: 156789,
    encryptedUrl: '#',
    accessLevel: 'legal_only' as const,
    virusScanned: true,
    uploadedBy: 'demo-user-001',
    uploadedAt: new Date().toISOString(),
    downloadCount: 2,
    documentType: 'nda' as const,
    version: 1,
    checksum: 'sha256:def456...',
    isExpired: false,
    complianceLabels: ['legal', 'confidential'],
    isLegalPrivileged: true,
    jurisdictions: ['US', 'UK'],
    reviewStatus: 'approved' as const,
    accessLog: [],
    sharedWith: [],
    regulatoryClassification: 'restricted' as const,
  },
];

// Helper to check if this is a demo user/team/company
const isDemoEntity = (id: string): boolean => {
  if (!id) return false;
  return id.includes('demo') ||
         id === 'demo@example.com' ||
         id === 'company@example.com' ||
         id.startsWith('demo-');
};

export interface SecureDocument extends MessageAttachment {
  // Enhanced metadata
  conversationId?: string;
  dealId?: string;
  teamId?: string;
  companyId?: string;

  // Security and compliance
  encryptionKey?: string; // Stored separately for security
  digitalSignature?: string;
  complianceLabels: string[];
  retentionDate?: Date;

  // Access tracking
  accessLog: DocumentAccessEntry[];
  sharedWith: DocumentShare[];

  // Legal and regulatory
  isLegalPrivileged: boolean;
  jurisdictions: string[];
  regulatoryClassification?: 'public' | 'internal' | 'confidential' | 'restricted';

  // Workflow
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'requires_changes';
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewComments?: string;
}

export interface DocumentAccessEntry {
  userId: string;
  userName: string;
  action: 'view' | 'download' | 'edit' | 'share' | 'delete';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  location?: string;
  outcome: 'success' | 'denied' | 'error';
  denyReason?: string;
}

export interface DocumentShare {
  sharedWithUserId: string;
  sharedByUserId: string;
  shareType: 'view' | 'download' | 'edit';
  expiresAt?: Date;
  notifyOnAccess: boolean;
  passwordProtected: boolean;
  shareUrl?: string;
  createdAt: Date;
  accessCount: number;
  lastAccessed?: Date;
}

export interface VirusScanResult {
  scanId: string;
  scannerId: string;
  scanDate: Date;
  status: 'clean' | 'infected' | 'suspicious' | 'error';
  threats: string[];
  riskScore: number;
  scanDetails: Record<string, unknown>;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'nda' | 'contract' | 'term_sheet' | 'due_diligence' | 'compliance' | 'reference';
  templateUrl: string;
  variables: TemplateVariable[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
  jurisdictions: string[];
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  label: string;
  required: boolean;
  defaultValue?: unknown;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface DocumentGenerationRequest {
  templateId: string;
  variables: Record<string, unknown>;
  outputFormat: 'pdf' | 'docx';
  watermark?: string;
  securityLevel: 'standard' | 'high' | 'legal';
  recipientEmails?: string[];
}

export class DocumentService {
  private readonly ALLOWED_FILE_TYPES = [
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    '.xlsx', '.xls', '.csv',
    '.jpg', '.jpeg', '.png', '.gif',
    '.zip', '.7z'
  ];

  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // File upload with security validation
  async uploadSecureDocument(
    file: File,
    metadata: {
      conversationId?: string;
      dealId?: string;
      teamId?: string;
      companyId?: string;
      documentType: SecureDocument['documentType'];
      accessLevel: SecureDocument['accessLevel'];
      encryptionLevel: 'standard' | 'high' | 'legal';
      uploadedBy: string;
      complianceLabels?: string[];
    }
  ): Promise<string> {
    // Handle demo users - simulate successful upload
    if (isDemoEntity(metadata.uploadedBy) || isDemoEntity(metadata.teamId || '') || isDemoEntity(metadata.companyId || '')) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload delay
      const demoDocId = `demo-doc-${Date.now()}`;
      console.log(`[Demo] Uploaded document: ${file.name} (${demoDocId})`);
      return demoDocId;
    }

    try {
      // Validate file
      this.validateFile(file);

      // Generate secure filename
      const secureFileName = this.generateSecureFilename(file.name, metadata.uploadedBy);

      // Scan for viruses (simulate - would integrate with real service)
      const scanResult = await this.scanForViruses(file);
      if (scanResult.status === 'infected') {
        throw new Error(`File rejected: ${scanResult.threats.join(', ')}`);
      }

      // Calculate checksum
      const checksum = await this.calculateChecksum(file);

      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', secureFileName);
      formData.append('originalFilename', file.name);
      formData.append('documentType', metadata.documentType || 'other');
      formData.append('accessLevel', metadata.accessLevel);
      formData.append('encryptionLevel', metadata.encryptionLevel);
      formData.append('checksum', checksum);
      if (metadata.conversationId) formData.append('conversationId', metadata.conversationId);
      if (metadata.dealId) formData.append('dealId', metadata.dealId);
      if (metadata.teamId) formData.append('teamId', metadata.teamId);
      if (metadata.companyId) formData.append('companyId', metadata.companyId);
      if (metadata.complianceLabels) formData.append('complianceLabels', JSON.stringify(metadata.complianceLabels));

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload document');
      }

      const result = await response.json();
      return result.document?.id || result.data?.id || '';
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload secure document');
    }
  }

  // Get document with access control
  async getSecureDocument(documentId: string, userId: string, action: 'view' | 'download' = 'view'): Promise<SecureDocument | null> {
    // Handle demo documents
    if (isDemoEntity(documentId) || isDemoEntity(userId)) {
      const demoDoc = DEMO_DOCUMENTS.find(d => d.id === documentId);
      if (demoDoc) {
        return demoDoc as unknown as SecureDocument;
      }
      // Return first demo doc for any demo user
      return DEMO_DOCUMENTS[0] as unknown as SecureDocument;
    }

    try {
      const response = await fetch(`/api/documents/${documentId}?action=${action}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        if (response.status === 403) throw new Error('Access denied to document');
        throw new Error('Failed to retrieve document');
      }

      const result = await response.json();
      const doc = result.document || result.data;

      if (!doc) return null;

      return {
        ...doc,
        id: doc.id,
        uploadedAt: doc.uploadedAt,
        reviewedAt: doc.reviewedAt ? new Date(doc.reviewedAt) : undefined,
        retentionDate: doc.retentionDate ? new Date(doc.retentionDate) : undefined,
        accessLog: doc.accessLog || [],
        sharedWith: doc.sharedWith || [],
        complianceLabels: doc.complianceLabels || [],
        jurisdictions: doc.jurisdictions || ['US'],
      } as SecureDocument;
    } catch (error) {
      console.error('Error getting document:', error);
      throw new Error('Failed to retrieve document');
    }
  }

  // Share document with specific users
  async shareDocument(
    documentId: string,
    sharedByUserId: string,
    shareOptions: {
      recipientUserIds: string[];
      shareType: 'view' | 'download' | 'edit';
      expiresAt?: Date;
      notifyOnAccess?: boolean;
      passwordProtected?: boolean;
      customMessage?: string;
    }
  ): Promise<DocumentShare[]> {
    // Handle demo documents
    if (isDemoEntity(documentId) || isDemoEntity(sharedByUserId)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`[Demo] Shared document ${documentId} with ${shareOptions.recipientUserIds.length} recipients`);
      return shareOptions.recipientUserIds.map(recipientUserId => ({
        sharedWithUserId: recipientUserId,
        sharedByUserId,
        shareType: shareOptions.shareType,
        expiresAt: shareOptions.expiresAt,
        notifyOnAccess: shareOptions.notifyOnAccess || false,
        passwordProtected: shareOptions.passwordProtected || false,
        createdAt: new Date(),
        accessCount: 0,
      }));
    }

    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shareOptions),
      });

      if (!response.ok) {
        throw new Error('Failed to share document');
      }

      const result = await response.json();
      return result.shares || result.data?.shares || [];
    } catch (error) {
      console.error('Error sharing document:', error);
      throw new Error('Failed to share document');
    }
  }

  // Generate legal document from template
  async generateLegalDocument(request: DocumentGenerationRequest): Promise<string> {
    try {
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      const result = await response.json();
      return result.documentId || result.data?.documentId || '';
    } catch (error) {
      console.error('Error generating document:', error);
      throw new Error('Failed to generate legal document');
    }
  }

  // Get documents for conversation/deal
  async getDocumentsForEntity(
    entityType: 'conversation' | 'deal' | 'team' | 'company',
    entityId: string,
    userId: string
  ): Promise<SecureDocument[]> {
    // Handle demo entities
    if (isDemoEntity(entityId) || isDemoEntity(userId)) {
      return DEMO_DOCUMENTS as unknown as SecureDocument[];
    }

    try {
      const response = await fetch(`/api/documents?${entityType}Id=${entityId}`);

      if (!response.ok) {
        throw new Error('Failed to retrieve documents');
      }

      const result = await response.json();
      const docs = result.documents || result.data?.documents || [];

      return docs.map((doc: Record<string, unknown>) => ({
        ...doc,
        id: doc.id,
        uploadedAt: doc.uploadedAt,
        accessLog: doc.accessLog || [],
        sharedWith: doc.sharedWith || [],
        complianceLabels: doc.complianceLabels || [],
        jurisdictions: doc.jurisdictions || ['US'],
      })) as SecureDocument[];
    } catch (error) {
      console.error('Error getting documents for entity:', error);
      throw new Error('Failed to retrieve documents');
    }
  }

  // Delete document
  async deleteDocument(documentId: string, userId: string): Promise<void> {
    // Handle demo documents
    if (isDemoEntity(documentId) || isDemoEntity(userId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Deleted document: ${documentId}`);
      return;
    }

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  // Get document versions
  async getDocumentVersions(documentId: string): Promise<{ version: number; uploadedAt: string; uploadedBy: string }[]> {
    // Handle demo documents
    if (isDemoEntity(documentId)) {
      return [
        { version: 1, uploadedAt: new Date().toISOString(), uploadedBy: 'demo-user-001' },
      ];
    }

    try {
      const response = await fetch(`/api/documents/${documentId}/versions`);

      if (!response.ok) {
        throw new Error('Failed to retrieve document versions');
      }

      const result = await response.json();
      return result.versions || result.data?.versions || [];
    } catch (error) {
      console.error('Error getting document versions:', error);
      throw new Error('Failed to retrieve document versions');
    }
  }

  // Private helper methods
  private validateFile(file: File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.ALLOWED_FILE_TYPES.includes(fileExtension)) {
      throw new Error(`File type ${fileExtension} is not allowed`);
    }
  }

  private generateSecureFilename(originalName: string, userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${random}-${userId.substr(0, 8)}.${extension}`;
  }

  private async scanForViruses(file: File): Promise<VirusScanResult> {
    // Simulate virus scanning - would integrate with real service like ClamAV
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          scanId: `scan-${Date.now()}`,
          scannerId: 'clamav-simulator',
          scanDate: new Date(),
          status: 'clean',
          threats: [],
          riskScore: 0,
          scanDetails: {
            scannerVersion: '1.0.0',
            signatureVersion: '2024-09-20',
            scanDuration: 150,
          },
        });
      }, 100);
    });
  }

  private async calculateChecksum(file: File): Promise<string> {
    // Calculate SHA-256 checksum
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const documentService = new DocumentService();
