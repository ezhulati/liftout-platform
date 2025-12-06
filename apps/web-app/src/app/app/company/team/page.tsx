'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  UsersIcon,
  PlusIcon,
  TrashIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface CompanyMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'recruiter' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
}

export default function CompanyTeamPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'recruiter' | 'viewer'>('recruiter');

  const { data, isLoading } = useQuery<{ members: CompanyMember[] }>({
    queryKey: ['company-team'],
    queryFn: async () => {
      const response = await fetch('/api/company/team');
      if (!response.ok) {
        return { members: [] };
      }
      return response.json();
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await fetch('/api/company/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      if (!response.ok) throw new Error('Failed to invite');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Invitation sent');
      queryClient.invalidateQueries({ queryKey: ['company-team'] });
      setShowInviteForm(false);
      setInviteEmail('');
    },
    onError: () => {
      toast.error('Failed to send invitation');
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await fetch(`/api/company/team/${memberId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Member removed');
      queryClient.invalidateQueries({ queryKey: ['company-team'] });
    },
    onError: () => {
      toast.error('Failed to remove member');
    },
  });

  const getRoleBadge = (role: CompanyMember['role']) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-navy-50 text-navy">
            <ShieldCheckIcon className="h-3 w-3 mr-1" />
            Admin
          </span>
        );
      case 'recruiter':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Recruiter
          </span>
        );
      case 'viewer':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Viewer
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-64"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-bg-elevated rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const members = data?.members || [];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/app/company')}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to company
        </button>
        <div className="flex items-center justify-between">
          <div className="page-header">
            <h1 className="page-title">Team</h1>
            <p className="page-subtitle">Manage your hiring team.</p>
          </div>
          {!showInviteForm && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Invite Member
            </button>
          )}
        </div>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="card mb-6">
          <div className="px-6 py-4">
            <h3 className="font-medium text-text-primary mb-4">Invite Team Member</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="input-field w-full"
                  placeholder="colleague@company.com"
                />
              </div>
              <div className="w-40">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                  className="input-field w-full"
                >
                  <option value="viewer">Viewer</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => inviteMutation.mutate({ email: inviteEmail, role: inviteRole })}
                disabled={!inviteEmail}
                className="btn-primary"
              >
                Send Invitation
              </button>
              <button
                onClick={() => setShowInviteForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      {members.length === 0 ? (
        <div className="card text-center py-12">
          <UsersIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No team members yet</h3>
          <p className="text-text-secondary">
            Invite colleagues to help manage your company&apos;s presence
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="card">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-bg-elevated flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-text-tertiary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{member.name || member.email}</p>
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                      <EnvelopeIcon className="h-3 w-3" />
                      {member.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getRoleBadge(member.role)}
                  {member.status === 'pending' && (
                    <span className="text-xs text-gold-600">Pending</span>
                  )}
                  <button
                    onClick={() => removeMutation.mutate(member.id)}
                    className="p-2 text-text-tertiary hover:text-error rounded hover:bg-error/10"
                    title="Remove"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
