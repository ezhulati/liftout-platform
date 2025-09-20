'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/lib/services/teamService';
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
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid';
import type { TeamFilters, TeamProfile } from '@/types/teams';

const industries = [
  'Financial Services',
  'Investment Banking', 
  'Private Equity',
  'Management Consulting',
  'Healthcare Technology',
  'Biotechnology',
  'Enterprise Software',
  'Fintech',
  'Legal Services',
  'Media & Entertainment',
];

const specializations = [
  'Quantitative Analytics',
  'Risk Management',
  'M&A Advisory',
  'Strategic Planning',
  'Healthcare AI',
  'Medical Imaging',
  'Software Engineering',
  'Data Science',
  'Digital Marketing',
  'Business Development',
];

const availabilityOptions = [
  { value: 'available', label: 'Available Now' },
  { value: 'selective', label: 'Selective Opportunities' },
  { value: 'not_available', label: 'Not Available' },
];

const teamSizeOptions = [
  { min: 2, max: 5, label: '2-5 members' },
  { min: 6, max: 10, label: '6-10 members' },
  { min: 11, max: 15, label: '11-15 members' },
  { min: 16, max: 20, label: '16+ members' },
];

export default function TeamsPage() {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TeamFilters>({
    verified: true, // Default to show only verified teams
  });

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ['teams', filters, searchTerm],
    queryFn: async () => {
      const searchFilters = { ...filters };
      
      // Add search term to specializations if provided
      if (searchTerm) {
        searchFilters.specializations = [...(searchFilters.specializations || []), searchTerm];
      }
      
      return await teamService.searchTeams(searchFilters, 0, 20);
    },
  });

  const { data: featuredTeams } = useQuery({
    queryKey: ['featured-teams'],
    queryFn: () => teamService.getFeaturedTeams(6),
  });

  const isCompanyUser = userData?.type === 'company';
  const isTeamUser = userData?.type === 'individual';

  console.log('Teams page - userData:', userData);
  console.log('Teams page - isCompanyUser:', isCompanyUser);
  console.log('Teams page - isTeamUser:', isTeamUser);

  const handleFilterChange = (key: keyof TeamFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({ verified: true });
    setSearchTerm('');
  };

  const filteredTeams = useMemo(() => {
    if (!searchResults?.teams) return [];
    
    let teams = searchResults.teams;
    
    // Additional client-side filtering
    if (searchTerm) {
      teams = teams.filter(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.specializations.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        team.industry.some(ind => 
          ind.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return teams;
  }, [searchResults?.teams, searchTerm]);

  // Allow access if user is authenticated
  if (!userData) {
    return (
      <div className="text-center py-12">
        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Restricted</h3>
        <p className="mt-1 text-sm text-gray-500">Please log in to browse teams.</p>
      </div>
    );
  }

  // Different experience for team members vs companies
  if (!isCompanyUser) {
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
                  <p className="text-gray-600">Led by {userData.name} • 4 Members • 3.5 Years Together</p>
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

      {/* Search and Filters */}
      <div className="card">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search teams by specialization, industry, or skills..."
                className="pl-10 input-field"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
              {Object.keys(filters).filter(key => filters[key as keyof TeamFilters]).length > 1 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1">
                  {Object.keys(filters).filter(key => filters[key as keyof TeamFilters]).length - 1}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={filters.industry?.[0] || ''}
                    onChange={(e) => handleFilterChange('industry', e.target.value ? [e.target.value] : undefined)}
                    className="input-field"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                {/* Specialization Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    value={filters.specializations?.[0] || ''}
                    onChange={(e) => handleFilterChange('specializations', e.target.value ? [e.target.value] : undefined)}
                    className="input-field"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Team Size Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size
                  </label>
                  <select
                    value={filters.teamSize ? `${filters.teamSize.min}-${filters.teamSize.max}` : ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        handleFilterChange('teamSize', undefined);
                        return;
                      }
                      const option = teamSizeOptions.find(opt => `${opt.min}-${opt.max}` === e.target.value);
                      if (option) {
                        handleFilterChange('teamSize', { min: option.min, max: option.max });
                      }
                    }}
                    className="input-field"
                  >
                    <option value="">Any Size</option>
                    {teamSizeOptions.map(option => (
                      <option key={`${option.min}-${option.max}`} value={`${option.min}-${option.max}`}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability || ''}
                    onChange={(e) => handleFilterChange('availability', e.target.value || undefined)}
                    className="input-field"
                  >
                    <option value="">Any Availability</option>
                    {availabilityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.verified || false}
                      onChange={(e) => handleFilterChange('verified', e.target.checked || undefined)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified teams only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.remote || false}
                      onChange={(e) => handleFilterChange('remote', e.target.checked || undefined)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remote-friendly</span>
                  </label>
                </div>

                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Teams (for company users) */}
      {isCompanyUser && featuredTeams && featuredTeams.length > 0 && (
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Featured Teams
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTeams.slice(0, 3).map((team) => (
                <TeamCard key={team.id} team={team} featured />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              {isLoading ? 'Loading...' : `${filteredTeams.length} teams found`}
            </h2>
          </div>
        </div>
        
        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading teams...</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          <div className="px-6 py-4">
            <div className="space-y-6">
              {filteredTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface TeamCardProps {
  team: TeamProfile;
  featured?: boolean;
}

function TeamCard({ team, featured = false }: TeamCardProps) {
  const { userData } = useAuth();
  const isCompanyUser = userData?.type === 'company';

  return (
    <div className={`border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${featured ? 'ring-2 ring-yellow-200' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Link href={`/app/teams/${team.id}`} className="hover:text-blue-600">
                {team.name}
              </Link>
              {team.verification.status === 'verified' && (
                <CheckBadgeIconSolid className="h-5 w-5 text-blue-500 ml-2" />
              )}
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
                {team.dynamics.yearsWorkingTogether} years together
              </span>
            </div>
          </div>
        </div>
        
        {isCompanyUser && (
          <div className="flex items-center space-x-2">
            <button className="text-gray-400 hover:text-red-500">
              <HeartIcon className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-500">{team.expressionsOfInterest}</span>
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{team.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {team.specializations.slice(0, 3).map((spec) => (
          <span key={spec} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {spec}
          </span>
        ))}
        {team.specializations.length > 3 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            +{team.specializations.length - 3} more
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-2" />
          <span>{team.location.primary} {team.location.remote && '(Remote)'}</span>
        </div>
        <div className="flex items-center">
          <EyeIcon className="h-4 w-4 mr-2" />
          <span>{team.viewCount} views</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            team.availability.status === 'available' ? 'bg-green-100 text-green-800' :
            team.availability.status === 'selective' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {team.availability.status.replace('_', ' ')}
          </span>
        </div>
        {isCompanyUser && team.compensationExpectations && (
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span>
              {team.compensationExpectations.currency} {team.compensationExpectations.totalTeamValue.min.toLocaleString()}+
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{team.industry.join(', ')}</span>
        </div>
        <Link
          href={`/app/teams/${team.id}`}
          className="btn-primary text-sm"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}