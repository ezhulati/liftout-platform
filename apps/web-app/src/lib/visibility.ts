/**
 * Team Visibility Enforcement Library
 *
 * This module provides robust visibility controls for team profiles.
 *
 * Visibility modes:
 * - PUBLIC: Visible to everyone, fully identifiable
 * - ANONYMOUS: Visible to verified companies only, identity masked until team responds
 * - PRIVATE: Only visible to team members
 *
 * Features:
 * - Verified company check for anonymous mode
 * - Data masking for anonymous teams
 * - Blocked company filtering
 * - NDA acceptance tracking for conversations
 */

import { prisma } from '@/lib/prisma';
import { TeamVisibility } from '@prisma/client';

export interface VisibilityCheckResult {
  canView: boolean;
  showAnonymous: boolean;
  reason?: string;
}

export interface TeamMemberData {
  id: string;
  userId: string;
  name: string;
  email?: string;
  role: string;
  title?: string;
  bio?: string;
  photoUrl?: string;
  yearsExperience?: number;
  isLead: boolean;
  [key: string]: unknown;
}

export interface TeamData {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  location?: string;
  createdBy: string;
  visibility: TeamVisibility;
  isAnonymous: boolean;
  blockedCompanies?: string[];
  members: TeamMemberData[];
  [key: string]: unknown;
}

/**
 * Check if a user is a member of a team
 */
export async function isTeamMember(teamId: string, userId: string): Promise<boolean> {
  const member = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      status: 'active',
    },
  });
  return !!member;
}

/**
 * Check if a user belongs to a verified company
 */
export async function isVerifiedCompanyUser(userId: string): Promise<{ isVerified: boolean; companyId?: string }> {
  const companyMembership = await prisma.companyUser.findFirst({
    where: {
      userId,
      company: {
        verificationStatus: 'verified',
      },
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          verificationStatus: true,
        },
      },
    },
  });

  if (companyMembership?.company) {
    return { isVerified: true, companyId: companyMembership.company.id };
  }

  return { isVerified: false };
}

/**
 * Check if a team has blocked a specific company
 */
export function isCompanyBlocked(team: { blockedCompanies?: unknown }, companyId: string): boolean {
  if (!team.blockedCompanies) return false;

  const blockedList = Array.isArray(team.blockedCompanies)
    ? team.blockedCompanies
    : [];

  return blockedList.includes(companyId);
}

/**
 * Determine if a user can view a team based on visibility settings
 */
export async function canViewTeam(
  team: {
    id: string;
    visibility: TeamVisibility;
    isAnonymous: boolean;
    createdBy: string;
    blockedCompanies?: unknown;
  },
  viewerId: string,
  viewerType: 'individual' | 'company' | 'admin'
): Promise<VisibilityCheckResult> {
  // Team creator can always view
  if (team.createdBy === viewerId) {
    return { canView: true, showAnonymous: false };
  }

  // Team members can always view
  const isMember = await isTeamMember(team.id, viewerId);
  if (isMember) {
    return { canView: true, showAnonymous: false };
  }

  // Admin can always view
  if (viewerType === 'admin') {
    return { canView: true, showAnonymous: false };
  }

  // Check visibility mode
  switch (team.visibility) {
    case 'public':
      // Public teams visible to all, but check if they opted for anonymous display
      return { canView: true, showAnonymous: team.isAnonymous };

    case 'private':
      // Private teams only visible to members (already checked above)
      return {
        canView: false,
        showAnonymous: false,
        reason: 'This team profile is private and only visible to team members.',
      };

    case 'anonymous':
      // Anonymous teams only visible to verified companies
      if (viewerType === 'company') {
        const verification = await isVerifiedCompanyUser(viewerId);

        if (!verification.isVerified) {
          return {
            canView: false,
            showAnonymous: false,
            reason: 'Only verified companies can view anonymous team profiles. Please complete company verification.',
          };
        }

        // Check if company is blocked by this team
        if (verification.companyId && isCompanyBlocked(team, verification.companyId)) {
          return {
            canView: false,
            showAnonymous: false,
            reason: 'This team profile is not available.',
          };
        }

        return { canView: true, showAnonymous: true };
      }

      return {
        canView: false,
        showAnonymous: false,
        reason: 'Anonymous team profiles are only visible to verified companies.',
      };

    default:
      return { canView: true, showAnonymous: false };
  }
}

