import { opportunityService, teamService, applicationService, userService } from '@/lib/firestore';
import type { Opportunity, Team, Application, User } from '@/types/firebase';
import { auth } from '@/lib/firebase';

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Helper function to get current user
const getCurrentUser = async (): Promise<User | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser?.email) return null;
  
  return await userService.getUserByEmail(currentUser.email);
};

// Auth API calls (Firebase handles this through AuthContext)
export const authApi = {
  // These are handled by Firebase Auth in AuthContext
  register: async (data: any) => ({ success: true, message: 'Use AuthContext signUp method' }),
  login: async (data: any) => ({ success: true, message: 'Use AuthContext signIn method' }),
  forgotPassword: async (email: string) => ({ success: true, message: 'Use AuthContext sendPasswordReset method' }),
  resetPassword: async (data: any) => ({ success: true, message: 'Use AuthContext updatePassword method' }),
};

// User API calls (Firebase implementation)
export const userApi = {
  getMe: async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Authentication required' };
      }
      return { success: true, data: currentUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  updateProfile: async (data: any) => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Authentication required' };
      }
      
      await userService.updateUser(currentUser.id, data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// Team API calls (Firebase implementation)
export const teamApi = {
  getTeams: async (params?: {
    page?: number;
    limit?: number;
    industry?: string;
    location?: string;
    size?: string;
  }) => {
    try {
      const teams = await teamService.searchTeams({
        industry: params?.industry,
        location: params?.location,
        size: params?.size ? parseInt(params.size) : undefined,
      });
      return { success: true, data: teams };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getTeam: async (id: string) => {
    try {
      const team = await teamService.getTeamById(id);
      if (!team) {
        return { success: false, error: 'Team not found' };
      }
      return { success: true, data: team };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  createTeam: async (data: {
    name: string;
    description?: string;
    industry?: string;
    specialization?: string;
    size: number;
    location?: string;
    remoteStatus?: string;
    visibility?: string;
  }) => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Authentication required' };
      }

      const teamData = {
        name: data.name,
        description: data.description || '',
        industry: data.industry || '',
        size: data.size,
        location: data.location || '',
        leaderId: currentUser.id,
        memberIds: [currentUser.id],
        skills: [], // Can be updated later
        experience: {
          yearsWorkedTogether: 0,
          previousLiftouts: 0,
          successfulProjects: 0,
        },
        availability: {
          status: 'available' as const,
        },
        profileViews: 0,
        rating: {
          average: 0,
          count: 0,
        },
        verification: {
          status: 'pending' as const,
        },
      };

      const teamId = await teamService.createTeam(teamData);
      return { success: true, data: { id: teamId } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  updateTeam: async (id: string, data: any) => {
    try {
      await teamService.updateTeam(id, data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  inviteMember: async (teamId: string, data: {
    email: string;
    role: string;
    specialization?: string;
    seniorityLevel?: string;
    personalMessage?: string;
  }) => {
    try {
      // For now, just add member directly (in production, would send invitation)
      const user = await userService.getUserByEmail(data.email);
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      await teamService.addMember(teamId, user.id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getApplications: async (teamId: string) => {
    try {
      const applications = await applicationService.getApplicationsByTeam(teamId);
      return { success: true, data: applications };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// Company API calls (Firebase implementation)
export const companyApi = {
  getMe: async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.type !== 'company') {
        return { success: false, error: 'Company account required' };
      }
      return { success: true, data: currentUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  updateCompany: async (data: any) => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.type !== 'company') {
        return { success: false, error: 'Company account required' };
      }
      
      await userService.updateUser(currentUser.id, data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// Opportunity API calls (Firebase implementation)
export const opportunityApi = {
  getOpportunities: async (params?: {
    page?: number;
    limit?: number;
    industry?: string;
    location?: string;
    skills?: string[];
    liftoutType?: string;
    companyId?: string;
  }) => {
    try {
      const opportunities = await opportunityService.searchOpportunities({
        industry: params?.industry,
        location: params?.location,
        skills: params?.skills,
        liftoutType: params?.liftoutType,
        companyId: params?.companyId,
      });
      
      // Transform Firebase opportunities to component format
      const transformedOpportunities = opportunities.map((opp: any) => ({
        id: opp.id,
        title: opp.title,
        description: opp.description,
        industry: opp.industry,
        location: opp.location,
        compensation: {
          min: opp.compensation?.amount ? Math.round(opp.compensation.amount * 0.8) : 100000,
          max: opp.compensation?.amount || 150000,
          currency: opp.compensation?.currency || 'USD',
          type: opp.compensation?.type || 'salary',
        },
        commitment: {
          duration: 'Permanent',
          startDate: opp.timeline?.expectedStartDate ? 
            new Date(opp.timeline.expectedStartDate.toDate()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 
            'Q1 2025',
        },
        teamSize: {
          min: opp.teamRequirements?.minSize || 3,
          max: opp.teamRequirements?.maxSize || 6,
        },
        skills: opp.teamRequirements?.skills || [],
        status: opp.status === 'open' ? 'active' : 
                opp.status === 'closed' ? 'closed' : 'evaluating',
        expressionsOfInterest: opp.applicationCount || 0,
        postedAt: opp.createdAt ? opp.createdAt.toDate().toISOString() : new Date().toISOString(),
        deadline: opp.timeline?.applicationDeadline ? 
          opp.timeline.applicationDeadline.toDate().toISOString() : 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        company: {
          name: opp.companyName || 'Company Name',
        },
        liftoutType: opp.liftoutType || 'capability_building',
        confidential: opp.confidential || false,
      }));
      
      return { success: true, data: transformedOpportunities };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getOpportunity: async (id: string) => {
    try {
      const opportunity = await opportunityService.getOpportunityById(id);
      if (!opportunity) {
        return { success: false, error: 'Opportunity not found' };
      }
      return { success: true, data: opportunity };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  createOpportunity: async (data: {
    title: string;
    description: string;
    industry: string;
    location: string;
    workStyle: 'remote' | 'hybrid' | 'onsite';
    budget: {
      min: number;
      max: number;
      currency: string;
    };
    duration: {
      value: number;
      unit: 'weeks' | 'months';
    };
    teamSize: {
      min: number;
      max: number;
    };
    deadline: string;
    skills: string[];
    requirements: string;
    deliverables: string;
  }) => {
    try {
      // Get current user from Firebase auth
      const currentUser = await getCurrentUser();
      
      if (!currentUser || currentUser.type !== 'company') {
        return { success: false, error: 'Only companies can create opportunities' };
      }

      const opportunityData = {
        title: data.title,
        description: data.description,
        companyId: currentUser.id,
        industry: data.industry,
        location: data.location,
        liftoutType: 'capability_building', // Default for now
        workStyle: data.workStyle,
        compensation: {
          type: 'budget' as const,
          amount: data.budget.max,
          currency: data.budget.currency,
          equity: false,
        },
        teamRequirements: {
          minSize: data.teamSize.min,
          maxSize: data.teamSize.max,
          skills: data.skills,
          experienceLevel: 'senior' as const,
        },
        timeline: {
          applicationDeadline: new Date(data.deadline),
          expectedStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          projectDuration: `${data.duration.value} ${data.duration.unit}`,
        },
        requirements: data.requirements,
        whatWeOffer: data.deliverables,
        applicationCount: 0,
        viewCount: 0,
        status: 'open' as const,
        confidential: false,
        featured: false,
      };

      const opportunityId = await opportunityService.createOpportunity(opportunityData);
      return { success: true, data: { id: opportunityId } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  updateOpportunity: async (id: string, data: any) => {
    try {
      await opportunityService.updateOpportunity(id, data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// Application API calls (Firebase implementation)
export const applicationApi = {
  getMyApplications: async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Authentication required' };
      }

      // Get teams led by current user
      const teams = await teamService.getTeamsByLeader(currentUser.id);
      const applications = [];
      
      for (const team of teams) {
        const teamApplications = await applicationService.getApplicationsByTeam(team.id);
        applications.push(...teamApplications);
      }

      return { success: true, data: applications };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  submitApplication: async (data: {
    teamId: string;
    opportunityId: string;
    coverLetter?: string;
    proposedCompensation?: number;
    availabilityDate?: string;
  }) => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Authentication required' };
      }

      // Get the opportunity details
      const opportunity = await opportunityService.getOpportunityById(data.opportunityId);
      if (!opportunity) {
        return { success: false, error: 'Opportunity not found' };
      }

      const applicationData = {
        teamId: data.teamId,
        opportunityId: data.opportunityId,
        companyId: opportunity.companyId,
        submittedBy: currentUser.id,
        status: 'pending' as const,
        proposal: {
          coverLetter: data.coverLetter || '',
          proposedCompensation: data.proposedCompensation,
          availabilityDate: data.availabilityDate ? new Date(data.availabilityDate) : undefined,
        },
        timeline: {
          submittedAt: new Date(),
        },
        documentation: [],
      };

      const applicationId = await applicationService.createApplication(applicationData);
      return { success: true, data: { id: applicationId } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  updateApplicationStatus: async (id: string, status: string) => {
    try {
      await applicationService.updateApplicationStatus(id, status as any);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// Search API calls (Firebase implementation)
export const searchApi = {
  searchTeams: async (params: {
    q?: string;
    industry?: string[];
    skills?: string[];
    location?: string;
    teamSize?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const teams = await teamService.searchTeams({
        industry: params.industry?.[0], // Firestore simple search for now
        location: params.location,
        size: params.teamSize ? parseInt(params.teamSize) : undefined,
        skills: params.skills,
      });
      
      // Simple text search if query provided
      let filteredTeams = teams;
      if (params.q) {
        const query = params.q.toLowerCase();
        filteredTeams = teams.filter(team => 
          team.name.toLowerCase().includes(query) ||
          team.description.toLowerCase().includes(query) ||
          team.industry.toLowerCase().includes(query)
        );
      }

      return { success: true, data: filteredTeams };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  searchOpportunities: async (params: {
    q?: string;
    industry?: string[];
    skills?: string[];
    location?: string;
    compensation?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const opportunities = await opportunityService.searchOpportunities({
        industry: params.industry?.[0],
        location: params.location,
        skills: params.skills,
      });
      
      // Simple text search if query provided
      let filteredOpportunities = opportunities;
      if (params.q) {
        const query = params.q.toLowerCase();
        filteredOpportunities = opportunities.filter(opp => 
          opp.title.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query) ||
          opp.industry.toLowerCase().includes(query)
        );
      }

      return { success: true, data: filteredOpportunities };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};