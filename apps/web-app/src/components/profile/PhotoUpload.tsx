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
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
            transition-colors duration-200
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
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openFilePicker();
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                    disabled={disabled}
                  >
                    <CameraIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhoto();
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                    disabled={disabled}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Upload placeholder */
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ArrowUpTrayIcon className="w-8 h-8 mb-2" />
              <span className="text-xs text-center">
                {dragActive ? 'Drop here' : 'Upload photo'}
              </span>
            </div>
          )}
        </div>

        {/* Upload progress */}
        {isUploading && uploadProgress && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-xs font-medium">{Math.round(uploadProgress.progress)}%</div>
              <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {type === 'profile' ? 'Profile Photo Preview' : 'Company Logo Preview'}
              </h3>
              <button
                onClick={cancelUpload}
                className="text-gray-400 hover:text-gray-600"
                disabled={isUploading}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Preview */}
              <div className="flex justify-center mb-4">
                <div className={`${sizeClasses.xl} rounded-full overflow-hidden border-2 border-gray-200`}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* File info */}
              <div className="text-center text-sm text-gray-600 mb-6">
                <div className="font-medium">{selectedFile.name}</div>
                <div>{formatFileSize(selectedFile.size)}</div>
                {type === 'profile' && (
                  <div className="text-xs mt-1 text-gray-500">
                    Image will be cropped to square and resized to 400x400px
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelUpload}
                  className="flex-1 btn-secondary"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={uploadPhoto}
                  className="flex-1 btn-primary"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}