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
        minSize: params?.size ? parseInt(params.size) : undefined,
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
        compensation: {
          currentRange: {
            min: 0,
            max: 0,
            currency: 'USD',
          },
          expectations: {
            min: 0,
            max: 0,
            currency: 'USD',
          },
          type: 'salary' as const,
        },
        visibility: 'public' as const,
        verificationStatus: 'pending' as const,
        profileViews: 0,
        expressionsOfInterest: 0,
        tags: [],
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
        type: params?.liftoutType,
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
        companyName: currentUser.companyName || 'Unknown Company',
        industry: data.industry,
        location: data.location,
        type: 'capability_building' as const,
        teamSize: {
          min: data.teamSize?.min || 1,
          max: data.teamSize?.max || 10,
        },
        skills: data.skills || [],
        experience: {
          minYears: 0,
          preferredYears: 5,
        },
        compensation: {
          min: data.budget?.min || 0,
          max: data.budget?.max || 0,
          currency: data.budget?.currency || 'USD',
          type: 'total_package' as const,
        },
        timeline: {
          urgency: 'within_quarter' as const,
        },
        requirements: {
          mustHave: Array.isArray(data.requirements) ? data.requirements : (data.requirements ? [data.requirements] : []),
          niceToHave: [],
          culturalFit: [],
        },
        confidential: false,
        status: 'active' as const,
        applicantCount: 0,
        viewCount: 0,
        tags: [],
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
        minSize: params.teamSize ? parseInt(params.teamSize) : undefined,
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

// Application API
export const applicationApi = {
  async createApplication(data: any) {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.type !== 'individual') {
        return { success: false, error: 'Only team members can create applications' };
      }
      
      const { applicationService } = await import('@/lib/services/applicationService');
      const applicationId = await applicationService.createApplication(data, currentUser.id);
      return { success: true, data: { id: applicationId } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getApplicationById(applicationId: string) {
    try {
      const { applicationService } = await import('@/lib/services/applicationService');
      const application = await applicationService.getApplicationById(applicationId);
      return { success: true, data: application };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getMyApplications() {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Not authenticated' };
      }
      
      const { applicationService } = await import('@/lib/services/applicationService');
      let applications;
      
      if (currentUser.type === 'company') {
        applications = await applicationService.getCompanyApplications(currentUser.id);
      } else {
        applications = await applicationService.getTeamApplications(currentUser.id);
      }
      
      return { success: true, data: applications };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async updateApplicationStatus(applicationId: string, status: string, notes?: string) {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.type !== 'company') {
        return { success: false, error: 'Only companies can update application status' };
      }
      
      const { applicationService } = await import('@/lib/services/applicationService');
      await applicationService.updateApplicationStatus(applicationId, status as any, notes);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async withdrawApplication(applicationId: string) {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.type !== 'individual') {
        return { success: false, error: 'Only team members can withdraw applications' };
      }
      
      const { applicationService } = await import('@/lib/services/applicationService');
      await applicationService.withdrawApplication(applicationId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};