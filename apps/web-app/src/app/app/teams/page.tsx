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
  const filterMetadata = teamsResponse?.filters || { industries: [], locations: [], sizes: [] };
  
  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const isCompanyUser = session.user.userType === 'company';
  const isTeamUser = session.user.userType === 'individual';

  // Filter groups for the SearchAndFilter component
  const filterGroups = useMemo(() => [
    {
      label: 'Industry',
      key: 'industry',
      type: 'select' as const,
      options: filterMetadata.industries.map(industry => ({ label: industry, value: industry }))
    },
    {
      label: 'Location',
      key: 'location', 
      type: 'select' as const,
      options: filterMetadata.locations.map(location => ({ label: location, value: location }))
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
  ], [filterMetadata]);

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
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">TechFlow Data Science Team</h2>
                  <p className="text-gray-600">Led by Alex Chen • 4 Members • 3.5 Years Together</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Available for Liftout
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Verified Team
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700">
                Elite data science team with proven track record in fintech analytics and machine learning solutions. 
                We've successfully delivered $2M+ in value through predictive modeling and risk assessment systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-sm text-gray-600">Successful Projects</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">96%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$2.1M</div>
                <div className="text-sm text-gray-600">Annual Value Generated</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Key Achievements</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Reduced fraud detection false positives by 35%</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Built predictive models generating $2.1M annual savings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Mentored 12+ junior data scientists across 3 years</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling', 'Risk Assessment'].map((skill) => (
                <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {skill}
                </span>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Profile Views</h4>
                  <p className="text-2xl font-bold text-blue-600">847</p>
                  <p className="text-sm text-gray-500">↑ 23% this month</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Liftout Inquiries</h4>
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-sm text-gray-500">3 active discussions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/app/applications" className="card hover:shadow-md transition-shadow">
            <div className="px-6 py-4 flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">My Applications</h3>
                <p className="text-sm text-gray-500">Track application status</p>
              </div>
            </div>
          </Link>

          <Link href="/app/opportunities" className="card hover:shadow-md transition-shadow">
            <div className="px-6 py-4 flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Browse Opportunities</h3>
                <p className="text-sm text-gray-500">Find new liftout opportunities</p>
              </div>
            </div>
          </Link>

          <Link href="/app/messages" className="card hover:shadow-md transition-shadow">
            <div className="px-6 py-4 flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Messages</h3>
                <p className="text-sm text-gray-500">Company communications</p>
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
                    <div className="h-6 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {isCompanyUser ? 'No teams found' : 'No teams available'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
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
      "card hover:shadow-md transition-shadow",
      featured ? 'ring-2 ring-yellow-200' : ''
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Link href={`/app/teams/${team.id}`} className="hover:text-blue-600">
                  {team.name}
                </Link>
                <CheckBadgeIconSolid className="h-5 w-5 text-blue-500 ml-2" />
                {featured && (
                  <StarIcon className="h-5 w-5 text-yellow-500 ml-2 fill-current" />
                )}
              </h3>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
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
          
          <p className="text-gray-700 mb-4 line-clamp-2">{team.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <StarIcon className="h-4 w-4 mr-2 text-yellow-500" />
              <span>Cohesion: {team.cohesionScore}/100</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
              <span>{team.successfulProjects} projects</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CurrencyDollarIcon className="h-4 w-4 mr-2 text-blue-500" />
              <span>{team.compensation.range}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2 text-purple-500" />
              <span>{team.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {team.members.slice(0, 5).flatMap((member: any) => member.skills.slice(0, 2)).slice(0, 6).map((skill: string, index: number) => (
              <span key={`${skill}-${index}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {team.achievements.slice(0, 2).map((achievement: string, index: number) => (
                <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {achievement.length > 50 ? `${achievement.substring(0, 50)}...` : achievement}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Industry: {team.industry}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-6">
          {team.openToLiftout && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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