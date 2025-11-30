import { isDemoAccount, DEMO_ACCOUNTS } from '@/lib/demo-accounts';
import type { Application, CreateApplicationData, ApplicationFilters } from '@/types/applications';

// Demo applications data for Alex Chen (team user)
const DEMO_TEAM_APPLICATIONS: Application[] = [
  {
    id: 'app_001',
    opportunityId: 'opp_001',
    teamId: 'team_demo_001',
    applicantUserId: 'demo@example.com',
    status: 'under_review',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Updated 1 day ago
    viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "Our TechFlow Data Science team is excited about NextGen Financial's expansion into quantitative analytics. With 3.5 years working together and a proven track record of reducing fraud detection false positives by 35%, we've generated over $2.1M in annual savings through our predictive modeling expertise. We're particularly drawn to your team-first culture and the opportunity to lead your new analytics division with full autonomy.",
    teamMotivation: "We're motivated by the opportunity to build something from the ground up and work with cutting-edge financial technology.",
    availabilityTimeline: "Available to start within 8 weeks with 2-week notice period",
    compensationExpectations: {
      min: 240000,
      max: 320000,
      currency: 'USD',
      negotiable: true
    },
    documents: []
  },
  {
    id: 'app_002',
    opportunityId: 'opp_002',
    teamId: 'team_demo_001',
    applicantUserId: 'demo@example.com',
    status: 'interview_scheduled',
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "While our primary expertise is in fintech analytics, our team has significant experience applying machine learning to healthcare data. We've worked on medical imaging projects during our academic research and are excited about MedTech's mission to revolutionize diagnostic tools. Our team's collaborative approach and research background would be ideal for establishing your AI Innovation Lab.",
    teamMotivation: "We're excited to apply our ML expertise to healthcare and make a meaningful impact on patient outcomes.",
    availabilityTimeline: "Flexible start date, preferentially Q2 2024",
    compensationExpectations: {
      min: 300000,
      max: 450000,
      currency: 'USD',
      negotiable: true
    },
    interviewDetails: {
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      format: 'video',
      participants: ['Dr. Lisa Chen']
    },
    documents: []
  },
  {
    id: 'app_003',
    opportunityId: 'opp_004',
    teamId: 'team_demo_001',
    applicantUserId: 'demo@example.com',
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    viewedByCompany: false,
    coverLetter: "DataFlow Analytics looks like an incredible opportunity to apply our quantitative expertise to financial markets. Our team's experience with real-time data processing and risk modeling aligns perfectly with your algorithmic trading platform needs. We're excited about the startup environment and the potential for significant equity upside.",
    teamMotivation: "We're drawn to the startup environment and the opportunity for significant equity participation.",
    availabilityTimeline: "Can start immediately with 1-week notice",
    compensationExpectations: {
      min: 200000,
      max: 280000,
      currency: 'USD',
      negotiable: true
    },
    documents: []
  },
  {
    id: 'app_004',
    opportunityId: 'opp_005',
    teamId: 'team_demo_001',
    applicantUserId: 'demo@example.com',
    status: 'rejected',
    submittedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "Our team is interested in GlobalCorp's enterprise analytics transformation. While our experience is primarily in fintech, we believe our quantitative skills and team cohesion would translate well to supply chain optimization and enterprise data analytics.",
    teamMotivation: "We're interested in expanding our expertise into enterprise analytics and supply chain optimization.",
    availabilityTimeline: "Available within 12 weeks",
    compensationExpectations: {
      min: 250000,
      max: 350000,
      currency: 'USD',
      negotiable: true
    },
    companyNotes: "Strong technical team but lacks enterprise and supply chain domain expertise. Looking for teams with direct industry experience.",
    documents: []
  }
];

