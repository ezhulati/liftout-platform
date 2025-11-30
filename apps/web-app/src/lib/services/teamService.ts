import type {
  TeamProfile,
  CreateTeamData,
  TeamFilters,
  TeamSearchResult,
  TeamMember,
  TeamVerification
} from '@/types/teams';
import { DEMO_DATA, DEMO_ACCOUNTS } from '@/lib/demo-accounts';

// Transform demo team data to TeamProfile format
const transformDemoTeam = (team: typeof DEMO_DATA.teams[0]): TeamProfile => ({
  id: team.id,
  name: team.name,
  description: team.description,
  industry: [team.specialization],
  specializations: team.skills,
  size: team.size,
  leaderId: 'demo-leader',
  members: [],
  location: {
    primary: 'New York, NY',
    remote: true,
  },
  availability: {
    status: team.openToLiftout ? 'available' : 'not_available',
  },
  compensationExpectations: {
    totalTeamValue: {
      min: 200000,
      max: 400000,
      currency: 'USD',
    },
  },
  performanceMetrics: {
    projectsCompleted: 15,
    successRate: team.successRate,
    averageProjectValue: 500000,
    clientRetentionRate: team.clientSatisfaction,
    timeToDelivery: 30,
    qualityScore: 95,
    clientSatisfactionScore: team.clientSatisfaction,
    revenueGenerated: 5000000,
    costEfficiency: 90,
    innovationIndex: 85,
  },
  dynamics: {
    yearsWorkingTogether: team.yearsWorking,
    cohesionScore: team.cohesionScore,
    preferredWorkArrangement: 'hybrid',
  },
  verification: {
    status: 'verified',
    documents: [],
    backgroundChecks: [],
    references: [],
  },
  liftoutHistory: {
    previousLiftouts: [],
    liftoutReadiness: 'ready',
    noticePeriod: '4 weeks',
  },
  testimonials: [],
  tags: team.skills,
  featured: true,
  establishedDate: new Date(Date.now() - team.yearsWorking * 365 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'demo-user',
  viewCount: 150,
  expressionsOfInterest: 12,
  activeOpportunities: 3,
} as unknown as TeamProfile);

// Helper to check if this is a demo user/entity
const isDemoEntity = (id: string): boolean => {
  if (!id) return false;
  return id.includes('demo') ||
         id === 'demo@example.com' ||
         id === 'company@example.com' ||
         id.startsWith('demo-');
};

export class TeamService {
  // Create a new team profile
  async createTeam(data: CreateTeamData, creatorUserId: string): Promise<string> {
    // Handle demo users - simulate successful team creation
    if (isDemoEntity(creatorUserId)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const demoTeamId = `demo-team-${Date.now()}`;
      console.log(`[Demo] Created team: ${data.name} (${demoTeamId})`);
      return demoTeamId;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create team');
      }

      const result = await response.json();
      return result.team?.id || result.data?.id || '';
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team profile');
    }
  }

  // Get team by ID
  async getTeamById(teamId: string): Promise<TeamProfile | null> {
    // Handle demo teams
    if (isDemoEntity(teamId)) {
      const demoTeam = DEMO_DATA.teams.find(t => t.id === teamId);
      if (demoTeam) {
        return transformDemoTeam(demoTeam);
      }
      return null;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch team');
      }

      const result = await response.json();
      const team = result.team || result.data;
      if (!team) return null;

      // Transform API response to TeamProfile format
      return {
        id: team.id,
        name: team.name,
        description: team.description || '',
        industry: team.industry ? [team.industry] : [],
        specializations: team.specialization ? [team.specialization] : [],
        size: team.size || team._count?.members || 0,
        leaderId: team.createdBy || '',
        members: (team.members || []).map((m: any) => ({
          id: m.id,
          userId: m.userId,
          name: m.user ? `${m.user.firstName} ${m.user.lastName}` : 'Unknown',
          email: m.user?.email || '',
          role: m.role,
          verified: m.status === 'active',
        })),
        location: {
          primary: team.location || '',
          remote: team.remoteStatus === 'remote',
        },
        availability: {
          status: 'available',
        },
        performanceMetrics: {
          projectsCompleted: 0,
          successRate: 0,
          averageProjectValue: 0,
          clientRetentionRate: 0,
          timeToDelivery: 0,
          qualityScore: 0,
          clientSatisfactionScore: 0,
          revenueGenerated: 0,
          costEfficiency: 0,
          innovationIndex: 0,
        },
        dynamics: {
          yearsWorkingTogether: 0,
          cohesionScore: 0,
          preferredWorkArrangement: 'hybrid',
        },
        verification: {
          status: team.verificationStatus || 'pending',
          documents: [],
          backgroundChecks: [],
          references: [],
        },
        liftoutHistory: {
          previousLiftouts: [],
          liftoutReadiness: 'not_ready',
          noticePeriod: '',
        },
        testimonials: [],
        tags: [],
        featured: false,
        establishedDate: team.createdAt ? new Date(team.createdAt) : new Date(),
        createdAt: team.createdAt ? new Date(team.createdAt) : new Date(),
        updatedAt: team.updatedAt ? new Date(team.updatedAt) : new Date(),
        createdBy: team.createdBy || '',
        viewCount: 0,
        expressionsOfInterest: 0,
        activeOpportunities: 0,
      } as unknown as TeamProfile;
    } catch (error) {
      console.error('Error getting team:', error);
      throw new Error('Failed to get team profile');
    }
  }

  // Search teams with filters
  async searchTeams(filters: TeamFilters, page = 0, pageSize = 10): Promise<TeamSearchResult> {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.industry?.length) {
        filters.industry.forEach(i => params.append('industry', i));
      }
      if (filters.specializations?.length) {
        filters.specializations.forEach(s => params.append('specialization', s));
      }
      if (filters.remote !== undefined) {
        params.append('remote', filters.remote.toString());
      }
      if (filters.availability) {
        params.append('availability', filters.availability);
      }
      if (filters.verified) {
        params.append('verified', 'true');
      }
      if (filters.teamSize) {
        params.append('minSize', filters.teamSize.min.toString());
        params.append('maxSize', filters.teamSize.max.toString());
      }
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/teams?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }

      const result = await response.json();
      const teamsData = result.teams || result.data?.teams || [];

      // Transform API response to TeamProfile format
      const teams = teamsData.map((team: any) => ({
        id: team.id,
        name: team.name,
        description: team.description || '',
        industry: team.industry ? [team.industry] : [],
        specializations: team.specialization ? [team.specialization] : [],
        size: team.size || team._count?.members || team.memberCount || 0,
        leaderId: team.createdBy || '',
        members: [],
        location: {
          primary: team.location || '',
          remote: team.remoteStatus === 'remote',
        },
        availability: {
          status: 'available',
        },
        verification: {
          status: team.verificationStatus || 'pending',
          documents: [],
          backgroundChecks: [],
          references: [],
        },
        createdAt: team.createdAt ? new Date(team.createdAt) : new Date(),
        updatedAt: team.updatedAt ? new Date(team.updatedAt) : new Date(),
      } as unknown as TeamProfile));

      return {
        teams,
        total: result.total || teams.length,
        filters: result.filters || {
          industries: [],
          specializations: [],
          locations: [],
          experienceLevels: [],
        },
      };
    } catch (error) {
      console.error('Error searching teams:', error);
      throw new Error('Failed to search teams');
    }
  }

  // Update team profile
  async updateTeam(teamId: string, updates: Partial<TeamProfile>): Promise<void> {
    // Handle demo teams
    if (isDemoEntity(teamId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Updated team: ${teamId}`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update team');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      throw new Error('Failed to update team profile');
    }
  }

  // Upload verification document
  async uploadVerificationDocument(
    teamId: string,
    file: File,
    documentType: TeamVerification['documents'][0]['type']
  ): Promise<string> {
    // Handle demo teams
    if (isDemoEntity(teamId)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`[Demo] Uploaded document: ${documentType}`);
      return `https://demo.example.com/documents/${teamId}/${documentType}`;
    }

    try {
      // Use the documents API endpoint for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('teamId', teamId);
      formData.append('documentType', documentType);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const result = await response.json();
      return result.url || result.data?.url || '';
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload verification document');
    }
  }

  // Submit team for verification
  async submitForVerification(teamId: string): Promise<void> {
    // Handle demo teams
    if (isDemoEntity(teamId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Submitted team for verification: ${teamId}`);
      return;
    }

    try {
      const response = await fetch('/api/teams/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, status: 'in_progress' }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit for verification');
      }
    } catch (error) {
      console.error('Error submitting for verification:', error);
      throw new Error('Failed to submit team for verification');
    }
  }

  // Add team member
  async addTeamMember(teamId: string, member: Omit<TeamMember, 'id' | 'verified'>): Promise<void> {
    // Handle demo teams
    if (isDemoEntity(teamId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Added team member to: ${teamId}`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addMember: member }),
      });

      if (!response.ok) {
        throw new Error('Failed to add team member');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      throw new Error('Failed to add team member');
    }
  }

  // Remove team member
  async removeTeamMember(teamId: string, memberId: string): Promise<void> {
    // Handle demo teams
    if (isDemoEntity(teamId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Removed team member: ${memberId}`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removeMemberId: memberId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove team member');
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      throw new Error('Failed to remove team member');
    }
  }

  // Add reference for verification
  async addReference(teamId: string, reference: TeamVerification['references'][0]): Promise<void> {
    // Handle demo teams
    if (isDemoEntity(teamId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Added reference to team: ${teamId}`);
      return;
    }

    try {
      const response = await fetch('/api/teams/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, addReference: reference }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reference');
      }
    } catch (error) {
      console.error('Error adding reference:', error);
      throw new Error('Failed to add reference');
    }
  }

  // Add testimonial
  async addTestimonial(teamId: string, testimonial: Omit<TeamProfile['testimonials'][0], 'id'>): Promise<void> {
    // Handle demo teams
    if (isDemoEntity(teamId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Added testimonial to team: ${teamId}`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addTestimonial: testimonial }),
      });

      if (!response.ok) {
        throw new Error('Failed to add testimonial');
      }
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw new Error('Failed to add testimonial');
    }
  }

  // Increment view count
  async incrementViewCount(teamId: string): Promise<void> {
    // Handle demo teams - no-op
    if (isDemoEntity(teamId)) {
      return;
    }

    try {
      // View count tracking is typically handled server-side
      console.log(`View count increment requested for team: ${teamId}`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Express interest in team
  async expressInterest(teamId: string, companyUserId: string): Promise<void> {
    // Handle demo teams
    if (isDemoEntity(teamId) || isDemoEntity(companyUserId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Expressed interest in team: ${teamId}`);
      return;
    }

    try {
      const response = await fetch('/api/applications/eoi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, type: 'expression_of_interest' }),
      });

      if (!response.ok) {
        throw new Error('Failed to express interest');
      }
    } catch (error) {
      console.error('Error expressing interest:', error);
      throw new Error('Failed to express interest in team');
    }
  }

  // Get teams by user (for team leads)
  async getTeamsByUser(userId: string): Promise<TeamProfile[]> {
    // Handle demo users
    if (isDemoEntity(userId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [];
    }

    try {
      // Use API route which handles Prisma operations server-side
      const response = await fetch('/api/teams/user-teams');
      if (!response.ok) {
        throw new Error('Failed to fetch user teams');
      }
      const result = await response.json();
      if (result.success && result.data) {
        // Transform API response to partial TeamProfile format
        // Using unknown cast since API returns minimal data
        return result.data.map((team: any) => ({
          id: team.id,
          name: team.name,
          size: team.size,
          industry: team.industry || [],
          specializations: team.specialization ? [team.specialization] : [],
          location: {
            primary: team.location || '',
            remote: team.remoteStatus === 'remote',
          },
          members: team.members || [],
          leaderId: team.leaderId || '',
          description: team.description || '',
        }) as unknown as TeamProfile);
      }
      return [];
    } catch (error) {
      console.error('Error getting teams by user:', error);
      throw new Error('Failed to get user teams');
    }
  }

  // Alias for backward compatibility
  async getTeamsByLeader(leaderId: string): Promise<TeamProfile[]> {
    return this.getTeamsByUser(leaderId);
  }

  // Get featured teams
  async getFeaturedTeams(limit = 6): Promise<TeamProfile[]> {
    try {
      // Return demo teams as featured
      const demoTeams = DEMO_DATA.teams.slice(0, limit).map(transformDemoTeam);

      // Also try to get real teams from API
      try {
        const result = await this.searchTeams({ verified: true }, 0, limit);
        if (result.teams.length > 0) {
          return result.teams;
        }
      } catch {
        // Fallback to demo teams
      }

      return demoTeams;
    } catch (error) {
      console.error('Error getting featured teams:', error);
      // Return demo teams as fallback
      return DEMO_DATA.teams.slice(0, limit).map(transformDemoTeam);
    }
  }

  // Get team statistics
  async getTeamStats(teamId?: string): Promise<any> {
    try {
      if (teamId) {
        // Get stats for specific team
        const team = await this.getTeamById(teamId);
        if (!team) throw new Error('Team not found');

        const establishedDate = team.establishedDate instanceof Date
          ? team.establishedDate
          : new Date(team.establishedDate);

        return {
          profileViews: team.viewCount || 0,
          expressionsOfInterest: team.expressionsOfInterest || 0,
          activeOpportunities: team.activeOpportunities || 0,
          verificationStatus: team.verification?.status || 'pending',
          teamSize: team.size || 0,
          establishedYears: new Date().getFullYear() - establishedDate.getFullYear(),
        };
      } else {
        // Get platform-wide team stats
        return {
          totalTeams: 0,
          verifiedTeams: 0,
          activeTeams: 0,
          averageTeamSize: 0,
        };
      }
    } catch (error) {
      console.error('Error getting team stats:', error);
      throw new Error('Failed to get team statistics');
    }
  }
}

export const teamService = new TeamService();