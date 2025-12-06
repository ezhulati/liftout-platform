'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  ArrowLeftIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface Applicant {
  id: string;
  applicationId: string;
  team: {
    id: string;
    name: string;
    size: number;
    cohesionScore: number;
    industry: string;
  };
  status: 'pending' | 'reviewed' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  appliedAt: string;
  matchScore: number;
  notes?: string;
}

export default function OpportunityApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const opportunityId = params?.id as string;
  const [filter, setFilter] = useState<string>('all');

  const { data, isLoading } = useQuery<{ applicants: Applicant[]; total: number }>({
    queryKey: ['opportunity-applicants', opportunityId, filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const response = await fetch(`/api/opportunities/${opportunityId}/applicants?${params}`);
      if (!response.ok) return { applicants: [], total: 0 };
      return response.json();
    },
    enabled: !!opportunityId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['opportunity-applicants', opportunityId] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const getStatusBadge = (status: Applicant['status']) => {
    const badges = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-700', icon: ClockIcon, label: 'Pending' },
      reviewed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: EyeIcon, label: 'Reviewed' },
      interviewing: { bg: 'bg-gold-100', text: 'text-gold-800', icon: ChatBubbleLeftRightIcon, label: 'Interviewing' },
      offered: { bg: 'bg-success-light', text: 'text-success-dark', icon: CheckCircleIcon, label: 'Offered' },
      rejected: { bg: 'bg-error/10', text: 'text-error', icon: XCircleIcon, label: 'Rejected' },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-500', icon: XCircleIcon, label: 'Withdrawn' },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="h-3 w-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  const applicants = data?.applicants || [];
  const filteredApplicants = filter === 'all' ? applicants : applicants.filter((a) => a.status === filter);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-64"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-bg-elevated rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push(`/app/opportunities/${opportunityId}`)}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to opportunity
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Applicants</h1>
            <p className="text-text-secondary mt-1">Review applications.</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center mr-2">
          <FunnelIcon className="h-4 w-4 text-text-tertiary" />
        </div>
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending' },
          { id: 'reviewed', label: 'Reviewed' },
          { id: 'interviewing', label: 'Interviewing' },
          { id: 'offered', label: 'Offered' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-navy text-white'
                : 'bg-bg-elevated text-text-secondary hover:bg-bg-alt'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Applicants List */}
      {filteredApplicants.length === 0 ? (
        <div className="card text-center py-12">
          <UserGroupIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {filter === 'all' ? 'No applicants yet' : `No ${filter} applicants`}
          </h3>
          <p className="text-text-secondary">
            Teams that apply to this opportunity will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((applicant) => (
            <div key={applicant.id} className="card">
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3
                          onClick={() => router.push(`/app/teams/${applicant.team.id}`)}
                          className="font-semibold text-text-primary cursor-pointer hover:text-navy"
                        >
                          {applicant.team.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <span>{applicant.team.size} members</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <StarIcon className="h-3 w-3 mr-1 text-gold-500" />
                            {applicant.team.cohesionScore}% cohesion
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-tertiary mt-3">
                      <span>Applied {new Date(applicant.appliedAt).toLocaleDateString()}</span>
                      <span className="flex items-center">
                        Match: <span className="font-medium text-navy ml-1">{applicant.matchScore}%</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(applicant.status)}

                    {applicant.status !== 'withdrawn' && applicant.status !== 'rejected' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/app/applications/${applicant.applicationId}`)}
                          className="btn-outline text-xs px-3 py-1"
                        >
                          <EyeIcon className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => router.push(`/app/messages?team=${applicant.team.id}`)}
                          className="btn-outline text-xs px-3 py-1"
                        >
                          <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                          Message
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                {applicant.status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => updateStatusMutation.mutate({ applicationId: applicant.applicationId, status: 'reviewed' })}
                      className="btn-outline text-sm flex-1"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => updateStatusMutation.mutate({ applicationId: applicant.applicationId, status: 'interviewing' })}
                      className="btn-primary text-sm flex-1"
                    >
                      Move to Interview
                    </button>
                    <button
                      onClick={() => updateStatusMutation.mutate({ applicationId: applicant.applicationId, status: 'rejected' })}
                      className="btn-outline text-error border-error hover:bg-error/10 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
