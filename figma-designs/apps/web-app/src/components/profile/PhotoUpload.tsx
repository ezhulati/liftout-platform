'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
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
  /** Use local storage (data URL) instead of Firebase - for demo users */
  useLocalStorage?: boolean;
}

// Convert file to data URL for local storage
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
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
  useLocalStorage = false,
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
      // For demo users or local storage mode, convert to data URL
      if (useLocalStorage) {
        // Simulate progress
        setUploadProgress({
          bytesTransferred: 0,
          totalBytes: selectedFile.size,
          state: 'running',
          progress: 50,
        });

        const dataUrl = await fileToDataUrl(selectedFile);

        setUploadProgress({
          bytesTransferred: selectedFile.size,
          totalBytes: selectedFile.size,
          state: 'success',
          progress: 100,
        });

        onPhotoUpdate(dataUrl);
        toast.success('Photo updated successfully!');

        // Cleanup
        setShowCropModal(false);
        setSelectedFile(null);
        if (previewUrl) {
          cleanupImagePreview(previewUrl);
          setPreviewUrl(null);
        }
        return;
      }

      // For real users, use Firebase Storage
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

      // Delete old photo if exists (only for Firebase URLs)
      if (currentPhotoUrl && currentPhotoUrl.startsWith('https://firebasestorage')) {
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
  }, [selectedFile, userId, type, currentPhotoUrl, onPhotoUpdate, previewUrl, useLocalStorage]);

  // Delete photo
  const deletePhoto = useCallback(async () => {
    if (!currentPhotoUrl) return;

    try {
      // For local storage or data URLs, just clear the reference
      if (useLocalStorage || currentPhotoUrl.startsWith('data:')) {
        onPhotoUpdate(null);
        toast.success('Photo removed');
        return;
      }

      // For Firebase URLs, delete from storage
      if (currentPhotoUrl.startsWith('https://firebasestorage')) {
        await deleteProfilePhoto(currentPhotoUrl);
      }

      onPhotoUpdate(null);
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete photo');
    }
  }, [currentPhotoUrl, onPhotoUpdate, useLocalStorage]);

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
              <Image
                src={currentPhotoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 160px) 100vw, 160px"
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

      {/* Crop/Preview Modal - Using portal-like positioning with high z-index and solid backdrop */}
      {showCropModal && selectedFile && previewUrl && (
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto"
          aria-labelledby="photo-preview-modal"
          role="dialog"
          aria-modal="true"
        >
          {/* Solid backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={cancelUpload}
            aria-hidden="true"
          />

          {/* Modal positioning container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* Modal content */}
            <div className="relative bg-white rounded-xl max-w-md w-full shadow-2xl transform transition-all">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 id="photo-preview-modal" className="text-lg font-semibold text-gray-900">
                  {type === 'profile' ? 'Profile photo preview' : 'Company logo preview'}
                </h3>
                <button
                  onClick={cancelUpload}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={isUploading}
                  aria-label="Close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                {/* Preview image */}
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg relative bg-gray-50">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      fill
                      sizes="160px"
                    />
                  </div>
                </div>

                {/* File info */}
                <div className="text-center mb-6">
                  <div className="font-medium text-gray-900 truncate max-w-xs mx-auto">
                    {selectedFile.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatFileSize(selectedFile.size)}
                  </div>
                  {type === 'profile' && (
                    <div className="text-xs text-gray-400 mt-2">
                      Image will be cropped to square and resized to 400x400px
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={uploadPhoto}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-navy text-white font-medium rounded-lg hover:bg-navy-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy disabled:opacity-50 transition-colors"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="loading-spinner mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-5 h-5 mr-2" />
                        Upload photo
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelUpload}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}