'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TeamPermissionMember, 
  Permission, 
  TeamRole,
  teamPermissionService 
} from '@/lib/team-permissions';

interface UseTeamPermissionsReturn {
  member: TeamPermissionMember | null;
  loading: boolean;
  error: string | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasRole: (role: TeamRole) => boolean;
  hasRoleLevel: (minLevel: number) => boolean;
  canManageRole: (targetRole: TeamRole) => boolean;
  refetch: () => Promise<void>;
}

export function useTeamPermissions(teamId: string): UseTeamPermissionsReturn {
  const { user } = useAuth();
  const [member, setMember] = useState<TeamPermissionMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMember = async () => {
    if (!user?.uid || !teamId) {
      setMember(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const memberData = await teamPermissionService.getTeamMember(teamId, user.uid);
      setMember(memberData);
    } catch (err) {
      console.error('Error fetching team member:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
      setMember(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [user?.uid, teamId]);

  const hasPermission = useMemo(() => {
    return (permission: Permission): boolean => {
      if (!member || !member.isActive) return false;
      return member.permissions?.includes(permission) || false;
    };
  }, [member]);

  const hasAnyPermission = useMemo(() => {
    return (permissions: Permission[]): boolean => {
      if (!member || !member.isActive) return false;
      return permissions.some(permission => 
        member.permissions?.includes(permission) || false
      );
    };
  }, [member]);

  const hasRole = useMemo(() => {
    return (role: TeamRole): boolean => {
      return member?.role === role;
    };
  }, [member]);

  const hasRoleLevel = useMemo(() => {
    return (minLevel: number): boolean => {
      if (!member) return false;
      
      const roleLevels: Record<TeamRole, number> = {
        member: 1,
        admin: 2,
        leader: 3
      };
      
      return roleLevels[member.role] >= minLevel;
    };
  }, [member]);

  const canManageRole = useMemo(() => {
    return (targetRole: TeamRole): boolean => {
      if (!member || !member.isActive) return false;
      
      // Leaders can manage anyone
      if (member.role === 'leader') return true;
      
      // Admins can only manage members
      if (member.role === 'admin') {
        return targetRole === 'member';
      }
      
      return false;
    };
  }, [member]);

  return {
    member,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasRoleLevel,
    canManageRole,
    refetch: fetchMember
  };
}

// Higher-order component for role-based rendering
export interface RoleGuardProps {
  teamId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  // Permission-based guards
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean; // For multiple permissions
  // Role-based guards
  role?: TeamRole;
  roles?: TeamRole[];
  minRoleLevel?: number;
  // Loading state
  showLoadingFallback?: boolean;
}

export function RoleGuard({
  teamId,
  children,
  fallback = null,
  permission,
  permissions,
  requireAll = false,
  role,
  roles,
  minRoleLevel,
  showLoadingFallback = false
}: RoleGuardProps) {
  const { 
    loading, 
    hasPermission, 
    hasAnyPermission, 
    hasRole, 
    hasRoleLevel 
  } = useTeamPermissions(teamId);

  if (loading && showLoadingFallback) {
    return <>{fallback}</>;
  }

  if (loading) {
    return null;
  }

  // Check permission-based access
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (permissions) {
    const hasAccess = requireAll 
      ? permissions.every(p => hasPermission(p))
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  // Check role-based access
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  if (roles && !roles.some(r => hasRole(r))) {
    return <>{fallback}</>;
  }

  if (minRoleLevel && !hasRoleLevel(minRoleLevel)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Utility hook for conditional class names based on permissions
export function usePermissionClasses(
  teamId: string,
  classes: {
    hasPermission?: string;
    noPermission?: string;
    loading?: string;
  } = {}
) {
  const { loading, hasPermission } = useTeamPermissions(teamId);

  return useMemo(() => {
    return (permission: Permission) => {
      if (loading) return classes.loading || '';
      return hasPermission(permission) 
        ? classes.hasPermission || ''
        : classes.noPermission || '';
    };
  }, [loading, hasPermission, classes]);
}

// Utility for getting user-friendly role and permission descriptions
export function useRoleDescription(teamId: string) {
  const { member } = useTeamPermissions(teamId);

  return useMemo(() => {
    if (!member) return null;

    const roleDescriptions = {
      leader: 'Team Leader - Full control over all team operations',
      admin: 'Team Admin - Administrative access to team management',
      member: 'Team Member - Standard access to team resources'
    };

    return {
      role: member.role,
      title: roleDescriptions[member.role],
      permissionCount: member.permissions?.length || 0,
      permissions: member.permissions || []
    };
  }, [member]);
}