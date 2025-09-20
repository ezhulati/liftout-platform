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
  limit as firestoreLimit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isDemoAccount, DEMO_ACCOUNTS } from '@/lib/demo-accounts';
import type { Application, CreateApplicationData, ApplicationFilters } from '@/types/applications';

const APPLICATIONS_COLLECTION = 'applications';

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
    availabilityTimeline: "Available to start within 8 weeks with 2-week notice period",
    compensationExpectations: {
      min: 240000,
      max: 320000,
      currency: 'USD',
      negotiable: true
    },
    teamDetails: {
      currentCompany: 'TechFlow Analytics',
      yearsWorkingTogether: 3.5,
      teamSize: 4,
      keyAchievements: [
        'Reduced fraud detection false positives by 35%',
        'Generated $2.1M+ annual savings',
        'Led 23 successful projects with 96% client satisfaction'
      ]
    }
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
    teamDetails: {
      currentCompany: 'TechFlow Analytics',
      yearsWorkingTogether: 3.5,
      teamSize: 4,
      keyAchievements: [
        'Published 3 papers on medical ML applications',
        'Built FDA-compliant data processing pipelines',
        'Experience with HIPAA and medical data regulations'
      ]
    }
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
    availabilityTimeline: "Can start immediately with 1-week notice",
    compensationExpectations: {
      min: 200000,
      max: 280000,
      currency: 'USD',
      negotiable: true
    },
    teamDetails: {
      currentCompany: 'TechFlow Analytics',
      yearsWorkingTogether: 3.5,
      teamSize: 4,
      keyAchievements: [
        'Built real-time trading analytics systems',
        'Expertise in market microstructure',
        'Strong performance under pressure'
      ]
    }
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
    availabilityTimeline: "Available within 12 weeks",
    compensationExpectations: {
      min: 250000,
      max: 350000,
      currency: 'USD',
      negotiable: true
    },
    companyNotes: "Strong technical team but lacks enterprise and supply chain domain expertise. Looking for teams with direct industry experience.",
    teamDetails: {
      currentCompany: 'TechFlow Analytics',
      yearsWorkingTogether: 3.5,
      teamSize: 4,
      keyAchievements: [
        'Excellent technical execution',
        'Strong team dynamics',
        'Limited enterprise experience'
      ]
    }
  }
];

// Demo applications for company user (Sarah Rodriguez at NextGen Financial)
const DEMO_COMPANY_APPLICATIONS: Application[] = [
  {
    id: 'app_company_001',
    opportunityId: 'opp_001',
    teamId: 'team_external_001',
    companyId: 'company_demo_001',
    applicantUserId: 'external_team_lead@goldman.com',
    status: 'pending',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    viewedByCompany: false,
    coverLetter: "The QuantRisk Analytics team at Goldman Sachs is intrigued by NextGen Financial's expansion into institutional trading. Our team has 4.2 years of experience working together and has built real-time risk monitoring systems for portfolios exceeding $50B. We're seeking a strategic opportunity that offers greater autonomy and equity participation while maintaining our focus on cutting-edge quantitative finance.",
    availabilityTimeline: "Available within 16 weeks with proper transition planning",
    compensationExpectations: {
      min: 350000,
      max: 500000,
      currency: 'USD',
      negotiable: true
    },
    teamDetails: {
      currentCompany: 'Goldman Sachs',
      yearsWorkingTogether: 4.2,
      teamSize: 5,
      keyAchievements: [
        'Reduced VaR calculation time by 60%',
        'Built real-time risk monitoring for $50B portfolio',
        'Published 8 papers in top finance journals'
      ]
    }
  },
  {
    id: 'app_company_002',
    opportunityId: 'opp_001',
    teamId: 'team_external_002',
    companyId: 'company_demo_001',
    applicantUserId: 'team_lead@jpmorgan.com',
    status: 'under_review',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "Our derivatives trading analytics team at JPMorgan Chase has been following NextGen Financial's growth trajectory with great interest. With 3.8 years as a cohesive unit, we've developed sophisticated algorithms for options pricing and volatility modeling. We're attracted to your innovative culture and the opportunity to build a new quantitative division from the ground up.",
    availabilityTimeline: "Flexible timing, prefer Q2 2024 start",
    compensationExpectations: {
      min: 320000,
      max: 450000,
      currency: 'USD',
      negotiable: true
    },
    teamDetails: {
      currentCompany: 'JPMorgan Chase',
      yearsWorkingTogether: 3.8,
      teamSize: 4,
      keyAchievements: [
        'Developed proprietary options pricing models',
        'Managed $25B+ in derivatives exposure',
        'Achieved 97% accuracy in volatility predictions'
      ]
    }
  },
  {
    id: 'app_company_003',
    opportunityId: 'opp_ng_002',
    teamId: 'team_external_003',
    companyId: 'company_demo_001',
    applicantUserId: 'ai_team@mit.edu',
    status: 'accepted',
    submittedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    viewedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
    viewedByCompany: true,
    coverLetter: "The MIT Applied AI Research team is excited about NextGen Financial's vision for AI-powered financial services. Our interdisciplinary team combines machine learning expertise with financial modeling, having published 15+ papers on algorithmic trading and market prediction. We're ready to transition from academic research to industry application.",
    availabilityTimeline: "Ready to start January 2024",
    compensationExpectations: {
      min: 280000,
      max: 380000,
      currency: 'USD',
      negotiable: true
    },
    companyNotes: "Exceptional academic credentials and research output. Strong fit for our AI initiatives. Terms agreed upon.",
    teamDetails: {
      currentCompany: 'MIT',
      yearsWorkingTogether: 2.5,
      teamSize: 6,
      keyAchievements: [
        'Published 15+ papers on financial AI',
        'Developed novel deep learning architectures',
        'NSF grant recipients for $2.5M research project'
      ]
    }
  }
];

