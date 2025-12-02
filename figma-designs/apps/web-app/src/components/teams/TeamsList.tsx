'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  EllipsisVerticalIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useTeams } from '@/hooks/useTeams';
import { useProfileGate } from '@/hooks/useProfileGate';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface TeamsListProps {
  userType: string;
}

export function TeamsList({ userType }: TeamsListProps) {
  const isCompanyUser = userType === 'company';
  const router = useRouter();
  const { checkAccess } = useProfileGate();

  const { data: teamsResponse, isLoading, error } = useTeams();
  const teams = teamsResponse?.teams || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-bg-alt rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-bg-alt rounded w-48 mb-2"></div>
                <div className="h-3 bg-bg-alt rounded w-64 mb-2"></div>
                <div className="h-3 bg-bg-alt rounded w-32"></div>
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
        <UserGroupIcon className="mx-auto h-12 w-12 text-text-tertiary" />
        <h3 className="mt-2 text-base font-medium text-text-primary">
          {isCompanyUser ? 'No teams available' : 'No team profile yet'}
        </h3>
        <p className="mt-1 text-base text-text-secondary">
          {isCompanyUser
            ? 'Check back later for new teams available for liftout opportunities.'
            : 'Create your team profile to explore liftout opportunities.'
          }
        </p>
        {!isCompanyUser && (
          <div className="mt-6">
            <button
              onClick={() => {
                if (checkAccess({ message: 'Complete your profile to create a team' })) {
                  router.push('/app/teams/create');
                }
              }}
              className="btn-primary min-h-12 inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create team profile
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div key={team.id} className="card hover:shadow-md transition-shadow duration-fast">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-lg bg-navy-50 flex items-center justify-center">
                  <UserGroupIcon className="h-8 w-8 text-navy" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-text-primary truncate">
                    {team.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-success-light text-success-dark">
                    {team.openToLiftout ? 'Open to liftout' : 'Not available'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-navy-50 text-navy-800">
                    {team.industry}
                  </span>
                </div>

                <p className="text-base text-text-secondary mt-1 line-clamp-2">
                  {team.description}
                </p>

                <div className="flex items-center mt-3 space-x-6 text-base text-text-tertiary">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {team.size} members
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {team.location}
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1 text-gold fill-current" />
                    {team.cohesionScore || 95}% cohesion
                  </div>
                  <div>
                    {team.yearsWorking}y together
                  </div>
                  {isCompanyUser && (
                    <div className="font-medium">
                      {team.successfulProjects || 0} projects
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {(team.members?.flatMap(m => m.skills) || []).slice(0, 4).map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-bg-alt text-text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                  {(team.members?.flatMap(m => m.skills) || []).length > 4 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg-alt text-text-secondary">
                      +{(team.members?.flatMap(m => m.skills) || []).length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/app/teams/${team.id}`}
                className="btn-outline min-h-12"
              >
                {isCompanyUser ? 'View profile' : 'Manage profile'}
              </Link>

              {isCompanyUser && team.openToLiftout && (
                <button
                  onClick={() => {
                    if (checkAccess({ message: 'Complete your company profile to contact teams' })) {
                      router.push(`/app/messages?team=${team.id}`);
                    }
                  }}
                  className="btn-primary min-h-12"
                >
                  Initiate contact
                </button>
              )}

              {!isCompanyUser && (
                <Menu as="div" className="relative">
                  <Menu.Button className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-alt rounded-lg transition-colors duration-fast">
                    <EllipsisVerticalIcon className="h-5 w-5" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-lg bg-bg-surface py-2 shadow-lg ring-1 ring-border focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/app/teams/${team.id}/edit`}
                            className={classNames(
                              active ? 'bg-bg-alt' : '',
                              'flex items-center px-4 py-3 min-h-12 text-base text-text-secondary transition-colors duration-fast'
                            )}
                          >
                            Edit profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/app/teams/${team.id}/members`}
                            className={classNames(
                              active ? 'bg-bg-alt' : '',
                              'flex items-center px-4 py-3 min-h-12 text-base text-text-secondary transition-colors duration-fast'
                            )}
                          >
                            Manage team members
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/app/opportunities"
                            className={classNames(
                              active ? 'bg-bg-alt' : '',
                              'flex items-center px-4 py-3 min-h-12 text-base text-text-secondary transition-colors duration-fast'
                            )}
                          >
                            View opportunities
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/app/teams/${team.id}/edit`}
                            className={classNames(
                              active ? 'bg-bg-alt' : '',
                              'flex items-center px-4 py-3 min-h-12 text-base text-text-secondary transition-colors duration-fast'
                            )}
                          >
                            Profile settings
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