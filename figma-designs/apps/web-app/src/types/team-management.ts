import { User } from './firebase';

// Team invitation system
export interface TeamInvitation {
  id: string;
  odId?: string; // Legacy field for backwards compatibility
  teamId: string;
  teamName: string;
  invitedEmail: string;
  invitedBy: string; // user ID of team leader
  inviterName: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedAt: string; // ISO date string
  respondedAt?: string; // ISO date string
  expiresAt: string; // ISO date string
  message?: string; // Optional personal message from inviter
  role: 'member' | 'lead'; // Most invitations will be 'member'
}

// Extended user type with team relationships
export interface UserWithTeam extends User {
  teamId?: string;
  teamRole?: 'leader' | 'member';
  joinedTeamAt?: string; // ISO date string
}

// Team member details
export interface TeamMemberDetails {
  userId: string;
  email: string;
  name: string;
  role: 'leader' | 'member';
  joinedAt: string; // ISO date string
  status: 'active' | 'pending' | 'inactive';
  profilePicture?: string;
  title?: string;
  skills?: string[];
  // Legacy fields for backwards compatibility
  odUserId?: string;
  odEmail?: string;
  odName?: string;
  odRole?: string;
  odJoinedAt?: string;
  odStatus?: string;
  odTitle?: string;
  odSkills?: string[];
}

// Team management operations
export interface TeamManagementData {
  teamId: string;
  teamName: string;
  description: string;
  leader: TeamMemberDetails;
  members: TeamMemberDetails[];
  pendingInvitations: TeamInvitation[];
  teamSize: number;
  maxTeamSize: number;
  isLookingForMembers: boolean;
  requiredSkills?: string[];
}

// Invitation email content
export interface InvitationEmailData {
  teamName: string;
  inviterName: string;
  inviterEmail: string;
  teamDescription: string;
  invitationLink: string;
  expiresIn: string; // "7 days"
  personalMessage?: string;
}