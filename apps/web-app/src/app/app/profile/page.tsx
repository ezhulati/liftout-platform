'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import { UserIcon } from '@heroicons/react/24/outline';
import IndividualProfile from '@/components/profile/IndividualProfile';
import CompanyProfile from '@/components/profile/CompanyProfile';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { user, isIndividual, isCompany, isUserLoading } = useAuth();

  // Get user type from session as fallback
  const sessionUser = session?.user as any;
  const userType = user?.type || sessionUser?.userType;

  // Only show loading for initial session check, not Firestore loading
  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-24 w-24 bg-bg-elevated rounded-full"></div>
            <div className="space-y-2">
              <div className="h-8 bg-bg-elevated rounded w-48"></div>
              <div className="h-4 bg-bg-elevated rounded w-64"></div>
            </div>
          </div>
          <div className="h-64 bg-bg-elevated rounded"></div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="card text-center py-12">
          <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <UserIcon className="h-7 w-7 text-text-tertiary" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">Sign in required</h2>
          <p className="text-base text-text-secondary leading-relaxed">Please sign in to access your profile.</p>
        </div>
      </div>
    );
  }

  // Render appropriate profile component based on user type
  if (isCompany || userType === 'company') {
    return <CompanyProfile />;
  }

  // Default to individual profile
  return <IndividualProfile />;
}