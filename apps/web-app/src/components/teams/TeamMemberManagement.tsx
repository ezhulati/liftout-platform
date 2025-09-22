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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="text-center py-12">
        <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Team not found</h3>
        <p className="mt-1 text-sm text-gray-500">
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
              <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {team.members.length} members • {team.openToLiftout ? 'Open to liftout' : 'Not available'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isTeamOwner && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <ShieldCheckIcon className="h-3 w-3 mr-1" />
                  Team Owner
                </span>
              )}
              {isTeamLead && !isTeamOwner && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Team Lead
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
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
              className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
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
          <div className="text-2xl font-bold text-primary-600">{stats.totalMembers}</div>
          <div className="text-sm text-gray-600">Total Members</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.avgExperience}</div>
          <div className="text-sm text-gray-600">Avg Experience</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalSkills}</div>
          <div className="text-sm text-gray-600">Unique Skills</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.avgRating}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
      </div>

      {/* Skill Distribution */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Skill Distribution</h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            {stats.skillDistribution.slice(0, 10).map(({ skill, count }) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{skill}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalMembers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Distribution */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Experience Distribution</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{stats.experienceDistribution.junior}</div>
              <div className="text-sm text-gray-600">Junior (0-3 years)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{stats.experienceDistribution.mid}</div>
              <div className="text-sm text-gray-600">Mid (3-7 years)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{stats.experienceDistribution.senior}</div>
              <div className="text-sm text-gray-600">Senior (7+ years)</div>
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
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Member Management Settings</h3>
          <p className="text-sm text-gray-500">
            Configure how team members can be managed and what information is visible.
          </p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Require approval for new members</label>
              <p className="text-sm text-gray-500">New member invitations require team lead approval</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireApproval}
              onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
              disabled={!isOwner}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Allow members to invite others</label>
              <p className="text-sm text-gray-500">Team members can send invitations to potential members</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowMemberInvites}
              onChange={(e) => setSettings({ ...settings, allowMemberInvites: e.target.checked })}
              disabled={!isOwner}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Show performance ratings</label>
              <p className="text-sm text-gray-500">Display member performance ratings in team profile</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showPerformanceRatings}
              onChange={(e) => setSettings({ ...settings, showPerformanceRatings: e.target.checked })}
              disabled={!isOwner}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Enable member profiles</label>
              <p className="text-sm text-gray-500">Allow members to create detailed individual profiles</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableMemberProfiles}
              onChange={(e) => setSettings({ ...settings, enableMemberProfiles: e.target.checked })}
              disabled={!isOwner}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
            />
          </div>

          {!isOwner && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Only team owners can modify these settings. Contact your team owner to request changes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}