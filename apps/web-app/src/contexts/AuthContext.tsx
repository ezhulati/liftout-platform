'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Timestamp } from 'firebase/firestore';
import { User } from '@/types/firebase';

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

  // Load user data from API when session changes
  useEffect(() => {
    const loadUser = async () => {
      if (session?.user?.id && !user) {
        setIsUserLoading(true);
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const userData = await response.json();
            // Transform API response to User type
            const transformedUser: User = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              type: userData.userType as 'individual' | 'company',
              photoURL: userData.profilePhotoUrl || '',
              phone: userData.phone || '',
              location: userData.location || '',
              industry: userData.industry || '',
              companyName: userData.companyName || '',
              position: userData.position || '',
              verified: userData.emailVerified || false,
              status: 'active',
              preferences: {
                notifications: true,
                marketing: true,
                confidentialMode: false,
              },
              profileData: {
                bio: userData.bio,
                website: userData.website,
                linkedin: userData.linkedin,
              },
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
            };
            setUser(transformedUser);
          } else {
            // User profile doesn't exist, create from session data
            const sessionUser = session.user as any;
            const fallbackUser = {
              id: sessionUser.id,
              email: sessionUser.email,
              name: sessionUser.name || `${sessionUser.firstName || ''} ${sessionUser.lastName || ''}`.trim(),
              type: (sessionUser.userType as 'individual' | 'company') || 'individual',
              photoURL: sessionUser.image || '',
              phone: '',
              location: '',
              industry: '',
              companyName: '',
              position: '',
              verified: !!sessionUser.emailVerified,
              status: 'active' as const,
              preferences: {
                notifications: true,
                marketing: true,
                confidentialMode: false,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            } as User;
            setUser(fallbackUser);
          }
        } catch (error) {
          console.error('Error loading user:', error);
          // Fallback to session data
          const sessionUser = session.user as any;
          setUser({
            id: sessionUser.id,
            email: sessionUser.email,
            name: sessionUser.name || '',
            type: (sessionUser.userType as 'individual' | 'company') || 'individual',
            photoURL: sessionUser.image || '',
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
            createdAt: new Date(),
            updatedAt: new Date(),
          } as User);
        } finally {
          setIsUserLoading(false);
        }
      } else if (!session) {
        setUser(null);
      }
    };

    loadUser();
  }, [session, user]);

  // Refresh user data from API
  const refreshUser = async () => {
    if (session?.user?.id) {
      setIsUserLoading(true);
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const userData = await response.json();
          const transformedUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            type: userData.userType as 'individual' | 'company',
            photoURL: userData.profilePhotoUrl || '',
            phone: userData.phone || '',
            location: userData.location || '',
            industry: userData.industry || '',
            companyName: userData.companyName || '',
            position: userData.position || '',
            verified: userData.emailVerified || false,
            status: 'active' as const,
            preferences: {
              notifications: true,
              marketing: true,
              confidentialMode: false,
            },
            profileData: {
              bio: userData.bio,
              website: userData.website,
              linkedin: userData.linkedin,
            },
            createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
            updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
          } as User;
          setUser(transformedUser);
        }
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
        // Note: userType changes would need a separate API endpoint
        // For now, update locally - type is usually set during registration
        setUser({ ...user, type });
      } catch (error) {
        console.error('Error updating user type:', error);
        throw error;
      }
    }
  };

  // Update user profile via API
  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      try {
        const response = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update profile');
        }

        setUser({ ...user, ...data });
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  };

  // User registration - creates user in database
  const signUp = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: 'individual' | 'company';
    companyName?: string;
    industry?: string;
    location?: string;
  }) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  };

  // Google sign-in via NextAuth
  const signInWithGoogle = async () => {
    const { signIn } = await import('next-auth/react');
    return signIn('google', { callbackUrl: '/app/onboarding' });
  };

  // Password reset request
  const sendPasswordReset = async (email: string) => {
    const response = await fetch('/api/auth/password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send reset email');
    }

    return data;
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
