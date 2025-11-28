'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/types/firebase';
import { userService } from '@/lib/firestore';

interface AuthContextType {
  // Session and user data
  session: any;
  user: User | null;
  userData: User | null; // Backward compatibility alias
  userType: 'individual' | 'company' | null;
  isAuthenticated: boolean;
  
  // Loading states
  loading: boolean; // Backward compatibility alias
  isLoading: boolean;
  isUserLoading: boolean;
  
  // User operations
  refreshUser: () => Promise<void>;
  updateUserType: (type: 'individual' | 'company') => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  signUp: (userData: any) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  sendPasswordReset: (email: string) => Promise<void>;
  
  // Firebase user for backward compatibility
  firebaseUser: any;
  
  // Role-based access
  isIndividual: boolean;
  isCompany: boolean;
  canAccessTeams: boolean;
  canCreateOpportunities: boolean;
  canViewAnalytics: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  // Derived state - use session userType as fallback when Firestore user not loaded
  const isAuthenticated = !!session;
  const isLoading = status === 'loading';
  const userType = user?.type || (session?.user?.userType as 'individual' | 'company') || null;
  const isIndividual = userType === 'individual';
  const isCompany = userType === 'company';

  // Role-based access permissions
  const canAccessTeams = isIndividual;
  const canCreateOpportunities = isCompany;
  const canViewAnalytics = isAuthenticated; // Both types can view analytics

  // Load user data from Firestore when session changes
  useEffect(() => {
    const loadUser = async () => {
      if (session?.user?.email && !user) {
        setIsUserLoading(true);
        try {
          const userData = await userService.getUserByEmail(session.user.email);
          if (userData) {
            setUser(userData);
            // Update last login
            await userService.updateLastLogin(userData.id);
          } else {
            // Create user if doesn't exist
            const newUser = await createUserFromSession(session);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error loading user:', error);
        } finally {
          setIsUserLoading(false);
        }
      } else if (!session) {
        setUser(null);
      }
    };

    loadUser();
  }, [session, user]);

  // Create new user from session data
  const createUserFromSession = async (sessionData: any): Promise<User> => {
    const userData = {
      email: sessionData.user.email,
      name: sessionData.user.name || sessionData.user.firstName + ' ' + sessionData.user.lastName,
      type: (sessionData.user.userType as 'individual' | 'company') || 'individual',
      photoURL: sessionData.user.image || '',
      phone: '',
      location: '',
      industry: '',
      companyName: '',
      position: '',
      verified: false,
      status: 'active' as const,
      preferences: {
        notifications: true,
        marketing: true,
        confidentialMode: false,
      },
    };

    const userId = await userService.createUser(userData);
    const createdUser = await userService.getUserById(userId);
    return createdUser!;
  };

  // Refresh user data from Firestore
  const refreshUser = async () => {
    if (session?.user?.email) {
      setIsUserLoading(true);
      try {
        const userData = await userService.getUserByEmail(session.user.email);
        setUser(userData);
      } catch (error) {
        console.error('Error refreshing user:', error);
      } finally {
        setIsUserLoading(false);
      }
    }
  };

  // Update user type (for onboarding or type changes)
  const updateUserType = async (type: 'individual' | 'company') => {
    if (user) {
      try {
        await userService.updateUser(user.id, { type });
        setUser({ ...user, type });
      } catch (error) {
        console.error('Error updating user type:', error);
        throw error;
      }
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      try {
        await userService.updateUser(user.id, data);
        setUser({ ...user, ...data });
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  };

  // Placeholder authentication methods for backward compatibility
  const signUp = async (userData: any) => {
    throw new Error('signUp method should use NextAuth.js flow');
  };

  const signInWithGoogle = async () => {
    throw new Error('signInWithGoogle method should use NextAuth.js flow');
  };

  const sendPasswordReset = async (email: string) => {
    throw new Error('sendPasswordReset method should use NextAuth.js flow');
  };

  const value: AuthContextType = {
    // Session and user data
    session,
    user,
    userData: user, // Backward compatibility alias
    userType,
    isAuthenticated,
    
    // Loading states
    loading: isLoading, // Backward compatibility alias
    isLoading,
    isUserLoading,
    
    // User operations
    refreshUser,
    updateUserType,
    updateProfile,
    signUp,
    signInWithGoogle,
    sendPasswordReset,
    
    // Firebase user for backward compatibility
    firebaseUser: session?.user || null,
    
    // Role-based access
    isIndividual,
    isCompany,
    canAccessTeams,
    canCreateOpportunities,
    canViewAnalytics,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for role-based access control
export function usePermissions() {
  const { 
    isIndividual, 
    isCompany, 
    canAccessTeams, 
    canCreateOpportunities, 
    canViewAnalytics,
    isAuthenticated 
  } = useAuth();
  
  return {
    isIndividual,
    isCompany,
    canAccessTeams,
    canCreateOpportunities,
    canViewAnalytics,
    isAuthenticated,
    
    // Permission helpers
    requireAuth: () => {
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }
    },
    
    requireIndividual: () => {
      if (!isIndividual) {
        throw new Error('Individual user access required');
      }
    },
    
    requireCompany: () => {
      if (!isCompany) {
        throw new Error('Company user access required');
      }
    },
  };
}