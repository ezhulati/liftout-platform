import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

// Mock API for demo purposes - normally this would call real endpoints
const mockApi = {
  post: async (url: string, data: any) => ({ data: { success: true } }),
  get: async (url: string, params?: any) => ({ data: { success: true, data: [] } }),
  put: async (url: string, data: any) => ({ data: { success: true } }),
  delete: async (url: string) => ({ data: { success: true } }),
};

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

// Auth API calls (mocked for demo)
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: 'individual' | 'company';
    agreesToTerms: boolean;
  }) => {
    const response = await mockApi.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await mockApi.post('/auth/login', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await mockApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const response = await mockApi.post('/auth/reset-password', data);
    return response.data;
  },
};

// User API calls (mocked for demo)
export const userApi = {
  getMe: async () => {
    const response = await mockApi.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await mockApi.put('/users/me', data);
    return response.data;
  },

  addSkill: async (data: {
    skillId: number;
    proficiencyLevel: string;
    yearsExperience: number;
  }) => {
    const response = await mockApi.post('/users/me/skills', data);
    return response.data;
  },

  removeSkill: async (skillId: number) => {
    const response = await mockApi.delete(`/users/me/skills/${skillId}`);
    return response.data;
  },
};

// Team API calls
export const teamApi = {
  getTeams: async (params?: {
    page?: number;
    limit?: number;
    industry?: string;
    location?: string;
    size?: string;
  }) => {
    const response = await mockApi.get('/teams', { params });
    return response.data;
  },

  getTeam: async (id: string) => {
    const response = await mockApi.get(`/teams/${id}`);
    return response.data;
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
    const response = await mockApi.post('/teams', data);
    return response.data;
  },

  updateTeam: async (id: string, data: any) => {
    const response = await mockApi.put(`/teams/${id}`, data);
    return response.data;
  },

  inviteMember: async (teamId: string, data: {
    email: string;
    role: string;
    specialization?: string;
    seniorityLevel?: string;
    personalMessage?: string;
  }) => {
    const response = await mockApi.post(`/teams/${teamId}/members`, data);
    return response.data;
  },

  getApplications: async (teamId: string) => {
    const response = await mockApi.get(`/teams/${teamId}/applications`);
    return response.data;
  },
};

// Company API calls
export const companyApi = {
  getMe: async () => {
    const response = await mockApi.get('/companies/me');
    return response.data;
  },

  createCompany: async (data: any) => {
    const response = await mockApi.post('/companies', data);
    return response.data;
  },

  updateCompany: async (id: string, data: any) => {
    const response = await mockApi.put(`/companies/${id}`, data);
    return response.data;
  },
};

// Opportunity API calls (mocked for demo)
export const opportunityApi = {
  getOpportunities: async (params?: any) => {
    const response = await mockApi.get('/opportunities', { params });
    return response.data;
  },

  getOpportunity: async (id: string) => {
    const response = await mockApi.get(`/opportunities/${id}`);
    return response.data;
  },

  createOpportunity: async (data: any) => {
    const response = await mockApi.post('/opportunities', data);
    return response.data;
  },

  updateOpportunity: async (id: string, data: any) => {
    const response = await mockApi.put(`/opportunities/${id}`, data);
    return response.data;
  },
};

// Application API calls (mocked for demo)
export const applicationApi = {
  getMyApplications: async () => {
    const response = await mockApi.get('/applications/me');
    return response.data;
  },

  submitApplication: async (data: {
    teamId: string;
    opportunityId: string;
    coverLetter?: string;
    proposedCompensation?: number;
    availabilityDate?: string;
  }) => {
    const response = await mockApi.post('/applications', data);
    return response.data;
  },
};

// Search API calls (mocked for demo)
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
    const response = await mockApi.get('/search/teams', { params });
    return response.data;
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
    const response = await mockApi.get('/search/opportunities', { params });
    return response.data;
  },
};

export default api;