/**
 * Anonymize team data for anonymous mode viewing
 * Masks identifying information while preserving skills and experience
 */
export function anonymizeTeamData<T extends TeamData>(team: T): T {
  const memberCount = team.members?.length || 0;

  return {
    ...team,
    // Replace name with anonymous identifier
    name: `Anonymous Team #${team.id.slice(-6).toUpperCase()}`,
    // Keep description but remove any company mentions
    description: team.description
      ? maskCompanyNames(team.description)
      : undefined,
    // Keep industry but make location less specific
    location: team.location ? generalizeLocation(team.location) : undefined,
    // Anonymize member data
    members: team.members?.map((member, index) => anonymizeMemberData(member, index + 1)) || [],
    // Mark as anonymized for UI
    _isAnonymized: true,
    _memberCount: memberCount,
  } as T;
}

/**
 * Anonymize individual member data
 */
function anonymizeMemberData(member: TeamMemberData, memberNumber: number): TeamMemberData {
  return {
    ...member,
    name: `Team Member ${memberNumber}`,
    email: undefined, // Remove email entirely
    photoUrl: undefined, // Remove photo
    // Keep role and experience as they're not identifying
    role: member.role,
    title: member.title ? generalizeTitle(member.title) : undefined,
    bio: undefined, // Remove bio as it may contain identifying info
    yearsExperience: member.yearsExperience,
    isLead: member.isLead,
    _isAnonymized: true,
  };
}

/**
 * Mask company names in text
 */
function maskCompanyNames(text: string): string {
  // Common company suffixes to detect
  const companySuffixes = ['Inc', 'LLC', 'Ltd', 'Corp', 'Corporation', 'Company', 'Co', 'Group', 'Partners', 'LLP'];
  const suffixPattern = companySuffixes.join('|');

  // Replace patterns like "Company Name Inc" or "Company Name, LLC"
  let masked = text.replace(
    new RegExp(`\\b[A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)*\\s*,?\\s*(${suffixPattern})\\.?`, 'g'),
    '[Company]'
  );

  // Also replace "at Company" patterns
  masked = masked.replace(/\bat\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*/g, 'at [Company]');

  return masked;
}

/**
 * Make location less specific (city → region/country)
 */
function generalizeLocation(location: string): string {
  // Common US states and regions
  const usStates: Record<string, string> = {
    'new york': 'Northeast US',
    'los angeles': 'West Coast US',
    'san francisco': 'West Coast US',
    'chicago': 'Midwest US',
    'boston': 'Northeast US',
    'seattle': 'West Coast US',
    'austin': 'Southwest US',
    'denver': 'Mountain West US',
    'miami': 'Southeast US',
    'atlanta': 'Southeast US',
    'dallas': 'Southwest US',
    'houston': 'Southwest US',
  };

  const locationLower = location.toLowerCase();

  for (const [city, region] of Object.entries(usStates)) {
    if (locationLower.includes(city)) {
      return region;
    }
  }

  // For UK locations
  if (locationLower.includes('london') || locationLower.includes('uk') || locationLower.includes('england')) {
    return 'United Kingdom';
  }

  // Default: return country if identifiable, otherwise just "Available Globally"
  if (locationLower.includes('remote')) {
    return 'Remote';
  }

  return location; // Keep if can't determine
}

/**
 * Make job titles less specific while preserving level
 */
