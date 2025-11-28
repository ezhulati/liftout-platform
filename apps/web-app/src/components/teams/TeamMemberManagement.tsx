'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import {
  UsersIcon,
  UserPlusIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { MemberManagement } from './MemberManagement';
import { MemberInvitation } from './MemberInvitation';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: number;
  skills: string[];
  email?: string;
  linkedIn?: string;
  isLead?: boolean;
  joinedDate?: string;
  performance?: {
    rating?: number;
    projects?: number;
    achievements?: string[];
  };
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdBy: string;
  openToLiftout: boolean;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sentAt: Date;
  expiresAt: Date;
  invitedBy: string;
  personalMessage?: string;
  permissions: {
    canEditTeam: boolean;
    canInviteMembers: boolean;
    canViewAnalytics: boolean;
  };
}

interface TeamMemberManagementProps {
  teamId: string;
}

export function TeamMemberManagement({ teamId }: TeamMemberManagementProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Fetch team data
  const { data: team, isLoading, error } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch team');
      }
      const data = await response.json();
      return data.team as Team;
    },
  });

  // Update team members mutation
  const updateTeamMutation = useMutation({
    mutationFn: async (updatedMembers: TeamMember[]) => {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members: updatedMembers }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update team members');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleMembersUpdate = (updatedMembers: TeamMember[]) => {
    updateTeamMutation.mutate(updatedMembers);
  };

  const handleInviteSent = (newInvite: Invitation) => {
    setInvitations(prev => [...prev, newInvite]);
  };

  // Mock invitations for demo
  useEffect(() => {
    if (team) {
      setInvitations([
        {
          id: 'invite_1',
          email: 'sarah.johnson@example.com',
          role: 'Senior UX Designer',
          status: 'pending',
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          invitedBy: user?.id || '',
          personalMessage: 'Excited to have you join our amazing team!',
          permissions: {
            canEditTeam: false,
            canInviteMembers: false,
            canViewAnalytics: true,
          },
        },
        {
          id: 'invite_2',
          email: 'mike.chen@example.com',
          role: 'Product Manager',
          status: 'accepted',
          sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          invitedBy: user?.id || '',
          permissions: {
            canEditTeam: true,
            canInviteMembers: true,
            canViewAnalytics: true,
          },
        },
      ]);
    }
  }, [team, user]);

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="text-center py-12">
        <UsersIcon className="mx-auto h-12 w-12 text-text-tertiary" />
        <h3 className="mt-2 text-sm font-medium text-text-primary">Team not found</h3>
        <p className="mt-1 text-sm text-text-secondary">
          The team you're looking for doesn't exist or you don't have permission to manage it.
        </p>
      </div>
    );
  }

  const isTeamOwner = user?.id === team.createdBy;
  const isTeamLead = team.members.some(member => member.id === user?.id && member.isLead);

  const tabs = [
    {
      name: 'Current Members',
      icon: UsersIcon,
      component: (
        <MemberManagement
          teamId={teamId}
          members={team.members}
          onMembersUpdate={handleMembersUpdate}
          isEditable={isTeamOwner || isTeamLead}
        />
      ),
    },
    {
      name: 'Invitations',
      icon: UserPlusIcon,
      component: (
        <MemberInvitation
          teamId={teamId}
          teamName={team.name}
          existingInvites={invitations}
          onInviteSent={handleInviteSent}
          isTeamLead={isTeamOwner || isTeamLead}
        />
      ),
    },
    {
      name: 'Analytics',
      icon: ChartBarIcon,
      component: <TeamAnalytics team={team} />,
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      component: <TeamMemberSettings team={team} isOwner={isTeamOwner} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Team Overview Card */}
      <div className="card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{team.name}</h2>
              <p className="text-sm text-text-secondary mt-1">
                {team.members.length} members • {team.openToLiftout ? 'Open to liftout' : 'Not available'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isTeamOwner && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
                  <ShieldCheckIcon className="h-3 w-3 mr-1" />
                  Team Owner
                </span>
              )}
              {isTeamLead && !isTeamOwner && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-800">
                  Team Lead
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-navy/10 p-1">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-navy focus:outline-none focus:ring-2 ${
                  selected
                    ? 'bg-bg-surface shadow text-navy'
                    : 'text-navy/60 hover:bg-white/[0.12] hover:text-navy'
                }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, index) => (
            <Tab.Panel
              key={index}
              className="rounded-xl bg-bg-surface p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-navy focus:outline-none focus:ring-2"
            >
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

// Team Analytics Component
function TeamAnalytics({ team }: { team: Team }) {
  const calculateStats = () => {
    const totalExperience = team.members.reduce((sum, member) => sum + member.experience, 0);
    const avgExperience = totalExperience / team.members.length;
    const allSkills = [...new Set(team.members.flatMap(member => member.skills))];
    const avgRating = team.members.reduce((sum, member) =>
      sum + (member.performance?.rating || 0), 0) / team.members.length;
    const totalProjects = team.members.reduce((sum, member) =>
      sum + (member.performance?.projects || 0), 0);

    return {
      totalMembers: team.members.length,
      avgExperience: avgExperience.toFixed(1),
      totalSkills: allSkills.length,
      avgRating: avgRating.toFixed(1),
      totalProjects,
      skillDistribution: allSkills.map(skill => ({
        skill,
        count: team.members.filter(member => member.skills.includes(skill)).length,
      })).sort((a, b) => b.count - a.count),
      experienceDistribution: {
        junior: team.members.filter(member => member.experience < 3).length,
        mid: team.members.filter(member => member.experience >= 3 && member.experience < 7).length,
        senior: team.members.filter(member => member.experience >= 7).length,
      },
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-navy">{stats.totalMembers}</div>
          <div className="text-sm text-text-secondary">Total members</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-success">{stats.avgExperience}</div>
          <div className="text-sm text-text-secondary">Avg experience</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-navy">{stats.totalSkills}</div>
          <div className="text-sm text-text-secondary">Unique skills</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gold-700">{stats.avgRating}</div>
          <div className="text-sm text-text-secondary">Avg rating</div>
        </div>
      </div>

      {/* Skill Distribution */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-medium text-text-primary">Skill distribution</h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            {stats.skillDistribution.slice(0, 10).map(({ skill, count }) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">{skill}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-bg-alt rounded-full h-2">
                    <div
                      className="bg-navy h-2 rounded-full"
                      style={{ width: `${(count / stats.totalMembers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-text-secondary">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Distribution */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-medium text-text-primary">Experience distribution</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-success">{stats.experienceDistribution.junior}</div>
              <div className="text-sm text-text-secondary">Junior (0-3 years)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-navy">{stats.experienceDistribution.mid}</div>
              <div className="text-sm text-text-secondary">Mid (3-7 years)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gold-700">{stats.experienceDistribution.senior}</div>
              <div className="text-sm text-text-secondary">Senior (7+ years)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Team Member Settings Component
function TeamMemberSettings({ team, isOwner }: { team: Team; isOwner: boolean }) {
  const [settings, setSettings] = useState({
    requireApproval: true,
    allowMemberInvites: false,
    showPerformanceRatings: true,
    enableMemberProfiles: true,
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-medium text-text-primary">Member management settings</h3>
          <p className="text-sm text-text-secondary">
            Configure how team members can be managed and what information is visible.
          </p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Require approval for new members</label>
              <p className="text-sm text-text-secondary">New member invitations require team lead approval</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireApproval}
              onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
              disabled={!isOwner}
              className="rounded border-border text-navy focus:ring-navy disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Allow members to invite others</label>
              <p className="text-sm text-text-secondary">Team members can send invitations to potential members</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowMemberInvites}
              onChange={(e) => setSettings({ ...settings, allowMemberInvites: e.target.checked })}
              disabled={!isOwner}
              className="rounded border-border text-navy focus:ring-navy disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Show performance ratings</label>
              <p className="text-sm text-text-secondary">Display member performance ratings in team profile</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showPerformanceRatings}
              onChange={(e) => setSettings({ ...settings, showPerformanceRatings: e.target.checked })}
              disabled={!isOwner}
              className="rounded border-border text-navy focus:ring-navy disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Enable member profiles</label>
              <p className="text-sm text-text-secondary">Allow members to create detailed individual profiles</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableMemberProfiles}
              onChange={(e) => setSettings({ ...settings, enableMemberProfiles: e.target.checked })}
              disabled={!isOwner}
              className="rounded border-border text-navy focus:ring-navy disabled:opacity-50"
            />
          </div>

          {!isOwner && (
            <div className="mt-4 p-4 bg-warning-light border border-warning/30 rounded-md">
              <p className="text-sm text-warning-dark">
                Only team owners can modify these settings. Contact your team owner to request changes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}