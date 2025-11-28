/**
 * Mock applications data for demo/fallback when API server is unavailable
 */

export interface MockApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  teamId: string;
  teamName: string;
  status: 'pending' | 'under_review' | 'interview' | 'offer' | 'accepted' | 'rejected' | 'withdrawn';
  appliedAt: string;
  updatedAt: string;
  coverLetter?: string;
  notes?: string;
  interviewDate?: string;
  feedback?: string;
}

export const mockApplications: MockApplication[] = [
  {
    id: 'app_mock_001',
    opportunityId: 'opp_mock_001',
    opportunityTitle: 'Strategic FinTech Analytics Team',
    company: 'Goldman Sachs',
    teamId: 'team_demo_001',
    teamName: 'TechFlow Data Science Team',
    status: 'under_review',
    appliedAt: '2025-01-28T09:00:00Z',
    updatedAt: '2025-01-30T14:00:00Z',
    coverLetter: 'Our team has a proven track record in fintech analytics with 3.5 years of cohesive collaboration. We have delivered over 23 successful projects with a 96% client satisfaction rate. We are excited about the opportunity to bring our expertise in machine learning and quantitative finance to Goldman Sachs.',
    notes: 'Strong application - team cohesion score of 94% is impressive.'
  },
  {
    id: 'app_mock_002',
    opportunityId: 'opp_mock_002',
    opportunityTitle: 'Healthcare AI Research Team',
    company: 'MedTech Innovations',
    teamId: 'team_demo_001',
    teamName: 'TechFlow Data Science Team',
    status: 'interview',
    appliedAt: '2025-01-25T11:30:00Z',
    updatedAt: '2025-02-01T10:00:00Z',
    coverLetter: 'While our primary focus has been fintech, our ML expertise is highly transferable to healthcare AI. We have experience with predictive modeling and large dataset analysis that would be valuable for diagnostic systems.',
    interviewDate: '2025-02-05T15:00:00Z',
    notes: 'Interview scheduled with CTO and VP of Engineering'
  },
  {
    id: 'app_mock_003',
    opportunityId: 'opp_mock_004',
    opportunityTitle: 'DevOps & Platform Engineering Team',
    company: 'Scale Labs',
    teamId: 'team_demo_001',
    teamName: 'TechFlow Data Science Team',
    status: 'pending',
    appliedAt: '2025-02-01T16:00:00Z',
    updatedAt: '2025-02-01T16:00:00Z',
    coverLetter: 'We are interested in expanding our capabilities into platform engineering. Our data engineering experience with AWS and large-scale data pipelines provides a strong foundation for DevOps work.'
  }
];

// In-memory storage for applications
let applications = [...mockApplications];

/**
 * Get all applications for a team
 */
export function getMockApplicationsByTeam(teamId: string): MockApplication[] {
  return applications.filter(app => app.teamId === teamId);
}

/**
 * Get all applications for an opportunity
 */
export function getMockApplicationsByOpportunity(opportunityId: string): MockApplication[] {
  return applications.filter(app => app.opportunityId === opportunityId);
}

/**
 * Get a single application by ID
 */
export function getMockApplicationById(id: string): MockApplication | null {
  return applications.find(app => app.id === id) || null;
}

/**
 * Get all applications (for admin/company view)
 */
export function getAllMockApplications(filters?: {
  status?: string;
  opportunityId?: string;
  teamId?: string;
}): { applications: MockApplication[]; total: number } {
  let filtered = [...applications];

  if (filters) {
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.opportunityId) {
      filtered = filtered.filter(app => app.opportunityId === filters.opportunityId);
    }

    if (filters.teamId) {
      filtered = filtered.filter(app => app.teamId === filters.teamId);
    }
  }

  return {
    applications: filtered,
    total: filtered.length
  };
}

/**
 * Create a new application
 */
export function createMockApplication(data: {
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  teamId: string;
  teamName: string;
  coverLetter?: string;
}): MockApplication {
  const newApp: MockApplication = {
    id: `app_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    opportunityId: data.opportunityId,
    opportunityTitle: data.opportunityTitle,
    company: data.company,
    teamId: data.teamId,
    teamName: data.teamName,
    status: 'pending',
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverLetter: data.coverLetter
  };

  applications.push(newApp);
  return newApp;
}

/**
 * Update application status
 */
export function updateMockApplicationStatus(
  id: string,
  status: MockApplication['status'],
  notes?: string
): MockApplication | null {
  const appIndex = applications.findIndex(app => app.id === id);
  if (appIndex === -1) return null;

  applications[appIndex] = {
    ...applications[appIndex],
    status,
    notes: notes || applications[appIndex].notes,
    updatedAt: new Date().toISOString()
  };

  return applications[appIndex];
}

/**
 * Reset applications to initial mock data
 */
export function resetMockApplications(): void {
  applications = [...mockApplications];
}
