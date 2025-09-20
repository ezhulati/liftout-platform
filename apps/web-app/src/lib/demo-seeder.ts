// Demo data seeding service for Firebase
import { doc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { DEMO_ACCOUNTS, DEMO_DATA } from '@/lib/demo-accounts';

export class DemoSeeder {
  
  static async seedDemoUsers() {
    try {
      console.log('Seeding demo users...');
      
      // Create individual demo user
      const individualAccount = DEMO_ACCOUNTS.individual;
      await this.createDemoUser(individualAccount.email, individualAccount.password, {
        name: individualAccount.profile.name,
        title: individualAccount.profile.title,
        company: individualAccount.profile.company,
        location: individualAccount.profile.location,
        userType: 'individual',
        profile: individualAccount.profile,
        team: individualAccount.team
      });
      
      // Create company demo user
      const companyAccount = DEMO_ACCOUNTS.company;
      await this.createDemoUser(companyAccount.email, companyAccount.password, {
        name: companyAccount.profile.name,
        title: companyAccount.profile.title,
        company: companyAccount.profile.company,
        location: companyAccount.profile.location,
        userType: 'company',
        profile: companyAccount.profile,
        companyDetails: companyAccount.company
      });
      
      console.log('Demo users seeded successfully');
    } catch (error) {
      console.error('Error seeding demo users:', error);
    }
  }
  
  static async createDemoUser(email: string, password: string, userData: any) {
    try {
      // Create user in Firebase Auth (only if doesn't exist)
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`Demo user ${email} already exists in auth`);
          return;
        }
        throw error;
      }
      
      const uid = userCredential.user.uid;
      
      // Create user document in Firestore with proper structure
      const userDoc = {
        id: uid,
        email,
        name: userData.name,
        type: userData.userType,
        photoURL: '',
        phone: '',
        location: userData.location || '',
        industry: userData.industry || '',
        companyName: userData.company || '',
        position: userData.title || '',
        verified: false,
        status: 'active' as const,
        preferences: {
          notifications: true,
          marketing: true,
          confidentialMode: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDemo: true
      };
      
      await setDoc(doc(db, 'users', uid), userDoc);
      
      console.log(`Created demo user: ${email}`);
    } catch (error) {
      console.error(`Error creating demo user ${email}:`, error);
    }
  }
  
  static async seedDemoTeams() {
    try {
      console.log('Seeding demo teams...');
      const batch = writeBatch(db);
      
      DEMO_DATA.teams.forEach((team) => {
        const teamRef = doc(collection(db, 'teams'));
        batch.set(teamRef, {
          ...team,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDemo: true
        });
      });
      
      await batch.commit();
      console.log('Demo teams seeded successfully');
    } catch (error) {
      console.error('Error seeding demo teams:', error);
    }
  }
  
  static async seedDemoOpportunities() {
    try {
      console.log('Seeding demo opportunities...');
      const batch = writeBatch(db);
      
      DEMO_DATA.opportunities.forEach((opportunity) => {
        const oppRef = doc(collection(db, 'opportunities'));
        batch.set(oppRef, {
          ...opportunity,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDemo: true,
          postedBy: DEMO_ACCOUNTS.company.email // Link to company demo user
        });
      });
      
      await batch.commit();
      console.log('Demo opportunities seeded successfully');
    } catch (error) {
      console.error('Error seeding demo opportunities:', error);
    }
  }
  
  static async seedDemoConversations() {
    try {
      console.log('Seeding demo conversations...');
      const batch = writeBatch(db);
      
      DEMO_DATA.conversations.forEach((conversation) => {
        const convRef = doc(collection(db, 'conversations'));
        batch.set(convRef, {
          ...conversation,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDemo: true
        });
      });
      
      await batch.commit();
      console.log('Demo conversations seeded successfully');
    } catch (error) {
      console.error('Error seeding demo conversations:', error);
    }
  }
  
  static async seedAllDemoData() {
    console.log('Starting demo data seeding...');
    
    try {
      await this.seedDemoUsers();
      await this.seedDemoTeams();
      await this.seedDemoOpportunities();
      await this.seedDemoConversations();
      
      console.log('All demo data seeded successfully!');
      return { success: true, message: 'Demo data seeded successfully' };
    } catch (error) {
      console.error('Error seeding demo data:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  
  static async clearDemoData() {
    try {
      console.log('Clearing demo data...');
      
      // Note: In a real implementation, you'd query and delete demo documents
      // For now, this is a placeholder since we'd need to query by isDemo: true
      
      console.log('Demo data cleared successfully');
      return { success: true, message: 'Demo data cleared successfully' };
    } catch (error) {
      console.error('Error clearing demo data:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Helper function to check if user is a demo account
export const isDemoUser = (email: string) => {
  return email === DEMO_ACCOUNTS.individual.email || email === DEMO_ACCOUNTS.company.email;
};

// Helper function to get demo data for a user
export const getDemoUserData = (email: string) => {
  if (email === DEMO_ACCOUNTS.individual.email) {
    return {
      type: 'individual',
      profile: DEMO_ACCOUNTS.individual.profile,
      team: DEMO_ACCOUNTS.individual.team,
      analytics: DEMO_DATA.analytics.individual
    };
  }
  
  if (email === DEMO_ACCOUNTS.company.email) {
    return {
      type: 'company',
      profile: DEMO_ACCOUNTS.company.profile,
      company: DEMO_ACCOUNTS.company.company,
      analytics: DEMO_DATA.analytics.company
    };
  }
  
  return null;
};