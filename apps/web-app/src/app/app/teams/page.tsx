'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  CheckBadgeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  EyeIcon,
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useTeams } from '@/hooks/useTeams';
import { useMyTeam } from '@/hooks/useMyTeam';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { TeamCardMenu } from '@/components/teams/TeamCardMenu';
import { MemberRowMenu } from '@/components/teams/MemberRowMenu';
import { PendingInvites } from '@/components/teams/PendingInvites';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Team member avatar stack component
interface TeamMemberAvatarsProps {
  members: Array<{
    name: string;
    avatar?: string;
  }>;
  size?: 'sm' | 'md' | 'lg';
  maxDisplay?: number;
}

function TeamMemberAvatars({ members, size = 'md', maxDisplay = 5 }: TeamMemberAvatarsProps) {
  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = members.length - maxDisplay;

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const overlapClasses = {
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4',
  };

  // Demo avatar URLs (professional headshots from UI Faces / randomuser)
  const demoAvatars = [
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://randomuser.me/api/portraits/women/90.jpg',
    'https://randomuser.me/api/portraits/men/86.jpg',
  ];

  return (
    <div className="flex items-center">
      {displayMembers.map((member, index) => (
        <div
          key={member.name || index}
          className={classNames(
            sizeClasses[size],
            index > 0 ? overlapClasses[size] : '',
            'rounded-full ring-2 ring-white bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center overflow-hidden'
          )}
          title={member.name}
        >
          {member.avatar || demoAvatars[index % demoAvatars.length] ? (
            /* eslint-disable-next-line @next/next/no-img-element -- Dynamic external avatar URLs */
            <img
              src={member.avatar || demoAvatars[index % demoAvatars.length]}
              alt={member.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-medium text-navy">
              {member.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={classNames(
            sizeClasses[size],
            overlapClasses[size],
            'rounded-full ring-2 ring-white bg-navy-100 flex items-center justify-center'
          )}
        >
          <span className="font-medium text-navy">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}

// My Team View Component - for team users
function MyTeamView({ userId }: { userId: string }) {
  const router = useRouter();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    team,
    isLoading,
    isTeamLead,
    isOwner,
    canEdit,
    canInvite,
    canRemoveMembers,
    canDelete,
    sendInvite,
    cancelInvite,
    resendInvite,
    updateMemberRole,
    removeMember,
    leaveTeam,
    updateTeam,
  } = useMyTeam();

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      await sendInvite(inviteEmail, inviteRole || undefined);
      setInviteEmail('');
      setInviteRole('');
    } finally {
      setIsInviting(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!team) return;
    const newStatus = team.availabilityStatus === 'available' ? 'not_available' : 'available';
    await updateTeam({ availabilityStatus: newStatus } as any);
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    await updateMemberRole(memberId, newRole);
  };

  const handleMakeLead = async (memberId: string) => {
    await updateMemberRole(memberId, 'Team Lead', true);
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember(memberId);
  };

  const handleLeaveTeam = async () => {
    await leaveTeam();
    router.push('/app/dashboard');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-bg-alt rounded w-48 mb-2"></div>
          <div className="h-4 bg-bg-alt rounded w-80"></div>
        </div>
        <div className="card animate-pulse">
          <div className="h-32 bg-bg-alt rounded"></div>
        </div>
        <div className="card animate-pulse">
          <div className="h-64 bg-bg-alt rounded"></div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">Team members</h1>
          <p className="page-subtitle">You're not on a team yet.</p>
        </div>
        <div className="card text-center py-12">
          <UserGroupIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No team yet</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Create a new team to showcase your collective experience, or wait for an invitation from an existing team.
          </p>
          <Link href="/app/teams/create" className="btn-primary min-h-12 inline-flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Create a team
          </Link>
        </div>
      </div>
    );
  }

  const teamMembers = team.members || [];
  const totalExperience = teamMembers.reduce((sum, m) => sum + (m.experience || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Team members</h1>
        <p className="page-subtitle">Manage your team post and members.</p>
      </div>

      {/* Team Post Card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {team.industry && (
              <span className="text-sm font-medium text-purple-700 mb-2 block">{team.industry}</span>
            )}
            <h3 className="text-xl font-bold text-text-primary flex items-center flex-wrap gap-3 mb-2">
              {team.name}
              <span className="badge badge-primary text-xs font-normal">Team of {teamMembers.length}</span>
            </h3>

            {team.location && (
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                <MapPinIcon className="h-4 w-4" />
                {team.location}
              </div>
            )}

            {team.description && (
              <p className="text-sm text-text-secondary mb-4 leading-relaxed line-clamp-3">
                {team.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {team.availabilityStatus === 'available' && (
                <span className="text-sm font-medium text-purple-700">Open to relocation</span>
              )}
              <span className="text-sm font-medium text-success">{totalExperience} years combined experience</span>
            </div>
          </div>

          {/* Hide team details toggle */}
          <div className="flex items-start gap-4 ml-6">
            <div className="text-right">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={false}
                  onChange={() => {}}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <div>
                  <span className="text-sm font-medium text-text-primary block">Hide team details</span>
                  <span className="text-xs text-text-tertiary">Hide names, location, and employment details of individuals on the team.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Your team section */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-1">Your team</h2>
        <p className="text-sm text-text-tertiary mb-4">Manage your existing team and change roles/permissions.</p>

        {/* Team Members Table */}
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-alt">
                <th className="text-left text-sm font-medium text-text-tertiary px-6 py-3">Name</th>
                <th className="text-left text-sm font-medium text-text-tertiary px-6 py-3">Email</th>
                <th className="w-32 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, index) => (
                <tr key={member.id} className={index !== teamMembers.length - 1 ? 'border-b border-border' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {member.avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-navy-100 flex items-center justify-center">
                          <span className="text-navy font-medium text-sm">
                            {member.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-text-primary">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">{(member as any).email || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 justify-end">
                      {canRemoveMembers && !member.isLead && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-sm font-medium text-text-secondary hover:text-error transition-colors"
                        >
                          Delete
                        </button>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => router.push(`/app/teams/${team.id}/edit`)}
                          className="text-sm font-medium text-purple-700 hover:text-purple-800 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Invites - moved to bottom */}
      {canInvite && (team.invitations || []).length > 0 && (
        <PendingInvites
          invitations={team.invitations || []}
          canManage={canInvite}
          onResend={resendInvite}
          onCancel={cancelInvite}
        />
      )}
    </div>
  );
}

export default function TeamsPage() {
  const { data: session, status } = useSession();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});
  
  const { data: teamsResponse, isLoading, error } = useTeams({
    search: searchValue,
    industry: activeFilters.industry as string,
    location: activeFilters.location as string,
    minSize: activeFilters.minSize as string,
    maxSize: activeFilters.maxSize as string,
    availability: activeFilters.availability as string,
    minExperience: activeFilters.minExperience as string,
    skills: Array.isArray(activeFilters.skills) ? activeFilters.skills.join(',') : undefined,
    minCohesion: activeFilters.minCohesion as string,
  });

  const teams = teamsResponse?.teams || [];

  const isCompanyUser = session?.user?.userType === 'company';
  const isTeamUser = session?.user?.userType === 'individual';

  // Filter groups for the SearchAndFilter component - must be before early returns
  const filterGroups = useMemo(() => {
    const filterMetadataData = teamsResponse?.filters || { industries: [], locations: [], sizes: [] };
    return [
    {
      label: 'Industry',
      key: 'industry',
      type: 'select' as const,
      options: filterMetadataData.industries.map(industry => ({ label: industry, value: industry }))
    },
    {
      label: 'Location',
      key: 'location',
      type: 'select' as const,
      options: filterMetadataData.locations.map(location => ({ label: location, value: location }))
    },
    {
      label: 'Min Team Size',
      key: 'minSize',
      type: 'select' as const,
      options: [
        { label: '2+', value: '2' },
        { label: '4+', value: '4' },
        { label: '6+', value: '6' },
        { label: '10+', value: '10' }
      ]
    },
    {
      label: 'Max Team Size',
      key: 'maxSize',
      type: 'select' as const,
      options: [
        { label: 'Up to 5', value: '5' },
        { label: 'Up to 10', value: '10' },
        { label: 'Up to 15', value: '15' },
        { label: 'Any size', value: '100' }
      ]
    },
    {
      label: 'Availability',
      key: 'availability',
      type: 'select' as const,
      options: [
        { label: 'Available Teams', value: 'available' }
      ]
    },
    {
      label: 'Min Experience',
      key: 'minExperience',
      type: 'select' as const,
      options: [
        { label: '3+ years average', value: '3' },
        { label: '5+ years average', value: '5' },
        { label: '7+ years average', value: '7' },
        { label: '10+ years average', value: '10' }
      ]
    },
    {
      label: 'Skills',
      key: 'skills',
      type: 'multi-select' as const,
      options: [
        { label: 'Machine Learning', value: 'machine learning' },
        { label: 'Python', value: 'python' },
        { label: 'SQL', value: 'sql' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Financial Modeling', value: 'financial modeling' },
        { label: 'Deep Learning', value: 'deep learning' },
        { label: 'TensorFlow', value: 'tensorflow' },
        { label: 'Apache Spark', value: 'apache spark' },
        { label: 'AWS', value: 'aws' },
        { label: 'Data Pipelines', value: 'data pipelines' },
        { label: 'Business Intelligence', value: 'business intelligence' },
        { label: 'Analytics', value: 'analytics' }
      ]
    },
    {
      label: 'Min Cohesion Score',
      key: 'minCohesion',
      type: 'select' as const,
      options: [
        { label: '80+', value: '80' },
        { label: '85+', value: '85' },
        { label: '90+', value: '90' },
        { label: '95+', value: '95' }
      ]
    }
  ];
  }, [teamsResponse?.filters]);

  // Early returns after all hooks
  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const handleFilterChange = (filterKey: string, value: string | string[]) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchValue('');
  };

  // Different experience for team members vs companies
  if (isTeamUser) {
    return (
      <MyTeamView userId={(session?.user as any)?.id} />
    );
  }

  // Company user view - browse teams
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Find teams</h1>
            <p className="page-subtitle">
              Browse high-performing teams available for liftout.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchPlaceholder="Search teams by name, skills, achievements, or member roles..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultCount={teams.length}
      />

      {/* Teams List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="h-6 bg-bg-elevated rounded w-64 mb-2"></div>
                    <div className="h-4 bg-bg-elevated rounded w-32 mb-4"></div>
                    <div className="h-4 bg-bg-elevated rounded w-full mb-2"></div>
                    <div className="h-4 bg-bg-elevated rounded w-3/4"></div>
                  </div>
                  <div className="h-8 w-24 bg-bg-elevated rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-text-tertiary" />
            <h3 className="mt-2 text-sm font-medium text-text-primary">
              {isCompanyUser ? 'No teams found' : 'No teams available'}
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {isCompanyUser
                ? 'Try adjusting your search criteria or filters.'
                : 'Check back later for new teams or adjust your search criteria.'
              }
            </p>
          </div>
        ) : (
          teams.map((team) => (
            <TeamCard key={team.id} team={team} isCompanyUser={isCompanyUser} />
          ))
        )}
      </div>
    </div>
  );
}

interface TeamCardProps {
  team: any;
  isCompanyUser: boolean;
  featured?: boolean;
}

function TeamCard({ team, isCompanyUser, featured = false }: TeamCardProps) {
  return (
    <div className={classNames(
      "card hover:shadow-md hover:border-purple-300 transition-all duration-base",
      featured ? 'ring-2 ring-purple-200' : ''
    )}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Team Member Avatars */}
          <div className="mb-4">
            <TeamMemberAvatars
              members={(team.members || []).map((m: any) => ({ name: m.name, avatar: m.avatar }))}
              size="md"
              maxDisplay={5}
            />
          </div>

          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center flex-wrap gap-2 leading-snug">
              <Link href={`/app/teams/${team.id}`} className="hover:text-purple-700 transition-colors duration-fast">
                {team.name}
              </Link>
              <CheckBadgeIconSolid className="h-5 w-5 text-purple-700 flex-shrink-0" aria-label="Verified" />
              {featured && (
                <StarIcon className="h-5 w-5 text-purple-400 fill-current flex-shrink-0" aria-label="Featured" />
              )}
            </h3>
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm font-normal text-text-tertiary">
              <span className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                {team.size} members
              </span>
              <span className="flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                {team.yearsWorkingTogether} years together
              </span>
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                Added {formatDistanceToNow(new Date(team.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-base font-normal text-text-secondary mb-4 line-clamp-2 leading-relaxed">{team.description}</p>

          {/* Stats grid - Practical UI: 8pt grid spacing */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center text-sm font-normal text-text-secondary">
              <StarIcon className="h-4 w-4 mr-2 text-purple-700 flex-shrink-0" aria-hidden="true" />
              <span>Cohesion: <strong className="font-bold">{team.cohesionScore || 'N/A'}</strong>/100</span>
            </div>
            <div className="flex items-center text-sm font-normal text-text-secondary">
              <CheckCircleIcon className="h-4 w-4 mr-2 text-success flex-shrink-0" aria-hidden="true" />
              <span><strong className="font-bold">{team.successfulProjects || 0}</strong> projects</span>
            </div>
            <div className="flex items-center text-sm font-normal text-text-secondary">
              <CurrencyDollarIcon className="h-4 w-4 mr-2 text-purple-700 flex-shrink-0" aria-hidden="true" />
              <span>{team.compensation?.range || 'Negotiable'}</span>
            </div>
            <div className="flex items-center text-sm font-normal text-text-secondary">
              <MapPinIcon className="h-4 w-4 mr-2 text-purple-400 flex-shrink-0" aria-hidden="true" />
              <span>{team.location || 'Remote'}</span>
            </div>
          </div>

          {/* Skills badges - Practical UI: 8pt grid spacing */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(team.members || []).slice(0, 5).flatMap((member: any) => (member.skills || []).slice(0, 2)).slice(0, 6).map((skill: string, index: number) => (
              <span key={`${skill}-${index}`} className="badge badge-primary text-xs">
                {skill}
              </span>
            ))}
          </div>

          {/* Achievements and industry */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {(team.achievements || []).slice(0, 2).map((achievement: string, index: number) => (
                <span key={index} className="text-xs font-normal text-text-secondary bg-bg-alt px-2.5 py-1 rounded-lg">
                  {achievement.length > 50 ? `${achievement.substring(0, 50)}...` : achievement}
                </span>
              ))}
            </div>
            <div className="text-sm font-normal text-text-tertiary">
              Industry: <strong className="font-bold">{team.industry || 'Various'}</strong>
            </div>
          </div>
        </div>

        {/* Actions - Practical UI: 8pt grid spacing */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:ml-4">
          {team.openToLiftout && (
            <span className="badge badge-success text-xs">
              Available
            </span>
          )}
          <Link
            href={`/app/teams/${team.id}`}
            className="btn-primary min-h-12 whitespace-nowrap"
          >
            View profile
          </Link>
        </div>
      </div>
    </div>
  );
}