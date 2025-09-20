import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side only)
if (getApps().length === 0) {
  const projectId = 'liftout-29094';
  
  // For development, we'll use the Firebase emulator or service account
  if (process.env.NODE_ENV === 'development') {
    // Use emulator for development
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    
    initializeApp({
      projectId,
    });
  } else {
    // For production, use service account key
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required in production');
    }
    
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    
    initializeApp({
      credential: cert(serviceAccount),
      projectId,
    });
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

export { FieldValue } from 'firebase-admin/firestore';