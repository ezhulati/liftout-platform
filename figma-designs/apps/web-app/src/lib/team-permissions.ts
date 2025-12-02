// Team role definitions
export type TeamRole = 'leader' | 'admin' | 'member';

// Permission categories
export type Permission =
  // Team management
  | 'team.edit.profile'
  | 'team.edit.settings'
  | 'team.delete'
  | 'team.view.analytics'

  // Member management
  | 'members.invite'
  | 'members.remove'
  | 'members.edit.roles'
  | 'members.view.all'

  // Content management
  | 'content.create'
  | 'content.edit.own'
  | 'content.edit.all'
  | 'content.delete.own'
  | 'content.delete.all'

  // Application management
  | 'applications.view'
  | 'applications.respond'
  | 'applications.manage'

  // Financial and legal
  | 'finance.view'
  | 'finance.manage'
  | 'legal.view'
  | 'legal.manage'

  // Communication
  | 'communication.external'
  | 'communication.internal'

  // Settings
  | 'settings.team'
  | 'settings.privacy'
  | 'settings.notifications';

// Role permission mappings
export const ROLE_PERMISSIONS: Record<TeamRole, Permission[]> = {
  leader: [
    'team.edit.profile', 'team.edit.settings', 'team.delete', 'team.view.analytics',
    'members.invite', 'members.remove', 'members.edit.roles', 'members.view.all',
    'content.create', 'content.edit.own', 'content.edit.all', 'content.delete.own', 'content.delete.all',
    'applications.view', 'applications.respond', 'applications.manage',
    'finance.view', 'finance.manage', 'legal.view', 'legal.manage',
    'communication.external', 'communication.internal',
    'settings.team', 'settings.privacy', 'settings.notifications',
  ],
  admin: [
    'team.edit.profile', 'team.view.analytics',
    'members.invite', 'members.remove', 'members.view.all',
    'content.create', 'content.edit.own', 'content.edit.all', 'content.delete.own',
    'applications.view', 'applications.respond', 'applications.manage',
    'finance.view', 'legal.view',
    'communication.external', 'communication.internal',
    'settings.team', 'settings.notifications',
  ],
  member: [
    'members.view.all',
    'content.create', 'content.edit.own', 'content.delete.own',
    'applications.view',
    'communication.internal',
    'settings.notifications',
  ],
};

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<TeamRole, { title: string; description: string; level: number }> = {
  leader: {
    title: 'Team Leader',
    description: 'Full control over team management, settings, and strategic direction.',
    level: 3,
  },
  admin: {
    title: 'Team Admin',
    description: 'Administrative access to team operations and member management.',
    level: 2,
  },
  member: {
    title: 'Team Member',
    description: 'Standard team member with access to team resources.',
    level: 1,
  },
};

export interface TeamPermissionMember {
  id?: string;
  teamId: string;
  userId: string;
  email: string;
  name: string;
  role: TeamRole;
  joinedAt: Date | string;
  invitedAt?: Date | string;
  invitedBy?: string;
  lastActive?: Date | string;
  isActive: boolean;
  permissions?: Permission[];
}

export interface RoleChangeHistory {
  id?: string;
  teamId: string;
  userId: string;
  changedBy: string;
  previousRole: TeamRole;
  newRole: TeamRole;
  reason?: string;
  changedAt: Date | string;
}

