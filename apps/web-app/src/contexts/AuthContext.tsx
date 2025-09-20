'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, authService } from '@/lib/auth-firebase';
import { User } from '@/types/firebase';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: 'individual' | 'company';
    companyName?: string;
    industry?: string;
    location?: string;
  }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    location?: string;
    industry?: string;
    companyName?: string;
    position?: string;
    phone?: string;
  }) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        // Get user data from Firestore
        try {
          const userData = await authService.getCurrentUserData();
          setUserData(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user, userData } = await authService.signIn({ email, password });
      setFirebaseUser(user);
      setUserData(userData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: 'individual' | 'company';
    companyName?: string;
    industry?: string;
    location?: string;
  }) => {
    try {
      const { user, userData } = await authService.signUp(data);
      setFirebaseUser(user);
      setUserData(userData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user, userData } = await authService.signInWithGoogle();
      setFirebaseUser(user);
      setUserData(userData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setFirebaseUser(null);
      setUserData(null);
    } catch (error) {
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    await authService.sendPasswordReset(email);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    await authService.updatePassword(currentPassword, newPassword);
  };

  const updateProfile = async (data: {
    firstName?: string;
    lastName?: string;
    location?: string;
    industry?: string;
    companyName?: string;
    position?: string;
    phone?: string;
  }) => {
    await authService.updateUserProfile(data);
    // Refresh user data
    await refreshUserData();
  };

  const deleteAccount = async (password: string) => {
    try {
      await authService.deleteAccount(password);
      setFirebaseUser(null);
      setUserData(null);
    } catch (error) {
      throw error;
    }
  };

  const refreshUserData = async () => {
    if (firebaseUser) {
      try {
        const userData = await authService.getCurrentUserData();
        setUserData(userData);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  const value: AuthContextType = {
    firebaseUser,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    updatePassword,
    updateProfile,
    deleteAccount,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to check if user is authenticated
export function useRequireAuth() {
  const { firebaseUser, userData, loading } = useAuth();
  
  return {
    isAuthenticated: !!firebaseUser && !!userData,
    firebaseUser,
    userData,
    loading,
  };
}

// Hook to check user type
export function useUserType() {
  const { userData } = useAuth();
  
  return {
    userType: userData?.type || null,
    isIndividual: userData?.type === 'individual',
    isCompany: userData?.type === 'company',
  };
}