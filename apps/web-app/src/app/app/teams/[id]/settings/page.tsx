'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EyeIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArchiveBoxIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { DeleteTeamModal } from '@/components/teams/DeleteTeamModal';

// Accessible toggle component with 48pt touch target
function Toggle({
  enabled,
  onChange,
  label
}: {
  enabled: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onChange}
      className="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4C1D95] focus:ring-offset-2 min-h-[48px] min-w-[48px] items-center"
      style={{ backgroundColor: enabled ? '#4C1D95' : '#D1D5DB' }}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

interface TeamSettings {
  id: string;
  name: string;
  visibility: 'public' | 'private' | 'anonymous';
  isAnonymous: boolean;
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
      const team = data.team || data;
      return {
        id: team.id,
        name: team.name,
        visibility: team.visibility || 'public',
        isAnonymous: team.isAnonymous ?? false,
        openToLiftout: team.openToLiftout ?? (team.availabilityStatus === 'available'),
        allowMessages: team.allowMessages ?? true,
        requireApproval: team.requireApproval ?? false,
        notifyOnInterest: true,
        notifyOnApplication: true,
        isArchived: team.isArchived ?? false,
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

  const handleVisibilityChange = (visibility: 'public' | 'anonymous' | 'private') => {
    updateSettingsMutation.mutate({
      visibility,
      isAnonymous: visibility === 'anonymous',
    });
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
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 min-h-[48px] -ml-2 px-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-base">Back to team</span>
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Team settings</h1>
        <p className="text-base text-text-secondary mt-1">Manage your team&apos;s visibility and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Visibility Mode */}
        <section className="bg-bg-surface rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">Profile visibility</h2>
            <p className="text-base text-text-secondary mt-1">
              Choose who can discover your team
            </p>
          </div>
          <div className="p-6">
            <fieldset className="space-y-3" role="radiogroup" aria-label="Visibility mode">
              {[
                {
                  value: 'public' as const,
                  title: 'Public',
                  description: 'Visible to all companies. Best for maximum exposure.',
                  icon: GlobeAltIcon,
                },
                {
                  value: 'anonymous' as const,
                  title: 'Anonymous',
                  description: 'Only verified companies see you. Identity hidden until you respond.',
                  icon: UserGroupIcon,
                  badge: 'Recommended',
                },
                {
                  value: 'private' as const,
                  title: 'Private',
                  description: 'Hidden from search. Only team members can view.',
                  icon: LockClosedIcon,
                },
              ].map((option) => {
                const isSelected = settings.visibility === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors min-h-[72px] ${
                      isSelected
                        ? 'border-[#4C1D95] bg-purple-50'
                        : 'border-border hover:border-purple-200 bg-bg-surface'
                    } ${updateSettingsMutation.isPending ? 'opacity-60 cursor-wait' : ''}`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => handleVisibilityChange(option.value)}
                      disabled={updateSettingsMutation.isPending}
                      className="sr-only"
                    />
                    {/* Custom radio indicator */}
                    <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#4C1D95] bg-[#4C1D95]' : 'border-gray-400'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <option.icon className={`h-5 w-5 flex-shrink-0 ${isSelected ? 'text-[#4C1D95]' : 'text-text-tertiary'}`} />
                        <span className="font-bold text-text-primary">{option.title}</span>
                        {option.badge && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-[#4C1D95]/10 text-[#4C1D95] rounded">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-base text-text-secondary mt-1 leading-relaxed">{option.description}</p>
                    </div>
                  </label>
                );
              })}
            </fieldset>

            {/* Contextual info boxes */}
            {settings.visibility === 'anonymous' && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-[#4C1D95] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#4C1D95]">Anonymous mode active</p>
                    <p className="text-base text-purple-700 mt-1 leading-relaxed">
                      Companies see &quot;Anonymous Team&quot; with masked details. Your identity is revealed only when you respond.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {settings.visibility === 'private' && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex gap-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800">Limited discoverability</p>
                    <p className="text-base text-amber-700 mt-1 leading-relaxed">
                      Companies cannot find your team. You won&apos;t receive inbound interest.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Availability & Communication */}
        <section className="bg-bg-surface rounded-xl border border-border">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">Availability</h2>
          </div>
          <div className="divide-y divide-border">
            <div className="px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-text-primary">Open to opportunities</p>
                <p className="text-base text-text-secondary mt-1">Signal that your team is exploring liftout options</p>
              </div>
              <Toggle
                enabled={settings.openToLiftout}
                onChange={() => handleToggle('openToLiftout', !settings.openToLiftout)}
                label="Open to opportunities"
              />
            </div>

            <div className="px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-text-primary">Allow messages</p>
                <p className="text-base text-text-secondary mt-1">Let companies contact your team directly</p>
              </div>
              <Toggle
                enabled={settings.allowMessages}
                onChange={() => handleToggle('allowMessages', !settings.allowMessages)}
                label="Allow messages"
              />
            </div>

            <div className="px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-text-primary">Require member approval</p>
                <p className="text-base text-text-secondary mt-1">New members must be approved by a team lead</p>
              </div>
              <Toggle
                enabled={settings.requireApproval}
                onChange={() => handleToggle('requireApproval', !settings.requireApproval)}
                label="Require member approval"
              />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-bg-surface rounded-xl border border-red-200">
          <div className="px-6 py-5 border-b border-red-200">
            <h2 className="text-lg font-bold text-red-700">Danger zone</h2>
          </div>
          <div className="divide-y divide-red-100">
            <div className="px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-text-primary">Archive team</p>
                <p className="text-base text-text-secondary mt-1">
                  Hide from searches. Can be restored later.
                </p>
              </div>
              <button
                onClick={() => setShowArchiveConfirm(true)}
                className="px-4 py-2 min-h-[48px] text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 font-medium transition-colors flex items-center gap-2"
              >
                <ArchiveBoxIcon className="h-5 w-5" />
                Archive team
              </button>
            </div>

            <div className="px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-text-primary">Delete team</p>
                <p className="text-base text-text-secondary mt-1">
                  Permanently remove team and all data. Cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 min-h-[48px] text-red-700 border border-red-300 rounded-lg hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
              >
                <TrashIcon className="h-5 w-5" />
                Delete team
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl max-w-md w-full p-6 shadow-xl" role="dialog" aria-modal="true">
            <h3 className="text-xl font-bold text-text-primary mb-2">Archive team?</h3>
            <p className="text-base text-text-secondary mb-6 leading-relaxed">
              Your team will be hidden from company searches. You can restore it anytime from settings.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 min-h-[48px] border border-border rounded-lg hover:bg-bg-elevated font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  archiveTeamMutation.mutate();
                  setShowArchiveConfirm(false);
                }}
                className="px-4 py-2 min-h-[48px] bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors"
              >
                Archive team
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
