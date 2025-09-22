'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import IndividualProfile from '@/components/profile/IndividualProfile';
import CompanyProfile from '@/components/profile/CompanyProfile';

export default function ProfilePage() {
  const { user, isIndividual, isCompany, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Required</h3>
        <p className="mt-1 text-sm text-gray-500">Please log in to access your profile.</p>
      </div>
    );
  }

  // Render appropriate profile component based on user type
  if (isIndividual) {
    return <IndividualProfile />;
  } else if (isCompany) {
    return <CompanyProfile />;
  }

  return (
    <div className="text-center py-12">
      <h3 className="mt-2 text-sm font-medium text-gray-900">Profile Setup Required</h3>
      <p className="mt-1 text-sm text-gray-500">Please complete your onboarding to set up your profile.</p>
    </div>
  );
}