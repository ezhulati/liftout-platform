import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD_8v3wHgvAWXaDAcWypktYXxMCInInNgM",
  authDomain: "liftout-29094.firebaseapp.com",
  projectId: "liftout-29094",
  storageBucket: "liftout-29094.firebasestorage.app",
  messagingSenderId: "195008193891",
  appId: "1:195008193891:web:332d80caa1ec01ff7f1f56",
  measurementId: "G-RF9ZK8TNSL"
};

// Initialize Firebase app (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only on client side and if supported)
export const analytics = typeof window !== 'undefined' && isSupported() 
  ? getAnalytics(app) 
  : null;

// Development emulator setup (uncomment for local development)
// if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
//   try {
//     connectAuthEmulator(auth, 'http://localhost:9099');
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     connectStorageEmulator(storage, 'localhost', 9199);
//   } catch (error) {
//     console.log('Emulator connection failed:', error);
//   }
// }

export default app;