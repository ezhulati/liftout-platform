'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { applicationService } from '@/lib/services/applicationService';
import { ApplicationsList } from '@/components/applications/ApplicationsList';

export default function ApplicationsPage() {
  const { userData, loading } = useAuth();
  
  const { data: applications, isLoading: isLoadingApplications, refetch } = useQuery({
    queryKey: ['applications', userData?.id, userData?.type],
    queryFn: async () => {
      if (!userData) return [];
      
      console.log('Applications query - userData:', userData);
      console.log('Applications query - userData.id:', userData.id);
      console.log('Applications query - userData.email:', userData.email);
      
      if (userData.type === 'company') {
        return await applicationService.getCompanyApplications(userData.id);
      } else {
        // For teams/individuals, use their user ID as team ID for demo
        // Also try with email for demo accounts
        return await applicationService.getTeamApplications(userData.email || userData.id);
      }
    },
    enabled: !!userData,
  });
  
  if (loading || isLoadingApplications) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const isCompanyUser = userData.type === 'company';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">
          {isCompanyUser ? 'Team Applications' : 'My Applications'}
        </h1>
        <p className="page-subtitle">
          {isCompanyUser 
            ? 'Review teams that have expressed interest in your liftout opportunities'
            : 'Track the status of your team applications to liftout opportunities'
          }
        </p>
      </div>

      {/* Applications list */}
      <ApplicationsList 
        applications={applications || []}
        isCompanyUser={isCompanyUser}
        onRefresh={refetch}
      />
    </div>
  );
}