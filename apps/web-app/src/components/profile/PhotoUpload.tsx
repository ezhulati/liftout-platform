'use client';

import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  CameraIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  uploadProfilePhoto,
  uploadCompanyLogo,
  deleteProfilePhoto,
  formatFileSize,
  isImageFile,
  createImagePreview,
  cleanupImagePreview,
  UploadProgress,
} from '@/lib/storage';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  userId: string;
  type?: 'profile' | 'company-logo';
  onPhotoUpdate: (photoUrl: string | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

export default function PhotoUpload({
  currentPhotoUrl,
  userId,
  type = 'profile',
  onPhotoUpdate,
  className = '',
  size = 'lg',
  disabled = false,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (!isImageFile(file)) {
      toast.error('Please select an image file (JPEG, PNG, or WebP)');
      return;
    }

    // Check file size (5MB limit for profile photos, 2MB for logos)
    const maxSize = type === 'profile' ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setSelectedFile(file);
    const preview = createImagePreview(file);
    setPreviewUrl(preview);
    setShowCropModal(true);
  }, [type]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect, disabled]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Upload photo
  const uploadPhoto = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      const uploadFunction = type === 'profile' ? uploadProfilePhoto : uploadCompanyLogo;
      
      const downloadURL = await uploadFunction(userId, selectedFile, {
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
        onError: (error) => {
          console.error('Upload error:', error);
          toast.error(error.message || 'Upload failed');
        },
      });

      // Delete old photo if exists
      if (currentPhotoUrl) {
        try {
          await deleteProfilePhoto(currentPhotoUrl);
        } catch (error) {
          console.warn('Failed to delete old photo:', error);
        }
      }

      onPhotoUpdate(downloadURL);
      toast.success('Photo uploaded successfully!');
      
      // Cleanup
      setShowCropModal(false);
      setSelectedFile(null);
      if (previewUrl) {
        cleanupImagePreview(previewUrl);
        setPreviewUrl(null);
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, [selectedFile, userId, type, currentPhotoUrl, onPhotoUpdate, previewUrl]);

  // Delete photo
  const deletePhoto = useCallback(async () => {
    if (!currentPhotoUrl) return;

    try {
      await deleteProfilePhoto(currentPhotoUrl);
      onPhotoUpdate(null);
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete photo');
    }
  }, [currentPhotoUrl, onPhotoUpdate]);

  // Cancel upload
  const cancelUpload = useCallback(() => {
    setShowCropModal(false);
    setSelectedFile(null);
    if (previewUrl) {
      cleanupImagePreview(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  // Open file picker
  const openFilePicker = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  return (
    <>
      {/* Main photo upload area */}
      <div className={`relative ${className}`}>
        <div
          ref={dropZoneRef}
          className={`
            relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-dashed
            ${dragActive ? 'border-navy bg-navy-50' : 'border-border'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-navy-300'}
            transition-colors duration-base
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFilePicker}
        >
          {currentPhotoUrl ? (
            <>
              {/* Current photo */}
              <img
                src={currentPhotoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-navy-900/0 hover:bg-navy-900/40 transition-opacity duration-base flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-base flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openFilePicker();
                    }}
                    className="p-2 bg-bg-surface rounded-full text-text-secondary hover:text-navy transition-colors touch-target"
                    disabled={disabled}
                    aria-label="Change photo"
                  >
                    <CameraIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhoto();
                    }}
                    className="p-2 bg-bg-surface rounded-full text-text-secondary hover:text-error transition-colors touch-target"
                    disabled={disabled}
                    aria-label="Delete photo"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Upload placeholder */
            <div className="w-full h-full flex flex-col items-center justify-center text-text-tertiary">
              <ArrowUpTrayIcon className="w-8 h-8 mb-2" />
              <span className="text-xs text-center">
                {dragActive ? 'Drop here' : 'Upload photo'}
              </span>
            </div>
          )}
        </div>

        {/* Upload progress */}
        {isUploading && uploadProgress && (
          <div className="absolute inset-0 bg-navy-900/50 rounded-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-xs font-medium">{Math.round(uploadProgress.progress)}%</div>
              <div className="w-16 bg-bg-alt rounded-full h-1 mt-1">
                <div
                  className="bg-navy h-1 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Crop/Preview Modal */}
      {showCropModal && selectedFile && previewUrl && (
        <div className="fixed inset-0 bg-navy-900/75 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-lg max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-medium text-text-primary">
                {type === 'profile' ? 'Profile photo preview' : 'Company logo preview'}
              </h3>
              <button
                onClick={cancelUpload}
                className="text-text-tertiary hover:text-text-primary transition-colors touch-target"
                disabled={isUploading}
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Preview */}
              <div className="flex justify-center mb-4">
                <div className={`${sizeClasses.xl} rounded-full overflow-hidden border-2 border-border`}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* File info */}
              <div className="text-center text-sm text-text-secondary mb-6">
                <div className="font-medium text-text-primary">{selectedFile.name}</div>
                <div>{formatFileSize(selectedFile.size)}</div>
                {type === 'profile' && (
                  <div className="text-xs mt-1 text-text-tertiary">
                    Image will be cropped to square and resized to 400x400px
                  </div>
                )}
              </div>

              {/* Actions - Primary button first per Practical UI */}
              <div className="flex space-x-3">
                <button
                  onClick={uploadPhoto}
                  className="flex-1 btn-primary inline-flex items-center justify-center"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Upload photo
                    </>
                  )}
                </button>
                <button
                  onClick={cancelUpload}
                  className="flex-1 btn-outline"
                  disabled={isUploading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}