// Demo members data
const DEMO_MEMBERS: TeamPermissionMember[] = [
  {
    id: 'demo-member-001',
    teamId: 'demo-team-001',
    userId: 'demo@example.com',
    email: 'demo@example.com',
    name: 'Alex Chen',
    role: 'leader',
    joinedAt: new Date(Date.now() - 3.5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    permissions: ROLE_PERMISSIONS.leader,
  },
  {
    id: 'demo-member-002',
    teamId: 'demo-team-001',
    userId: 'sarah.kim@techflow.com',
    email: 'sarah.kim@techflow.com',
    name: 'Sarah Kim',
    role: 'member',
    joinedAt: new Date(Date.now() - 2.8 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    permissions: ROLE_PERMISSIONS.member,
  },
];

const isDemoEntity = (id: string): boolean => {
  return id?.includes('demo') || id === 'demo@example.com' || id === 'company@example.com';
};

class TeamPermissionService {
  async hasPermission(teamId: string, userId: string, permission: Permission): Promise<boolean> {
    try {
      const member = await this.getTeamMember(teamId, userId);
      if (!member || !member.isActive) return false;
      return ROLE_PERMISSIONS[member.role].includes(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  async hasAnyPermission(teamId: string, userId: string, permissions: Permission[]): Promise<boolean> {
    try {
      const member = await this.getTeamMember(teamId, userId);
      if (!member || !member.isActive) return false;
      const rolePermissions = ROLE_PERMISSIONS[member.role];
      return permissions.some(p => rolePermissions.includes(p));
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  async getUserPermissions(teamId: string, userId: string): Promise<Permission[]> {
    try {
      const member = await this.getTeamMember(teamId, userId);
      if (!member || !member.isActive) return [];
      return ROLE_PERMISSIONS[member.role];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  async addTeamMember(memberData: Omit<TeamPermissionMember, 'id' | 'joinedAt' | 'isActive'>): Promise<string> {
    if (isDemoEntity(memberData.teamId) || isDemoEntity(memberData.userId)) {
      console.log(`[Demo] Adding member ${memberData.email} to team`);
      return `demo-member-${Date.now()}`;
    }

    try {
      const response = await fetch('/api/teams/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      if (!response.ok) throw new Error('Failed to add team member');
      const result = await response.json();
      return result.memberId || result.data?.memberId || '';
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  async getTeamMember(teamId: string, userId: string): Promise<TeamPermissionMember | null> {
    if (isDemoEntity(teamId) || isDemoEntity(userId)) {
      const member = DEMO_MEMBERS.find(m => m.teamId === teamId && m.userId === userId);
      if (member) return member;
      if (isDemoEntity(userId)) {
        return {
          id: 'demo-member-temp',
          teamId,
          userId,
          email: userId,
          name: 'Demo User',
          role: 'leader',
          joinedAt: new Date().toISOString(),
          isActive: true,
          permissions: ROLE_PERMISSIONS.leader,
        };
      }
      return null;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${userId}`);
      if (!response.ok) return null;
      const result = await response.json();
      const member = result.member || result.data;
      if (!member) return null;
      return { ...member, permissions: ROLE_PERMISSIONS[member.role as TeamRole] };
    } catch (error) {
      console.error('Error getting team member:', error);
      return null;
    }
  }

  async getTeamMembers(teamId: string): Promise<TeamPermissionMember[]> {
    if (isDemoEntity(teamId)) {
      return DEMO_MEMBERS.filter(m => m.teamId === teamId || teamId.includes('demo'));
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/members`);
      if (!response.ok) throw new Error('Failed to get team members');
      const result = await response.json();
      const members = result.members || result.data || [];
      return members.map((m: TeamPermissionMember) => ({
        ...m,
        permissions: ROLE_PERMISSIONS[m.role],
      })).sort((a: TeamPermissionMember, b: TeamPermissionMember) => {
        const levelDiff = ROLE_DESCRIPTIONS[b.role].level - ROLE_DESCRIPTIONS[a.role].level;
        if (levelDiff !== 0) return levelDiff;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error getting team members:', error);
      throw error;
    }
  }

  async changeRole(teamId: string, userId: string, newRole: TeamRole, changedBy: string, reason?: string): Promise<void> {
    if (isDemoEntity(teamId) || isDemoEntity(userId)) {
      console.log(`[Demo] Changing role for ${userId} to ${newRole}`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole, changedBy, reason }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change role');
      }
    } catch (error) {
      console.error('Error changing role:', error);
      throw error;
    }
  }

  async removeTeamMember(teamId: string, userId: string, removedBy: string): Promise<void> {
    if (isDemoEntity(teamId) || isDemoEntity(userId)) {
      console.log(`[Demo] Removing member ${userId} from team`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removedBy }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }

  async getTeamMembersByRole(teamId: string, role: TeamRole): Promise<TeamPermissionMember[]> {
    const members = await this.getTeamMembers(teamId);
    return members.filter(m => m.role === role);
  }

  async getRoleChangeHistory(teamId: string): Promise<RoleChangeHistory[]> {
    if (isDemoEntity(teamId)) {
      return [];
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/role-history`);
      if (!response.ok) return [];
      const result = await response.json();
      return result.history || result.data || [];
    } catch (error) {
      console.error('Error getting role change history:', error);
      return [];
    }
  }

  async getTeamStats(teamId: string): Promise<{ totalMembers: number; membersByRole: Record<TeamRole, number>; activeMembers: number }> {
    try {
      const members = await this.getTeamMembers(teamId);
      const membersByRole: Record<TeamRole, number> = { leader: 0, admin: 0, member: 0 };
      members.forEach(m => membersByRole[m.role]++);
      return {
        totalMembers: members.length,
        membersByRole,
        activeMembers: members.filter(m => m.isActive).length,
      };
    } catch (error) {
      console.error('Error getting team stats:', error);
      throw error;
    }
  }
}

export const teamPermissionService = new TeamPermissionService();