// Demo applications for company user (Sarah Rodriguez at NextGen Financial)
const DEMO_COMPANY_APPLICATIONS: Application[] = [
  {
    id: 'app_company_001',
    opportunityId: 'opp_001',
    teamId: 'team_external_001',
    applicantUserId: 'external_team_lead@goldman.com',
    status: 'pending',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    viewedByCompany: false,
    coverLetter: "The QuantRisk Analytics team at Goldman Sachs is intrigued by NextGen Financial's expansion into institutional trading. Our team has 4.2 years of experience working together and has built real-time risk monitoring systems for portfolios exceeding $50B. We're seeking a strategic opportunity that offers greater autonomy and equity participation while maintaining our focus on cutting-edge quantitative finance.",
    teamMotivation: "We're seeking greater autonomy and equity participation while maintaining our focus on quantitative finance.",
    availabilityTimeline: "Available within 16 weeks with proper transition planning",
    compensationExpectations: {
      min: 350000,
      max: 500000,
      currency: 'USD',
      negotiable: true
    },
    documents: []
  },
  {
    id: 'app_company_002',
    opportunityId: 'opp_001',
    teamId: 'team_external_002',
    applicantUserId: 'team_lead@jpmorgan.com',
    status: 'under_review',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "Our derivatives trading analytics team at JPMorgan Chase has been following NextGen Financial's growth trajectory with great interest. With 3.8 years as a cohesive unit, we've developed sophisticated algorithms for options pricing and volatility modeling. We're attracted to your innovative culture and the opportunity to build a new quantitative division from the ground up.",
    teamMotivation: "We're attracted to your innovative culture and the opportunity to build a new quantitative division from the ground up.",
    availabilityTimeline: "Flexible timing, prefer Q2 2024 start",
    compensationExpectations: {
      min: 320000,
      max: 450000,
      currency: 'USD',
      negotiable: true
    },
    documents: []
  },
  {
    id: 'app_company_003',
    opportunityId: 'opp_ng_002',
    teamId: 'team_external_003',
    applicantUserId: 'ai_team@mit.edu',
    status: 'accepted',
    submittedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "The MIT Applied AI Research team is excited about NextGen Financial's vision for AI-powered financial services. Our interdisciplinary team combines machine learning expertise with financial modeling, having published 15+ papers on algorithmic trading and market prediction. We're ready to transition from academic research to industry application.",
    teamMotivation: "We're ready to transition from academic research to industry application and make a real-world impact.",
    availabilityTimeline: "Ready to start January 2024",
    compensationExpectations: {
      min: 280000,
      max: 380000,
      currency: 'USD',
      negotiable: true
    },
    companyNotes: "Exceptional academic credentials and research output. Strong fit for our AI initiatives. Terms agreed upon.",
    documents: []
  }
];

// Helper to check if this is a demo entity
const isDemoEntity = (id: string): boolean => {
  if (!id) return false;
  return id.includes('demo') ||
         id === 'demo@example.com' ||
         id === 'company@example.com' ||
         id.startsWith('demo-') ||
         id.startsWith('app_');
};

export class ApplicationService {
  // Create a new application
  async createApplication(data: CreateApplicationData, applicantUserId: string): Promise<string> {
    // Handle demo users
    if (isDemoEntity(applicantUserId)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const demoAppId = `demo-app-${Date.now()}`;
      console.log(`[Demo] Created application: ${demoAppId}`);
      return demoAppId;
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          applicantUserId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      const result = await response.json();
      return result.application?.id || result.data?.id || '';
    } catch (error) {
      console.error('Error creating application:', error);
      throw new Error('Failed to create application');
    }
  }

  // Get application by ID
  async getApplicationById(applicationId: string): Promise<Application | null> {
    // Handle demo applications
    if (isDemoEntity(applicationId)) {
      const demoApp = [...DEMO_TEAM_APPLICATIONS, ...DEMO_COMPANY_APPLICATIONS].find(a => a.id === applicationId);
      return demoApp || null;
    }

    try {
      const response = await fetch(`/api/applications/${applicationId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch application');
      }

      const result = await response.json();
      const app = result.application || result.data;
      if (!app) return null;

      return {
        ...app,
        submittedAt: app.submittedAt ? new Date(app.submittedAt) : new Date(),
        updatedAt: app.updatedAt ? new Date(app.updatedAt) : new Date(),
        viewedAt: app.viewedAt ? new Date(app.viewedAt) : undefined,
      } as Application;
    } catch (error) {
      console.error('Error getting application:', error);
      throw new Error('Failed to get application');
    }
  }

  // Get applications for a team
  async getTeamApplications(teamId: string): Promise<Application[]> {
    console.log('getTeamApplications called with teamId:', teamId);

    // Return demo data for demo accounts - check team ID and email patterns
    if (teamId === 'team_demo_001' ||
        teamId === 'demo@example.com' ||
        teamId === 'demo@liftout.com' ||
        teamId?.includes('demo') ||
        isDemoAccount(teamId)) {
      console.log('Returning demo team applications, count:', DEMO_TEAM_APPLICATIONS.length);
      return [...DEMO_TEAM_APPLICATIONS];
    }

    try {
      // Use API route which handles Prisma operations server-side
      const response = await fetch('/api/applications/user');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const result = await response.json();
      if (result.success && result.data) {
        // Filter for this team and transform dates
        return result.data
          .filter((app: any) => app.teamId === teamId)
          .map((app: any) => ({
            ...app,
            submittedAt: new Date(app.submittedAt),
            updatedAt: new Date(app.updatedAt),
            viewedAt: app.viewedAt ? new Date(app.viewedAt) : undefined,
          })) as Application[];
      }
      return [];
    } catch (error) {
      console.error('Error getting team applications:', error);
      throw new Error('Failed to get team applications');
    }
  }

  // Get applications for an opportunity (for companies)
  async getOpportunityApplications(opportunityId: string): Promise<Application[]> {
    // Handle demo opportunities
    if (isDemoEntity(opportunityId)) {
      return DEMO_COMPANY_APPLICATIONS.filter(a => a.opportunityId === opportunityId);
    }

    try {
      const response = await fetch(`/api/applications/opportunity/${opportunityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const result = await response.json();
      const apps = result.applications || result.data || [];

      return apps.map((app: any) => ({
        ...app,
        submittedAt: app.submittedAt ? new Date(app.submittedAt) : new Date(),
        updatedAt: app.updatedAt ? new Date(app.updatedAt) : new Date(),
        viewedAt: app.viewedAt ? new Date(app.viewedAt) : undefined,
      })) as Application[];
    } catch (error) {
      console.error('Error getting opportunity applications:', error);
      throw new Error('Failed to get opportunity applications');
    }
  }

  // Get all applications for a company (across all their opportunities)
  async getCompanyApplications(companyUserId: string): Promise<Application[]> {
    // Return demo data for demo company account
    if (companyUserId === 'company_demo_001' ||
        companyUserId === 'company@example.com' ||
        companyUserId === 'company@liftout.com' ||
        companyUserId?.includes('company') ||
        isDemoAccount(companyUserId)) {
      return [...DEMO_COMPANY_APPLICATIONS];
    }

    try {
      // Use API route which handles Prisma operations server-side
      const response = await fetch('/api/applications/user');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const result = await response.json();
      if (result.success && result.data) {
        // Transform dates
        return result.data.map((app: any) => ({
          ...app,
          submittedAt: new Date(app.submittedAt),
          updatedAt: new Date(app.updatedAt),
          viewedAt: app.viewedAt ? new Date(app.viewedAt) : undefined,
        })) as Application[];
      }
      return [];
    } catch (error) {
      console.error('Error getting company applications:', error);
      throw new Error('Failed to get company applications');
    }
  }

  // Update application status
  async updateApplicationStatus(applicationId: string, status: Application['status'], companyNotes?: string): Promise<void> {
    // Handle demo applications
    if (isDemoEntity(applicationId)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`[Demo] Updated application ${applicationId} status to ${status}`);
      return;
    }

    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, companyNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      throw new Error('Failed to update application status');
    }
  }

