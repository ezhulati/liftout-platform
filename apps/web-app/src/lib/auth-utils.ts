import { User } from '@/types/firebase';

// User type checking utilities
export const isIndividualUser = (user: User | null): boolean => {
  return user?.type === 'individual';
};

export const isCompanyUser = (user: User | null): boolean => {
  return user?.type === 'company';
};

// Permission checking utilities
export const canAccessTeams = (user: User | null): boolean => {
  return isIndividualUser(user);
};

export const canCreateOpportunities = (user: User | null): boolean => {
  return isCompanyUser(user);
};

export const canViewAnalytics = (user: User | null): boolean => {
  return !!user; // Both user types can view analytics
};

export const canManageTeam = (user: User | null, teamLeaderId: string): boolean => {
  return isIndividualUser(user) && user?.id === teamLeaderId;
};

export const canApplyToOpportunity = (user: User | null): boolean => {
  return isIndividualUser(user);
};

export const canManageOpportunity = (user: User | null, opportunityCompanyId: string): boolean => {
  return isCompanyUser(user) && user?.id === opportunityCompanyId;
};

// Route access control
export const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/error',
];

export const individualOnlyRoutes = [
  '/app/teams/create',
  '/app/teams/edit',
  '/app/teams/manage',
  '/app/applications',
];

export const companyOnlyRoutes = [
  '/app/opportunities/create',
  '/app/company',
];

export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route));
};

export const isIndividualOnlyRoute = (pathname: string): boolean => {
  return individualOnlyRoutes.some(route => pathname.startsWith(route));
};

export const isCompanyOnlyRoute = (pathname: string): boolean => {
  return companyOnlyRoutes.some(route => pathname.startsWith(route));
};

export const canAccessRoute = (pathname: string, user: User | null): boolean => {
  // Public routes are always accessible
  if (isPublicRoute(pathname)) {
    return true;
  }

  // Require authentication for all other routes
  if (!user) {
    return false;
  }

  // Check individual-only routes
  if (isIndividualOnlyRoute(pathname)) {
    return isIndividualUser(user);
  }

  // Check company-only routes
  if (isCompanyOnlyRoute(pathname)) {
    return isCompanyUser(user);
  }

  // All other routes are accessible to authenticated users
  return true;
};

// Redirect helpers
export const getRedirectPath = (user: User | null, intendedPath?: string): string => {
  // If not authenticated, redirect to signin
  if (!user) {
    return '/auth/signin';
  }

  // If intended path is provided and accessible, use it
  if (intendedPath && canAccessRoute(intendedPath, user)) {
    return intendedPath;
  }

  // Default redirect based on user type
  return '/app/dashboard';
};

export const getUnauthorizedRedirect = (user: User | null): string => {
  if (!user) {
    return '/auth/signin';
  }

  // Redirect to appropriate section based on user type
  if (isIndividualUser(user)) {
    return '/app/teams';
  } else if (isCompanyUser(user)) {
    return '/app/opportunities';
  }

  return '/app/dashboard';
};

// Profile completeness utilities
export const calculateProfileCompleteness = (user: User): number => {
  const requiredFields = ['name', 'email'];
  const optionalFields = ['phone', 'location', 'industry', 'position'];
  
  let completedFields = 0;
  let totalFields = requiredFields.length + optionalFields.length;

  // Check required fields
  for (const field of requiredFields) {
    if (user[field as keyof User]) {
      completedFields++;
    }
  }

  // Check optional fields
  for (const field of optionalFields) {
    if (user[field as keyof User]) {
      completedFields++;
    }
  }

  return Math.round((completedFields / totalFields) * 100);
};

export const isProfileComplete = (user: User): boolean => {
  return calculateProfileCompleteness(user) >= 80;
};

export const getRequiredProfileFields = (user: User): string[] => {
  const missing: string[] = [];
  
  if (!user.name) missing.push('name');
  if (!user.phone) missing.push('phone');
  if (!user.location) missing.push('location');
  if (!user.industry) missing.push('industry');
  if (!user.position) missing.push('position');

  return missing;
};