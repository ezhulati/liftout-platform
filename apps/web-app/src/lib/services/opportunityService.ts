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
import type { Opportunity, CreateOpportunityData, OpportunityFilters } from '@/types/firebase';

const OPPORTUNITIES_COLLECTION = 'opportunities';

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
    try {
      const opportunityData = {
        ...data,
        companyId: companyUserId,
        status: 'active' as const,
        postedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        views: 0,
        applications: 0,
        expressionsOfInterest: 0,
      };

      const docRef = await addDoc(collection(db, OPPORTUNITIES_COLLECTION), opportunityData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw new Error('Failed to create opportunity');
    }
  }

  // Get opportunity by ID
  async getOpportunityById(opportunityId: string): Promise<Opportunity | null> {
    try {
      const docRef = doc(db, OPPORTUNITIES_COLLECTION, opportunityId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        return {
          id: docSnap.id,
          ...(data as object),
          postedAt: data.postedAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          deadline: data.deadline?.toDate(),
        } as unknown as Opportunity;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting opportunity:', error);
      throw new Error('Failed to get opportunity');
    }
  }

  // Search opportunities with filters
  async searchOpportunities(filters: OpportunityFilters, page = 0, pageSize = 10): Promise<OpportunitySearchResult> {
    try {
      let q = collection(db, OPPORTUNITIES_COLLECTION);
      const constraints = [];

      // Apply filters
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters.companyId) {
        constraints.push(where('companyId', '==', filters.companyId));
      }
      
      if (filters.industry?.length) {
        constraints.push(where('industry', 'array-contains-any', filters.industry));
      }
      
      if (filters.location) {
        constraints.push(where('location', '==', filters.location));
      }
      
      // remotePolicy filter removed - property doesn't exist
      // commitment filter removed - property doesn't exist

      // Add ordering and pagination
      constraints.push(orderBy('postedAt', 'desc'));
      constraints.push(firestoreLimit(filters.limit || pageSize));

      const finalQuery = query(q, ...constraints);
      const querySnapshot = await getDocs(finalQuery);
      
      const opportunities = querySnapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...(data as object),
          postedAt: data.postedAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          deadline: data.deadline?.toDate(),
        } as unknown as Opportunity;
      });

      // TODO: Implement aggregation for filter counts
      const filterCounts = {
        industries: [],
        locations: [],
        commitment: [],
        compensation: [],
      };

      return {
        opportunities,
        total: opportunities.length, // TODO: Get actual count
        filters: filterCounts,
      };
    } catch (error) {
      console.error('Error searching opportunities:', error);
      throw new Error('Failed to search opportunities');
    }
  }

  // Get opportunities for a company
  async getCompanyOpportunities(companyUserId: string): Promise<Opportunity[]> {
    try {
      const q = query(
        collection(db, OPPORTUNITIES_COLLECTION),
        where('companyId', '==', companyUserId),
        orderBy('postedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...(data as object),
          postedAt: data.postedAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          deadline: data.deadline?.toDate(),
        } as unknown as Opportunity;
      });
    } catch (error) {
      console.error('Error getting company opportunities:', error);
      throw new Error('Failed to get company opportunities');
    }
  }

  // Update opportunity
  async updateOpportunity(opportunityId: string, updates: Partial<Opportunity>): Promise<void> {
    try {
      const docRef = doc(db, OPPORTUNITIES_COLLECTION, opportunityId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating opportunity:', error);
      throw new Error('Failed to update opportunity');
    }
  }

  // Update opportunity status
  async updateOpportunityStatus(opportunityId: string, status: Opportunity['status']): Promise<void> {
    try {
      const docRef = doc(db, OPPORTUNITIES_COLLECTION, opportunityId);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating opportunity status:', error);
      throw new Error('Failed to update opportunity status');
    }
  }

  // Increment view count
  async incrementViewCount(opportunityId: string): Promise<void> {
    try {
      const opportunity = await this.getOpportunityById(opportunityId);
      if (!opportunity) return;

      const docRef = doc(db, OPPORTUNITIES_COLLECTION, opportunityId);
      await updateDoc(docRef, {
        viewCount: (opportunity.viewCount || 0) + 1,
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Express interest in opportunity
  async expressInterest(opportunityId: string, teamId: string): Promise<void> {
    try {
      const opportunity = await this.getOpportunityById(opportunityId);
      if (!opportunity) throw new Error('Opportunity not found');

      const docRef = doc(db, OPPORTUNITIES_COLLECTION, opportunityId);
      await updateDoc(docRef, {
        applicantCount: (opportunity.applicantCount || 0) + 1,
        updatedAt: Timestamp.now(),
      });
      
      // TODO: Add notification system to notify company of interest
    } catch (error) {
      console.error('Error expressing interest:', error);
      throw new Error('Failed to express interest in opportunity');
    }
  }

  // Get featured opportunities
  async getFeaturedOpportunities(limit = 6): Promise<Opportunity[]> {
    try {
      const q = query(
        collection(db, OPPORTUNITIES_COLLECTION),
        where('status', '==', 'active'),
        where('featured', '==', true),
        orderBy('postedAt', 'desc'),
        firestoreLimit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...(data as object),
          postedAt: data.postedAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          deadline: data.deadline?.toDate(),
        } as unknown as Opportunity;
      });
    } catch (error) {
      console.error('Error getting featured opportunities:', error);
      throw new Error('Failed to get featured opportunities');
    }
  }

  // Get opportunity statistics
  async getOpportunityStats(opportunityId?: string): Promise<any> {
    try {
      if (opportunityId) {
        // Get stats for specific opportunity
        const opportunity = await this.getOpportunityById(opportunityId);
        if (!opportunity) throw new Error('Opportunity not found');
        
        return {
          views: opportunity.views || 0,
          applications: opportunity.applications || 0,
          expressionsOfInterest: opportunity.expressionsOfInterest || 0,
          status: opportunity.status,
          daysActive: Math.floor((new Date().getTime() - opportunity.postedAt.getTime()) / (1000 * 60 * 60 * 24)),
        };
      } else {
        // Get platform-wide opportunity stats
        // TODO: Implement aggregation queries
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
    try {
      const docRef = doc(db, OPPORTUNITIES_COLLECTION, opportunityId);
      await updateDoc(docRef, {
        status: 'closed',
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      throw new Error('Failed to delete opportunity');
    }
  }

  // Archive opportunity
  async archiveOpportunity(opportunityId: string): Promise<void> {
    try {
      const docRef = doc(db, OPPORTUNITIES_COLLECTION, opportunityId);
      await updateDoc(docRef, {
        status: 'archived',
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error archiving opportunity:', error);
      throw new Error('Failed to archive opportunity');
    }
  }

  // Feature opportunity
  async featureOpportunity(opportunityId: string, featured: boolean): Promise<void> {
    try {
      const docRef = doc(db, OPPORTUNITIES_COLLECTION, opportunityId);
      await updateDoc(docRef, {
        featured,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error featuring opportunity:', error);
      throw new Error('Failed to feature opportunity');
    }
  }
}

export const opportunityService = new OpportunityService();