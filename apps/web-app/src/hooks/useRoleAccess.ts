import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Role-based access control hook
export function useRoleAccess() {
  const { 
    user, 
    userType, 
    isAuthenticated, 
    isIndividual, 
    isCompany,
    canAccessTeams,
    canCreateOpportunities,
    canViewAnalytics,
    loading 
  } = useAuth();

  return {
    // User state
    user,
    userType,
    isAuthenticated,
    loading,
    
    // Role checks
    isIndividual,
    isCompany,
    
    // Permission checks
    canAccessTeams,
    canCreateOpportunities,
    canViewAnalytics,
    
    // Advanced permission helpers
    canManageTeam: (teamLeaderId: string) => {
      return isIndividual && user?.id === teamLeaderId;
    },
    
    canManageOpportunity: (opportunityCompanyId: string) => {
      return isCompany && user?.id === opportunityCompanyId;
    },
    
    canApplyToOpportunity: () => {
      return isIndividual;
    },
    
    canViewTeamDetails: (teamId: string) => {
      // Both user types can view team details for discovery
      return isAuthenticated;
    },
    
    canViewOpportunityDetails: (opportunityId: string) => {
      // Both user types can view opportunity details for discovery
      return isAuthenticated;
    },
    
    canAccessAnalytics: () => {
      return isAuthenticated;
    },
    
    canUploadDocuments: () => {
      return isAuthenticated;
    },
    
    canInitiateNegotiation: () => {
      return isAuthenticated;
    },
    
    canAccessDueDiligence: () => {
      return isAuthenticated;
    },
    
    canManageIntegration: () => {
      return isAuthenticated;
    },
    
    // Resource ownership checks
    ownsResource: (resourceOwnerId: string) => {
      return user?.id === resourceOwnerId;
    },
    
    // Route access checks
    canAccessRoute: (route: string) => {
      // Individual-only routes
      const individualOnlyRoutes = [
        '/app/teams/create',
        '/app/teams/edit',
        '/app/teams/manage',
        '/app/applications',
      ];
      
      // Company-only routes
      const companyOnlyRoutes = [
        '/app/opportunities/create',
        '/app/company',
      ];
      
      // Check individual-only routes
      if (individualOnlyRoutes.some(r => route.startsWith(r))) {
        return isIndividual;
      }
      
      // Check company-only routes
      if (companyOnlyRoutes.some(r => route.startsWith(r))) {
        return isCompany;
      }
      
      // All other protected routes require authentication
      return isAuthenticated;
    },
  };
}

// Hook to enforce role-based route access
export function useRequireAuth(options?: {
  requiredRole?: 'individual' | 'company';
  redirectTo?: string;
  onUnauthorized?: () => void;
}) {
  const { 
    isAuthenticated, 
    userType, 
    loading 
  } = useAuth();
  const router = useRouter();
  
  const {
    requiredRole,
    redirectTo = '/auth/signin',
    onUnauthorized
  } = options || {};

  useEffect(() => {
    if (!loading) {
      // Check authentication
      if (!isAuthenticated) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          router.push(redirectTo);
        }
        return;
      }

      // Check role requirements
      if (requiredRole && userType !== requiredRole) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          // Redirect to appropriate section based on user type
          const defaultRedirect = userType === 'company' ? '/app/opportunities' : '/app/teams';
          router.push(defaultRedirect);
        }
        return;
      }
    }
  }, [isAuthenticated, userType, loading, requiredRole, redirectTo, onUnauthorized, router]);

  return {
    isAuthenticated,
    userType,
    loading,
    isAuthorized: isAuthenticated && (!requiredRole || userType === requiredRole),
  };
}

// Hook to redirect authenticated users away from auth pages
export function useRedirectIfAuthenticated(redirectTo: string = '/app/dashboard') {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  return { loading, isAuthenticated };
}

