'use client';

import { useState, useRef, useCallback } from 'react';
import { documentService } from '@/lib/services/documentService';
import type { SecureDocument } from '@/lib/services/documentService';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface SecureDocumentUploadProps {
  conversationId?: string;
  dealId?: string;
  teamId?: string;
  companyId?: string;
  onUploadComplete?: (documentId: string, document: SecureDocument) => void;
  onUploadError?: (error: string) => void;
  allowedTypes?: string[];
  maxFileSize?: number;
  securityLevel?: 'standard' | 'high' | 'legal';
  accessLevel?: 'public' | 'parties_only' | 'legal_only' | 'confidential';
  className?: string;
}

interface UploadingFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  documentId?: string;
  document?: SecureDocument;
}

export function SecureDocumentUpload({
  conversationId,
  dealId,
  teamId,
  companyId,
  onUploadComplete,
  onUploadError,
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png', '.xlsx'],
  maxFileSize = 50 * 1024 * 1024, // 50MB
  securityLevel = 'high',
  accessLevel = 'parties_only',
  className = '',
}: SecureDocumentUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadingFile[] = Array.from(files).map(file => ({
      file,
      id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      progress: 0,
      status: 'uploading',
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);

    // Process each file
    newFiles.forEach(uploadFile => {
      processFileUpload(uploadFile);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, dealId, teamId, companyId, securityLevel, accessLevel]);

  const processFileUpload = async (uploadFile: UploadingFile) => {
    try {
      // Validate file
      const validation = validateFile(uploadFile.file);
      if (!validation.isValid) {
        updateFileStatus(uploadFile.id, 'error', 0, validation.error);
        onUploadError?.(validation.error || 'File validation failed');
        return;
      }

      // Update status to processing
      updateFileStatus(uploadFile.id, 'processing', 50);

      // Determine document type based on file
      const documentType = determineDocumentType(uploadFile.file);

      // Upload document
      const documentId = await documentService.uploadSecureDocument(uploadFile.file, {
        conversationId,
        dealId,
        teamId,
        companyId,
        documentType,
        accessLevel,
        encryptionLevel: securityLevel,
        uploadedBy: 'current-user-id', // Would get from auth context
        complianceLabels: generateComplianceLabels(uploadFile.file, documentType || 'other'),
      });

      // Get the uploaded document details
      const document = await documentService.getSecureDocument(documentId, 'current-user-id');
      
      if (document) {
        updateFileStatus(uploadFile.id, 'complete', 100, undefined, documentId, document);
        onUploadComplete?.(documentId, document);
      } else {
        throw new Error('Failed to retrieve uploaded document');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      updateFileStatus(uploadFile.id, 'error', 0, errorMessage);
      onUploadError?.(errorMessage);
    }
  };

  const updateFileStatus = (
    id: string, 
    status: UploadingFile['status'], 
    progress: number, 
    error?: string,
    documentId?: string,
    document?: SecureDocument
  ) => {
    setUploadingFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, status, progress, error, documentId, document }
        : file
    ));
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of ${Math.round(maxFileSize / (1024 * 1024))}MB`
      };
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check for potentially dangerous files
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js'];
    if (dangerousExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      return {
        isValid: false,
        error: 'Executable files are not allowed for security reasons'
      };
    }

    return { isValid: true };
  };

  const determineDocumentType = (file: File): SecureDocument['documentType'] => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.includes('nda') || fileName.includes('non-disclosure')) {
      return 'nda';
    }
    if (fileName.includes('contract') || fileName.includes('agreement')) {
      return 'contract';
    }
    if (fileName.includes('term') && fileName.includes('sheet')) {
      return 'term_sheet';
    }
    if (fileName.includes('due') && fileName.includes('diligence')) {
      return 'due_diligence';
    }
    if (fileName.includes('reference') || fileName.includes('recommendation')) {
      return 'reference';
    }
    if (fileName.includes('compliance') || fileName.includes('regulatory')) {
      return 'compliance';
    }
    
    return 'other';
  };

  const generateComplianceLabels = (file: File, documentType: string): string[] => {
    const labels = ['user_uploaded', `type_${documentType}`];
    
    if (securityLevel === 'legal') {
      labels.push('legal_review_required');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      labels.push('large_file');
    }
    
    if (accessLevel === 'confidential') {
      labels.push('confidential');
    }
    
    return labels;
  };

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSecurityIcon = () => {
    switch (securityLevel) {
      case 'legal':
        return <ShieldCheckIcon className="h-4 w-4 text-error" />;
      case 'high':
        return <LockClosedIcon className="h-4 w-4 text-gold" />;
      default:
        return <EyeIcon className="h-4 w-4 text-navy" />;
    }
  };

  const getSecurityBadgeColor = () => {
    switch (securityLevel) {
      case 'legal':
        return 'bg-error-light text-error-dark';
      case 'high':
        return 'bg-gold-100 text-gold-800';
      default:
        return 'bg-navy-50 text-navy-800';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-fast ${
          isDragOver
            ? 'border-navy bg-navy-50'
            : 'border-border hover:border-text-tertiary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-text-tertiary" />
        <div className="mt-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-navy hover:text-navy-700 font-medium transition-colors duration-fast"
          >
            Upload secure documents
          </button>
          <p className="text-text-secondary text-sm mt-1">or drag and drop files here</p>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            {getSecurityIcon()}
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSecurityBadgeColor()}`}>
              {securityLevel.toUpperCase()} SECURITY
            </span>
          </div>

          <span className="text-xs text-text-tertiary">
            Max {Math.round(maxFileSize / (1024 * 1024))}MB
          </span>
        </div>

        <p className="text-xs text-text-tertiary mt-2">
          Supported: {allowedTypes.join(', ')}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Security Notice */}
      {securityLevel === 'legal' && (
        <div className="bg-error-light border border-error rounded-lg p-3">
          <div className="flex">
            <ShieldCheckIcon className="h-5 w-5 text-error mr-2 mt-0.5" />
            <div className="text-sm">
              <p className="text-error-dark font-medium">Maximum security upload</p>
              <p className="text-error-dark/80 mt-1">
                Files uploaded with legal-grade security will be encrypted, require legal review,
                and are subject to enhanced audit logging and compliance monitoring.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-text-primary">Upload progress</h4>

          {uploadingFiles.map((uploadFile) => (
            <div key={uploadFile.id} className="border border-border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <DocumentTextIcon className="h-8 w-8 text-text-tertiary mt-1" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {uploadFile.file.name}
                    </p>

                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-text-tertiary">
                        {formatFileSize(uploadFile.file.size)}
                      </span>

                      {uploadFile.status === 'complete' && uploadFile.document && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getSecurityBadgeColor()}`}>
                          {uploadFile.document.documentType?.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {(uploadFile.status === 'uploading' || uploadFile.status === 'processing') && (
                      <div className="mt-2">
                        <div className="bg-bg-alt rounded-full h-2">
                          <div
                            className="bg-navy h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadFile.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-tertiary mt-1">
                          {uploadFile.status === 'processing' ? 'Processing...' : 'Uploading...'}
                        </p>
                      </div>
                    )}

                    {/* Error Message */}
                    {uploadFile.status === 'error' && uploadFile.error && (
                      <p className="text-xs text-error mt-1">{uploadFile.error}</p>
                    )}
                  </div>
                </div>

                {/* Status Icon */}
                <div className="ml-2">
                  {uploadFile.status === 'complete' && (
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                  )}
                  {uploadFile.status === 'error' && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-error" />
                  )}
                  {(uploadFile.status === 'uploading' || uploadFile.status === 'processing') && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-navy" />
                  )}

                  <button
                    onClick={() => removeFile(uploadFile.id)}
                    className="ml-2 text-text-tertiary hover:text-text-secondary transition-colors duration-fast"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}