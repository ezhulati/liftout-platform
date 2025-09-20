import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isDemoAccount } from '@/lib/demo-accounts';
import type { 
  TeamInvitation, 
  TeamMemberDetails, 
  TeamManagementData,
  UserWithTeam 
} from '@/types/team-management';

const INVITATIONS_COLLECTION = 'team_invitations';
const TEAMS_COLLECTION = 'teams';
const USERS_COLLECTION = 'users';

// Demo data for Alex Chen's team
const DEMO_TEAM_MANAGEMENT: TeamManagementData = {
  teamId: 'team_demo_001',
  teamName: 'TechFlow Data Science Team',
  description: 'Elite data science team with proven track record in fintech analytics and machine learning solutions.',
  leader: {
    userId: 'demo@example.com',
    email: 'demo@example.com',
    name: 'Alex Chen',
    role: 'leader',
    joinedAt: Timestamp.fromDate(new Date(Date.now() - 3.5 * 365 * 24 * 60 * 60 * 1000)),
    status: 'active',
    title: 'Senior Data Scientist & Team Lead',
    skills: ['Machine Learning', 'Python', 'Team Leadership', 'Financial Modeling']
  },
  members: [
    {
      userId: 'sarah.kim@techflow.com',
      email: 'sarah.kim@techflow.com',
      name: 'Sarah Kim',
      role: 'member',
      joinedAt: Timestamp.fromDate(new Date(Date.now() - 2.8 * 365 * 24 * 60 * 60 * 1000)),
      status: 'active',
      title: 'Data Scientist',
      skills: ['Python', 'SQL', 'Machine Learning', 'Statistics']
    },
    {
      userId: 'mike.rodriguez@techflow.com',
      email: 'mike.rodriguez@techflow.com',
      name: 'Mike Rodriguez',
      role: 'member',
      joinedAt: Timestamp.fromDate(new Date(Date.now() - 2.2 * 365 * 24 * 60 * 60 * 1000)),
      status: 'active',
      title: 'Senior Data Engineer',
      skills: ['Python', 'AWS', 'Data Engineering', 'ETL']
    },
    {
      userId: 'jennifer.liu@techflow.com',
      email: 'jennifer.liu@techflow.com',
      name: 'Jennifer Liu',
      role: 'member',
      joinedAt: Timestamp.fromDate(new Date(Date.now() - 1.5 * 365 * 24 * 60 * 60 * 1000)),
      status: 'active',
      title: 'ML Engineer',
      skills: ['Machine Learning', 'TensorFlow', 'Model Deployment', 'MLOps']
    }
  ],
  pendingInvitations: [
    {
      id: 'inv_001',
      teamId: 'team_demo_001',
      teamName: 'TechFlow Data Science Team',
      invitedEmail: 'david.park@gmail.com',
      invitedBy: 'demo@example.com',
      inviterName: 'Alex Chen',
      status: 'pending',
      invitedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)),
      message: 'Hi David! We\'d love to have you join our data science team at TechFlow. Your expertise in NLP would be a perfect fit for our upcoming projects.',
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
      // Get user's team
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
      if (!userDoc.exists()) return null;

      const userData = userDoc.data() as UserWithTeam;
      if (!userData.teamId) return null;

      // Get team details
      const teamDoc = await getDoc(doc(db, TEAMS_COLLECTION, userData.teamId));
      if (!teamDoc.exists()) return null;

      const teamData = teamDoc.data();

      // Get all team members
      const membersQuery = query(
        collection(db, USERS_COLLECTION),
        where('teamId', '==', userData.teamId)
      );
      const membersSnapshot = await getDocs(membersQuery);
      
      const members: TeamMemberDetails[] = membersSnapshot.docs.map(doc => {
        const data = doc.data() as UserWithTeam;
        return {
          userId: doc.id,
          email: data.email,
          name: data.name,
          role: data.teamRole || 'member',
          joinedAt: data.joinedTeamAt || Timestamp.now(),
          status: 'active',
          title: data.position || '',
          skills: []
        };
      });

      // Get pending invitations
      const invitationsQuery = query(
        collection(db, INVITATIONS_COLLECTION),
        where('teamId', '==', userData.teamId),
        where('status', '==', 'pending'),
        orderBy('invitedAt', 'desc')
      );
      const invitationsSnapshot = await getDocs(invitationsQuery);
      
      const pendingInvitations: TeamInvitation[] = invitationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TeamInvitation));

      const leader = members.find(m => m.role === 'leader') || members[0];

      return {
        teamId: userData.teamId,
        teamName: teamData.name,
        description: teamData.description,
        leader,
        members: members.filter(m => m.role !== 'leader'),
        pendingInvitations,
        teamSize: members.length,
        maxTeamSize: 8,
        isLookingForMembers: members.length < 8,
        requiredSkills: teamData.skills || []
      };
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
      // Simulate adding to demo data
      console.log(`Demo: Inviting ${invitedEmail} to team ${teamId}`);
      return 'demo_invitation_001';
    }

    try {
      // Check if user is already on a team
      const existingUserQuery = query(
        collection(db, USERS_COLLECTION),
        where('email', '==', invitedEmail),
        where('teamId', '!=', null)
      );
      const existingUserSnapshot = await getDocs(existingUserQuery);
      
      if (!existingUserSnapshot.empty) {
        throw new Error('User is already part of another team');
      }

      // Check if there's already a pending invitation
      const existingInviteQuery = query(
        collection(db, INVITATIONS_COLLECTION),
        where('teamId', '==', teamId),
        where('invitedEmail', '==', invitedEmail),
        where('status', '==', 'pending')
      );
      const existingInviteSnapshot = await getDocs(existingInviteQuery);
      
      if (!existingInviteSnapshot.empty) {
        throw new Error('Invitation already sent to this email');
      }

      // Get team details
      const teamDoc = await getDoc(doc(db, TEAMS_COLLECTION, teamId));
      if (!teamDoc.exists()) {
        throw new Error('Team not found');
      }

      const teamData = teamDoc.data();

      // Create invitation
      const invitation: Omit<TeamInvitation, 'id'> = {
        teamId,
        teamName: teamData.name,
        invitedEmail,
        invitedBy,
        inviterName,
        status: 'pending',
        invitedAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
        message,
        role: 'member'
      };

      const docRef = await addDoc(collection(db, INVITATIONS_COLLECTION), invitation);
      
      // TODO: Send invitation email
      await this.sendInvitationEmail(invitation, docRef.id);

      return docRef.id;
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
      return;
    }

    try {
      const batch = writeBatch(db);

      // Get invitation
      const inviteDoc = await getDoc(doc(db, INVITATIONS_COLLECTION, invitationId));
      if (!inviteDoc.exists()) {
        throw new Error('Invitation not found');
      }

      const invitation = inviteDoc.data() as TeamInvitation;
      
      if (invitation.status !== 'pending') {
        throw new Error('Invitation is no longer valid');
      }

      if (invitation.expiresAt.toDate() < new Date()) {
        throw new Error('Invitation has expired');
      }

      // Check if user is already on a team
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data() as UserWithTeam;
      if (userData.teamId) {
        throw new Error('User is already part of a team. Please leave your current team first.');
      }

      // Update user with team information
      batch.update(doc(db, USERS_COLLECTION, userId), {
        teamId: invitation.teamId,
        teamRole: invitation.role,
        joinedTeamAt: Timestamp.now()
      });

      // Update invitation status
      batch.update(doc(db, INVITATIONS_COLLECTION, invitationId), {
        status: 'accepted',
        respondedAt: Timestamp.now()
      });

      await batch.commit();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  // Decline team invitation
  async declineInvitation(invitationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, INVITATIONS_COLLECTION, invitationId), {
        status: 'declined',
        respondedAt: Timestamp.now()
      });
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
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data() as UserWithTeam;
      if (!userData.teamId) {
        throw new Error('User is not part of any team');
      }

      if (userData.teamRole === 'leader') {
        throw new Error('Team leader cannot leave team. Please transfer leadership first.');
      }

      // Remove user from team
      await updateDoc(doc(db, USERS_COLLECTION, userId), {
        teamId: null,
        teamRole: null,
        joinedTeamAt: null
      });
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
      return;
    }

    try {
      // Verify the requester is the team leader
      const leaderDoc = await getDoc(doc(db, USERS_COLLECTION, teamLeaderId));
      if (!leaderDoc.exists()) {
        throw new Error('Leader not found');
      }

      const leaderData = leaderDoc.data() as UserWithTeam;
      if (leaderData.teamRole !== 'leader') {
        throw new Error('Only team leaders can remove members');
      }

      // Get member
      const memberDoc = await getDoc(doc(db, USERS_COLLECTION, memberUserId));
      if (!memberDoc.exists()) {
        throw new Error('Member not found');
      }

      const memberData = memberDoc.data() as UserWithTeam;
      if (memberData.teamId !== leaderData.teamId) {
        throw new Error('Member is not part of your team');
      }

      // Remove member from team
      await updateDoc(doc(db, USERS_COLLECTION, memberUserId), {
        teamId: null,
        teamRole: null,
        joinedTeamAt: null
      });
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }

  // Cancel invitation
  async cancelInvitation(invitationId: string, userId: string): Promise<void> {
    try {
      const inviteDoc = await getDoc(doc(db, INVITATIONS_COLLECTION, invitationId));
      if (!inviteDoc.exists()) {
        throw new Error('Invitation not found');
      }

      const invitation = inviteDoc.data() as TeamInvitation;
      
      if (invitation.invitedBy !== userId) {
        throw new Error('Only the inviter can cancel this invitation');
      }

      await deleteDoc(doc(db, INVITATIONS_COLLECTION, invitationId));
    } catch (error) {
      console.error('Error canceling invitation:', error);
      throw error;
    }
  }

  // Private method to send invitation email
  private async sendInvitationEmail(invitation: Omit<TeamInvitation, 'id'>, invitationId: string): Promise<void> {
    // TODO: Implement email sending logic
    // This would integrate with your email service (SendGrid, AWS SES, etc.)
    
    const invitationLink = `${window.location.origin}/app/invitations/${invitationId}`;
    
    console.log('Sending invitation email:', {
      to: invitation.invitedEmail,
      subject: `Invitation to join ${invitation.teamName}`,
      invitationLink,
      message: invitation.message
    });
    
    // For now, just log the invitation details
    // In production, this would send an actual email
  }
}

export const teamManagementService = new TeamManagementService();