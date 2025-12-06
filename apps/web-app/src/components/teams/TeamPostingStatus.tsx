'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  GlobeAltIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface PostingRequirement {
  id: string;
  label: string;
  description: string;
  met: boolean;
  current?: number;
  required?: number;
  details?: string;
  priority: number;
}

interface PostingRequirementsData {
  teamId: string;
  teamName: string;
  postingStatus: 'draft' | 'ready' | 'posted' | 'unposted';
  canPost: boolean;
  progress: {
    met: number;
    total: number;
    percent: number;
  };
  requirements: PostingRequirement[];
  nextStep: string;
}

interface TeamStatusData {
  teamId: string;
  teamName: string;
  postingStatus: 'draft' | 'ready' | 'posted' | 'unposted';
  postedAt: string | null;
  unpostedAt: string | null;
  availabilityStatus: string;
  visibility: string;
  memberCount: number;
  isMember: boolean;
  isLeadOrAdmin: boolean;
  canPost: boolean;
  canUnpost: boolean;
  statusMessage: string;
  statusColor: string;
}

interface TeamPostingStatusProps {
  teamId: string;
  isTeamOwner: boolean;
}

export function TeamPostingStatus({ teamId, isTeamOwner }: TeamPostingStatusProps) {
  const queryClient = useQueryClient();
  const [showRequirements, setShowRequirements] = useState(false);

  // Fetch team status
  const { data: statusData, isLoading: statusLoading } = useQuery<TeamStatusData>({
    queryKey: ['team-status', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}/status`);
      if (!response.ok) throw new Error('Failed to fetch team status');
      return response.json();
    },
    enabled: !!teamId && isTeamOwner,
  });

  // Fetch posting requirements
  const { data: requirementsData, isLoading: requirementsLoading } = useQuery<PostingRequirementsData>({
    queryKey: ['team-requirements', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}/posting-requirements`);
      if (!response.ok) throw new Error('Failed to fetch requirements');
      return response.json();
    },
    enabled: !!teamId && isTeamOwner && showRequirements,
  });

  // Post team mutation
  const postTeamMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/teams/${teamId}/post`, {
        method: 'POST',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post team');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Team posted! Your team is now visible to companies.');
      queryClient.invalidateQueries({ queryKey: ['team-status', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
      // Show requirements if posting failed
      setShowRequirements(true);
    },
  });

  // Unpost team mutation
  const unpostTeamMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/teams/${teamId}/unpost`, {
        method: 'POST',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unpost team');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Team unposted. Your team is now hidden from companies.');
      queryClient.invalidateQueries({ queryKey: ['team-status', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (!isTeamOwner) return null;
  if (statusLoading) {
    return (
      <div className="card animate-pulse">
        <div className="px-6 py-4">
          <div className="h-4 bg-bg-elevated rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-bg-elevated rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const status = statusData?.postingStatus || 'draft';
  const isPosted = status === 'posted';
  const canPost = statusData?.isLeadOrAdmin && (status === 'draft' || status === 'ready' || status === 'unposted');
  const canUnpost = statusData?.canUnpost;

  const getStatusBadge = () => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
            Draft
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Ready to Post
          </span>
        );
      case 'posted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-light text-success-dark">
            <GlobeAltIcon className="h-4 w-4 mr-1" />
            Posted - Visible to Companies
          </span>
        );
      case 'unposted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-100 text-gold-800">
            <EyeSlashIcon className="h-4 w-4 mr-1" />
            Unposted - Hidden
          </span>
        );
    }
  };

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-medium text-text-primary flex items-center">
          <GlobeAltIcon className="h-5 w-5 mr-2" />
          Team Posting Status
        </h2>
      </div>
      <div className="px-6 py-4 space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Current Status</span>
          {getStatusBadge()}
        </div>

        {/* Status Message */}
        <p className="text-sm text-text-secondary">
          {statusData?.statusMessage}
        </p>

        {/* Posted/Unposted timestamps */}
        {statusData?.postedAt && (
          <p className="text-xs text-text-tertiary">
            Posted on {new Date(statusData.postedAt).toLocaleDateString()}
          </p>
        )}
        {statusData?.unpostedAt && status === 'unposted' && (
          <p className="text-xs text-text-tertiary">
            Unposted on {new Date(statusData.unpostedAt).toLocaleDateString()}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {canPost && (
            <button
              onClick={() => postTeamMutation.mutate()}
              disabled={postTeamMutation.isPending}
              className="btn-primary flex items-center min-h-10"
            >
              {postTeamMutation.isPending ? (
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <GlobeAltIcon className="h-4 w-4 mr-2" />
              )}
              {status === 'unposted' ? 'Re-post Team' : 'Post Team'}
            </button>
          )}

          {canUnpost && (
            <button
              onClick={() => unpostTeamMutation.mutate()}
              disabled={unpostTeamMutation.isPending}
              className="btn-outline flex items-center min-h-10"
            >
              {unpostTeamMutation.isPending ? (
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <EyeSlashIcon className="h-4 w-4 mr-2" />
              )}
              Unpost Team
            </button>
          )}

          {!isPosted && (
            <button
              onClick={() => setShowRequirements(!showRequirements)}
              className="btn-outline flex items-center min-h-10"
            >
              {showRequirements ? 'Hide Requirements' : 'View Requirements'}
            </button>
          )}
        </div>

        {/* Requirements List */}
        {showRequirements && requirementsData && (
          <div className="mt-4 p-4 bg-bg-alt rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-primary">Posting Requirements</h3>
              <span className="text-sm text-text-secondary">
                {requirementsData.progress.met}/{requirementsData.progress.total} complete
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-border rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all ${
                  requirementsData.canPost ? 'bg-success' : 'bg-navy'
                }`}
                style={{ width: `${requirementsData.progress.percent}%` }}
              />
            </div>

            {/* Requirements list */}
            <ul className="space-y-2">
              {requirementsData.requirements.map((req) => (
                <li key={req.id} className="flex items-start space-x-2">
                  {req.met ? (
                    <CheckCircleIcon className="h-5 w-5 text-success flex-shrink-0" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 text-gold-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm ${req.met ? 'text-text-secondary' : 'text-text-primary font-medium'}`}>
                      {req.label}
                    </p>
                    <p className="text-xs text-text-tertiary">{req.details}</p>
                  </div>
                </li>
              ))}
            </ul>

            {!requirementsData.canPost && (
              <p className="mt-3 text-sm text-gold-600">
                Next step: {requirementsData.nextStep}
              </p>
            )}
          </div>
        )}

        {requirementsLoading && showRequirements && (
          <div className="mt-4 p-4 bg-bg-alt rounded-lg animate-pulse">
            <div className="h-4 bg-bg-elevated rounded w-1/2 mb-3"></div>
            <div className="h-2 bg-bg-elevated rounded w-full mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-bg-elevated rounded w-3/4"></div>
              <div className="h-4 bg-bg-elevated rounded w-2/3"></div>
              <div className="h-4 bg-bg-elevated rounded w-4/5"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
