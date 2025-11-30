import { isDemoAccount } from '@/lib/demo-accounts';
import type {
  TeamInvitation,
  TeamMemberDetails,
  TeamManagementData,
} from '@/types/team-management';

// Demo data for Alex Chen's team
const DEMO_TEAM_MANAGEMENT: TeamManagementData = {
  teamId: 'team_demo_001',
  teamName: 'TechFlow Data Science Team',
  description: 'Elite data science team with proven track record in fintech analytics and machine learning solutions.',
  leader: {
    odUserId: 'demo@example.com',
    odEmail: 'demo@example.com',
    odName: 'Alex Chen',
    odRole: 'leader',
    odJoinedAt: new Date(Date.now() - 3.5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    odStatus: 'active',
    odTitle: 'Senior Data Scientist & Team Lead',
    odSkills: ['Machine Learning', 'Python', 'Team Leadership', 'Financial Modeling'],
    userId: 'demo@example.com',
    email: 'demo@example.com',
    name: 'Alex Chen',
    role: 'leader',
    joinedAt: new Date(Date.now() - 3.5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    title: 'Senior Data Scientist & Team Lead',
    skills: ['Machine Learning', 'Python', 'Team Leadership', 'Financial Modeling']
  },
  members: [
    {
      odUserId: 'sarah.kim@techflow.com',
      odEmail: 'sarah.kim@techflow.com',
      odName: 'Sarah Kim',
      odRole: 'member',
      odJoinedAt: new Date(Date.now() - 2.8 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      odStatus: 'active',
      odTitle: 'Data Scientist',
      odSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
      userId: 'sarah.kim@techflow.com',
      email: 'sarah.kim@techflow.com',
      name: 'Sarah Kim',
      role: 'member',
      joinedAt: new Date(Date.now() - 2.8 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      title: 'Data Scientist',
      skills: ['Python', 'SQL', 'Machine Learning', 'Statistics']
    },
    {
      odUserId: 'mike.rodriguez@techflow.com',
      odEmail: 'mike.rodriguez@techflow.com',
      odName: 'Mike Rodriguez',
      odRole: 'member',
      odJoinedAt: new Date(Date.now() - 2.2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      odStatus: 'active',
      odTitle: 'Senior Data Engineer',
      odSkills: ['Python', 'AWS', 'Data Engineering', 'ETL'],
      userId: 'mike.rodriguez@techflow.com',
      email: 'mike.rodriguez@techflow.com',
      name: 'Mike Rodriguez',
      role: 'member',
      joinedAt: new Date(Date.now() - 2.2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      title: 'Senior Data Engineer',
      skills: ['Python', 'AWS', 'Data Engineering', 'ETL']
    },
    {
      odUserId: 'jennifer.liu@techflow.com',
      odEmail: 'jennifer.liu@techflow.com',
      odName: 'Jennifer Liu',
      odRole: 'member',
      odJoinedAt: new Date(Date.now() - 1.5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      odStatus: 'active',
      odTitle: 'ML Engineer',
      odSkills: ['Machine Learning', 'TensorFlow', 'Model Deployment', 'MLOps'],
      userId: 'jennifer.liu@techflow.com',
      email: 'jennifer.liu@techflow.com',
      name: 'Jennifer Liu',
      role: 'member',
      joinedAt: new Date(Date.now() - 1.5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      title: 'ML Engineer',
      skills: ['Machine Learning', 'TensorFlow', 'Model Deployment', 'MLOps']
    }
  ],
  pendingInvitations: [
    {
      id: 'inv_001',
      odId: 'inv_001',
      teamId: 'team_demo_001',
      teamName: 'TechFlow Data Science Team',
      invitedEmail: 'david.park@gmail.com',
      invitedBy: 'demo@example.com',
      inviterName: 'Alex Chen',
      status: 'pending',
      invitedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Hi David! We'd love to have you join our data science team at TechFlow. Your expertise in NLP would be a perfect fit for our upcoming projects.",
      role: 'member'
    }
  ],
  teamSize: 4,
  maxTeamSize: 8,
  isLookingForMembers: true,
  requiredSkills: ['Python', 'Machine Learning', 'Data Analysis']
};

export class TeamManagementService {
  // Get team management data for a user
  async getTeamManagement(userId: string): Promise<TeamManagementData | null> {
    // Return demo data for demo accounts
    if (isDemoAccount(userId) || userId === 'demo@example.com') {
      return DEMO_TEAM_MANAGEMENT;
    }

    try {
      const response = await fetch('/api/teams/my-team');

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to get team management data');
      }

      const result = await response.json();
      return result.team || result.data || null;
    } catch (error) {
      console.error('Error getting team management data:', error);
      return null;
    }
  }

  // Send team invitation
  async inviteToTeam(
    teamId: string,
    invitedEmail: string,
    invitedBy: string,
    inviterName: string,
    message?: string
  ): Promise<string> {
    // For demo accounts, simulate success
    if (isDemoAccount(invitedBy) || invitedBy === 'demo@example.com') {
      console.log(`Demo: Inviting ${invitedEmail} to team ${teamId}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return 'demo_invitation_001';
    }

    try {
      const response = await fetch('/api/teams/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          invitedEmail,
          inviterName,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invitation');
      }

      const result = await response.json();
      return result.invitation?.id || result.data?.id || '';
    } catch (error) {
      console.error('Error sending team invitation:', error);
      throw error;
    }
  }

  // Accept team invitation
  async acceptInvitation(invitationId: string, userId: string): Promise<void> {
    // For demo accounts, simulate success
    if (isDemoAccount(userId) || userId === 'demo@example.com') {
      console.log(`Demo: Accepting invitation ${invitationId}`);
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    try {
      const response = await fetch(`/api/teams/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  // Decline team invitation
  async declineInvitation(invitationId: string): Promise<void> {
    try {
      const response = await fetch(`/api/teams/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline' }),
      });

      if (!response.ok) {
        throw new Error('Failed to decline invitation');
      }
    } catch (error) {
      console.error('Error declining invitation:', error);
      throw error;
    }
  }

  // Leave team
  async leaveTeam(userId: string): Promise<void> {
    // For demo accounts, simulate success
    if (isDemoAccount(userId) || userId === 'demo@example.com') {
      console.log(`Demo: User ${userId} leaving team`);
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    try {
      const response = await fetch('/api/teams/my-team/leave', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to leave team');
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      throw error;
    }
  }

  // Remove team member (leader only)
  async removeMember(teamLeaderId: string, memberUserId: string): Promise<void> {
    // For demo accounts, simulate success
    if (isDemoAccount(teamLeaderId) || teamLeaderId === 'demo@example.com') {
      console.log(`Demo: Removing member ${memberUserId} from team`);
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    try {
      const response = await fetch(`/api/teams/my-team/members/${memberUserId}`, {
        method: 'DELETE',
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

  // Cancel invitation
  async cancelInvitation(invitationId: string, userId: string): Promise<void> {
    // For demo accounts, simulate success
    if (isDemoAccount(userId) || userId === 'demo@example.com') {
      console.log(`Demo: Canceling invitation ${invitationId}`);
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    try {
      const response = await fetch(`/api/teams/invitations/${invitationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel invitation');
      }
    } catch (error) {
      console.error('Error canceling invitation:', error);
      throw error;
    }
  }

  // Get pending invitations for a user
  async getUserInvitations(userEmail: string): Promise<TeamInvitation[]> {
    // For demo accounts, return demo invitations
    if (isDemoAccount(userEmail) || userEmail === 'demo@example.com') {
      return DEMO_TEAM_MANAGEMENT.pendingInvitations;
    }

    try {
      const response = await fetch('/api/teams/invitations');

      if (!response.ok) {
        throw new Error('Failed to get invitations');
      }

      const result = await response.json();
      return result.invitations || result.data?.invitations || [];
    } catch (error) {
      console.error('Error getting user invitations:', error);
      return [];
    }
  }

  // Transfer leadership
  async transferLeadership(currentLeaderId: string, newLeaderId: string): Promise<void> {
    // For demo accounts, simulate success
    if (isDemoAccount(currentLeaderId) || currentLeaderId === 'demo@example.com') {
      console.log(`Demo: Transferring leadership to ${newLeaderId}`);
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    try {
      const response = await fetch('/api/teams/my-team/transfer-leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newLeaderId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to transfer leadership');
      }
    } catch (error) {
      console.error('Error transferring leadership:', error);
      throw error;
    }
  }

  // Update member role
  async updateMemberRole(teamLeaderId: string, memberUserId: string, newRole: string): Promise<void> {
    // For demo accounts, simulate success
    if (isDemoAccount(teamLeaderId) || teamLeaderId === 'demo@example.com') {
      console.log(`Demo: Updating member ${memberUserId} role to ${newRole}`);
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    try {
      const response = await fetch(`/api/teams/my-team/members/${memberUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update member role');
      }
    } catch (error) {
      console.error('Error updating member role:', error);
      throw error;
    }
  }
}

export const teamManagementService = new TeamManagementService();
