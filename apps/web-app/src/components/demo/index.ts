// Simplified Demo Components Export
export { DemoBanner, DemoModeIndicator, DemoSessionTimer } from './DemoBanner';

// Demo Account Utilities
export { DEMO_ACCOUNTS, DEMO_DATA, getDemoAccount, isDemoAccount, getDemoDataForUser } from '@/lib/demo-accounts';
// DemoSeeder disabled to prevent Firebase imports during build
// export { DemoSeeder, isDemoUser, getDemoUserData } from '@/lib/demo-seeder';

// Demo Types
export interface DemoAccount {
  email: string;
  password: string;
  profile: any;
}

// Simple Demo Utilities
export const demoUtils = {
  isEnabled: () => {
    if (typeof window === 'undefined') return false;
    return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV === 'development';
  },
  
  isDemoUser: (email: string) => {
    return email === 'demo@liftout.com' || email === 'company@liftout.com';
  },
  
  seedDemoData: async () => {
    try {
      const response = await fetch('/api/demo/seed', { method: 'POST' });
      return await response.json();
    } catch (error) {
      console.error('Failed to seed demo data:', error);
      return { success: false, error: 'Network error' };
    }
  }
};