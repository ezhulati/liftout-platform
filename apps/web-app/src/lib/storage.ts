import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot
} from 'firebase/storage';
import app from './firebase';

// Initialize Firebase Storage
export const storage = getStorage(app);

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  state: 'paused' | 'running' | 'success' | 'canceled' | 'error';
  progress: number; // 0-100
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onError?: (error: Error) => void;
  onComplete?: (downloadURL: string) => void;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  folder?: string;
}

// Default options for profile photos
const DEFAULT_PHOTO_OPTIONS: UploadOptions = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  folder: 'profile-photos',
};

// Utility function to generate unique file names
function generateFileName(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `${userId}_${timestamp}.${extension}`;
}

// Validate file before upload
function validateFile(file: File, options: UploadOptions): void {
  // Check file size
  if (options.maxSizeBytes && file.size > options.maxSizeBytes) {
    throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(options.maxSizeBytes / 1024 / 1024).toFixed(2)}MB)`);
  }

  // Check file type
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
  }
}

// Resize image using canvas
export function resizeImage(
  file: File, 
  maxWidth: number = 400, 
  maxHeight: number = 400, 
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type,
          quality
        );
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Crop image to square
export function cropImageToSquare(file: File, size: number = 400): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      const minDimension = Math.min(width, height);
      
      // Calculate crop position (center crop)
      const cropX = (width - minDimension) / 2;
      const cropY = (height - minDimension) / 2;

      // Set canvas to square
      canvas.width = size;
      canvas.height = size;

      if (ctx) {
        // Draw cropped and resized image
        ctx.drawImage(
          img,
          cropX, cropY, minDimension, minDimension, // Source rectangle
          0, 0, size, size // Destination rectangle
        );
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const croppedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(croppedFile);
            } else {
              reject(new Error('Failed to crop image'));
            }
          },
          file.type,
          0.9
        );
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Upload profile photo
export async function uploadProfilePhoto(
  userId: string,
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  const finalOptions = { ...DEFAULT_PHOTO_OPTIONS, ...options };
  
  try {
    // Validate file
    validateFile(file, finalOptions);

    // Resize and crop image
    const resizedFile = await resizeImage(file);
    const croppedFile = await cropImageToSquare(resizedFile);

    // Generate file path
    const fileName = generateFileName(userId, file.name);
    const filePath = `${finalOptions.folder}/${fileName}`;
    const storageRef = ref(storage, filePath);

    // Upload file with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, croppedFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            state: snapshot.state as any,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          };
          
          if (finalOptions.onProgress) {
            finalOptions.onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          if (finalOptions.onError) {
            finalOptions.onError(error);
          }
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            if (finalOptions.onComplete) {
              finalOptions.onComplete(downloadURL);
            }
            
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    if (finalOptions.onError) {
      finalOptions.onError(error as Error);
    }
    throw error;
  }
}

// Delete profile photo
export async function deleteProfilePhoto(photoURL: string): Promise<void> {
  try {
    // Extract file path from URL
    const url = new URL(photoURL);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch) {
      throw new Error('Invalid photo URL');
    }
    
    const filePath = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, filePath);
    
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}

// Upload company logo (similar to profile photo but with different sizing)
export async function uploadCompanyLogo(
  companyId: string,
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  const logoOptions: UploadOptions = {
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    folder: 'company-logos',
    ...options,
  };

  try {
    validateFile(file, logoOptions);

    // For logos, resize but maintain aspect ratio
    const resizedFile = await resizeImage(file, 200, 200, 0.9);

    const fileName = generateFileName(companyId, file.name);
    const filePath = `${logoOptions.folder}/${fileName}`;
    const storageRef = ref(storage, filePath);

    const uploadTask = uploadBytesResumable(storageRef, resizedFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            state: snapshot.state as any,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          };
          
          if (logoOptions.onProgress) {
            logoOptions.onProgress(progress);
          }
        },
        (error) => {
          console.error('Logo upload error:', error);
          if (logoOptions.onError) {
            logoOptions.onError(error);
          }
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            if (logoOptions.onComplete) {
              logoOptions.onComplete(downloadURL);
            }
            
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    if (logoOptions.onError) {
      logoOptions.onError(error as Error);
    }
    throw error;
  }
}

// Upload document files
export async function uploadDocument(
  userId: string,
  file: File,
  folder: string = 'documents',
  options: UploadOptions = {}
): Promise<string> {
  const documentOptions: UploadOptions = {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    folder,
    ...options,
  };

  try {
    validateFile(file, documentOptions);

    const fileName = generateFileName(userId, file.name);
    const filePath = `${documentOptions.folder}/${fileName}`;
    const storageRef = ref(storage, filePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            state: snapshot.state as any,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          };
          
          if (documentOptions.onProgress) {
            documentOptions.onProgress(progress);
          }
        },
        (error) => {
          console.error('Document upload error:', error);
          if (documentOptions.onError) {
            documentOptions.onError(error);
          }
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            if (documentOptions.onComplete) {
              documentOptions.onComplete(downloadURL);
            }
            
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    if (documentOptions.onError) {
      documentOptions.onError(error as Error);
    }
    throw error;
  }
}

// Get file size in human readable format
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Check if file is an image
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

// Create image preview URL
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

// Cleanup preview URL
export function cleanupImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}