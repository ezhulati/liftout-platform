// Storage utilities - local implementation (Firebase removed)
// Photo uploads are handled via data URLs stored in database

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
  progress: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onError?: (error: Error) => void;
}

// Check if file is an image
export function isImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Create a preview URL for an image file
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

// Clean up a preview URL
export function cleanupImagePreview(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

// Convert file to data URL (base64)
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Upload profile photo - returns data URL
export async function uploadProfilePhoto(
  userId: string,
  file: File,
  options?: UploadOptions
): Promise<string> {
  try {
    // Simulate progress
    if (options?.onProgress) {
      options.onProgress({
        bytesTransferred: file.size / 2,
        totalBytes: file.size,
        state: 'running',
        progress: 50,
      });
    }

    const dataUrl = await fileToDataUrl(file);

    if (options?.onProgress) {
      options.onProgress({
        bytesTransferred: file.size,
        totalBytes: file.size,
        state: 'success',
        progress: 100,
      });
    }

    return dataUrl;
  } catch (error) {
    if (options?.onError) {
      options.onError(error instanceof Error ? error : new Error('Upload failed'));
    }
    throw error;
  }
}

// Upload company logo - returns data URL
export async function uploadCompanyLogo(
  companyId: string,
  file: File,
  options?: UploadOptions
): Promise<string> {
  return uploadProfilePhoto(companyId, file, options);
}

// Delete profile photo - no-op for data URLs
export async function deleteProfilePhoto(photoUrl: string): Promise<void> {
  // Data URLs don't need to be deleted from external storage
  // They're just stored in the database
  return Promise.resolve();
}
