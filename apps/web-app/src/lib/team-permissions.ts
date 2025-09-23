import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs, 
  getDoc,
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

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
    // Full access to everything
    'team.edit.profile',
    'team.edit.settings',
    'team.delete',
    'team.view.analytics',
    'members.invite',
    'members.remove',
    'members.edit.roles',
    'members.view.all',
    'content.create',
    'content.edit.own',
    'content.edit.all',
    'content.delete.own',
    'content.delete.all',
    'applications.view',
    'applications.respond',
    'applications.manage',
    'finance.view',
    'finance.manage',
    'legal.view',
    'legal.manage',
    'communication.external',
    'communication.internal',
    'settings.team',
    'settings.privacy',
    'settings.notifications',
  ],
  
  admin: [
    // Administrative access
    'team.edit.profile',
    'team.view.analytics',
    'members.invite',
    'members.remove',
    'members.view.all',
    'content.create',
    'content.edit.own',
    'content.edit.all',
    'content.delete.own',
    'applications.view',
    'applications.respond',
    'applications.manage',
    'finance.view',
    'legal.view',
    'communication.external',
    'communication.internal',
    'settings.team',
    'settings.notifications',
  ],
  
  member: [
    // Basic member access
    'members.view.all',
    'content.create',
    'content.edit.own',
    'content.delete.own',
    'applications.view',
    'communication.internal',
    'settings.notifications',
  ],
};

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<TeamRole, { title: string; description: string; level: number }> = {
  leader: {
    title: 'Team Leader',
    description: 'Full control over team management, settings, and strategic direction. Can manage all aspects of the team.',
    level: 3,
  },
  admin: {
    title: 'Team Admin',
    description: 'Administrative access to team operations, member management, and content oversight.',
    level: 2,
  },
  member: {
    title: 'Team Member',
    description: 'Standard team member with access to team resources and ability to contribute to projects.',
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
  joinedAt: Date;
  invitedAt?: Date;
  invitedBy?: string;
  lastActive?: Date;
  isActive: boolean;
  permissions?: Permission[]; // Computed field
}

export interface RoleChangeHistory {
  id?: string;
  teamId: string;
  userId: string;
  changedBy: string;
  previousRole: TeamRole;
  newRole: TeamRole;
  reason?: string;
  changedAt: Date;
}

class TeamPermissionService {
  private readonly MEMBERS_COLLECTION = 'team_members';
  private readonly ROLE_HISTORY_COLLECTION = 'team_role_history';

  /**
   * Check if a user has a specific permission for a team
   */
  async hasPermission(teamId: string, userId: string, permission: Permission): Promise<boolean> {
    try {
      const member = await this.getTeamMember(teamId, userId);
      if (!member || !member.isActive) {
        return false;
      }

      const rolePermissions = ROLE_PERMISSIONS[member.role];
      return rolePermissions.includes(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Check if a user has any of the specified permissions
   */
  async hasAnyPermission(teamId: string, userId: string, permissions: Permission[]): Promise<boolean> {
    try {
      const member = await this.getTeamMember(teamId, userId);
      if (!member || !member.isActive) {
        return false;
      }

      const rolePermissions = ROLE_PERMISSIONS[member.role];
      return permissions.some(permission => rolePermissions.includes(permission));
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Get all permissions for a user in a team
   */
  async getUserPermissions(teamId: string, userId: string): Promise<Permission[]> {
    try {
      const member = await this.getTeamMember(teamId, userId);
      if (!member || !member.isActive) {
        return [];
      }

      return ROLE_PERMISSIONS[member.role];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  /**
   * Add a team member
   */
  async addTeamMember(memberData: Omit<TeamPermissionMember, 'id' | 'joinedAt' | 'isActive'>): Promise<string> {
    try {
      // Check if member already exists
      const existingMember = await this.getTeamMember(memberData.teamId, memberData.userId);
      if (existingMember) {
        throw new Error('User is already a member of this team');
      }

      const member: Omit<TeamPermissionMember, 'id'> = {
        ...memberData,
        joinedAt: new Date(),
        isActive: true,
      };

      const docRef = await addDoc(collection(db, this.MEMBERS_COLLECTION), {
        ...member,
        joinedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  /**
   * Get a team member by team and user ID
   */
  async getTeamMember(teamId: string, userId: string): Promise<TeamPermissionMember | null> {
    try {
      const q = query(
        collection(db, this.MEMBERS_COLLECTION),
        where('teamId', '==', teamId),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data() as TeamPermissionMember;
      
      return {
        id: doc.id,
        ...data,
        permissions: ROLE_PERMISSIONS[data.role],
      };
    } catch (error) {
      console.error('Error getting team member:', error);
      return null;
    }
  }

  /**
   * Get all members of a team
   */
  async getTeamMembers(teamId: string): Promise<TeamPermissionMember[]> {
    try {
      const q = query(
        collection(db, this.MEMBERS_COLLECTION),
        where('teamId', '==', teamId),
        where('isActive', '==', true)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as TeamPermissionMember;
        return {
          id: doc.id,
          ...data,
          permissions: ROLE_PERMISSIONS[data.role],
        };
      }).sort((a, b) => {
        // Sort by role level (leader > admin > member), then by name
        const levelDiff = ROLE_DESCRIPTIONS[b.role].level - ROLE_DESCRIPTIONS[a.role].level;
        if (levelDiff !== 0) return levelDiff;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error getting team members:', error);
      throw error;
    }
  }

  /**
   * Change a team member's role
   */
  async changeRole(
    teamId: string, 
    userId: string, 
    newRole: TeamRole, 
    changedBy: string, 
    reason?: string
  ): Promise<void> {
    try {
      // Get current member data
      const member = await this.getTeamMember(teamId, userId);
      if (!member) {
        throw new Error('Team member not found');
      }

      if (member.role === newRole) {
        throw new Error('User already has this role');
      }

      // Check if the person making the change has permission
      const canChangeRoles = await this.hasPermission(teamId, changedBy, 'members.edit.roles');
      if (!canChangeRoles) {
        throw new Error('You do not have permission to change roles');
      }

      // Prevent members from promoting themselves to leader/admin
      if (userId === changedBy && (newRole === 'leader' || newRole === 'admin')) {
        throw new Error('You cannot promote yourself to a higher role');
      }

      const previousRole = member.role;

      // Update member role
      const memberRef = doc(db, this.MEMBERS_COLLECTION, member.id!);
      await updateDoc(memberRef, {
        role: newRole,
        lastActive: serverTimestamp(),
      });

      // Record role change history
      await this.recordRoleChange(teamId, userId, changedBy, previousRole, newRole, reason);

    } catch (error) {
      console.error('Error changing role:', error);
      throw error;
    }
  }

  /**
   * Remove a team member
   */
  async removeTeamMember(teamId: string, userId: string, removedBy: string): Promise<void> {
    try {
      // Check if the person removing has permission
      const canRemove = await this.hasPermission(teamId, removedBy, 'members.remove');
      if (!canRemove) {
        throw new Error('You do not have permission to remove members');
      }

      // Prevent removing themselves if they're the only leader
      if (userId === removedBy) {
        const leaders = await this.getTeamMembersByRole(teamId, 'leader');
        if (leaders.length === 1 && leaders[0].userId === userId) {
          throw new Error('You cannot remove yourself as the only team leader');
        }
      }

      const member = await this.getTeamMember(teamId, userId);
      if (!member) {
        throw new Error('Team member not found');
      }

      // Soft delete - mark as inactive
      const memberRef = doc(db, this.MEMBERS_COLLECTION, member.id!);
      await updateDoc(memberRef, {
        isActive: false,
        removedAt: serverTimestamp(),
        removedBy: removedBy,
      });

    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }

  /**
   * Get team members by role
   */
  async getTeamMembersByRole(teamId: string, role: TeamRole): Promise<TeamPermissionMember[]> {
    try {
      const q = query(
        collection(db, this.MEMBERS_COLLECTION),
        where('teamId', '==', teamId),
        where('role', '==', role),
        where('isActive', '==', true)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as TeamPermissionMember;
        return {
          id: doc.id,
          ...data,
          permissions: ROLE_PERMISSIONS[data.role],
        };
      });
    } catch (error) {
      console.error('Error getting team members by role:', error);
      throw error;
    }
  }

  /**
   * Get role change history for a team
   */
  async getRoleChangeHistory(teamId: string): Promise<RoleChangeHistory[]> {
    try {
      const q = query(
        collection(db, this.ROLE_HISTORY_COLLECTION),
        where('teamId', '==', teamId)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RoleChangeHistory[];
    } catch (error) {
      console.error('Error getting role change history:', error);
      throw error;
    }
  }

  /**
   * Record role change in history
   */
  private async recordRoleChange(
    teamId: string,
    userId: string,
    changedBy: string,
    previousRole: TeamRole,
    newRole: TeamRole,
    reason?: string
  ): Promise<void> {
    try {
      const historyEntry: Omit<RoleChangeHistory, 'id'> = {
        teamId,
        userId,
        changedBy,
        previousRole,
        newRole,
        reason,
        changedAt: new Date(),
      };

      await addDoc(collection(db, this.ROLE_HISTORY_COLLECTION), {
        ...historyEntry,
        changedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error recording role change:', error);
      // Don't throw - this is audit logging
    }
  }

  /**
   * Get team statistics
   */
  async getTeamStats(teamId: string): Promise<{
    totalMembers: number;
    membersByRole: Record<TeamRole, number>;
    activeMembers: number;
  }> {
    try {
      const members = await this.getTeamMembers(teamId);
      
      const membersByRole: Record<TeamRole, number> = {
        leader: 0,
        admin: 0,
        member: 0,
      };

      members.forEach(member => {
        membersByRole[member.role]++;
      });

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