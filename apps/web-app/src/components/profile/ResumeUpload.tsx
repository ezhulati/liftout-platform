'use client';

import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export interface ResumeData {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  url: string;
}

interface ResumeUploadProps {
  resume: ResumeData | null;
  onResumeChange: (resume: ResumeData | null) => void;
  userId: string;
  isEditing: boolean;
  useLocalStorage?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export default function ResumeUpload({
  resume,
  onResumeChange,
  userId,
  isEditing,
  useLocalStorage = false,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Please upload a PDF or Word document (${ALLOWED_EXTENSIONS.join(', ')})`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 5MB limit. Your file is ${formatFileSize(file.size)}`;
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      if (useLocalStorage) {
        // For demo users: store as base64 in localStorage
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          const resumeData: ResumeData = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadDate: new Date().toISOString(),
            url: base64,
          };

          clearInterval(progressInterval);
          setUploadProgress(100);

          setTimeout(() => {
            onResumeChange(resumeData);
            setIsUploading(false);
            setUploadProgress(0);
            toast.success('Resume uploaded successfully');
          }, 300);
        };
        reader.onerror = () => {
          clearInterval(progressInterval);
          setIsUploading(false);
          toast.error('Failed to read file');
        };
        reader.readAsDataURL(file);
      } else {
        // For real users: upload to server
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'resume');
        formData.append('userId', userId);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        setUploadProgress(100);

        const resumeData: ResumeData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          url: result.url,
        };

        setTimeout(() => {
          onResumeChange(resumeData);
          setIsUploading(false);
          setUploadProgress(0);
          toast.success('Resume uploaded successfully');
        }, 300);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error('Failed to upload resume. Please try again.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, []);

  const handleRemove = () => {
    onResumeChange(null);
    toast.success('Resume removed');
  };

  const handleDownload = () => {
    if (!resume) return;

    if (resume.url.startsWith('data:')) {
      // Base64 data - create download link
      const link = document.createElement('a');
      link.href = resume.url;
      link.download = resume.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // URL - open in new tab or trigger download
      window.open(resume.url, '_blank');
    }
  };

  const handlePreview = () => {
    if (!resume) return;

    if (resume.url.startsWith('data:')) {
      // Open base64 in new tab
      const newWindow = window.open();
      if (newWindow) {
        if (resume.fileType === 'application/pdf') {
          newWindow.document.write(
            `<iframe width="100%" height="100%" src="${resume.url}"></iframe>`
          );
        } else {
          newWindow.document.write(
            `<p>Preview not available for this file type. Please download the file to view it.</p>`
          );
        }
      }
    } else {
      window.open(resume.url, '_blank');
    }
  };

  const getFileIcon = () => {
    if (!resume) return DocumentTextIcon;
    if (resume.fileType === 'application/pdf') return DocumentTextIcon;
    return DocumentTextIcon;
  };

  const FileIcon = getFileIcon();

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {isEditing && !resume && !isUploading && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-navy bg-purple-50'
              : 'border-border hover:border-navy'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <DocumentArrowUpIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-primary font-medium mb-1">
            Drag and drop your resume here
          </p>
          <p className="text-sm text-text-tertiary mb-4">
            or click to browse
          </p>
          <p className="text-xs text-text-tertiary">
            PDF, DOC, or DOCX (max 5MB)
          </p>
        </div>
      )}

      {/* Uploading State */}
      {isUploading && (
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <DocumentArrowUpIcon className="h-6 w-6 text-navy animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-text-primary mb-2">Uploading resume...</p>
              <div className="w-full bg-bg-secondary rounded-full h-2">
                <div
                  className="bg-navy h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-text-tertiary mt-1">{uploadProgress}% complete</p>
            </div>
          </div>
        </div>
      )}

      {/* Resume Display */}
      {resume && !isUploading && (
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <FileIcon className="h-6 w-6 text-navy" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-text-primary">{resume.fileName}</h4>
                  <span className="inline-flex items-center gap-1 text-xs text-success-dark bg-success-light px-2 py-0.5 rounded-full">
                    <CheckCircleIcon className="h-3 w-3" />
                    Uploaded
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-text-tertiary">
                  <span>{formatFileSize(resume.fileSize)}</span>
                  <span>Uploaded {formatDate(resume.uploadDate)}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  {resume.fileType === 'application/pdf' && (
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="inline-flex items-center gap-1.5 text-sm text-navy hover:text-navy-dark transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Preview
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 text-sm text-navy hover:text-navy-dark transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 text-text-tertiary hover:text-error hover:bg-error-light rounded-lg transition-colors"
                aria-label="Remove resume"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Replace Resume */}
      {resume && isEditing && !isUploading && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-navy hover:text-navy-dark transition-colors"
          >
            Replace with a different resume
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* No Resume - Not Editing */}
      {!resume && !isEditing && !isUploading && (
        <div className="text-center py-8 bg-bg-secondary rounded-lg">
          <DocumentTextIcon className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-tertiary">No resume uploaded</p>
        </div>
      )}

      {/* Help Text */}
      {isEditing && (
        <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
          <ExclamationCircleIcon className="h-5 w-5 text-navy flex-shrink-0 mt-0.5" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">Tips for your resume</p>
            <ul className="list-disc list-inside space-y-0.5 text-text-tertiary">
              <li>Use a clean, professional format</li>
              <li>Keep it to 1-2 pages for most roles</li>
              <li>Include relevant keywords from job descriptions</li>
              <li>Highlight achievements with quantifiable results</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
