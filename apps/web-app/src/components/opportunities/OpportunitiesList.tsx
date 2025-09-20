'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  EllipsisVerticalIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { opportunityApi } from '@/lib/api';
import type { Opportunity as FirebaseOpportunity } from '@/types/firebase';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  industry: string;
  location: string;
  compensation: {
    min: number;
    max: number;
    currency: string;
    type: 'salary' | 'equity' | 'total_package';
  };
  commitment: {
    duration: string;
    startDate: string;
  };
  teamSize: {
    min: number;
    max: number;
  };
  skills: string[];
  status: 'active' | 'closed' | 'evaluating' | 'completed';
  expressionsOfInterest: number;
  postedAt: string;
  deadline: string;
  company: {
    name: string;
    logo?: string;
  };
  liftoutType: 'expansion' | 'acquisition' | 'market_entry' | 'capability_building';
  confidential: boolean;
}

interface OpportunitiesListProps {
  userType: string;
  activeTab: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Strategic FinTech Analytics Team',
    description: 'Seeking an elite analytics team to lead our expansion into predictive financial modeling. Looking for a proven team with deep expertise in quantitative finance and machine learning.',
    industry: 'Financial Services',
    location: 'New York, NY',
    compensation: { min: 180000, max: 250000, currency: 'USD', type: 'salary' },
    commitment: { duration: 'Permanent', startDate: 'Q1 2025' },
    teamSize: { min: 4, max: 6 },
    skills: ['Python', 'R', 'Machine Learning', 'Quantitative Finance', 'Risk Management'],
    status: 'active',
    expressionsOfInterest: 8,
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    company: { name: 'Goldman Sachs Technology' },
    liftoutType: 'capability_building',
    confidential: false,
  },
  {
    id: '2',
    title: 'Healthcare AI Innovation Team',
    description: 'Leading medical technology company seeking an intact AI/ML team to accelerate our diagnostic imaging platform. Team must have proven track record in healthcare applications.',
    industry: 'Healthcare Technology',
    location: 'Boston, MA / Remote Hybrid',
    compensation: { min: 200000, max: 300000, currency: 'USD', type: 'total_package' },
    commitment: { duration: 'Permanent', startDate: 'February 2025' },
    teamSize: { min: 5, max: 8 },
    skills: ['Computer Vision', 'TensorFlow', 'PyTorch', 'Medical Imaging', 'Deep Learning'],
    status: 'active',
    expressionsOfInterest: 12,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    company: { name: 'MedTech Innovations' },
    liftoutType: 'market_entry',
    confidential: false,
  },
  {
    id: '3',
    title: 'European Market Expansion Team',
    description: 'Confidential opportunity for a high-performing business development team to lead our European market entry. Seeking team with established relationships and proven market expansion success.',
    industry: 'Enterprise Software',
    location: 'London, UK',
    compensation: { min: 150000, max: 220000, currency: 'GBP', type: 'salary' },
    commitment: { duration: 'Permanent', startDate: 'March 2025' },
    teamSize: { min: 3, max: 5 },
    skills: ['Business Development', 'Enterprise Sales', 'Market Strategy', 'Partnership Development'],
    status: 'evaluating',
    expressionsOfInterest: 6,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    company: { name: 'Confidential - Fortune 500 Tech Company' },
    liftoutType: 'expansion',
    confidential: true,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function OpportunitiesList({ userType, activeTab }: OpportunitiesListProps) {
  const { data: opportunitiesResponse, isLoading } = useQuery({
    queryKey: ['opportunities', userType, activeTab],
    queryFn: async () => {
      const response = await opportunityApi.getOpportunities({
        // Add filtering based on activeTab if needed
        page: 1,
        limit: 20,
      });
      
      if (response.success) {
        return response.data || [];
      } else {
        console.error('Failed to fetch opportunities:', response.error);
        return mockOpportunities; // Fallback to mock data if API fails
      }
    },
  });

  const opportunities = opportunitiesResponse || [];

  const isCompanyUser = userType === 'company';

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
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                <span className="font-medium">{opportunity.company.name}</span>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {opportunity.location}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Posted {formatDistanceToNow(new Date(opportunity.postedAt), { addSuffix: true })}
                </div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2">
                {opportunity.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>
                    {opportunity.compensation.currency} {opportunity.compensation.min.toLocaleString()} - {opportunity.compensation.max.toLocaleString()}
                    <span className="text-xs text-gray-500 ml-1">({opportunity.compensation.type.replace('_', ' ')})</span>
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span>
                    {opportunity.commitment.duration} - {opportunity.commitment.startDate}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-purple-500" />
                  <span>
                    {opportunity.teamSize.min}-{opportunity.teamSize.max} members
                  </span>
                </div>
                {isCompanyUser && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-orange-500" />
                    <span>{opportunity.expressionsOfInterest} expressions of interest</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.slice(0, 4).map((skill: string) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                  {opportunity.skills.length > 4 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{opportunity.skills.length - 4} more
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Deadline: {format(new Date(opportunity.deadline), 'MMM d, yyyy')}
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
                    {opportunity.expressionsOfInterest} Expressions of Interest
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
  );
}