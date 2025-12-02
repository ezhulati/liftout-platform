export interface TeamInvitation {
  id?: string;
  teamId: string;
  teamName: string;
  inviterEmail: string;
  inviterName: string;
  inviteeEmail: string;
  role: 'member' | 'admin' | 'leader';
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'revoked';
  message?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  revokedAt?: Date;
}

export interface InvitationSummary {
  teamId: string;
  pending: number;
  accepted: number;
  declined: number;
  expired: number;
  revoked: number;
  total: number;
}

// Demo invitation data
const DEMO_INVITATIONS: TeamInvitation[] = [
  {
    id: 'demo-invite-001',
    teamId: 'demo-team-001',
    teamName: 'TechFlow Data Science Team',
    inviterEmail: 'demo@example.com',
    inviterName: 'Alex Chen',
    inviteeEmail: 'david.park@gmail.com',
    role: 'member',
    status: 'pending',
    message: "Hi David! We'd love to have you join our data science team.",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

class EmailInvitationService {
  private readonly EXPIRY_DAYS = 7;

  /**
   * Check if this is a demo-related invitation
   */
  private isDemoInvitation(teamId: string, inviterEmail: string): boolean {
    return teamId.startsWith('demo-team-') ||
           teamId.includes('demo') ||
           inviterEmail === 'demo@example.com' ||
           inviterEmail === 'company@example.com';
  }

  /**
   * Send a team invitation via email
   */
  async sendInvitation(invitation: Omit<TeamInvitation, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'expiresAt'>): Promise<string> {
    // Handle demo invitations
    if (this.isDemoInvitation(invitation.teamId, invitation.inviterEmail)) {
      const demoId = `demo-invite-${Date.now()}`;
      console.log(`[Demo] Sending invitation to ${invitation.inviteeEmail} for team ${invitation.teamName}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return demoId;
    }

    try {
      const response = await fetch('/api/teams/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invitation),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invitation');
      }

      const result = await response.json();
      return result.invitationId || result.data?.invitationId || '';
    } catch (error) {
      console.error('Error sending team invitation:', error);
      throw error;
    }
  }

  /**
   * Accept a team invitation
   */
  async acceptInvitation(invitationId: string, userEmail: string): Promise<void> {
    // Handle demo invitations
    if (invitationId.startsWith('demo-')) {
      console.log(`[Demo] Accepting invitation ${invitationId}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    try {
      const response = await fetch(`/api/teams/invitations/${invitationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept', userEmail }),
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

  /**
   * Decline a team invitation
   */
  async declineInvitation(invitationId: string, userEmail: string): Promise<void> {
    // Handle demo invitations
    if (invitationId.startsWith('demo-')) {
      console.log(`[Demo] Declining invitation ${invitationId}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    try {
      const response = await fetch(`/api/teams/invitations/${invitationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline', userEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to decline invitation');
      }
    } catch (error) {
      console.error('Error declining invitation:', error);
      throw error;
    }
  }

  /**
   * Revoke a team invitation
   */
  async revokeInvitation(invitationId: string, revokerEmail: string): Promise<void> {
    // Handle demo invitations
    if (invitationId.startsWith('demo-')) {
      console.log(`[Demo] Revoking invitation ${invitationId}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    try {
      const response = await fetch(`/api/teams/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revokerEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to revoke invitation');
      }
    } catch (error) {
      console.error('Error revoking invitation:', error);
      throw error;
    }
  }

  /**
   * Get all invitations for a team
   */
  async getTeamInvitations(teamId: string): Promise<TeamInvitation[]> {
    // Handle demo teams
    if (teamId.startsWith('demo-') || teamId.includes('demo')) {
      return DEMO_INVITATIONS.filter(inv => inv.teamId === teamId || teamId.includes('demo'));
    }

    try {
      const response = await fetch(`/api/teams/invitations?teamId=${teamId}`);

      if (!response.ok) {
        throw new Error('Failed to get team invitations');
      }

      const result = await response.json();
      return (result.invitations || result.data?.invitations || []).map(this.parseInvitation);
    } catch (error) {
      console.error('Error getting team invitations:', error);
      throw error;
    }
  }

  /**
   * Get invitations for a user email
   */
  async getUserInvitations(email: string): Promise<TeamInvitation[]> {
    // Handle demo users
    if (email === 'demo@example.com' || email === 'company@example.com') {
      return DEMO_INVITATIONS.filter(inv =>
        inv.inviteeEmail === email &&
        inv.status === 'pending' &&
        new Date() <= inv.expiresAt
      );
    }

    try {
      const response = await fetch('/api/teams/invitations');

      if (!response.ok) {
        throw new Error('Failed to get user invitations');
      }

      const result = await response.json();
      const invitations = (result.invitations || result.data?.invitations || []).map(this.parseInvitation);
      return invitations.filter((inv: TeamInvitation) => new Date() <= inv.expiresAt);
    } catch (error) {
      console.error('Error getting user invitations:', error);
      throw error;
    }
  }

  /**
   * Get invitation summary for a team
   */
  async getInvitationSummary(teamId: string): Promise<InvitationSummary> {
    try {
      const invitations = await this.getTeamInvitations(teamId);

      const summary: InvitationSummary = {
        teamId,
        pending: 0,
        accepted: 0,
        declined: 0,
        expired: 0,
        revoked: 0,
        total: invitations.length
      };

      invitations.forEach(invitation => {
        if (invitation.status === 'pending' && new Date() > invitation.expiresAt) {
          summary.expired++;
        } else {
          summary[invitation.status]++;
        }
      });

      return summary;
    } catch (error) {
      console.error('Error getting invitation summary:', error);
      throw error;
    }
  }

  /**
   * Send reminder for pending invitations
   */
  async sendReminder(invitationId: string): Promise<void> {
    // Handle demo invitations
    if (invitationId.startsWith('demo-')) {
      console.log(`[Demo] Sending reminder for invitation ${invitationId}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    try {
      const response = await fetch(`/api/teams/invitations/${invitationId}/reminder`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send reminder');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

  /**
   * Parse invitation from API response
   */
  private parseInvitation(inv: Record<string, unknown>): TeamInvitation {
    return {
      ...inv,
      expiresAt: new Date(inv.expiresAt as string),
      createdAt: new Date(inv.createdAt as string),
      updatedAt: new Date(inv.updatedAt as string),
      acceptedAt: inv.acceptedAt ? new Date(inv.acceptedAt as string) : undefined,
      revokedAt: inv.revokedAt ? new Date(inv.revokedAt as string) : undefined,
    } as TeamInvitation;
  }
}

export const emailInvitationService = new EmailInvitationService();
