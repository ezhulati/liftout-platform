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
  startAfter,
  Timestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { 
  TeamProfile, 
  CreateTeamData, 
  TeamFilters, 
  TeamSearchResult,
  TeamMember,
  TeamVerification
} from '@/types/teams';

const TEAMS_COLLECTION = 'teams';
const TEAM_DOCUMENTS_PATH = 'team-documents';

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
      const teamData = {
        ...data,
        leaderId: creatorUserId,
        size: data.members.length,
        establishedDate: new Date(),
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
        verification: {
          status: 'pending',
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
        tags: [...data.industry, ...data.specializations],
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: creatorUserId,
        viewCount: 0,
        expressionsOfInterest: 0,
        activeOpportunities: 0,
      };

      const docRef = await addDoc(collection(db, TEAMS_COLLECTION), teamData as any);
      return docRef.id;
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team profile');
    }
  }

  // Get team by ID
  async getTeamById(teamId: string): Promise<TeamProfile | null> {
    try {
      const docRef = doc(db, TEAMS_COLLECTION, teamId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          establishedDate: data.establishedDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          verification: {
            ...data.verification,
            verifiedAt: data.verification?.verifiedAt?.toDate(),
            documents: data.verification?.documents?.map((doc: any) => ({
              ...doc,
              uploadedAt: doc.uploadedAt?.toDate(),
            })) || [],
            backgroundChecks: data.verification?.backgroundChecks?.map((check: any) => ({
              ...check,
              completedAt: check.completedAt?.toDate(),
            })) || [],
            references: data.verification?.references?.map((ref: any) => ({
              ...ref,
              contactedAt: ref.contactedAt?.toDate(),
            })) || [],
          },
          liftoutHistory: {
            ...data.liftoutHistory,
            previousLiftouts: data.liftoutHistory?.previousLiftouts?.map((liftout: any) => ({
              ...liftout,
              date: liftout.date?.toDate(),
            })) || [],
          },
          testimonials: data.testimonials?.map((testimonial: any) => ({
            ...testimonial,
            date: testimonial.date?.toDate(),
          })) || [],
          members: data.members?.map((member: any) => ({
            ...member,
            joinedTeamDate: member.joinedTeamDate?.toDate(),
          })) || [],
        } as TeamProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting team:', error);
      throw new Error('Failed to get team profile');
    }
  }

  // Search teams with filters
  async searchTeams(filters: TeamFilters, page = 0, pageSize = 10): Promise<TeamSearchResult> {
    try {
      let q = collection(db, TEAMS_COLLECTION);
      const constraints = [];

      // Apply filters
      if (filters.industry?.length) {
        constraints.push(where('industry', 'array-contains-any', filters.industry));
      }
      
      if (filters.specializations?.length) {
        constraints.push(where('specializations', 'array-contains-any', filters.specializations));
      }
      
      if (filters.remote !== undefined) {
        constraints.push(where('location.remote', '==', filters.remote));
      }
      
      if (filters.availability) {
        constraints.push(where('availability.status', '==', filters.availability));
      }
      
      if (filters.verified) {
        constraints.push(where('verification.status', '==', 'verified'));
      }

      if (filters.teamSize) {
        constraints.push(where('size', '>=', filters.teamSize.min));
        constraints.push(where('size', '<=', filters.teamSize.max));
      }

      // Add ordering and pagination
      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(firestoreLimit(pageSize));

      const finalQuery = query(q, ...constraints);
      const querySnapshot = await getDocs(finalQuery);
      
      const teams = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          establishedDate: data.establishedDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          // Simplified for list view
          members: data.members?.map((member: any) => ({
            ...member,
            joinedTeamDate: member.joinedTeamDate?.toDate(),
          })) || [],
        } as TeamProfile;
      });

      // TODO: Implement aggregation for filter counts
      const filterCounts = {
        industries: [],
        specializations: [],
        locations: [],
        experienceLevels: [],
      };

      return {
        teams,
        total: teams.length, // TODO: Get actual count
        filters: filterCounts,
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
      const docRef = doc(db, TEAMS_COLLECTION, teamId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
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
    try {
      const fileName = `${teamId}/${documentType}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${TEAM_DOCUMENTS_PATH}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update team document list
      const teamRef = doc(db, TEAMS_COLLECTION, teamId);
      await updateDoc(teamRef, {
        'verification.documents': arrayUnion({
          type: documentType,
          url: downloadURL,
          uploadedAt: Timestamp.now(),
          verified: false,
        }),
        updatedAt: Timestamp.now(),
      });
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload verification document');
    }
  }

  // Submit team for verification
  async submitForVerification(teamId: string): Promise<void> {
    try {
      const docRef = doc(db, TEAMS_COLLECTION, teamId);
      await updateDoc(docRef, {
        'verification.status': 'in_progress',
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error submitting for verification:', error);
      throw new Error('Failed to submit team for verification');
    }
  }

  // Add team member
  async addTeamMember(teamId: string, member: Omit<TeamMember, 'id' | 'verified'>): Promise<void> {
    try {
      const teamRef = doc(db, TEAMS_COLLECTION, teamId);
      const memberWithId = {
        ...member,
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        verified: false,
      };
      
      await updateDoc(teamRef, {
        members: arrayUnion(memberWithId),
        size: increment(1),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      throw new Error('Failed to add team member');
    }
  }

  // Remove team member
  async removeTeamMember(teamId: string, memberId: string): Promise<void> {
    try {
      const team = await this.getTeamById(teamId);
      if (!team) throw new Error('Team not found');
      
      const updatedMembers = team.members.filter(member => member.id !== memberId);
      
      const teamRef = doc(db, TEAMS_COLLECTION, teamId);
      await updateDoc(teamRef, {
        members: updatedMembers,
        size: increment(-1),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error removing team member:', error);
      throw new Error('Failed to remove team member');
    }
  }

  // Add reference for verification
  async addReference(teamId: string, reference: TeamVerification['references'][0]): Promise<void> {
    try {
      const teamRef = doc(db, TEAMS_COLLECTION, teamId);
      await updateDoc(teamRef, {
        'verification.references': arrayUnion(reference),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding reference:', error);
      throw new Error('Failed to add reference');
    }
  }

  // Add testimonial
  async addTestimonial(teamId: string, testimonial: Omit<TeamProfile['testimonials'][0], 'id'>): Promise<void> {
    try {
      const testimonialWithId = {
        ...testimonial,
        id: `testimonial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: Timestamp.now(),
        verified: false,
      };
      
      const teamRef = doc(db, TEAMS_COLLECTION, teamId);
      await updateDoc(teamRef, {
        testimonials: arrayUnion(testimonialWithId),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw new Error('Failed to add testimonial');
    }
  }

  // Increment view count
  async incrementViewCount(teamId: string): Promise<void> {
    try {
      const teamRef = doc(db, TEAMS_COLLECTION, teamId);
      await updateDoc(teamRef, {
        viewCount: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Express interest in team
  async expressInterest(teamId: string, companyUserId: string): Promise<void> {
    try {
      const teamRef = doc(db, TEAMS_COLLECTION, teamId);
      await updateDoc(teamRef, {
        expressionsOfInterest: increment(1),
        updatedAt: Timestamp.now(),
      });
      
      // TODO: Add notification system to notify team of interest
    } catch (error) {
      console.error('Error expressing interest:', error);
      throw new Error('Failed to express interest in team');
    }
  }

  // Get teams by user (for team leads)
  async getTeamsByUser(userId: string): Promise<TeamProfile[]> {
    try {
      const q = query(
        collection(db, TEAMS_COLLECTION),
        where('leaderId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          establishedDate: data.establishedDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          members: data.members?.map((member: any) => ({
            ...member,
            joinedTeamDate: member.joinedTeamDate?.toDate(),
          })) || [],
        } as TeamProfile;
      });
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
      const q = query(
        collection(db, TEAMS_COLLECTION),
        where('featured', '==', true),
        where('verification.status', '==', 'verified'),
        orderBy('viewCount', 'desc'),
        firestoreLimit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          establishedDate: data.establishedDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          members: data.members?.map((member: any) => ({
            ...member,
            joinedTeamDate: member.joinedTeamDate?.toDate(),
          })) || [],
        } as TeamProfile;
      });
    } catch (error) {
      console.error('Error getting featured teams:', error);
      throw new Error('Failed to get featured teams');
    }
  }

  // Get team statistics
  async getTeamStats(teamId?: string): Promise<any> {
    try {
      if (teamId) {
        // Get stats for specific team
        const team = await this.getTeamById(teamId);
        if (!team) throw new Error('Team not found');
        
        return {
          profileViews: team.viewCount,
          expressionsOfInterest: team.expressionsOfInterest,
          activeOpportunities: team.activeOpportunities,
          verificationStatus: team.verification.status,
          teamSize: team.size,
          establishedYears: new Date().getFullYear() - team.establishedDate.getFullYear(),
        };
      } else {
        // Get platform-wide team stats
        // TODO: Implement aggregation queries
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