'use client';

import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { 
  RoleChangeHistory, 
  TeamRole,
  ROLE_DESCRIPTIONS,
  teamPermissionService 
} from '@/lib/team-permissions';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface RoleChangeNotificationProps {
  teamId: string;
  showAll?: boolean;
  limit?: number;
}

interface RoleChangeWithUserInfo extends RoleChangeHistory {
  userName?: string;
  changedByName?: string;
}

const getRoleIcon = (role: TeamRole) => {
  switch (role) {
    case 'leader':
      return <StarIcon className="h-4 w-4 text-gold" />;
    case 'admin':
      return <ShieldCheckIcon className="h-4 w-4 text-navy" />;
    case 'member':
      return <UserIcon className="h-4 w-4 text-text-tertiary" />;
  }
};

const getRoleBadgeColor = (role: TeamRole) => {
  switch (role) {
    case 'leader':
      return 'bg-gold-100 text-gold-800';
    case 'admin':
      return 'bg-navy-50 text-navy-800';
    case 'member':
      return 'bg-bg-alt text-text-secondary';
  }
};

export function RoleChangeNotification({ 
  teamId, 
  showAll = false, 
  limit = 5 
}: RoleChangeNotificationProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<RoleChangeWithUserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllHistory, setShowAllHistory] = useState(showAll);

  useEffect(() => {
    loadRoleHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const loadRoleHistory = async () => {
    try {
      setLoading(true);
      const roleHistory = await teamPermissionService.getRoleChangeHistory(teamId);
      
      // Sort by most recent first
      const sortedHistory = roleHistory.sort(
        (a, b) => {
          const dateA = a.changedAt instanceof Date ? a.changedAt : new Date(a.changedAt);
          const dateB = b.changedAt instanceof Date ? b.changedAt : new Date(b.changedAt);
          return dateB.getTime() - dateA.getTime();
        }
      );

      // If not showing all, limit the results
      const displayHistory = showAllHistory ? sortedHistory : sortedHistory.slice(0, limit);

      // TODO: Enhance with user name lookups
      const historyWithNames = displayHistory.map(item => ({
        ...item,
        userName: `User ${item.userId.slice(-4)}`, // Placeholder
        changedByName: item.changedBy === user?.id ? 'You' : `User ${item.changedBy.slice(-4)}`
      }));

      setHistory(historyWithNames);
    } catch (error) {
      console.error('Error loading role history:', error);
      toast.error('Failed to load role change history');
    } finally {
      setLoading(false);
    }
  };

  const getChangeType = (previous: TeamRole, current: TeamRole) => {
    const roleLevels = { member: 1, admin: 2, leader: 3 };

    if (roleLevels[current] > roleLevels[previous]) {
      return { type: 'promotion', icon: '↗️', color: 'text-success' };
    } else if (roleLevels[current] < roleLevels[previous]) {
      return { type: 'demotion', icon: '↘️', color: 'text-error' };
    } else {
      return { type: 'change', icon: '↔️', color: 'text-navy' };
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-bg-alt rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <ClockIcon className="h-12 w-12 text-text-tertiary mx-auto mb-2" />
        <p className="text-text-secondary">No role changes recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BellIcon className="h-5 w-5 text-navy mr-2" />
          <h3 className="text-lg font-medium text-text-primary">
            Role change history
          </h3>
        </div>

        {!showAll && history.length >= limit && (
          <button
            onClick={() => setShowAllHistory(true)}
            className="text-sm text-navy hover:text-navy-800 transition-colors duration-fast"
          >
            View all
          </button>
        )}
      </div>

      <div className="space-y-3">
        {history.map((change) => {
          const changeInfo = getChangeType(change.previousRole, change.newRole);
          
          return (
            <div
              key={change.id}
              className="card p-4 hover:shadow-sm transition-all duration-fast"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-lg ${changeInfo.color}`}>
                      {changeInfo.icon}
                    </span>
                    <span className="font-medium text-text-primary">
                      {change.userName || 'Team Member'}
                    </span>
                    <span className="text-sm text-text-tertiary">
                      role changed by {change.changedByName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(change.previousRole)}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(change.previousRole)}`}>
                        {ROLE_DESCRIPTIONS[change.previousRole].title}
                      </span>
                    </div>
                    
                    <span className={`text-sm ${changeInfo.color}`}>→</span>
                    
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(change.newRole)}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(change.newRole)}`}>
                        {ROLE_DESCRIPTIONS[change.newRole].title}
                      </span>
                    </div>
                  </div>

                  {change.reason && (
                    <div className="bg-bg-alt rounded-md p-2 mb-2">
                      <p className="text-sm text-text-secondary">
                        <span className="font-medium">Reason:</span> &ldquo;{change.reason}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-text-tertiary">
                    {formatDistanceToNow(
                      change.changedAt instanceof Date ? change.changedAt : new Date(change.changedAt),
                      { addSuffix: true }
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  {changeInfo.type === 'promotion' && (
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                  )}
                  {changeInfo.type === 'demotion' && (
                    <XCircleIcon className="h-5 w-5 text-error" />
                  )}
                  {changeInfo.type === 'change' && (
                    <ClockIcon className="h-5 w-5 text-navy" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAllHistory && history.length > limit && (
        <div className="text-center pt-4">
          <button
            onClick={() => setShowAllHistory(false)}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-fast"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
}

// Compact version for dashboard or quick views
export function RoleChangeAlert({ teamId }: { teamId: string }) {
  const { user } = useAuth();
  const [recentChanges, setRecentChanges] = useState<RoleChangeHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const loadRecentChanges = async () => {
    try {
      const history = await teamPermissionService.getRoleChangeHistory(teamId);
      
      // Get changes from the last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const recent = history.filter(
        change => {
          const changeDate = change.changedAt instanceof Date ? change.changedAt : new Date(change.changedAt);
          return changeDate > yesterday;
        }
      ).slice(0, 3);
      
      setRecentChanges(recent);
    } catch (error) {
      console.error('Error loading recent changes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || recentChanges.length === 0) {
    return null;
  }

  return (
    <div className="bg-navy-50 border border-border rounded-md p-3">
      <div className="flex">
        <BellIcon className="h-5 w-5 text-navy flex-shrink-0" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-navy-800">
            Recent role changes
          </h3>
          <div className="mt-1 text-sm text-navy-700">
            {recentChanges.length} role change{recentChanges.length !== 1 ? 's' : ''} in the last 24 hours
          </div>
        </div>
      </div>
    </div>
  );
}