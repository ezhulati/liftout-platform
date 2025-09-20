'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'individual' | 'company';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredUserType, 
  redirectTo = '/auth/signin' 
}: ProtectedRouteProps) {
  const { firebaseUser, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!firebaseUser || !userData) {
        router.push(redirectTo);
        return;
      }

      if (requiredUserType && userData.type !== requiredUserType) {
        // Redirect to appropriate dashboard based on user type
        if (userData.type === 'company') {
          router.push('/app/dashboard');
        } else {
          router.push('/app/dashboard');
        }
        return;
      }
    }
  }, [firebaseUser, userData, loading, router, requiredUserType, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!firebaseUser || !userData) {
    return null;
  }

  if (requiredUserType && userData.type !== requiredUserType) {
    return null;
  }

  return <>{children}</>;
}

// Hook to redirect authenticated users away from auth pages
export function useRedirectIfAuthenticated() {
  const { firebaseUser, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && firebaseUser && userData) {
      router.push('/app/dashboard');
    }
  }, [firebaseUser, userData, loading, router]);

  return { loading, isAuthenticated: !!firebaseUser && !!userData };
}