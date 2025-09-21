import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from './firebase';
import { userService } from './firestore';
import { Timestamp } from 'firebase/firestore';
import type { User } from '@/types/firebase';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'individual' | 'company';
  companyName?: string;
  industry?: string;
  location?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  // Sign up with email and password
  async signUp(data: SignUpData): Promise<{ user: FirebaseUser; userData: User }> {
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Update Firebase user profile
      await updateProfile(firebaseUser, {
        displayName: `${data.firstName} ${data.lastName}`,
      });
      
      // Create user document in Firestore
      const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        type: data.userType,
        phone: '',
        location: data.location || '',
        industry: data.industry || '',
        companyName: data.companyName || '',
        position: '',
        verified: false,
        status: 'active',
        preferences: {
          notifications: true,
          marketing: true,
          confidentialMode: false,
        },
      };
      
      await userService.createUser(userData);
      
      // Send email verification
      await sendEmailVerification(firebaseUser);
      
      // Get the complete user data
      const completeUserData = await userService.getUserByEmail(data.email);
      
      return {
        user: firebaseUser,
        userData: completeUserData!,
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with email and password
  async signIn(data: SignInData): Promise<{ user: FirebaseUser; userData: User }> {
    // Handle demo accounts
    if (data.email === 'demo@example.com' && data.password === 'demo123') {
      // Return mock data for Alex Chen (team user)
      const mockFirebaseUser = {
        uid: 'demo@example.com',
        email: 'demo@example.com',
        displayName: 'Alex Chen',
        emailVerified: true
      } as FirebaseUser;

      const mockUserData: User = {
        id: 'demo@example.com',
        email: 'demo@example.com',
        name: 'Alex Chen',
        type: 'individual',
        verified: true,
        status: 'active',
        preferences: {
          notifications: true,
          marketing: false,
          confidentialMode: false,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now()
      };

      return { user: mockFirebaseUser, userData: mockUserData };
    }

    if (data.email === 'company@example.com' && data.password === 'demo123') {
      // Return mock data for Sarah Rodriguez (company user)
      const mockFirebaseUser = {
        uid: 'company@example.com',
        email: 'company@example.com',
        displayName: 'Sarah Rodriguez',
        emailVerified: true
      } as FirebaseUser;

      const mockUserData: User = {
        id: 'company@example.com',
        email: 'company@example.com',
        name: 'Sarah Rodriguez',
        type: 'company',
        companyName: 'TechFlow Solutions',
        position: 'Head of Talent Acquisition',
        industry: 'Technology',
        location: 'San Francisco, CA',
        verified: true,
        status: 'active',
        preferences: {
          notifications: true,
          marketing: true,
          confidentialMode: false,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now()
      };

      return { user: mockFirebaseUser, userData: mockUserData };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userData = await userService.getUserByEmail(data.email);
      
      if (!userData) {
        throw new Error('User data not found. Please contact support.');
      }
      
      // Update last login
      await userService.updateLastLogin(userData.id);
      
      return {
        user: firebaseUser,
        userData,
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<{ user: FirebaseUser; userData: User; isNewUser: boolean }> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      // Check if user exists in Firestore
      let userData = await userService.getUserByEmail(firebaseUser.email!);
      let isNewUser = false;
      
      if (!userData) {
        // Create new user document
        isNewUser = true;
        const newUserData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
          email: firebaseUser.email!,
          name: firebaseUser.displayName || 'Google User',
          type: 'individual', // Default, can be changed later
          photoURL: firebaseUser.photoURL || '',
          phone: '',
          location: '',
          industry: '',
          companyName: '',
          position: '',
          verified: firebaseUser.emailVerified,
          status: 'active',
          preferences: {
            notifications: true,
            marketing: true,
            confidentialMode: false,
          },
        };
        
        await userService.createUser(newUserData);
        userData = await userService.getUserByEmail(firebaseUser.email!);
      } else {
        // Update last login for existing user
        await userService.updateLastLogin(userData.id);
      }
      
      return {
        user: firebaseUser,
        userData: userData!,
        isNewUser,
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update password
  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update user profile
  async updateUserProfile(data: {
    firstName?: string;
    lastName?: string;
    location?: string;
    industry?: string;
    companyName?: string;
    position?: string;
    phone?: string;
  }): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No authenticated user found');
      }

      const userData = await userService.getUserByEmail(firebaseUser.email!);
      if (!userData) {
        throw new Error('User data not found');
      }

      // Update display name in Firebase Auth if name changed
      if (data.firstName || data.lastName) {
        const currentName = userData.name.split(' ');
        const firstName = data.firstName || currentName[0] || '';
        const lastName = data.lastName || currentName[1] || '';
        const newDisplayName = `${firstName} ${lastName}`.trim();
        
        await updateProfile(firebaseUser, {
          displayName: newDisplayName,
        });
        
        data = { ...data, firstName, lastName };
      }

      // Update user document in Firestore
      const updateData: Partial<User> = {};
      
      if (data.firstName && data.lastName) {
        updateData.name = `${data.firstName} ${data.lastName}`;
      }
      if (data.location !== undefined) updateData.location = data.location;
      if (data.industry !== undefined) updateData.industry = data.industry;
      if (data.companyName !== undefined) updateData.companyName = data.companyName;
      if (data.position !== undefined) updateData.position = data.position;
      if (data.phone !== undefined) updateData.phone = data.phone;

      await userService.updateUser(userData.id, updateData);
    } catch (error: any) {
      throw new Error('Failed to update profile. Please try again.');
    }
  }

  // Get current user data
  async getCurrentUserData(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser?.email) {
      return null;
    }

    return userService.getUserByEmail(firebaseUser.email);
  }

  // Check if email is available
  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await userService.getUserByEmail(email);
    return !user;
  }

  // Resend email verification
  async resendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      await sendEmailVerification(user);
    } catch (error: any) {
      throw new Error('Failed to send verification email. Please try again.');
    }
  }

  // Delete account
  async deleteAccount(password: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Get user data to delete from Firestore
      const userData = await userService.getUserByEmail(user.email);
      
      // Delete user document from Firestore
      if (userData) {
        // Here you would also delete related data (teams, applications, etc.)
        // This is a simplified version
        await userService.updateUser(userData.id, { status: 'suspended' });
      }

      // Delete Firebase Auth account
      await user.delete();
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Helper method to get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/cancelled-popup-request':
        return 'Another sign-in popup is already open.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by your browser.';
      case 'auth/requires-recent-login':
        return 'This action requires recent authentication. Please sign in again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export auth state observer
export { onAuthStateChanged } from 'firebase/auth';
export { auth };