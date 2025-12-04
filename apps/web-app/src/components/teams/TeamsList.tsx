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
      <div className="card text-center py-12">
        <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
          <UserGroupIcon className="h-7 w-7 text-text-tertiary" />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2">
          {isCompanyUser ? 'No teams yet' : 'No team profile yet'}
        </h3>
        <p className="text-base text-text-secondary leading-relaxed max-w-md mx-auto">
          {isCompanyUser
            ? 'Teams are starting to post profiles here. Be among the first to connect with intact teams.'
            : 'Post a team profile together. This is how companies find you on Liftout.'
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
        <div key={team.id} className="card hover:shadow-md hover:border-purple-300 transition-all duration-base">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-lg bg-navy-50 flex items-center justify-center">
                  <UserGroupIcon className="h-7 w-7 text-navy" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h3 className="text-base font-bold text-text-primary truncate">
                    {team.name}
                  </h3>
                  <span className={classNames(
                    'badge text-xs',
                    team.openToLiftout ? 'badge-success' : 'badge-secondary'
                  )}>
                    {team.openToLiftout ? 'Open to liftout' : 'Not available'}
                  </span>
                  <span className="badge badge-primary text-xs">
                    {team.industry}
                  </span>
                </div>

                <p className="text-sm text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                  {team.description}
                </p>

                <div className="flex flex-wrap items-center mt-3 gap-x-4 gap-y-1 text-sm text-text-tertiary">
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
                    <div className="font-bold">
                      {team.successfulProjects || 0} projects
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {(team.members?.flatMap(m => m.skills) || []).slice(0, 4).map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="badge badge-secondary text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {(team.members?.flatMap(m => m.skills) || []).length > 4 && (
                    <span className="badge badge-secondary text-xs">
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