import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Migration 001: Add User Types
 * 
 * This migration adds the 'type' field to existing users who don't have it.
 * It defaults users to 'individual' type unless they have company-specific data.
 */

interface MigrationResult {
  success: boolean;
  message: string;
  details: {
    totalUsers: number;
    updatedUsers: number;
    errors: string[];
  };
}

export async function migration001AddUserTypes(): Promise<MigrationResult> {
  const errors: string[] = [];
  let totalUsers = 0;
  let updatedUsers = 0;

  try {
    console.log('Starting Migration 001: Add User Types');
    
    // Get all users
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    totalUsers = snapshot.size;
    
    console.log(`Found ${totalUsers} users to check`);

    // Process each user
    for (const userDoc of snapshot.docs) {
      try {
        const userData = userDoc.data();
        
        // Skip users who already have a type
        if (userData.type) {
          console.log(`User ${userDoc.id} already has type: ${userData.type}`);
          continue;
        }

        // Determine user type based on existing data
        let userType: 'individual' | 'company' = 'individual';
        
        // Check if user appears to be a company user
        if (userData.companyName || 
            userData.industry === 'Technology' && userData.position?.toLowerCase().includes('hr') ||
            userData.position?.toLowerCase().includes('recruiter') ||
            userData.position?.toLowerCase().includes('talent')) {
          userType = 'company';
        }

        // Update the user document
        const userRef = doc(db, 'users', userDoc.id);
        await updateDoc(userRef, {
          type: userType,
          updatedAt: Timestamp.now(),
        });

        updatedUsers++;
        console.log(`Updated user ${userDoc.id} with type: ${userType}`);

      } catch (error) {
        const errorMsg = `Error updating user ${userDoc.id}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const success = errors.length === 0;
    const message = success 
      ? `Migration completed successfully. Updated ${updatedUsers} of ${totalUsers} users.`
      : `Migration completed with ${errors.length} errors. Updated ${updatedUsers} of ${totalUsers} users.`;

    console.log(message);
    return {
      success,
      message,
      details: {
        totalUsers,
        updatedUsers,
        errors,
      },
    };

  } catch (error) {
    const errorMsg = `Migration failed: ${error}`;
    console.error(errorMsg);
    return {
      success: false,
      message: errorMsg,
      details: {
        totalUsers,
        updatedUsers,
        errors: [errorMsg],
      },
    };
  }
}

// Rollback function to remove user types
export async function rollback001AddUserTypes(): Promise<MigrationResult> {
  const errors: string[] = [];
  let totalUsers = 0;
  let updatedUsers = 0;

  try {
    console.log('Starting Rollback 001: Remove User Types');
    
    // Get all users with type field
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(query(usersRef, where('type', '!=', null)));
    totalUsers = snapshot.size;
    
    console.log(`Found ${totalUsers} users with type field to remove`);

    // Process each user
    for (const userDoc of snapshot.docs) {
      try {
        const userRef = doc(db, 'users', userDoc.id);
        
        // Remove the type field by updating without it
        const userData = userDoc.data();
        const { type, ...userDataWithoutType } = userData;
        
        await updateDoc(userRef, {
          ...userDataWithoutType,
          updatedAt: Timestamp.now(),
        });

        updatedUsers++;
        console.log(`Removed type field from user ${userDoc.id}`);

      } catch (error) {
        const errorMsg = `Error updating user ${userDoc.id}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    const success = errors.length === 0;
    const message = success 
      ? `Rollback completed successfully. Updated ${updatedUsers} of ${totalUsers} users.`
      : `Rollback completed with ${errors.length} errors. Updated ${updatedUsers} of ${totalUsers} users.`;

    console.log(message);
    return {
      success,
      message,
      details: {
        totalUsers,
        updatedUsers,
        errors,
      },
    };

  } catch (error) {
    const errorMsg = `Rollback failed: ${error}`;
    console.error(errorMsg);
    return {
      success: false,
      message: errorMsg,
      details: {
        totalUsers,
        updatedUsers,
        errors: [errorMsg],
      },
    };
  }
}