export class ApplicationService {
  // Create a new application
  async createApplication(data: CreateApplicationData, applicantUserId: string): Promise<string> {
    try {
      const applicationData = {
        ...data,
        applicantUserId,
        status: 'pending' as const,
        submittedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        documents: [], // TODO: Handle file uploads
        viewedByCompany: false,
      };

      const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), applicationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating application:', error);
      throw new Error('Failed to create application');
    }
  }

  // Get application by ID
  async getApplicationById(applicationId: string): Promise<Application | null> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          submittedAt: data.submittedAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          viewedAt: data.viewedAt?.toDate(),
        } as Application;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting application:', error);
      throw new Error('Failed to get application');
    }
  }

  // Get applications for a team
  async getTeamApplications(teamId: string): Promise<Application[]> {
    console.log('getTeamApplications called with teamId:', teamId);
    console.log('isDemoAccount(teamId):', isDemoAccount(teamId));
    
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
      // Try the optimized query with composite index first
      const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        where('teamId', '==', teamId),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          viewedAt: data.viewedAt?.toDate(),
        } as Application;
      });
    } catch (error: any) {
      console.error('Error getting team applications:', error);
      
      // If the error is about missing index, try fallback query without ordering
      if (error.message?.includes('index') || error.code === 'failed-precondition') {
        console.log('Composite index not available, using fallback query without ordering');
        try {
          const fallbackQuery = query(
            collection(db, APPLICATIONS_COLLECTION),
            where('teamId', '==', teamId)
          );
          
          const fallbackSnapshot = await getDocs(fallbackQuery);
          const applications = fallbackSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              submittedAt: data.submittedAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
              viewedAt: data.viewedAt?.toDate(),
            } as Application;
          });
          
          // Sort in memory as fallback
          return applications.sort((a, b) => {
            const dateA = a.submittedAt || new Date(0);
            const dateB = b.submittedAt || new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          throw new Error('Failed to get team applications');
        }
      }
      
      throw new Error('Failed to get team applications');
    }
  }

  // Get applications for an opportunity (for companies)
  async getOpportunityApplications(opportunityId: string): Promise<Application[]> {
    try {
      const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        where('opportunityId', '==', opportunityId),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          viewedAt: data.viewedAt?.toDate(),
        } as Application;
      });
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
      // First get all opportunities posted by this company
      const opportunitiesQuery = query(
        collection(db, 'opportunities'),
        where('companyId', '==', companyUserId)
      );
      
      const opportunitiesSnapshot = await getDocs(opportunitiesQuery);
      const opportunityIds = opportunitiesSnapshot.docs.map(doc => doc.id);
      
      if (opportunityIds.length === 0) {
        return [];
      }

      // Get applications for these opportunities
      const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        where('opportunityId', 'in', opportunityIds),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          viewedAt: data.viewedAt?.toDate(),
        } as Application;
      });
    } catch (error) {
      console.error('Error getting company applications:', error);
      throw new Error('Failed to get company applications');
    }
  }

  // Update application status
  async updateApplicationStatus(applicationId: string, status: Application['status'], companyNotes?: string): Promise<void> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
      const updateData: any = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (companyNotes) {
        updateData.companyNotes = companyNotes;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating application status:', error);
      throw new Error('Failed to update application status');
    }
  }

  // Mark application as viewed by company
  async markAsViewed(applicationId: string): Promise<void> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
      await updateDoc(docRef, {
        viewedByCompany: true,
        viewedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error marking application as viewed:', error);
      throw new Error('Failed to mark application as viewed');
    }
  }

  // Withdraw application (for teams)
  async withdrawApplication(applicationId: string): Promise<void> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
      await updateDoc(docRef, {
        status: 'withdrawn',
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw new Error('Failed to withdraw application');
    }
  }

  // Schedule interview
  async scheduleInterview(applicationId: string, interviewDetails: Application['interviewDetails']): Promise<void> {
    try {
      const docRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
      await updateDoc(docRef, {
        status: 'interview_scheduled',
        interviewDetails: {
          ...interviewDetails,
          scheduledDate: Timestamp.fromDate(interviewDetails!.scheduledDate),
        },
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw new Error('Failed to schedule interview');
    }
  }

  // Check if team has already applied to opportunity
  async hasTeamApplied(teamId: string, opportunityId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        where('teamId', '==', teamId),
        where('opportunityId', '==', opportunityId),
        firestoreLimit(1)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking if team has applied:', error);
      return false;
    }
  }

  // Get application statistics
  async getApplicationStats(filters?: { companyUserId?: string; teamId?: string }): Promise<any> {
    try {
      let baseQuery = collection(db, APPLICATIONS_COLLECTION);
      
      // Apply filters if provided
      if (filters?.companyUserId) {
        // Get company's opportunities first
        const opportunitiesQuery = query(
          collection(db, 'opportunities'),
          where('companyId', '==', filters.companyUserId)
        );
        
        const opportunitiesSnapshot = await getDocs(opportunitiesQuery);
        const opportunityIds = opportunitiesSnapshot.docs.map(doc => doc.id);
        
        if (opportunityIds.length === 0) {
          return { total: 0, pending: 0, underReview: 0, interviewScheduled: 0, accepted: 0, rejected: 0 };
        }

        baseQuery = query(baseQuery, where('opportunityId', 'in', opportunityIds));
      } else if (filters?.teamId) {
        baseQuery = query(baseQuery, where('teamId', '==', filters.teamId));
      }

      const querySnapshot = await getDocs(baseQuery);
      const applications = querySnapshot.docs.map(doc => doc.data());

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