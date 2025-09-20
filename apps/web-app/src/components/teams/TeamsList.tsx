'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  EllipsisVerticalIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Team {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  size: number;
  rating: number;
  skills: string[];
  role: 'owner' | 'admin' | 'member';
  status: 'available' | 'exploring' | 'committed' | 'inactive';
  profileImageUrl?: string;
  memberCount: number;
  yearsWorking: number;
  successfulLiftouts: number;
  currentCompany: string;
  liftoutInterest: 'high' | 'medium' | 'low';
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Elite Frontend Unit',
    description: 'High-performing team with 5 years of collaboration at TechCorp. Specialized in React ecosystems with proven track record of delivering complex web applications.',
    industry: 'Financial Technology',
    location: 'New York, NY',
    size: 6,
    rating: 4.9,
    skills: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'AWS'],
    role: 'owner',
    status: 'available',
    memberCount: 6,
    yearsWorking: 5,
    successfulLiftouts: 2,
    currentCompany: 'TechCorp Financial',
    liftoutInterest: 'high',
  },
  {
    id: '2',
    name: 'Data Science Collective',
    description: 'Analytics team from BigData Inc with extensive experience in ML pipelines and real-time data processing. Seeking new challenges in healthcare or climate tech.',
    industry: 'Data Science',
    location: 'San Francisco, CA',
    size: 8,
    rating: 4.8,
    skills: ['Python', 'TensorFlow', 'Apache Spark', 'Kubernetes', 'PostgreSQL'],
    role: 'admin',
    status: 'exploring',
    memberCount: 8,
    yearsWorking: 4,
    successfulLiftouts: 1,
    currentCompany: 'BigData Inc',
    liftoutInterest: 'medium',
  },
  {
    id: '3',
    name: 'DevOps Infrastructure Team',
    description: 'Platform engineering team responsible for scaling infrastructure at CloudCorp. Expert in cloud-native technologies and Site Reliability Engineering.',
    industry: 'Cloud Infrastructure',
    location: 'Seattle, WA',
    size: 5,
    rating: 4.7,
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Go', 'Prometheus'],
    role: 'member',
    status: 'available',
    memberCount: 5,
    yearsWorking: 3,
    successfulLiftouts: 0,
    currentCompany: 'CloudCorp Systems',
    liftoutInterest: 'high',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface TeamsListProps {
  userType: string;
}

export function TeamsList({ userType }: TeamsListProps) {
  const isCompanyUser = userType === 'company';
  
  const { data: teams, isLoading } = useQuery({
    queryKey: isCompanyUser ? ['available-teams'] : ['my-team'],
    queryFn: async () => {
      // This would normally fetch from your API
      if (isCompanyUser) {
        // Return all available teams for companies to browse
        return mockTeams;
      } else {
        // Return only the user's team profile for team users
        return [mockTeams[0]]; // Demo: show one team profile
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-12">
        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {isCompanyUser ? 'No teams available' : 'No team profile yet'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isCompanyUser 
            ? 'Check back later for new teams available for liftout opportunities.'
            : 'Create your team profile to explore liftout opportunities.'
          }
        </p>
        {!isCompanyUser && (
          <div className="mt-6">
            <Link href="/app/teams/create" className="btn-primary">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Team Profile
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div key={team.id} className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                {team.profileImageUrl ? (
                  <img
                    className="h-16 w-16 rounded-lg object-cover"
                    src={team.profileImageUrl}
                    alt={team.name}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-primary-100 flex items-center justify-center">
                    <UserGroupIcon className="h-8 w-8 text-primary-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {team.name}
                  </h3>
                  <span className={classNames(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    team.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : team.status === 'exploring'
                      ? 'bg-blue-100 text-blue-800'
                      : team.status === 'committed'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  )}>
                    {team.status}
                  </span>
                  <span className={classNames(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    team.role === 'owner'
                      ? 'bg-purple-100 text-purple-800'
                      : team.role === 'admin'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  )}>
                    {team.role}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {team.description}
                </p>
                
                <div className="flex items-center mt-3 space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {team.memberCount} members
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {team.location}
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                    {team.rating} rating
                  </div>
                  <div>
                    {team.yearsWorking}y together
                  </div>
                  {isCompanyUser && (
                    <div className="font-medium">
                      {team.successfulLiftouts} liftouts
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {team.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                  {team.skills.length > 4 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{team.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href={`/app/teams/${team.id}`}
                className="btn-secondary"
              >
                {isCompanyUser ? 'View Profile' : 'Manage Profile'}
              </Link>
              
              {isCompanyUser && team.status === 'available' && (
                <Link
                  href={`/app/teams/${team.id}/contact`}
                  className="btn-primary"
                >
                  Initiate Contact
                </Link>
              )}
              
              {(team.role === 'owner' || team.role === 'admin') && (
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
                            href={`/app/teams/${team.id}/edit`}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Edit Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/app/teams/${team.id}/members`}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Manage Team Members
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/app/teams/${team.id}/opportunities`}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            View Opportunities
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/app/teams/${team.id}/settings`}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Profile Settings
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}