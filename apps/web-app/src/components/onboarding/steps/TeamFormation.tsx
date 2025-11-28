'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

const createTeamSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  yearsWorking: z.number().min(1, 'Teams should have worked together for at least 1 year'),
  size: z.number().min(2, 'Minimum team size is 2').max(50, 'Maximum team size is 50'),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

interface TeamFormationProps {
  onComplete: () => void;
  onSkip?: () => void;
}

type FormationMode = 'choose' | 'create' | 'join';

interface InvitedMember {
  email: string;
  status: 'pending' | 'sent';
}

const industries = [
  'Financial Services',
  'Investment Banking',
  'Private Equity',
  'Management Consulting',
  'Healthcare Technology',
  'Biotechnology',
  'Enterprise Software',
  'Fintech',
  'Legal Services',
  'Advertising & Marketing',
  'Other',
];

export function TeamFormation({ onComplete, onSkip }: TeamFormationProps) {
  const [mode, setMode] = useState<FormationMode>('choose');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      yearsWorking: 2,
      size: 5,
    },
  });

  const handleInviteMember = () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (invitedMembers.some(m => m.email === email)) {
      toast.error('This email has already been invited');
      return;
    }

    setInvitedMembers(prev => [...prev, { email, status: 'pending' }]);
    setInviteEmail('');

    // Simulate sending invitation
    setTimeout(() => {
      setInvitedMembers(prev =>
        prev.map(m => m.email === email ? { ...m, status: 'sent' } : m)
      );
    }, 1000);
  };

  const removeInvite = (email: string) => {
    setInvitedMembers(prev => prev.filter(m => m.email !== email));
  };

  const onCreateTeam = async (data: CreateTeamFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Team data:', data, 'Invited members:', invitedMembers);
      toast.success('Team created successfully! Invitations sent to team members.');
      onComplete();
    } catch (error) {
      toast.error('Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a team invite code');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Successfully joined the team!');
      onComplete();
    } catch (error) {
      toast.error('Invalid invite code');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample teams for search
  const sampleTeams = [
    { id: '1', name: 'Quantum Analytics', industry: 'Fintech', members: 6, openInvite: true },
    { id: '2', name: 'HealthTech Pioneers', industry: 'Healthcare', members: 8, openInvite: false },
    { id: '3', name: 'Enterprise Solutions', industry: 'Software', members: 12, openInvite: true },
  ];

  const filteredTeams = searchQuery
    ? sampleTeams.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.industry.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (mode === 'choose') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <UserGroupIcon className="mx-auto h-12 w-12 text-navy" />
          <h3 className="mt-2 text-lg font-bold text-text-primary">
            Team formation
          </h3>
          <p className="mt-1 text-base text-text-secondary">
            Create a new team or join an existing one to start exploring liftout opportunities together.
          </p>
        </div>

        <div className="space-y-4">
          {/* Create Team Option */}
          <button
            onClick={() => setMode('create')}
            className="w-full p-6 border-2 border-border rounded-xl hover:border-navy transition-colors text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center group-hover:bg-navy-100 transition-colors">
                <PlusIcon className="h-6 w-6 text-navy" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-text-primary">Create a new team</h4>
                <p className="text-base text-text-secondary mt-1">
                  Start a team profile and invite colleagues you've worked with
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-navy bg-navy-50 px-2 py-1 rounded">
                    Team lead role
                  </span>
                  <span className="text-xs font-bold text-text-tertiary bg-bg-alt px-2 py-1 rounded">
                    Invite members
                  </span>
                </div>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-text-tertiary group-hover:text-navy transition-colors mt-2" />
            </div>
          </button>

          {/* Join Team Option */}
          <button
            onClick={() => setMode('join')}
            className="w-full p-6 border-2 border-border rounded-xl hover:border-navy transition-colors text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <MagnifyingGlassIcon className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-text-primary">Join an existing team</h4>
                <p className="text-base text-text-secondary mt-1">
                  Use an invite code or find a team you've been invited to
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-success bg-success-light px-2 py-1 rounded">
                    Team member role
                  </span>
                  <span className="text-xs font-bold text-text-tertiary bg-bg-alt px-2 py-1 rounded">
                    Accept invitation
                  </span>
                </div>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-text-tertiary group-hover:text-navy transition-colors mt-2" />
            </div>
          </button>
        </div>

        {onSkip && (
          <div className="pt-6 border-t border-border">
            <ButtonGroup>
              <TextLink onClick={onSkip}>
                Skip for now (continue as individual)
              </TextLink>
            </ButtonGroup>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <PlusIcon className="mx-auto h-12 w-12 text-navy" />
          <h3 className="mt-2 text-lg font-bold text-text-primary">
            Create your team
          </h3>
          <p className="mt-1 text-base text-text-secondary">
            Set up your team profile and invite members you've worked with.
          </p>
        </div>

        <form onSubmit={handleSubmit(onCreateTeam)} className="space-y-8">
          {/* Team Details */}
          <div className="space-y-5">
            <h4 className="text-base font-bold text-text-primary flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-text-tertiary" />
              Team details
            </h4>

            <FormField label="Team name" name="teamName" required error={errors.teamName?.message}>
              <input
                {...register('teamName')}
                type="text"
                className="input-field"
                placeholder="e.g., Alpha Analytics Team"
              />
            </FormField>

            <FormField label="Description" name="description" required error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Describe your team's expertise, achievements, and what makes you work well together..."
              />
            </FormField>

            <FormField label="Industry" name="industry" required error={errors.industry?.message}>
              <select {...register('industry')} className="input-field">
                <option value="">Select an industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Years working together" name="yearsWorking" required error={errors.yearsWorking?.message}>
                <input
                  {...register('yearsWorking', { valueAsNumber: true })}
                  type="number"
                  min={1}
                  className="input-field"
                />
              </FormField>

              <FormField label="Team size" name="size" required error={errors.size?.message}>
                <input
                  {...register('size', { valueAsNumber: true })}
                  type="number"
                  min={2}
                  max={50}
                  className="input-field"
                />
              </FormField>
            </div>
          </div>

          {/* Invite Members */}
          <div className="space-y-5">
            <h4 className="text-base font-bold text-text-primary flex items-center">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-text-tertiary" />
              Invite team members
            </h4>
            <p className="text-sm text-text-tertiary">
              Send email invitations to colleagues who will be part of your team.
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleInviteMember())}
                className="input-field flex-1"
                placeholder="colleague@company.com"
              />
              <button
                type="button"
                onClick={handleInviteMember}
                className="btn-outline min-h-12"
              >
                Invite
              </button>
            </div>

            {invitedMembers.length > 0 && (
              <div className="space-y-2">
                {invitedMembers.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center justify-between p-3 bg-bg-alt rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <EnvelopeIcon className="h-5 w-5 text-text-tertiary" />
                      <span className="text-sm text-text-primary">{member.email}</span>
                      {member.status === 'sent' ? (
                        <span className="text-xs font-bold text-success bg-success-light px-2 py-0.5 rounded">
                          Invitation sent
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-navy bg-navy-50 px-2 py-0.5 rounded">
                          Sending...
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInvite(member.email)}
                      className="p-2 text-text-tertiary hover:text-error transition-colors min-h-10 min-w-10"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="pt-6 border-t border-border">
            <ButtonGroup>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary min-h-12"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <div className="loading-spinner mr-2" />
                    Creating team...
                  </span>
                ) : (
                  'Create team'
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="text-link min-h-12"
                disabled={isSubmitting}
              >
                Back
              </button>
            </ButtonGroup>
          </div>
        </form>
      </div>
    );
  }

  // Join mode
  return (
    <div className="space-y-8">
      <div className="text-center">
        <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-navy" />
        <h3 className="mt-2 text-lg font-bold text-text-primary">
          Join a team
        </h3>
        <p className="mt-1 text-base text-text-secondary">
          Enter an invite code or search for teams you've been invited to.
        </p>
      </div>

      <div className="space-y-8">
        {/* Join with Code */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <ClipboardDocumentIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Join with invite code
          </h4>
          <p className="text-sm text-text-tertiary">
            Enter the invite code you received from your team lead.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="input-field flex-1 font-mono tracking-wider"
              placeholder="XXXX-XXXX-XXXX"
              maxLength={14}
            />
            <button
              onClick={handleJoinTeam}
              disabled={isSubmitting || !joinCode.trim()}
              className="btn-primary min-h-12 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="loading-spinner mr-2" />
                  Joining...
                </span>
              ) : (
                'Join'
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-bg-surface text-text-tertiary">or</span>
          </div>
        </div>

        {/* Search for Teams */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Find your team
          </h4>
          <p className="text-sm text-text-tertiary">
            Search for teams that have invited you or are open for new members.
          </p>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by team name or industry..."
            />
          </div>

          {filteredTeams.length > 0 && (
            <div className="space-y-3">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-4 bg-bg-alt rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{team.name}</p>
                      <p className="text-sm text-text-tertiary">
                        {team.industry} • {team.members} members
                      </p>
                    </div>
                  </div>
                  {team.openInvite ? (
                    <button className="btn-outline min-h-12 text-sm">
                      Request to join
                    </button>
                  ) : (
                    <span className="text-sm text-text-tertiary">Invite only</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {searchQuery && filteredTeams.length === 0 && (
            <div className="text-center py-8 text-text-tertiary">
              <UserGroupIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No teams found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-6 border-t border-border">
        <ButtonGroup>
          <button
            onClick={() => setMode('choose')}
            className="text-link min-h-12"
          >
            Back
          </button>
        </ButtonGroup>
      </div>
    </div>
  );
}
