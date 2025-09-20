'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { opportunityApi } from '@/lib/api';
import { applicationService } from '@/lib/services/applicationService';
import { toast } from 'react-hot-toast';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function ApplyToOpportunityPage() {
  const params = useParams();
  const router = useRouter();
  const { userData } = useAuth();
  const opportunityId = params.id as string;

  const [formData, setFormData] = useState({
    coverLetter: '',
    teamMotivation: '',
    availabilityTimeline: '',
    compensationMin: '',
    compensationMax: '',
    compensationCurrency: 'USD',
    compensationNegotiable: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Get opportunity details
  const { data: opportunity, isLoading: isLoadingOpportunity } = useQuery({
    queryKey: ['opportunity', opportunityId],
    queryFn: async () => {
      const response = await opportunityApi.getOpportunityById(opportunityId);
      return response.success ? response.data : null;
    },
  });

  // Check if team has already applied
  useEffect(() => {
    const checkIfApplied = async () => {
      if (userData && opportunityId) {
        try {
          // For demo purposes, assume user's team ID is their user ID
          const teamId = userData.id;
          const applied = await applicationService.hasTeamApplied(teamId, opportunityId);
          setHasApplied(applied);
        } catch (error) {
          console.error('Error checking application status:', error);
        }
      }
    };

    checkIfApplied();
  }, [userData, opportunityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData || !opportunity) {
      toast.error('Unable to submit application');
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        opportunityId,
        teamId: userData.id, // For demo purposes, use user ID as team ID
        coverLetter: formData.coverLetter,
        teamMotivation: formData.teamMotivation,
        availabilityTimeline: formData.availabilityTimeline,
        compensationExpectations: formData.compensationMin ? {
          min: parseFloat(formData.compensationMin),
          max: parseFloat(formData.compensationMax) || parseFloat(formData.compensationMin),
          currency: formData.compensationCurrency,
          negotiable: formData.compensationNegotiable,
        } : undefined,
      };

      await applicationService.createApplication(applicationData, userData.id);
      toast.success('Application submitted successfully!');
      router.push('/app/applications');
    } catch (error) {
      toast.error('Failed to submit application');
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingOpportunity) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Opportunity not found</h3>
        <p className="mt-1 text-sm text-gray-500">The opportunity you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (userData?.type !== 'individual') {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Restricted</h3>
        <p className="mt-1 text-sm text-gray-500">Only team members can apply to opportunities.</p>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Application Already Submitted</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your team has already applied to this opportunity. Check your applications for status updates.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/app/applications')}
            className="btn-primary"
          >
            View My Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Apply to Opportunity</h1>
        <p className="page-subtitle">
          Submit your team's application for this liftout opportunity
        </p>
      </div>

      {/* Opportunity summary */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Opportunity Details</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{opportunity.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{opportunity.company?.name}</p>
              <p className="text-gray-700 mb-4">{opportunity.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>
                    {opportunity.compensation?.currency} {opportunity.compensation?.min?.toLocaleString()} - {opportunity.compensation?.max?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{opportunity.commitment?.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Application Details</h2>
        </div>
        
        <div className="px-6 py-6 space-y-6">
          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter *
            </label>
            <textarea
              id="coverLetter"
              rows={6}
              required
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              className="input-field"
              placeholder="Introduce your team and explain why you're interested in this opportunity..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Tell the company about your team's background, relevant experience, and why you're excited about this opportunity.
            </p>
          </div>

          {/* Team Motivation */}
          <div>
            <label htmlFor="teamMotivation" className="block text-sm font-medium text-gray-700 mb-2">
              Team Motivation & Goals *
            </label>
            <textarea
              id="teamMotivation"
              rows={4}
              required
              value={formData.teamMotivation}
              onChange={(e) => setFormData({ ...formData, teamMotivation: e.target.value })}
              className="input-field"
              placeholder="What motivates your team to pursue this liftout opportunity?"
            />
            <p className="mt-1 text-xs text-gray-500">
              Explain what your team hopes to achieve and why you're looking to make this move together.
            </p>
          </div>

          {/* Availability Timeline */}
          <div>
            <label htmlFor="availabilityTimeline" className="block text-sm font-medium text-gray-700 mb-2">
              Availability Timeline *
            </label>
            <textarea
              id="availabilityTimeline"
              rows={3}
              required
              value={formData.availabilityTimeline}
              onChange={(e) => setFormData({ ...formData, availabilityTimeline: e.target.value })}
              className="input-field"
              placeholder="When would your team be available to start?"
            />
            <p className="mt-1 text-xs text-gray-500">
              Include any notice periods, project commitments, or other timing considerations.
            </p>
          </div>

          {/* Compensation Expectations */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Compensation Expectations (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="compensationMin" className="block text-xs font-medium text-gray-600 mb-1">
                  Minimum per person
                </label>
                <input
                  type="number"
                  id="compensationMin"
                  value={formData.compensationMin}
                  onChange={(e) => setFormData({ ...formData, compensationMin: e.target.value })}
                  className="input-field"
                  placeholder="150000"
                />
              </div>
              
              <div>
                <label htmlFor="compensationMax" className="block text-xs font-medium text-gray-600 mb-1">
                  Preferred per person
                </label>
                <input
                  type="number"
                  id="compensationMax"
                  value={formData.compensationMax}
                  onChange={(e) => setFormData({ ...formData, compensationMax: e.target.value })}
                  className="input-field"
                  placeholder="200000"
                />
              </div>
              
              <div>
                <label htmlFor="compensationCurrency" className="block text-xs font-medium text-gray-600 mb-1">
                  Currency
                </label>
                <select
                  id="compensationCurrency"
                  value={formData.compensationCurrency}
                  onChange={(e) => setFormData({ ...formData, compensationCurrency: e.target.value })}
                  className="input-field"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            
            <div className="mt-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.compensationNegotiable}
                  onChange={(e) => setFormData({ ...formData, compensationNegotiable: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Open to negotiation based on total package and benefits
                </span>
              </label>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}