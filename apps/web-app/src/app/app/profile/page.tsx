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
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-text-primary">Authentication Required</h3>
        <p className="mt-1 text-sm text-text-tertiary">Please log in to access your profile.</p>
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
      <h3 className="mt-2 text-sm font-medium text-text-primary">Profile Setup Required</h3>
      <p className="mt-1 text-sm text-text-tertiary">Please complete your onboarding to set up your profile.</p>
    </div>
  );
}