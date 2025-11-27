import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

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

class EmailInvitationService {
  private readonly COLLECTION_NAME = 'team_invitations';
  private readonly EXPIRY_DAYS = 7; // Invitations expire after 7 days

  /**
   * Send a team invitation via email
   */
  async sendInvitation(invitation: Omit<TeamInvitation, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'expiresAt'>): Promise<string> {
    try {
      // Check if invitation already exists for this email and team
      const existingInvitation = await this.getExistingInvitation(invitation.teamId, invitation.inviteeEmail);
      
      if (existingInvitation && existingInvitation.status === 'pending') {
        throw new Error('An invitation for this email address is already pending for this team');
      }

      // Create expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + this.EXPIRY_DAYS);

      // Create invitation document
      const invitationData: Omit<TeamInvitation, 'id'> = {
        ...invitation,
        status: 'pending',
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...invitationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt: expiresAt,
      });

      // Send email notification (in production, this would integrate with an email service)
      await this.sendInvitationEmail(docRef.id, invitationData);

      return docRef.id;
    } catch (error) {
      console.error('Error sending team invitation:', error);
      throw error;
    }
  }

  /**
   * Get existing invitation for email and team
   */
  private async getExistingInvitation(teamId: string, email: string): Promise<TeamInvitation | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('teamId', '==', teamId),
        where('inviteeEmail', '==', email),
        where('status', '==', 'pending')
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as TeamInvitation;
      }

      return null;
    } catch (error) {
      console.error('Error checking existing invitation:', error);
      return null;
    }
  }

  /**
   * Accept a team invitation
   */
  async acceptInvitation(invitationId: string, userEmail: string): Promise<void> {
    try {
      const invitationRef = doc(db, this.COLLECTION_NAME, invitationId);
      const invitationDoc = await getDoc(invitationRef);

      if (!invitationDoc.exists()) {
        throw new Error('Invitation not found');
      }

      const invitation = invitationDoc.data() as TeamInvitation;

      // Validate invitation
      if (invitation.inviteeEmail !== userEmail) {
        throw new Error('Invitation email does not match user email');
      }

      if (invitation.status !== 'pending') {
        throw new Error(`Invitation is ${invitation.status} and cannot be accepted`);
      }

      if (new Date() > invitation.expiresAt) {
        throw new Error('Invitation has expired');
      }

      // Update invitation status
      await updateDoc(invitationRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add user to team (this would integrate with team management service)
      await this.addUserToTeam(invitation.teamId, userEmail, invitation.role);

    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  /**
   * Decline a team invitation
   */
  async declineInvitation(invitationId: string, userEmail: string): Promise<void> {
    try {
      const invitationRef = doc(db, this.COLLECTION_NAME, invitationId);
      const invitationDoc = await getDoc(invitationRef);

      if (!invitationDoc.exists()) {
        throw new Error('Invitation not found');
      }

      const invitation = invitationDoc.data() as TeamInvitation;

      if (invitation.inviteeEmail !== userEmail) {
        throw new Error('Invitation email does not match user email');
      }

      if (invitation.status !== 'pending') {
        throw new Error(`Invitation is ${invitation.status} and cannot be declined`);
      }

      await updateDoc(invitationRef, {
        status: 'declined',
        updatedAt: serverTimestamp(),
      });

    } catch (error) {
      console.error('Error declining invitation:', error);
      throw error;
    }
  }

  /**
   * Revoke a team invitation
   */
  async revokeInvitation(invitationId: string, revokerEmail: string): Promise<void> {
    try {
      const invitationRef = doc(db, this.COLLECTION_NAME, invitationId);
      const invitationDoc = await getDoc(invitationRef);

      if (!invitationDoc.exists()) {
        throw new Error('Invitation not found');
      }

      const invitation = invitationDoc.data() as TeamInvitation;

      if (invitation.inviterEmail !== revokerEmail) {
        throw new Error('Only the inviter can revoke this invitation');
      }

      if (invitation.status !== 'pending') {
        throw new Error(`Invitation is ${invitation.status} and cannot be revoked`);
      }

      await updateDoc(invitationRef, {
        status: 'revoked',
        revokedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

    } catch (error) {
      console.error('Error revoking invitation:', error);
      throw error;
    }
  }

  /**
   * Get all invitations for a team
   */
  async getTeamInvitations(teamId: string): Promise<TeamInvitation[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('teamId', '==', teamId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamInvitation[];

    } catch (error) {
      console.error('Error getting team invitations:', error);
      throw error;
    }
  }

  /**
   * Get invitations for a user email
   */
  async getUserInvitations(email: string): Promise<TeamInvitation[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('inviteeEmail', '==', email),
        where('status', '==', 'pending')
      );

      const querySnapshot = await getDocs(q);
      
      // Filter out expired invitations
      const invitations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamInvitation[];

      return invitations.filter(invitation => new Date() <= invitation.expiresAt);

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
    try {
      const invitationRef = doc(db, this.COLLECTION_NAME, invitationId);
      const invitationDoc = await getDoc(invitationRef);

      if (!invitationDoc.exists()) {
        throw new Error('Invitation not found');
      }

      const invitation = invitationDoc.data() as TeamInvitation;

      if (invitation.status !== 'pending') {
        throw new Error('Can only send reminders for pending invitations');
      }

      if (new Date() > invitation.expiresAt) {
        throw new Error('Cannot send reminder for expired invitation');
      }

      // Send reminder email
      await this.sendReminderEmail(invitationId, invitation);

    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

  /**
   * Cleanup expired invitations
   */
  async cleanupExpiredInvitations(): Promise<number> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('status', '==', 'pending')
      );

      const querySnapshot = await getDocs(q);
      const expiredInvitations = querySnapshot.docs.filter(doc => {
        const invitation = doc.data() as TeamInvitation;
        return new Date() > invitation.expiresAt;
      });

      // Update expired invitations
      const updatePromises = expiredInvitations.map(doc => 
        updateDoc(doc.ref, {
          status: 'expired',
          updatedAt: serverTimestamp(),
        })
      );

      await Promise.all(updatePromises);
      return expiredInvitations.length;

    } catch (error) {
      console.error('Error cleaning up expired invitations:', error);
      throw error;
    }
  }

  /**
   * Send invitation email (placeholder for email service integration)
   */
  private async sendInvitationEmail(invitationId: string, invitation: Omit<TeamInvitation, 'id'>): Promise<void> {
    // In production, this would integrate with an email service like SendGrid, AWS SES, etc.
    console.log(`Sending invitation email to ${invitation.inviteeEmail} for team ${invitation.teamName}`);
    
    // Email template would include:
    // - Team name and inviter information
    // - Invitation message
    // - Accept/Decline links with invitation ID
    // - Expiration date
    // - Link to create account if needed
  }

  /**
   * Send reminder email
   */
  private async sendReminderEmail(invitationId: string, invitation: TeamInvitation): Promise<void> {
    console.log(`Sending reminder email to ${invitation.inviteeEmail} for team ${invitation.teamName}`);
  }

  /**
   * Add user to team (placeholder for team service integration)
   */
  private async addUserToTeam(teamId: string, userEmail: string, role: string): Promise<void> {
    console.log(`Adding user ${userEmail} to team ${teamId} with role ${role}`);
    // This would integrate with the team management service
  }
}

export const emailInvitationService = new EmailInvitationService();