function generalizeTitle(title: string): string {
  const titleLower = title.toLowerCase();

  // Detect seniority level
  let level = '';
  if (titleLower.includes('senior') || titleLower.includes('sr')) level = 'Senior';
  else if (titleLower.includes('lead') || titleLower.includes('principal')) level = 'Lead';
  else if (titleLower.includes('director')) level = 'Director';
  else if (titleLower.includes('vp') || titleLower.includes('vice president')) level = 'VP-level';
  else if (titleLower.includes('head')) level = 'Head';
  else if (titleLower.includes('junior') || titleLower.includes('jr')) level = 'Junior';
  else if (titleLower.includes('manager')) level = 'Manager';

  // Detect function
  let func = 'Professional';
  if (titleLower.includes('engineer') || titleLower.includes('developer')) func = 'Engineer';
  else if (titleLower.includes('design')) func = 'Designer';
  else if (titleLower.includes('product')) func = 'Product';
  else if (titleLower.includes('marketing')) func = 'Marketing';
  else if (titleLower.includes('sales')) func = 'Sales';
  else if (titleLower.includes('operations') || titleLower.includes('ops')) func = 'Operations';
  else if (titleLower.includes('finance') || titleLower.includes('accounting')) func = 'Finance';
  else if (titleLower.includes('legal') || titleLower.includes('attorney')) func = 'Legal';
  else if (titleLower.includes('hr') || titleLower.includes('people')) func = 'People';

  return level ? `${level} ${func}` : func;
}

/**
 * Check if NDA acceptance is required for a conversation
 * Returns whether NDA needs to be accepted before messaging
 *
 * Note: NDA acceptance is tracked via participantRoles JSON field on Conversation
 */
export async function requiresNDAAcceptance(
  teamId: string,
  userId: string
): Promise<{ required: boolean; accepted: boolean }> {
  // Get team visibility
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { visibility: true, isAnonymous: true },
  });

  if (!team) {
    return { required: false, accepted: false };
  }

  // Anonymous teams require NDA acceptance
  if (team.visibility === 'anonymous' || team.isAnonymous) {
    // Check if user has an existing conversation with NDA accepted
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        teamId,
        participants: {
          some: { userId },
        },
      },
      select: {
        id: true,
        participantRoles: true,
      },
    });

    if (existingConversation) {
      // NDA acceptance tracked in participantRoles JSON
      const roles = existingConversation.participantRoles as Record<string, unknown> | null;
      const ndaAcceptances = roles?.ndaAcceptedBy as string[] | undefined;
      return {
        required: true,
        accepted: ndaAcceptances?.includes(userId) || false,
      };
    }

    return { required: true, accepted: false };
  }

  return { required: false, accepted: true };
}

/**
 * Record NDA acceptance for a conversation
 * Uses participantRoles JSON field to track NDA acceptance
 */
export async function acceptNDA(conversationId: string, userId: string): Promise<void> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { participantRoles: true },
  });

  const currentRoles = (conversation?.participantRoles as Record<string, unknown>) || {};
  const currentAcceptances = (currentRoles.ndaAcceptedBy as string[]) || [];

  if (!currentAcceptances.includes(userId)) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        participantRoles: {
          ...currentRoles,
          ndaAcceptedBy: [...currentAcceptances, userId],
          ndaAcceptedAt: {
            ...(currentRoles.ndaAcceptedAt as Record<string, string> || {}),
            [userId]: new Date().toISOString(),
          },
        },
      },
    });
  }
}

/**
 * Get visibility settings from team metadata
 */
export function getVisibilitySettings(metadata: unknown): {
  hideCurrentEmployer: boolean;
  allowDiscovery: boolean;
} {
  if (!metadata || typeof metadata !== 'object') {
    return { hideCurrentEmployer: false, allowDiscovery: true };
  }

  const meta = metadata as Record<string, unknown>;
  const settings = meta.visibilitySettings as Record<string, unknown> | undefined;

  return {
    hideCurrentEmployer: settings?.hideCurrentEmployer === true,
    allowDiscovery: settings?.allowDiscovery !== false, // Default true
  };
}
