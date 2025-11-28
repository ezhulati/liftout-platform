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
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">My Team Profile</h1>
              <p className="page-subtitle">
                Manage your team profile and track liftout opportunities
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/app/teams/edit" className="btn-secondary">
                Edit Team Profile
              </Link>
              <Link href="/app/opportunities" className="btn-primary">
                Browse Opportunities
              </Link>
            </div>
          </div>
        </div>

        {/* Alex Chen's Team Profile Card */}
        <div className="card">
          <div className="px-6 py-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">TechFlow Data Science Team</h2>
                  <p className="text-text-secondary">Led by Alex Chen • 4 Members • 3.5 Years Together</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
                      Available for Liftout
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-50 text-navy-800">
                      Verified Team
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-text-secondary">
                Elite data science team with proven track record in fintech analytics and machine learning solutions.
                We've successfully delivered $2M+ in value through predictive modeling and risk assessment systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-bg-alt rounded-lg">
                <div className="text-2xl font-bold text-navy">23</div>
                <div className="text-sm text-text-secondary">Successful Projects</div>
              </div>
              <div className="text-center p-4 bg-bg-alt rounded-lg">
                <div className="text-2xl font-bold text-success">96%</div>
                <div className="text-sm text-text-secondary">Client Satisfaction</div>
              </div>
              <div className="text-center p-4 bg-bg-alt rounded-lg">
                <div className="text-2xl font-bold text-gold-600">$2.1M</div>
                <div className="text-sm text-text-secondary">Annual Value Generated</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-text-primary mb-3">Key Achievements</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-text-secondary">Reduced fraud detection false positives by 35%</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-text-secondary">Built predictive models generating $2.1M annual savings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-text-secondary">Mentored 12+ junior data scientists across 3 years</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling', 'Risk Assessment'].map((skill) => (
                <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-navy-50 text-navy-800">
                  {skill}
                </span>
              ))}
            </div>

            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Profile Views</h4>
                  <p className="text-2xl font-bold text-navy">847</p>
                  <p className="text-sm text-text-tertiary">↑ 23% this month</p>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Liftout Inquiries</h4>
                  <p className="text-2xl font-bold text-success">12</p>
                  <p className="text-sm text-text-tertiary">3 active discussions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/app/applications" className="card hover:shadow-md transition-shadow duration-fast">
            <div className="px-6 py-4 flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-navy mr-4" />
              <div>
                <h3 className="font-medium text-text-primary">My Applications</h3>
                <p className="text-sm text-text-tertiary">Track application status</p>
              </div>
            </div>
          </Link>

          <Link href="/app/opportunities" className="card hover:shadow-md transition-shadow duration-fast">
            <div className="px-6 py-4 flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-success mr-4" />
              <div>
                <h3 className="font-medium text-text-primary">Browse Opportunities</h3>
                <p className="text-sm text-text-tertiary">Find new liftout opportunities</p>
              </div>
            </div>
          </Link>

          <Link href="/app/messages" className="card hover:shadow-md transition-shadow duration-fast">
            <div className="px-6 py-4 flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-gold mr-4" />
              <div>
                <h3 className="font-medium text-text-primary">Messages</h3>
                <p className="text-sm text-text-tertiary">Company communications</p>
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
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-primary flex items-center">
                <Link href={`/app/teams/${team.id}`} className="hover:text-navy transition-colors duration-fast">
                  {team.name}
                </Link>
                <CheckBadgeIconSolid className="h-5 w-5 text-navy ml-2" />
                {featured && (
                  <StarIcon className="h-5 w-5 text-gold ml-2 fill-current" />
                )}
              </h3>
              <div className="flex items-center space-x-4 mt-1 text-sm text-text-tertiary">
                <span className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {team.size} members
                </span>
                <span className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-1" />
                  {team.yearsWorking} years together
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Added {formatDistanceToNow(new Date(team.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          <p className="text-text-secondary mb-4 line-clamp-2">{team.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center text-sm text-text-secondary">
              <StarIcon className="h-4 w-4 mr-2 text-gold" />
              <span>Cohesion: {team.cohesionScore}/100</span>
            </div>
            <div className="flex items-center text-sm text-text-secondary">
              <CheckCircleIcon className="h-4 w-4 mr-2 text-success" />
              <span>{team.successfulProjects} projects</span>
            </div>
            <div className="flex items-center text-sm text-text-secondary">
              <CurrencyDollarIcon className="h-4 w-4 mr-2 text-navy" />
              <span>{team.compensation.range}</span>
            </div>
            <div className="flex items-center text-sm text-text-secondary">
              <MapPinIcon className="h-4 w-4 mr-2 text-gold-600" />
              <span>{team.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {team.members.slice(0, 5).flatMap((member: any) => member.skills.slice(0, 2)).slice(0, 6).map((skill: string, index: number) => (
              <span key={`${skill}-${index}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-50 text-navy-800">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {team.achievements.slice(0, 2).map((achievement: string, index: number) => (
                <span key={index} className="text-xs text-text-secondary bg-bg-alt px-2 py-1 rounded">
                  {achievement.length > 50 ? `${achievement.substring(0, 50)}...` : achievement}
                </span>
              ))}
            </div>
            <div className="text-sm text-text-tertiary">
              Industry: {team.industry}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-6">
          {team.openToLiftout && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
              Available
            </span>
          )}
          <Link
            href={`/app/teams/${team.id}`}
            className="btn-primary"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}