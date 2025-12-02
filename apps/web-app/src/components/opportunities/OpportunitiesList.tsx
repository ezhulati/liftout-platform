'use client';

import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
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
  const isCompanyUser = userType === 'company';

  // Filter groups for the SearchAndFilter component
  const filterGroups = useMemo(() => {
    const filterMetadata = opportunitiesResponse?.filters || { industries: [], locations: [], types: [] };
    return [
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
  ];
  }, [opportunitiesResponse?.filters, isCompanyUser]);

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
                  <div className="h-6 bg-bg-alt rounded w-64 mb-2"></div>
                  <div className="h-4 bg-bg-alt rounded w-32 mb-4"></div>
                  <div className="h-4 bg-bg-alt rounded w-full mb-2"></div>
                  <div className="h-4 bg-bg-alt rounded w-3/4"></div>
                </div>
                <div className="h-8 w-24 bg-bg-alt rounded"></div>
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
        {/* Empty state - Practical UI: icon + bold heading + regular body */}
        <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
          <BriefcaseIcon className="h-7 w-7 text-text-tertiary" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">
          {isCompanyUser ? 'No liftout opportunities posted' : 'No liftout opportunities found'}
        </h3>
        <p className="mt-2 text-base font-normal text-text-secondary max-w-md mx-auto leading-relaxed">
          {isCompanyUser
            ? 'Start by posting your first liftout opportunity to attract high-performing teams.'
            : 'Check back later for new liftout opportunities or adjust your search criteria.'
          }
        </p>
        {isCompanyUser && (
          <div className="mt-6">
            <Link href="/app/opportunities/create" className="btn-primary min-h-12">
              Post liftout opportunity
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

      {/* Opportunities List - Practical UI cards */}
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
        <div key={opportunity.id} className="card hover:shadow-md hover:border-purple-300 transition-all duration-base">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              {/* Header row with title and badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-text-primary leading-snug">
                  <Link
                    href={`/app/opportunities/${opportunity.id}`}
                    className="hover:text-purple-700 transition-colors duration-fast"
                  >
                    {opportunity.title}
                  </Link>
                </h3>
                {/* Badges - Practical UI: consistent badge styling */}
                <span className={classNames(
                  'badge text-xs',
                  opportunity.status === 'active'
                    ? 'badge-success'
                    : opportunity.status === 'closed'
                    ? 'badge-secondary'
                    : opportunity.status === 'in_progress'
                    ? 'badge-primary'
                    : 'badge-warning'
                )}>
                  {opportunity.status.replace('_', ' ')}
                </span>
                {opportunity.urgent && (
                  <span className="badge badge-error text-xs">
                    Urgent
                  </span>
                )}
                {opportunity.confidential && (
                  <span className="badge badge-warning text-xs">
                    Confidential
                  </span>
                )}
              </div>

              {/* Meta row - Practical UI: regular weight for secondary info */}
              <div className="flex flex-wrap items-center text-sm font-normal text-text-tertiary mb-3 gap-x-4 gap-y-1">
                <span className="font-bold text-text-secondary">{opportunity.company}</span>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  {opportunity.location}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Posted {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
                </div>
              </div>

              {/* Description - Practical UI: regular weight, relaxed line height */}
              <p className="text-base font-normal text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                {opportunity.description}
              </p>

              {/* Info grid - Practical UI: icon + text pairs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm font-normal text-text-secondary">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-success flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{opportunity.compensation}</span>
                </div>
                <div className="flex items-center text-sm font-normal text-text-secondary">
                  <ClockIcon className="h-5 w-5 mr-2 text-purple-700 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{opportunity.timeline}</span>
                </div>
                <div className="flex items-center text-sm font-normal text-text-secondary">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-purple-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{opportunity.teamSize}</span>
                </div>
                {isCompanyUser && (
                  <div className="flex items-center text-sm font-normal text-text-secondary">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-700 flex-shrink-0" aria-hidden="true" />
                    <span>{opportunity.applications?.length || 0} expressions</span>
                  </div>
                )}
              </div>

              {/* Requirements and type - Practical UI: secondary badges */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {(opportunity.requirements || []).slice(0, 4).map((requirement: string, index: number) => (
                    <span
                      key={`${requirement}-${index}`}
                      className="badge badge-secondary text-xs"
                    >
                      {requirement}
                    </span>
                  ))}
                  {(opportunity.requirements || []).length > 4 && (
                    <span className="badge badge-secondary text-xs">
                      +{(opportunity.requirements || []).length - 4} more
                    </span>
                  )}
                </div>

                <div className="text-sm font-normal text-text-tertiary flex-shrink-0">
                  {opportunity.type || 'Strategic Expansion'}
                </div>
              </div>
            </div>

            {/* Actions - Practical UI: 48px touch targets */}
            <div className="flex items-start gap-3 flex-shrink-0">
              {!isCompanyUser ? (
                <Link
                  href={`/app/opportunities/${opportunity.id}/apply`}
                  className="btn-primary min-h-12"
                >
                  Express interest
                </Link>
              ) : (
                <>
                  <Link
                    href={`/app/opportunities/${opportunity.id}`}
                    className="btn-outline min-h-12 flex items-center"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    <span className="hidden sm:inline">{opportunity.applications?.length || 0} expressions</span>
                    <span className="sm:hidden">{opportunity.applications?.length || 0}</span>
                  </Link>

                  <Menu as="div" className="relative">
                    <Menu.Button className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-alt rounded-xl border border-border transition-colors duration-fast">
                      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">More options</span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-base"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-fast"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-bg-surface py-2 shadow-lg ring-1 ring-border focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                toast.success('Edit feature coming soon!');
                              }}
                              className={classNames(
                                active ? 'bg-bg-alt' : '',
                                'flex items-center w-full text-left px-4 py-3 min-h-12 text-base font-normal text-text-secondary transition-colors duration-fast'
                              )}
                            >
                              Edit opportunity
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/app/analytics"
                              className={classNames(
                                active ? 'bg-bg-alt' : '',
                                'flex items-center px-4 py-3 min-h-12 text-base font-normal text-text-secondary transition-colors duration-fast'
                              )}
                            >
                              View analytics
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                toast.success('Opportunity closed successfully');
                              }}
                              className={classNames(
                                active ? 'bg-bg-alt' : '',
                                'flex items-center w-full text-left px-4 py-3 min-h-12 text-base font-normal text-error transition-colors duration-fast'
                              )}
                            >
                              Close opportunity
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