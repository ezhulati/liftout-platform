'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArchiveBoxIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { DeleteTeamModal } from '@/components/teams/DeleteTeamModal';

interface TeamSettings {
  id: string;
  name: string;
  visibility: 'public' | 'private' | 'unlisted';
  openToLiftout: boolean;
  allowMessages: boolean;
  requireApproval: boolean;
  notifyOnInterest: boolean;
  notifyOnApplication: boolean;
  isArchived: boolean;
}

export default function TeamSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const teamId = params?.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const { data: settings, isLoading } = useQuery<TeamSettings>({
    queryKey: ['team-settings', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) throw new Error('Failed to fetch team');
      const data = await response.json();
      return {
        id: data.team.id,
        name: data.team.name,
        visibility: data.team.visibility || 'public',
        openToLiftout: data.team.openToLiftout ?? true,
        allowMessages: data.team.allowMessages ?? true,
        requireApproval: data.team.requireApproval ?? false,
        notifyOnInterest: true,
        notifyOnApplication: true,
        isArchived: data.team.isArchived ?? false,
      };
    },
    enabled: !!teamId,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<TeamSettings>) => {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Settings updated');
      queryClient.invalidateQueries({ queryKey: ['team-settings', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  const archiveTeamMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/teams/${teamId}/archive`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to archive team');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Team archived');
      router.push('/app/teams');
    },
    onError: () => {
      toast.error('Failed to archive team');
    },
  });

  const handleToggle = (key: keyof TeamSettings, value: boolean) => {
    updateSettingsMutation.mutate({ [key]: value });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-64"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-bg-elevated rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="card text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <p className="text-text-secondary">Team not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push(`/app/teams/${teamId}`)}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to team
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Team settings</h1>
        <p className="text-text-secondary mt-1">Configure team preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Visibility Settings */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium text-text-primary flex items-center">
              <EyeIcon className="h-5 w-5 mr-2" />
              Visibility
            </h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Open to opportunities</p>
                <p className="text-sm text-text-secondary">Show that your team is looking for liftout opportunities</p>
              </div>
              <button
                onClick={() => handleToggle('openToLiftout', !settings.openToLiftout)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 ${
                  settings.openToLiftout ? 'bg-navy' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.openToLiftout ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Allow messages</p>
                <p className="text-sm text-text-secondary">Let companies send messages to your team</p>
              </div>
              <button
                onClick={() => handleToggle('allowMessages', !settings.allowMessages)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 ${
                  settings.allowMessages ? 'bg-navy' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.allowMessages ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium text-text-primary flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Privacy
            </h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Require approval for new members</p>
                <p className="text-sm text-text-secondary">New members must be approved by a team lead</p>
              </div>
              <button
                onClick={() => handleToggle('requireApproval', !settings.requireApproval)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 ${
                  settings.requireApproval ? 'bg-navy' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.requireApproval ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-error/20">
          <div className="px-6 py-4 border-b border-error/20">
            <h2 className="text-lg font-medium text-error flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              Danger Zone
            </h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            {/* Archive Team */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Archive team</p>
                <p className="text-sm text-text-secondary">
                  Hide your team from searches. You can unarchive later.
                </p>
              </div>
              <button
                onClick={() => setShowArchiveConfirm(true)}
                className="btn-outline text-gold-600 border-gold-600 hover:bg-gold-50 flex items-center"
              >
                <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                Archive
              </button>
            </div>

            {/* Delete Team */}
            <div className="flex items-center justify-between pt-4 border-t border-error/20">
              <div>
                <p className="font-medium text-text-primary">Delete team</p>
                <p className="text-sm text-text-secondary">
                  Permanently delete this team and all its data
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-outline text-error border-error hover:bg-error/10 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-surface rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-text-primary mb-2">Archive team?</h3>
            <p className="text-text-secondary mb-6">
              This will hide your team from company searches. You can unarchive at any time from this settings page.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  archiveTeamMutation.mutate();
                  setShowArchiveConfirm(false);
                }}
                className="btn-primary bg-gold-600 hover:bg-gold-700"
              >
                Archive Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteTeamModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        teamId={teamId}
        teamName={settings.name}
      />
    </div>
  );
}
