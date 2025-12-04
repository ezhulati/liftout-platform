'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
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
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid';
import { useTeams } from '@/hooks/useTeams';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';

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
    // Team member view - matches Figma "My Team" design
    const teamMembers = [
      { name: 'Alex Chen', role: 'Team Lead', experience: '10 yrs', education: "Master's Degree", avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { name: 'Sarah Park', role: 'Senior Analyst', experience: '6 yrs', education: "Bachelor's Degree", avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { name: 'Marcus Johnson', role: 'Data Scientist', experience: '4 yrs', education: "Master's Degree", avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
      { name: 'Emily Rodriguez', role: 'ML Engineer', experience: '3 yrs', education: "Bachelor's Degree", avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    ];

    return (
      <div className="space-y-6">
        {/* Page Header - Figma style */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Team members</h1>
          <p className="text-text-secondary mt-1">
            Manage your team post, team members and their permissions.
          </p>
        </div>

        {/* Invite Section */}
        <div className="card">
          <h2 className="text-lg font-bold text-text-primary mb-2">Invite people to join your team</h2>
          <p className="text-sm text-text-tertiary mb-4">There is no limit to how many people you can add to this team.</p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="olivia@untitledui.com"
                  className="input-field pl-12"
                />
              </div>
            <button className="btn-primary min-h-12 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Invite
            </button>
          </div>
        </div>

        {/* Team Post Card */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="badge badge-primary text-xs mb-2">Data Science</span>
              <h3 className="text-lg font-bold text-text-primary flex items-center flex-wrap gap-3">
                TechFlow Data Science Team
                <span className="text-sm font-normal text-text-tertiary">Team of 4</span>
              </h3>
            </div>
            <button className="min-h-12 min-w-12 flex items-center justify-center hover:bg-bg-alt rounded-lg transition-colors">
              <svg className="h-5 w-5 text-text-tertiary" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="18" r="2" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-text-tertiary mb-4">
            <span className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              San Francisco, CA
            </span>
            <span className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Full-time
            </span>
          </div>

          <p className="text-sm text-text-secondary mb-4 leading-relaxed">
            Elite data science team with proven track record in fintech analytics and machine learning solutions.
            We specialize in predictive modeling, risk assessment, and building scalable ML pipelines.
          </p>

          <span className="badge badge-primary text-xs">
            15 years combined experience
          </span>
        </div>

        {/* Team Members Table - Figma style */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-text-tertiary px-6 py-4">Name</th>
                  <th className="text-left text-sm font-medium text-text-tertiary px-6 py-4">Experience</th>
                  <th className="text-left text-sm font-medium text-text-tertiary px-6 py-4">Education</th>
                  <th className="w-12 px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, index) => (
                  <tr key={member.name} className={index !== teamMembers.length - 1 ? 'border-b border-border' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-text-primary">{member.name}</div>
                          <div className="text-sm text-text-tertiary">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{member.experience}</td>
                    <td className="px-6 py-4 text-text-secondary">{member.education}</td>
                    <td className="px-6 py-4">
                      {index > 0 && (
                        <button className="p-2 hover:bg-bg-alt rounded-lg transition-colors">
                          <svg className="h-5 w-5 text-text-tertiary" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="6" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="18" r="2" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Company user view - browse teams
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Browse High-Performing Teams</h1>
            <p className="page-subtitle">
              Find intact teams ready for strategic liftout opportunities
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
                {team.yearsWorking} years together
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