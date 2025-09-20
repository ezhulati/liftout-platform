import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  onSnapshot,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '@/types/firebase';
import type {
  User,
  Team,
  TeamMember,
  Opportunity,
  Application,
  Conversation,
  Message,
  DueDiligenceCase,
  Analytics,
  Notification,
  CompanyProfile,
  MarketData,
} from '@/types/firebase';

// Generic Firestore operations
class FirestoreService {
  // Create document
  async create<T extends DocumentData>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, collectionName), docData);
    return docRef.id;
  }

  // Get document by ID
  async getById<T extends DocumentData>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;
    }
    
    return null;
  }

  // Update document
  async update<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete document
  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

  // Query documents
  async query<T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    limitCount?: number
  ): Promise<T[]> {
    const queryConstraints = [...constraints];
    if (limitCount) {
      queryConstraints.push(limit(limitCount));
    }

    const q = query(collection(db, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  // Real-time listener
  subscribe<T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    callback: (data: T[]) => void,
    limitCount?: number
  ): () => void {
    const queryConstraints = [...constraints];
    if (limitCount) {
      queryConstraints.push(limit(limitCount));
    }

    const q = query(collection(db, collectionName), ...queryConstraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      callback(data);
    });
  }

  // Paginated query
  async queryPaginated<T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    limitCount: number = 20,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ data: T[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const queryConstraints = [...constraints, limit(limitCount)];
    
    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    
    return { data, lastDoc: lastVisible };
  }
}

// Service instance
export const firestoreService = new FirestoreService();

// Specific service classes for each entity
export class UserService {
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return firestoreService.create<User>(COLLECTIONS.USERS, userData);
  }

  async getUserById(id: string): Promise<User | null> {
    return firestoreService.getById<User>(COLLECTIONS.USERS, id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await firestoreService.query<User>(
      COLLECTIONS.USERS,
      [where('email', '==', email)],
      1
    );
    return users[0] || null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<void> {
    return firestoreService.update<User>(COLLECTIONS.USERS, id, data);
  }

  async updateLastLogin(id: string): Promise<void> {
    return firestoreService.update<User>(COLLECTIONS.USERS, id, {
      lastLoginAt: serverTimestamp() as any,
    });
  }
}

export class TeamService {
  async createTeam(teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return firestoreService.create<Team>(COLLECTIONS.TEAMS, teamData);
  }

  async getTeamById(id: string): Promise<Team | null> {
    return firestoreService.getById<Team>(COLLECTIONS.TEAMS, id);
  }

  async getTeamsByLeader(leaderId: string): Promise<Team[]> {
    return firestoreService.query<Team>(
      COLLECTIONS.TEAMS,
      [where('leaderId', '==', leaderId)]
    );
  }

  async getTeamsByMember(memberId: string): Promise<Team[]> {
    return firestoreService.query<Team>(
      COLLECTIONS.TEAMS,
      [where('memberIds', 'array-contains', memberId)]
    );
  }

  async searchTeams(filters: {
    industry?: string;
    location?: string;
    minSize?: number;
    maxSize?: number;
    skills?: string[];
    availability?: string;
  }): Promise<Team[]> {
    const constraints: QueryConstraint[] = [
      where('visibility', 'in', ['public', 'selective']),
      where('availability.status', 'in', ['available', 'selective'])
    ];

    if (filters.industry) {
      constraints.push(where('industry', '==', filters.industry));
    }
    if (filters.location) {
      constraints.push(where('location', '==', filters.location));
    }
    if (filters.minSize) {
      constraints.push(where('size', '>=', filters.minSize));
    }
    if (filters.maxSize) {
      constraints.push(where('size', '<=', filters.maxSize));
    }
    if (filters.skills && filters.skills.length > 0) {
      constraints.push(where('skills', 'array-contains-any', filters.skills));
    }

    return firestoreService.query<Team>(COLLECTIONS.TEAMS, constraints);
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<void> {
    return firestoreService.update<Team>(COLLECTIONS.TEAMS, id, data);
  }

  async incrementProfileViews(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TEAMS, id);
    await updateDoc(docRef, {
      profileViews: increment(1),
      updatedAt: serverTimestamp(),
    });
  }

  async addMember(teamId: string, memberId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TEAMS, teamId);
    await updateDoc(docRef, {
      memberIds: arrayUnion(memberId),
      updatedAt: serverTimestamp(),
    });
  }

  async removeMember(teamId: string, memberId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TEAMS, teamId);
    await updateDoc(docRef, {
      memberIds: arrayRemove(memberId),
      updatedAt: serverTimestamp(),
    });
  }
}

export class OpportunityService {
  async createOpportunity(opportunityData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return firestoreService.create<Opportunity>(COLLECTIONS.OPPORTUNITIES, opportunityData);
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    return firestoreService.getById<Opportunity>(COLLECTIONS.OPPORTUNITIES, id);
  }

  async getOpportunitiesByCompany(companyId: string): Promise<Opportunity[]> {
    return firestoreService.query<Opportunity>(
      COLLECTIONS.OPPORTUNITIES,
      [where('companyId', '==', companyId), orderBy('createdAt', 'desc')]
    );
  }

