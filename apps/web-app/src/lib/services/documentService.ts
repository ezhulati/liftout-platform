import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  getMetadata,
  updateMetadata 
} from 'firebase/storage';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  writeBatch 
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import type { MessageAttachment } from '@/lib/messaging';

const DOCUMENTS_COLLECTION = 'documents';
const DOCUMENT_ACCESS_LOG_COLLECTION = 'document_access_logs';

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
  scanDetails: Record<string, any>;
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
  defaultValue?: any;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface DocumentGenerationRequest {
  templateId: string;
  variables: Record<string, any>;
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
  private readonly VIRUS_SCAN_TIMEOUT = 30000; // 30 seconds

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
    try {
      // Validate file
      this.validateFile(file);
      
      // Generate secure filename
      const secureFileName = this.generateSecureFilename(file.name, metadata.uploadedBy);
      const storagePath = this.getStoragePath(metadata.documentType, secureFileName);
      
      // Scan for viruses (simulate - would integrate with real service)
      const scanResult = await this.scanForViruses(file);
      if (scanResult.status === 'infected') {
        throw new Error(`File rejected: ${scanResult.threats.join(', ')}`);
      }
      
      // Encrypt file if required
      const processedFile = metadata.encryptionLevel === 'legal' 
        ? await this.encryptFile(file) 
        : file;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, storagePath);
      const uploadResult = await uploadBytes(storageRef, processedFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      // Create document record
      const documentData: Partial<SecureDocument> = {
        filename: secureFileName,
        originalFilename: file.name,
        fileType: file.type,
        fileSize: file.size,
        encryptedUrl: downloadURL,
        accessLevel: metadata.accessLevel,
        virusScanned: true,
        scanResults: JSON.stringify(scanResult),
        uploadedBy: metadata.uploadedBy,
        uploadedAt: new Date().toISOString(),
        downloadCount: 0,
        documentType: metadata.documentType,
        version: 1,
        checksum: await this.calculateChecksum(file),
        isExpired: false,
        conversationId: metadata.conversationId,
        dealId: metadata.dealId,
        teamId: metadata.teamId,
        companyId: metadata.companyId,
        complianceLabels: metadata.complianceLabels || [],
        isLegalPrivileged: metadata.encryptionLevel === 'legal',
        jurisdictions: ['US'], // Default, could be configured
        reviewStatus: 'pending',
        accessLog: [],
        sharedWith: [],
        regulatoryClassification: this.determineRegulatoryClassification(metadata.accessLevel),
      };
      
      const docRef = await addDoc(collection(db, DOCUMENTS_COLLECTION), {
        ...documentData,
        uploadedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      // Log upload activity
      await this.logDocumentAccess(docRef.id, metadata.uploadedBy, 'upload', 'success');
      
      return docRef.id;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload secure document');
    }
  }

  // Get document with access control
  async getSecureDocument(documentId: string, userId: string, action: 'view' | 'download' = 'view'): Promise<SecureDocument | null> {
    try {
      const docRef = doc(db, DOCUMENTS_COLLECTION, documentId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await this.logDocumentAccess(documentId, userId, action, 'denied', 'Document not found');
        return null;
      }
      
      const documentData = docSnap.data() as SecureDocument;
      
      // Check access permissions
      const hasAccess = await this.checkDocumentAccess(documentData, userId, action);
      if (!hasAccess) {
        await this.logDocumentAccess(documentId, userId, action, 'denied', 'Insufficient permissions');
        throw new Error('Access denied to document');
      }
      
      // Increment download count if downloading
      if (action === 'download') {
        await updateDoc(docRef, {
          downloadCount: (documentData.downloadCount || 0) + 1,
          lastDownloaded: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
      
      // Log access
      await this.logDocumentAccess(documentId, userId, action, 'success');
      
      // Convert Firestore timestamps
      return {
        ...documentData,
        id: docSnap.id,
        uploadedAt: documentData.uploadedAt instanceof Timestamp ? documentData.uploadedAt.toDate().toISOString() : documentData.uploadedAt,
        reviewedAt: documentData.reviewedAt instanceof Timestamp ? documentData.reviewedAt.toDate() : documentData.reviewedAt,
        retentionDate: documentData.retentionDate instanceof Timestamp ? documentData.retentionDate.toDate() : documentData.retentionDate,
      };
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
    try {
      const document = await this.getSecureDocument(documentId, sharedByUserId, 'view');
      if (!document) {
        throw new Error('Document not found');
      }
      
      const shares: DocumentShare[] = [];
      const batch = writeBatch(db);
      
      for (const recipientUserId of shareOptions.recipientUserIds) {
        const shareId = `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const share: DocumentShare = {
          sharedWithUserId: recipientUserId,
          sharedByUserId,
          shareType: shareOptions.shareType,
          expiresAt: shareOptions.expiresAt,
          notifyOnAccess: shareOptions.notifyOnAccess || false,
          passwordProtected: shareOptions.passwordProtected || false,
          shareUrl: shareOptions.passwordProtected ? this.generateSecureShareUrl(documentId, shareId) : undefined,
          createdAt: new Date(),
          accessCount: 0,
        };
        
        shares.push(share);
        
        // Update document with new share
        const docRef = doc(db, DOCUMENTS_COLLECTION, documentId);
        batch.update(docRef, {
          sharedWith: [...(document.sharedWith || []), share],
          updatedAt: Timestamp.now(),
        });
      }
      
      await batch.commit();
      
      // TODO: Send notifications to recipients
      if (shareOptions.notifyOnAccess) {
        await this.notifyDocumentShared(documentId, shares, shareOptions.customMessage);
      }
      
      return shares;
    } catch (error) {
      console.error('Error sharing document:', error);
      throw new Error('Failed to share document');
    }
  }

  // Generate legal document from template
  async generateLegalDocument(request: DocumentGenerationRequest): Promise<string> {
    try {
      // Get template
      const template = await this.getDocumentTemplate(request.templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      
      // Validate variables
      this.validateTemplateVariables(template, request.variables);
      
      // Generate document (would integrate with document generation service)
      const generatedContent = await this.processTemplate(template, request.variables);
      
      // Create file blob
      const blob = new Blob([generatedContent], { 
        type: request.outputFormat === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      const file = new File([blob], `${template.name}-${Date.now()}.${request.outputFormat}`, {
        type: blob.type
      });
      
      // Upload generated document
      const documentId = await this.uploadSecureDocument(file, {
        documentType: template.category as any,
        accessLevel: request.securityLevel === 'legal' ? 'legal_only' : 'parties_only',
        encryptionLevel: request.securityLevel,
        uploadedBy: 'system', // System-generated
        complianceLabels: ['generated_document', `template_${request.templateId}`],
      });
      
      // Update template usage count
      await this.incrementTemplateUsage(request.templateId);
      
      return documentId;
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
    try {
      const q = query(
        collection(db, DOCUMENTS_COLLECTION),
        where(`${entityType}Id`, '==', entityId),
        orderBy('uploadedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const documents: SecureDocument[] = [];
      
      for (const docSnap of querySnapshot.docs) {
        const documentData = docSnap.data() as SecureDocument;
        
        // Check if user has access to this document
        const hasAccess = await this.checkDocumentAccess(documentData, userId, 'view');
        if (hasAccess) {
          documents.push({
            ...documentData,
            id: docSnap.id,
            uploadedAt: documentData.uploadedAt instanceof Timestamp ? documentData.uploadedAt.toDate().toISOString() : documentData.uploadedAt,
          });
        }
      }
      
      return documents;
    } catch (error) {
      console.error('Error getting documents for entity:', error);
      throw new Error('Failed to retrieve documents');
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

  private getStoragePath(documentType: string, filename: string): string {
    return `secure-documents/${documentType}/${filename}`;
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

  private async encryptFile(file: File): Promise<File> {
    // Simulate file encryption - would use proper encryption
    const arrayBuffer = await file.arrayBuffer();
    const encrypted = new Uint8Array(arrayBuffer); // In reality, would encrypt
    return new File([encrypted], file.name, { type: file.type });
  }

  private async calculateChecksum(file: File): Promise<string> {
    // Calculate SHA-256 checksum
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private determineRegulatoryClassification(accessLevel: string): 'public' | 'internal' | 'confidential' | 'restricted' {
    switch (accessLevel) {
      case 'public': return 'public';
      case 'parties_only': return 'internal';
      case 'legal_only': return 'restricted';
      case 'confidential': return 'confidential';
      default: return 'internal';
    }
  }

  private async checkDocumentAccess(document: SecureDocument, userId: string, action: string): Promise<boolean> {
    // Check if user uploaded the document
    if (document.uploadedBy === userId) {
      return true;
    }
    
    // Check access level restrictions
    if (document.accessLevel === 'legal_only') {
      // Would check if user has legal role
      return userId.includes('legal'); // Simplified check
    }
    
    // Check if document is shared with user
    const isSharedWithUser = document.sharedWith?.some(share => 
      share.sharedWithUserId === userId && 
      (!share.expiresAt || share.expiresAt > new Date()) &&
      (action === 'view' || share.shareType === action || share.shareType === 'edit')
    );
    
    return isSharedWithUser || document.accessLevel === 'public';
  }

  private async logDocumentAccess(
    documentId: string, 
    userId: string, 
    action: string, 
    outcome: string, 
    denyReason?: string
  ): Promise<void> {
    try {
      const logEntry = {
        documentId,
        userId,
        action,
        outcome,
        denyReason,
        timestamp: Timestamp.now(),
        ipAddress: '127.0.0.1', // Would get real IP
        userAgent: 'Mozilla/5.0...', // Would get real user agent
      };
      
      await addDoc(collection(db, DOCUMENT_ACCESS_LOG_COLLECTION), logEntry);
    } catch (error) {
      console.error('Error logging document access:', error);
    }
  }

  private generateSecureShareUrl(documentId: string, shareId: string): string {
    return `https://secure.liftout.com/documents/shared/${documentId}/${shareId}`;
  }

  private async notifyDocumentShared(documentId: string, shares: DocumentShare[], customMessage?: string): Promise<void> {
    // TODO: Implement notification system
    console.log('Document shared notifications sent for:', documentId, shares.length, 'recipients');
  }

  private async getDocumentTemplate(templateId: string): Promise<DocumentTemplate | null> {
    // TODO: Implement template retrieval
    return null;
  }

  private validateTemplateVariables(template: DocumentTemplate, variables: Record<string, any>): void {
    // TODO: Implement template variable validation
  }

  private async processTemplate(template: DocumentTemplate, variables: Record<string, any>): Promise<string> {
    // TODO: Implement template processing
    return `Generated document content for ${template.name}`;
  }

  private async incrementTemplateUsage(templateId: string): Promise<void> {
    // TODO: Implement template usage tracking
  }
}

export const documentService = new DocumentService();