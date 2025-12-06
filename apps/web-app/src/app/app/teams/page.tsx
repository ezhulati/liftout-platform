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
        {/* Empty state - Practical UI: Clear messaging, single primary CTA */}
        <div className="card text-center py-16 px-6">
          <UserGroupIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-bold text-text-primary mb-2">No team yet</h2>
          <p className="text-base text-text-secondary mb-8 max-w-sm mx-auto leading-relaxed">
            Create a team to showcase your collective experience, or wait for an invitation.
          </p>
          <Link href="/app/teams/create" className="btn-primary min-h-12 inline-flex items-center gap-2">
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Create team
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

      {/* Team Post Card - Practical UI: 8pt spacing, clear hierarchy */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            {team.industry && (
              <span className="text-sm font-semibold text-purple-700 mb-2 block">{team.industry}</span>
            )}
            <h2 className="text-xl font-bold text-text-primary flex items-center flex-wrap gap-3 mb-2">
              {team.name}
              <span className="badge badge-primary text-xs font-medium">Team of {teamMembers.length}</span>
            </h2>

            {team.location && (
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                <MapPinIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{team.location}</span>
              </div>
            )}

            {team.description && (
              <p className="text-base text-text-secondary mb-4 leading-relaxed line-clamp-3 max-w-prose">
                {team.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {team.availabilityStatus === 'available' && (
                <span className="text-sm font-semibold text-purple-700">Open to relocation</span>
              )}
              <span className="text-sm font-semibold text-success">{totalExperience} years combined experience</span>
            </div>
          </div>

          {/* Hide team details toggle - Practical UI: Toggle for instant effect, concise label */}
          <div className="flex-shrink-0">
            <label className="flex items-center gap-3 cursor-pointer min-h-12 px-2 -mx-2 rounded-lg hover:bg-bg-alt transition-colors">
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={false}
                  onChange={() => {}}
                  aria-describedby="hide-details-desc"
                />
              </div>
              <div>
                <span className="text-sm font-medium text-text-primary block">Hide details</span>
                <span id="hide-details-desc" className="text-xs text-text-tertiary">Anonymize member info</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Your team section - Practical UI: Clear section hierarchy */}
      <section aria-labelledby="your-team-heading">
        <div className="mb-4">
          <h2 id="your-team-heading" className="text-lg font-bold text-text-primary">Your team</h2>
          <p className="text-sm text-text-secondary mt-1">Manage members and permissions.</p>
        </div>

        {/* Team Members Table - Practical UI: 48pt touch targets, clear hierarchy */}
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-alt">
                <th scope="col" className="text-left text-sm font-semibold text-text-secondary px-6 py-3">Name</th>
                <th scope="col" className="text-left text-sm font-semibold text-text-secondary px-6 py-3">Email</th>
                <th scope="col" className="w-40 px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, index) => (
                <tr key={member.id} className={index !== teamMembers.length - 1 ? 'border-b border-border' : ''}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {member.avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={member.avatar}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-navy font-semibold text-sm" aria-hidden="true">
                            {member.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-text-primary">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-text-secondary text-sm">{(member as any).email || '—'}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {canRemoveMembers && !member.isLead && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="min-h-10 min-w-10 px-3 py-2 text-sm font-medium text-error hover:text-error-dark hover:bg-error/5 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => router.push(`/app/teams/${team.id}/edit`)}
                          className="min-h-10 px-3 py-2 text-sm font-medium text-purple-700 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
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
      </section>

      {/* Invite Member Section */}
      {canInvite && (
        <section aria-labelledby="invite-heading" className="card">
          <h2 id="invite-heading" className="text-lg font-bold text-text-primary mb-4">Invite team member</h2>
          <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="invite-email" className="sr-only">Email address</label>
              <input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="input w-full"
                required
              />
            </div>
            <div className="w-full sm:w-40">
              <label htmlFor="invite-role" className="sr-only">Role</label>
              <select
                id="invite-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="input w-full"
              >
                <option value="">Member</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Senior">Senior</option>
                <option value="Junior">Junior</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isInviting || !inviteEmail.trim()}
              className="btn-primary min-h-12 whitespace-nowrap disabled:opacity-50"
            >
              {isInviting ? 'Sending...' : 'Send invite'}
            </button>
          </form>
        </section>
      )}

      {/* Pending Invites */}
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
      {/* Page Header - Practical UI: Clear hierarchy */}
      <header className="page-header">
        <h1 className="page-title">Find teams</h1>
        <p className="page-subtitle">Browse high-performing teams available for liftout.</p>
      </header>

      {/* Search and Filter */}
      <SearchAndFilter
        searchPlaceholder="Search by name, skills, or location..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultCount={teams.length}
      />

      {/* Teams List - Practical UI: Consistent spacing */}
      <section aria-label="Team results">
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton - Practical UI: Match actual card layout
            <div className="space-y-4" aria-busy="true" aria-label="Loading teams">
              {[1, 2, 3].map((i) => (
                <article key={i} className="card animate-pulse" aria-hidden="true">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="h-10 w-10 rounded-full bg-bg-alt" />
                        ))}
                      </div>
                      <div className="h-6 bg-bg-alt rounded w-48 mb-2" />
                      <div className="h-4 bg-bg-alt rounded w-64 mb-4" />
                      <div className="h-4 bg-bg-alt rounded w-full mb-2" />
                      <div className="h-4 bg-bg-alt rounded w-3/4 mb-4" />
                      <div className="flex gap-2">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="h-6 w-16 bg-bg-alt rounded-full" />
                        ))}
                      </div>
                    </div>
                    <div className="h-12 w-28 bg-bg-alt rounded-lg" />
                  </div>
                </article>
              ))}
            </div>
          ) : teams.length === 0 ? (
            // Empty state - Practical UI: Clear messaging, single CTA
            <div className="card text-center py-16 px-6">
              <UserGroupIcon className="mx-auto h-12 w-12 text-text-tertiary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-text-primary">
                No teams found
              </h2>
              <p className="mt-2 text-base text-text-secondary max-w-sm mx-auto">
                Try adjusting your search or filters to find more teams.
              </p>
              {Object.keys(activeFilters).length > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 btn-secondary min-h-12"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            teams.map((team) => (
              <TeamCard key={team.id} team={team} isCompanyUser={isCompanyUser} />
            ))
          )}
        </div>
      </section>
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
    <article
      className={classNames(
        "card hover:shadow-md hover:border-purple-200 transition-shadow",
        featured ? 'ring-2 ring-purple-100' : ''
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          {/* Team Member Avatars */}
          <div className="mb-4">
            <TeamMemberAvatars
              members={(team.members || []).map((m: any) => ({ name: m.name, avatar: m.avatar }))}
              size="md"
              maxDisplay={5}
            />
          </div>

          {/* Header - Practical UI: Clear heading hierarchy */}
          <header className="mb-3">
            <h3 className="text-lg font-bold text-text-primary flex items-center flex-wrap gap-2">
              <Link
                href={`/app/teams/${team.id}`}
                className="hover:text-purple-700 transition-colors focus:outline-none focus:underline"
              >
                {team.name}
              </Link>
              <CheckBadgeIconSolid className="h-5 w-5 text-purple-700 flex-shrink-0" aria-label="Verified team" />
              {featured && (
                <span className="badge badge-warning text-xs">Featured</span>
              )}
            </h3>
            {/* Meta info - Practical UI: Consistent icon+text spacing */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <UserGroupIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {team.size} members
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {team.yearsWorkingTogether}y together
              </span>
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {team.location || 'Remote'}
              </span>
            </div>
          </header>

          {/* Description - Practical UI: Optimal line length */}
          {team.description && (
            <p className="text-base text-text-secondary mb-4 line-clamp-2 leading-relaxed max-w-prose">
              {team.description}
            </p>
          )}

          {/* Key Stats - Practical UI: Simplified, scannable */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <StarIcon className="h-4 w-4 text-purple-600" aria-hidden="true" />
              <strong className="font-semibold text-text-primary">{team.cohesionScore || '—'}</strong> cohesion
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <CheckCircleIcon className="h-4 w-4 text-success" aria-hidden="true" />
              <strong className="font-semibold text-text-primary">{team.successfulProjects || 0}</strong> projects
            </span>
            {team.industry && (
              <span className="text-text-tertiary">
                {team.industry}
              </span>
            )}
          </div>

          {/* Skills badges - Practical UI: Limit to avoid clutter */}
          {(team.members || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(team.members || [])
                .slice(0, 3)
                .flatMap((member: any) => (member.skills || []).slice(0, 2))
                .slice(0, 5)
                .map((skill: string, index: number) => (
                  <span key={`${skill}-${index}`} className="badge badge-primary text-xs">
                    {skill}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Actions - Practical UI: Single primary CTA per card */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:ml-4 flex-shrink-0">
          {team.openToLiftout && (
            <span className="badge badge-success text-xs font-medium">
              Available
            </span>
          )}
          <Link
            href={`/app/teams/${team.id}`}
            className="btn-primary min-h-12 px-6 whitespace-nowrap"
          >
            View team
          </Link>
        </div>
      </div>
    </article>
  );
}