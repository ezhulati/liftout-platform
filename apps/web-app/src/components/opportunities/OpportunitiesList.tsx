'use client';

import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { useState, useMemo } from 'react';
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  EllipsisVerticalIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';


interface OpportunitiesListProps {
  userType: string;
  activeTab: string;
}


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function OpportunitiesList({ userType, activeTab }: OpportunitiesListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});
  
  const { data: opportunitiesResponse, isLoading, error } = useOpportunities({
    search: searchValue,
    industry: activeFilters.industry as string,
    location: activeFilters.location as string,
    type: activeFilters.type as string,
    urgent: activeFilters.urgent === 'true' ? 'true' : undefined,
    confidential: activeFilters.confidential === 'true' ? 'true' : undefined,
    skills: Array.isArray(activeFilters.skills) ? activeFilters.skills.join(',') : undefined,
  });

  const opportunities = opportunitiesResponse?.opportunities || [];
  const filterMetadata = opportunitiesResponse?.filters || { industries: [], locations: [], types: [] };
  const isCompanyUser = userType === 'company';

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
      label: 'Type',
      key: 'type',
      type: 'select' as const,
      options: filterMetadata.types.map(type => ({ label: type, value: type }))
    },
    {
      label: 'Priority',
      key: 'urgent',
      type: 'select' as const,
      options: [
        { label: 'Urgent Only', value: 'true' },
        { label: 'All Priorities', value: 'false' }
      ]
    },
    ...(isCompanyUser ? [{
      label: 'Visibility',
      key: 'confidential',
      type: 'select' as const,
      options: [
        { label: 'Confidential Only', value: 'true' },
        { label: 'All Opportunities', value: 'false' }
      ]
    }] : []),
    {
      label: 'Skills',
      key: 'skills',
      type: 'multi-select' as const,
      options: [
        { label: 'Quantitative Finance', value: 'quantitative finance' },
        { label: 'Risk Management', value: 'risk management' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'Trading', value: 'trading' },
        { label: 'AI/ML', value: 'ai ml machine learning' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Compliance', value: 'compliance' },
        { label: 'Strategy', value: 'strategy' },
        { label: 'Business Development', value: 'business development' }
      ]
    }
  ], [filterMetadata, isCompanyUser]);

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="space-y-4">
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
          </div>
        ))}
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {isCompanyUser ? 'No liftout opportunities posted' : 'No liftout opportunities found'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isCompanyUser 
            ? 'Start by posting your first liftout opportunity to attract high-performing teams.'
            : 'Check back later for new liftout opportunities or adjust your search criteria.'
          }
        </p>
        {isCompanyUser && (
          <div className="mt-6">
            <Link href="/app/opportunities/create" className="btn-primary">
              Post Liftout Opportunity
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <SearchAndFilter
        searchPlaceholder="Search liftout opportunities by title, company, description, or requirements..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultCount={opportunities.length}
      />

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
        <div key={opportunity.id} className="card hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link 
                    href={`/app/opportunities/${opportunity.id}`}
                    className="hover:text-primary-600"
                  >
                    {opportunity.title}
                  </Link>
                </h3>
                <span className={classNames(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  opportunity.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : opportunity.status === 'closed'
                    ? 'bg-gray-100 text-gray-800'
                    : opportunity.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                )}>
                  {opportunity.status.replace('_', ' ')}
                </span>
                {opportunity.urgent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Urgent
                  </span>
                )}
                {opportunity.confidential && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Confidential
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                <span className="font-medium">{opportunity.company}</span>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {opportunity.location}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Posted {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
                </div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2">
                {opportunity.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>
                    {opportunity.compensation}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span>
                    {opportunity.timeline}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-purple-500" />
                  <span>
                    {opportunity.teamSize}
                  </span>
                </div>
                {isCompanyUser && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-orange-500" />
                    <span>{opportunity.applications?.length || 0} expressions of interest</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {(opportunity.requirements || []).slice(0, 4).map((requirement: string, index: number) => (
                    <span
                      key={`${requirement}-${index}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {requirement}
                    </span>
                  ))}
                  {(opportunity.requirements || []).length > 4 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{(opportunity.requirements || []).length - 4} more requirements
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Type: {opportunity.type || 'Strategic Expansion'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 ml-6">
              {!isCompanyUser ? (
                <Link
                  href={`/app/opportunities/${opportunity.id}/apply`}
                  className="btn-primary"
                >
                  Express Interest
                </Link>
              ) : (
                <>
                  <Link
                    href={`/app/opportunities/${opportunity.id}/applications`}
                    className="btn-secondary flex items-center"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    {opportunity.applications?.length || 0} Expressions of Interest
                  </Link>
                  
                  <Menu as="div" className="relative">
                    <Menu.Button className="p-2 text-gray-400 hover:text-gray-600">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={`/app/opportunities/${opportunity.id}/edit`}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Edit Liftout Opportunity
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={`/app/opportunities/${opportunity.id}/analytics`}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              View Analytics
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Close Liftout Opportunity
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              )}
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}