  // Mark application as viewed by company
  async markAsViewed(applicationId: string): Promise<void> {
    // Handle demo applications
    if (isDemoEntity(applicationId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Marked application ${applicationId} as viewed`);
      return;
    }

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewedByCompany: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark application as viewed');
      }
    } catch (error) {
      console.error('Error marking application as viewed:', error);
      throw new Error('Failed to mark application as viewed');
    }
  }

  // Withdraw application (for teams)
  async withdrawApplication(applicationId: string): Promise<void> {
    // Handle demo applications
    if (isDemoEntity(applicationId)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`[Demo] Withdrew application ${applicationId}`);
      return;
    }

    try {
      const response = await fetch(`/api/applications/${applicationId}/withdraw`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw application');
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw new Error('Failed to withdraw application');
    }
  }

  // Schedule interview
  async scheduleInterview(applicationId: string, interviewDetails: Application['interviewDetails']): Promise<void> {
    // Handle demo applications
    if (isDemoEntity(applicationId)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`[Demo] Scheduled interview for application ${applicationId}`);
      return;
    }

    try {
      const response = await fetch(`/api/applications/${applicationId}/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interviewDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule interview');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw new Error('Failed to schedule interview');
    }
  }

  // Check if team has already applied to opportunity
  async hasTeamApplied(teamId: string, opportunityId: string): Promise<boolean> {
    // Handle demo entities
    if (isDemoEntity(teamId) || isDemoEntity(opportunityId)) {
      const hasApplied = DEMO_TEAM_APPLICATIONS.some(
        app => app.teamId === teamId && app.opportunityId === opportunityId
      );
      return hasApplied;
    }

    try {
      const applications = await this.getTeamApplications(teamId);
      return applications.some(app => app.opportunityId === opportunityId);
    } catch (error) {
      console.error('Error checking if team has applied:', error);
      return false;
    }
  }

  // Get application statistics
  async getApplicationStats(filters?: { companyUserId?: string; teamId?: string }): Promise<any> {
    try {
      let applications: Application[] = [];

      if (filters?.companyUserId) {
        applications = await this.getCompanyApplications(filters.companyUserId);
      } else if (filters?.teamId) {
        applications = await this.getTeamApplications(filters.teamId);
      }

      const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        underReview: applications.filter(app => app.status === 'under_review').length,
        interviewScheduled: applications.filter(app => app.status === 'interview_scheduled').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
      };

      return stats;
    } catch (error) {
      console.error('Error getting application stats:', error);
      throw new Error('Failed to get application stats');
    }
  }
  // Alias for backward compatibility
  async getApplicationsByTeam(teamId: string): Promise<Application[]> {
    return this.getTeamApplications(teamId);
  }
}

export const applicationService = new ApplicationService();