  async searchOpportunities(filters: {
    industry?: string;
    location?: string;
    type?: string;
    minCompensation?: number;
    maxCompensation?: number;
    skills?: string[];
  }): Promise<Opportunity[]> {
    const constraints: QueryConstraint[] = [
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    ];

    if (filters.industry) {
      constraints.push(where('industry', '==', filters.industry));
    }
    if (filters.location) {
      constraints.push(where('location', '==', filters.location));
    }
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }
    if (filters.skills && filters.skills.length > 0) {
      constraints.push(where('skills', 'array-contains-any', filters.skills));
    }

    return firestoreService.query<Opportunity>(COLLECTIONS.OPPORTUNITIES, constraints);
  }

  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<void> {
    return firestoreService.update<Opportunity>(COLLECTIONS.OPPORTUNITIES, id, data);
  }

  async incrementViewCount(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.OPPORTUNITIES, id);
    await updateDoc(docRef, {
      viewCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  }
}

export class ApplicationService {
  async createApplication(applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Also increment applicant count on the opportunity
    const opportunityRef = doc(db, COLLECTIONS.OPPORTUNITIES, applicationData.opportunityId);
    await updateDoc(opportunityRef, {
      applicantCount: increment(1),
      updatedAt: serverTimestamp(),
    });

    return firestoreService.create<Application>(COLLECTIONS.APPLICATIONS, applicationData);
  }

  async getApplicationById(id: string): Promise<Application | null> {
    return firestoreService.getById<Application>(COLLECTIONS.APPLICATIONS, id);
  }

  async getApplicationsByTeam(teamId: string): Promise<Application[]> {
    return firestoreService.query<Application>(
      COLLECTIONS.APPLICATIONS,
      [where('teamId', '==', teamId), orderBy('createdAt', 'desc')]
    );
  }

  async getApplicationsByCompany(companyId: string): Promise<Application[]> {
    return firestoreService.query<Application>(
      COLLECTIONS.APPLICATIONS,
      [where('companyId', '==', companyId), orderBy('createdAt', 'desc')]
    );
  }

  async getApplicationsByOpportunity(opportunityId: string): Promise<Application[]> {
    return firestoreService.query<Application>(
      COLLECTIONS.APPLICATIONS,
      [where('opportunityId', '==', opportunityId), orderBy('createdAt', 'desc')]
    );
  }

  async updateApplicationStatus(id: string, status: Application['status']): Promise<void> {
    return firestoreService.update<Application>(COLLECTIONS.APPLICATIONS, id, {
      status,
      'timeline.lastUpdatedAt': serverTimestamp() as any,
    });
  }
}

export class MessagingService {
  async createConversation(conversationData: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return firestoreService.create<Conversation>(COLLECTIONS.CONVERSATIONS, conversationData);
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return firestoreService.query<Conversation>(
      COLLECTIONS.CONVERSATIONS,
      [where('participants', 'array-contains', userId), orderBy('updatedAt', 'desc')]
    );
  }

  async sendMessage(messageData: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Update conversation's last message
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, messageData.conversationId);
    await updateDoc(conversationRef, {
      lastMessage: {
        content: messageData.content,
        senderId: messageData.senderId,
        timestamp: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });

    return firestoreService.create<Message>(COLLECTIONS.MESSAGES, messageData);
  }

  async getMessagesByConversation(conversationId: string, limitCount: number = 50): Promise<Message[]> {
    return firestoreService.query<Message>(
      COLLECTIONS.MESSAGES,
      [where('conversationId', '==', conversationId), orderBy('createdAt', 'desc')],
      limitCount
    );
  }

  subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void): () => void {
    return firestoreService.subscribe<Message>(
      COLLECTIONS.MESSAGES,
      [where('conversationId', '==', conversationId), orderBy('createdAt', 'asc')],
      callback
    );
  }
}

export class NotificationService {
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return firestoreService.create<Notification>(COLLECTIONS.NOTIFICATIONS, notificationData);
  }

  async getNotificationsByUser(userId: string, unreadOnly = false): Promise<Notification[]> {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ];

    if (unreadOnly) {
      constraints.push(where('status', '==', 'unread'));
    }

    return firestoreService.query<Notification>(COLLECTIONS.NOTIFICATIONS, constraints);
  }

  async markAsRead(id: string): Promise<void> {
    return firestoreService.update<Notification>(COLLECTIONS.NOTIFICATIONS, id, {
      status: 'read',
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.getNotificationsByUser(userId, true);
    const updatePromises = notifications.map(notification =>
      this.markAsRead(notification.id)
    );
    await Promise.all(updatePromises);
  }

  subscribeToUserNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    return firestoreService.subscribe<Notification>(
      COLLECTIONS.NOTIFICATIONS,
      [where('userId', '==', userId), orderBy('createdAt', 'desc')],
      callback,
      50
    );
  }
}

// Export service instances
export const userService = new UserService();
export const teamService = new TeamService();
export const opportunityService = new OpportunityService();
export const applicationService = new ApplicationService();
export const messagingService = new MessagingService();
export const notificationService = new NotificationService();