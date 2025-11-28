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
    // Team member view - show their team profile
    return (
      <div className="space-y-6">
        {/* Page Header - Practical UI: One primary action per screen */}
        <div className="page-header">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="page-title">My Team Profile</h1>
              <p className="page-subtitle">
                Manage your team profile and track liftout opportunities
              </p>
            </div>
            {/* Button group - Primary first, then secondary */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/app/opportunities" className="btn-primary min-h-12">
                Browse opportunities
              </Link>
              <Link href="/app/teams/edit" className="btn-secondary min-h-12">
                Edit team profile
              </Link>
            </div>
          </div>
        </div>

        {/* Team Profile Card - Practical UI: Bold for emphasis, regular for body */}
        <div className="card">
          <div className="p-6">
            {/* Team Member Avatars - overlapping stack */}
            <div className="mb-6">
              <TeamMemberAvatars
                members={[
                  { name: 'Alex Chen' },
                  { name: 'Sarah Park' },
                  { name: 'Marcus Johnson' },
                  { name: 'Emily Rodriguez' },
                ]}
                size="lg"
                maxDisplay={5}
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary font-heading leading-tight">TechFlow Data Science Team</h2>
                <p className="text-base font-normal text-text-secondary mt-1">Led by Alex Chen · 4 Members · 3.5 Years Together</p>
                {/* Badges */}
                <div className="flex flex-wrap items-center mt-3 gap-2">
                  <span className="badge badge-success text-xs">
                    Available for Liftout
                  </span>
                  <span className="badge badge-primary text-xs">
                    Verified Team
                  </span>
                </div>
              </div>
            </div>

            {/* Description - max 65ch */}
            <div className="mb-6">
              <p className="text-base font-normal text-text-secondary leading-relaxed max-w-prose">
                Elite data science team with proven track record in fintech analytics and machine learning solutions.
                We've successfully delivered $2M+ in value through predictive modeling and risk assessment systems.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-bg-alt rounded-xl">
                <div className="text-3xl font-bold text-navy font-heading">23</div>
                <div className="text-sm font-normal text-text-secondary mt-1">Successful Projects</div>
              </div>
              <div className="text-center p-4 bg-bg-alt rounded-xl">
                <div className="text-3xl font-bold text-success font-heading">96%</div>
                <div className="text-sm font-normal text-text-secondary mt-1">Client Satisfaction</div>
              </div>
              <div className="text-center p-4 bg-bg-alt rounded-xl">
                <div className="text-3xl font-bold text-gold-600 font-heading">$2.1M</div>
                <div className="text-sm font-normal text-text-secondary mt-1">Annual Value Generated</div>
              </div>
            </div>

            {/* Key Achievements - Practical UI: icon + text */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 font-heading">Key Achievements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-base font-normal text-text-secondary leading-relaxed">Reduced fraud detection false positives by 35%</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-base font-normal text-text-secondary leading-relaxed">Built predictive models generating $2.1M annual savings</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-base font-normal text-text-secondary leading-relaxed">Mentored 12+ junior data scientists across 3 years</span>
                </li>
              </ul>
            </div>

            {/* Skills Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling', 'Risk Assessment'].map((skill) => (
                <span key={skill} className="badge badge-primary text-xs">
                  {skill}
                </span>
              ))}
            </div>

            {/* Profile Stats */}
            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-1">Profile Views</h4>
                  <p className="text-3xl font-bold text-navy font-heading">847</p>
                  <p className="text-sm font-normal text-text-tertiary mt-1">↑ 23% this month</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-1">Liftout Inquiries</h4>
                  <p className="text-3xl font-bold text-success font-heading">12</p>
                  <p className="text-sm font-normal text-text-tertiary mt-1">3 active discussions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - 48px touch targets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/app/applications" className="card hover:shadow-md transition-shadow duration-fast min-h-12">
            <div className="p-5 flex items-center gap-4">
              <div className="p-3 bg-navy-50 rounded-xl min-w-12 min-h-12 flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-navy" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">My Applications</h3>
                <p className="text-sm font-normal text-text-tertiary mt-0.5">Track application status</p>
              </div>
            </div>
          </Link>

          <Link href="/app/opportunities" className="card hover:shadow-md transition-shadow duration-fast min-h-12">
            <div className="p-5 flex items-center gap-4">
              <div className="p-3 bg-success-light rounded-xl min-w-12 min-h-12 flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6 text-success" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Browse Opportunities</h3>
                <p className="text-sm font-normal text-text-tertiary mt-0.5">Find new liftout opportunities</p>
              </div>
            </div>
          </Link>

          <Link href="/app/messages" className="card hover:shadow-md transition-shadow duration-fast min-h-12">
            <div className="p-5 flex items-center gap-4">
              <div className="p-3 bg-gold-50 rounded-xl min-w-12 min-h-12 flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gold-700" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Messages</h3>
                <p className="text-sm font-normal text-text-tertiary mt-0.5">Company communications</p>
              </div>
            </div>
          </Link>
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
      "card hover:shadow-md transition-shadow duration-fast",
      featured ? 'ring-2 ring-gold-200' : ''
    )}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Team Member Avatars */}
          <div className="mb-4">
            <TeamMemberAvatars
              members={team.members.map((m: any) => ({ name: m.name, avatar: m.avatar }))}
              size="md"
              maxDisplay={5}
            />
          </div>

          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center flex-wrap gap-2 leading-snug">
              <Link href={`/app/teams/${team.id}`} className="hover:text-navy transition-colors duration-fast">
                {team.name}
              </Link>
              <CheckBadgeIconSolid className="h-5 w-5 text-navy flex-shrink-0" aria-label="Verified" />
              {featured && (
                <StarIcon className="h-5 w-5 text-gold fill-current flex-shrink-0" aria-label="Featured" />
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

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center text-sm font-normal text-text-secondary">
              <StarIcon className="h-4 w-4 mr-2 text-gold flex-shrink-0" aria-hidden="true" />
              <span>Cohesion: <strong className="font-bold">{team.cohesionScore}</strong>/100</span>
            </div>
            <div className="flex items-center text-sm font-normal text-text-secondary">
              <CheckCircleIcon className="h-4 w-4 mr-2 text-success flex-shrink-0" aria-hidden="true" />
              <span><strong className="font-bold">{team.successfulProjects}</strong> projects</span>
            </div>
            <div className="flex items-center text-sm font-normal text-text-secondary">
              <CurrencyDollarIcon className="h-4 w-4 mr-2 text-navy flex-shrink-0" aria-hidden="true" />
              <span>{team.compensation.range}</span>
            </div>
            <div className="flex items-center text-sm font-normal text-text-secondary">
              <MapPinIcon className="h-4 w-4 mr-2 text-gold-600 flex-shrink-0" aria-hidden="true" />
              <span>{team.location}</span>
            </div>
          </div>

          {/* Skills badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {team.members.slice(0, 5).flatMap((member: any) => member.skills.slice(0, 2)).slice(0, 6).map((skill: string, index: number) => (
              <span key={`${skill}-${index}`} className="badge badge-primary text-xs">
                {skill}
              </span>
            ))}
          </div>

          {/* Achievements and industry */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {team.achievements.slice(0, 2).map((achievement: string, index: number) => (
                <span key={index} className="text-xs font-normal text-text-secondary bg-bg-alt px-2.5 py-1 rounded-lg">
                  {achievement.length > 50 ? `${achievement.substring(0, 50)}...` : achievement}
                </span>
              ))}
            </div>
            <div className="text-sm font-normal text-text-tertiary">
              Industry: <strong className="font-bold">{team.industry}</strong>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:ml-4">
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