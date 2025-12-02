import { DEMO_DATA, DEMO_ACCOUNTS, isDemoAccount } from '@/lib/demo-accounts';
import type { Opportunity, CreateOpportunityData, OpportunityFilters } from '@/types/firebase';

// Helper to check if this is a demo user/entity
const isDemoEntity = (id: string): boolean => {
  if (!id) return false;
  return id.includes('demo') ||
         id === 'demo@example.com' ||
         id === 'company@example.com' ||
         id.startsWith('demo-');
};

// Transform demo opportunity data to match Opportunity type
const transformDemoOpportunity = (opp: typeof DEMO_DATA.opportunities[0]): Opportunity => ({
  id: opp.id,
  title: opp.title,
  description: opp.description,
  companyId: 'company_demo_001',
  status: 'active',
  industry: 'Financial Services',
  location: opp.location,
  skills: opp.requirements,
  compensation: {
    min: 200000,
    max: 350000,
    currency: 'USD',
  },
  viewCount: 150,
  applicantCount: 8,
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as Opportunity);

export interface OpportunitySearchResult {
  opportunities: Opportunity[];
  total: number;
  filters: {
    industries: { value: string; count: number }[];
    locations: { value: string; count: number }[];
    commitment: { value: string; count: number }[];
    compensation: { value: string; count: number }[];
  };
}

export class OpportunityService {
  // Create a new opportunity
  async createOpportunity(data: CreateOpportunityData, companyUserId: string): Promise<string> {
    // Handle demo users - simulate successful opportunity creation
    if (isDemoEntity(companyUserId)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const demoOppId = `demo-opp-${Date.now()}`;
      console.log(`[Demo] Created opportunity: ${data.title} (${demoOppId})`);
      return demoOppId;
    }

    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create opportunity');
      }

      const result = await response.json();
      return result.opportunity?.id || result.data?.id || '';
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw new Error('Failed to create opportunity');
    }
  }

  // Get opportunity by ID
  async getOpportunityById(opportunityId: string): Promise<Opportunity | null> {
    // Handle demo opportunities
    if (isDemoEntity(opportunityId)) {
      const demoOpp = DEMO_DATA.opportunities.find(o => o.id === opportunityId);
      if (demoOpp) {
        return transformDemoOpportunity(demoOpp);
      }
      return null;
    }

    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch opportunity');
      }

      const result = await response.json();
      const opp = result.opportunity || result.data;
      if (!opp) return null;

      return {
        id: opp.id,
        title: opp.title,
        description: opp.description,
        companyId: opp.companyId,
        status: opp.status,
        industry: opp.industry,
        location: opp.location,
        skills: opp.requiredSkills || [],
        compensation: opp.compensationMin ? {
          min: opp.compensationMin,
          max: opp.compensationMax || opp.compensationMin,
          currency: opp.compensationCurrency || 'USD',
        } : undefined,
        viewCount: opp.viewCount || 0,
        applicantCount: opp.applicationsCount || 0,
        createdAt: opp.createdAt ? new Date(opp.createdAt) : new Date(),
        updatedAt: opp.updatedAt ? new Date(opp.updatedAt) : new Date(),
      } as unknown as Opportunity;
    } catch (error) {
      console.error('Error getting opportunity:', error);
      throw new Error('Failed to get opportunity');
    }
  }

  // Search opportunities with filters
  async searchOpportunities(filters: OpportunityFilters, page = 0, pageSize = 10): Promise<OpportunitySearchResult> {
    // Handle demo users - return demo opportunities
    if (isDemoEntity(filters.companyId || '')) {
      const demoOpportunities = DEMO_DATA.opportunities.map(transformDemoOpportunity);
      return {
        opportunities: demoOpportunities,
        total: demoOpportunities.length,
        filters: {
          industries: [],
          locations: [],
          commitment: [],
          compensation: [],
        },
      };
    }

    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.status) {
        const statusArr = Array.isArray(filters.status) ? filters.status : [filters.status];
        statusArr.forEach(s => params.append('status', s));
      }
      if (filters.companyId) params.append('companyId', filters.companyId);
      if (filters.industry?.length) {
        filters.industry.forEach(i => params.append('industry', i));
      }
      if (filters.location?.length) {
        filters.location.forEach(l => params.append('location', l));
      }
      if (filters.limit) params.append('limit', filters.limit.toString());
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/opportunities?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }

      const result = await response.json();
      const opps = result.opportunities || result.data?.opportunities || [];

      const opportunities = opps.map((opp: any) => ({
        id: opp.id,
        title: opp.title,
        description: opp.description,
        companyId: opp.companyId,
        status: opp.status,
        industry: opp.industry,
        location: opp.location,
        skills: opp.requiredSkills || [],
        compensation: opp.compensationMin ? {
          min: opp.compensationMin,
          max: opp.compensationMax || opp.compensationMin,
          currency: opp.compensationCurrency || 'USD',
        } : undefined,
        viewCount: opp.viewCount || 0,
        applicantCount: opp.applicationsCount || 0,
        createdAt: opp.createdAt ? new Date(opp.createdAt) : new Date(),
        updatedAt: opp.updatedAt ? new Date(opp.updatedAt) : new Date(),
      } as unknown as Opportunity));

      return {
        opportunities,
        total: result.total || opportunities.length,
        filters: result.filters || {
          industries: [],
          locations: [],
          commitment: [],
          compensation: [],
        },
      };
    } catch (error) {
      console.error('Error searching opportunities:', error);
      throw new Error('Failed to search opportunities');
    }
  }

  // Get opportunities for a company
  async getCompanyOpportunities(companyUserId: string): Promise<Opportunity[]> {
    // Handle demo users
    if (isDemoEntity(companyUserId)) {
      return DEMO_DATA.opportunities.map(transformDemoOpportunity);
    }

    try {
      const result = await this.searchOpportunities({ companyId: companyUserId, limit: 50 });
      return result.opportunities;
    } catch (error) {
      console.error('Error getting company opportunities:', error);
      throw new Error('Failed to get company opportunities');
    }
  }

  // Update opportunity
  async updateOpportunity(opportunityId: string, updates: Partial<Opportunity>): Promise<void> {
    // Handle demo opportunities
    if (isDemoEntity(opportunityId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Updated opportunity: ${opportunityId}`);
      return;
    }

    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update opportunity');
      }
    } catch (error) {
      console.error('Error updating opportunity:', error);
      throw new Error('Failed to update opportunity');
    }
  }

  // Update opportunity status
  async updateOpportunityStatus(opportunityId: string, status: Opportunity['status']): Promise<void> {
    // Handle demo opportunities
    if (isDemoEntity(opportunityId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Updated opportunity status: ${opportunityId} -> ${status}`);
      return;
    }

    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update opportunity status');
      }
    } catch (error) {
      console.error('Error updating opportunity status:', error);
      throw new Error('Failed to update opportunity status');
    }
  }

  // Increment view count
  async incrementViewCount(opportunityId: string): Promise<void> {
    // Handle demo opportunities - no-op
    if (isDemoEntity(opportunityId)) {
      return;
    }

    try {
      // View count is typically handled server-side when opportunity is fetched
      // This is a no-op for now as the API should handle view tracking
      console.log(`View count increment requested for: ${opportunityId}`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Express interest in opportunity
  async expressInterest(opportunityId: string, teamId: string): Promise<void> {
    // Handle demo opportunities
    if (isDemoEntity(opportunityId) || isDemoEntity(teamId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Expressed interest in opportunity: ${opportunityId}`);
      return;
    }

    try {
      // This would typically create an application or expression of interest
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          teamId,
          type: 'expression_of_interest',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to express interest');
      }
    } catch (error) {
      console.error('Error expressing interest:', error);
      throw new Error('Failed to express interest in opportunity');
    }
  }

  // Get featured opportunities
  async getFeaturedOpportunities(limit = 6): Promise<Opportunity[]> {
    try {
      const result = await this.searchOpportunities({ status: ['active'], limit });
      // Return top opportunities as "featured"
      return result.opportunities.slice(0, limit);
    } catch (error) {
      console.error('Error getting featured opportunities:', error);
      // Return demo opportunities as fallback
      return DEMO_DATA.opportunities.slice(0, limit).map(transformDemoOpportunity);
    }
  }

  // Get opportunity statistics
  async getOpportunityStats(opportunityId?: string): Promise<any> {
    try {
      if (opportunityId) {
        // Get stats for specific opportunity
        const opportunity = await this.getOpportunityById(opportunityId);
        if (!opportunity) throw new Error('Opportunity not found');

        const createdDate = typeof opportunity.createdAt === 'string'
          ? new Date(opportunity.createdAt)
          : opportunity.createdAt instanceof Date
            ? opportunity.createdAt
            : new Date();
        return {
          viewCount: opportunity.viewCount || 0,
          applicantCount: opportunity.applicantCount || 0,
          status: opportunity.status,
          daysActive: Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)),
        };
      } else {
        // Get platform-wide opportunity stats
        return {
          totalOpportunities: 0,
          activeOpportunities: 0,
          totalApplications: 0,
          averageTimeToFill: 0,
        };
      }
    } catch (error) {
      console.error('Error getting opportunity stats:', error);
      throw new Error('Failed to get opportunity statistics');
    }
  }

  // Delete opportunity
  async deleteOpportunity(opportunityId: string): Promise<void> {
    // Handle demo opportunities
    if (isDemoEntity(opportunityId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Deleted opportunity: ${opportunityId}`);
      return;
    }

    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete opportunity');
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      throw new Error('Failed to delete opportunity');
    }
  }

  // Archive opportunity
  async archiveOpportunity(opportunityId: string): Promise<void> {
    await this.updateOpportunityStatus(opportunityId, 'archived' as Opportunity['status']);
  }

  // Feature opportunity
  async featureOpportunity(opportunityId: string, featured: boolean): Promise<void> {
    await this.updateOpportunity(opportunityId, { featured } as Partial<Opportunity>);
  }
}

export const opportunityService = new OpportunityService();