// Hook for conditional rendering based on roles
export function useRoleBasedRender() {
  const roleAccess = useRoleAccess();

  return {
    ...roleAccess,
    
    // Render helpers
    renderForIndividual: (component: React.ReactNode) => {
      return roleAccess.isIndividual ? component : null;
    },
    
    renderForCompany: (component: React.ReactNode) => {
      return roleAccess.isCompany ? component : null;
    },
    
    renderForRole: (role: 'individual' | 'company', component: React.ReactNode) => {
      return roleAccess.userType === role ? component : null;
    },
    
    renderIfPermission: (permission: boolean, component: React.ReactNode) => {
      return permission ? component : null;
    },
    
    renderIfOwner: (resourceOwnerId: string, component: React.ReactNode) => {
      return roleAccess.ownsResource(resourceOwnerId) ? component : null;
    },
  };
}

// Hook for form submission permissions
export function useFormPermissions() {
  const roleAccess = useRoleAccess();

  return {
    ...roleAccess,
    
    // Form-specific permissions
    canSubmitTeamApplication: () => {
      return roleAccess.isIndividual;
    },
    
    canCreateTeamProfile: () => {
      return roleAccess.isIndividual;
    },
    
    canPostOpportunity: () => {
      return roleAccess.isCompany;
    },
    
    canUpdateProfile: () => {
      return roleAccess.isAuthenticated;
    },
    
    canUploadTeamDocuments: (teamLeaderId: string) => {
      return roleAccess.canManageTeam(teamLeaderId);
    },
    
    canUpdateOpportunity: (opportunityCompanyId: string) => {
      return roleAccess.canManageOpportunity(opportunityCompanyId);
    },
    
    canInitiateContact: () => {
      return roleAccess.isAuthenticated;
    },
    
    canScheduleInterview: () => {
      return roleAccess.isAuthenticated;
    },
    
    canSubmitFeedback: () => {
      return roleAccess.isAuthenticated;
    },
  };
}

// Hook for navigation permissions
export function useNavigationPermissions() {
  const roleAccess = useRoleAccess();

  return {
    ...roleAccess,
    
    // Navigation items based on role
    getNavigationItems: () => {
      const baseItems = [
        { href: '/app/dashboard', label: 'Dashboard', icon: 'home' },
        { href: '/app/discovery', label: 'Discovery', icon: 'search' },
        { href: '/app/ai-matching', label: 'AI Matching', icon: 'cpu' },
        { href: '/app/messages', label: 'Messages', icon: 'chat' },
        { href: '/app/analytics', label: 'Analytics', icon: 'chart' },
      ];

      const individualItems = [
        { href: '/app/teams', label: 'My Teams', icon: 'users' },
        { href: '/app/applications', label: 'Applications', icon: 'briefcase' },
      ];

      const companyItems = [
        { href: '/app/opportunities', label: 'Opportunities', icon: 'briefcase' },
        { href: '/app/company', label: 'Company', icon: 'building' },
      ];

      if (roleAccess.isIndividual) {
        return [...baseItems, ...individualItems];
      } else if (roleAccess.isCompany) {
        return [...baseItems, ...companyItems];
      } else {
        return baseItems;
      }
    },
    
    // Quick action items based on role
    getQuickActions: () => {
      if (roleAccess.isIndividual) {
        return [
          { href: '/app/teams/create', label: 'Create Team Profile', icon: 'plus' },
          { href: '/app/discovery', label: 'Find Opportunities', icon: 'search' },
          { href: '/app/ai-matching', label: 'AI Matching', icon: 'cpu' },
        ];
      } else if (roleAccess.isCompany) {
        return [
          { href: '/app/opportunities/create', label: 'Post Opportunity', icon: 'plus' },
          { href: '/app/discovery', label: 'Find Teams', icon: 'search' },
          { href: '/app/ai-matching', label: 'AI Matching', icon: 'cpu' },
        ];
      } else {
        return [];
      }
    },
  };
}