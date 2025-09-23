'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  CheckBadgeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import {
  CheckBadgeIcon as CheckBadgeIconSolid,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  description: string;
  size: number;
  yearsWorking: number;
  cohesionScore: number;
  successfulProjects: number;
  clientSatisfaction: number;
  openToLiftout: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: Array<{
    id: string;
    name: string;
    role: string;
    experience: number;
    skills: string[];
  }>;
  achievements: string[];
  industry: string;
  location: string;
  availability: string;
  compensation: {
    range: string;
    equity: boolean;
    benefits: string;
  };
}

interface TeamDetailProps {
  teamId: string;
}

export function TeamDetail({ teamId }: TeamDetailProps) {
  const { user, userType } = useAuth();
  const queryClient = useQueryClient();
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);

  // Fetch team data
  const { data: team, isLoading, error } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch team');
      }
      const data = await response.json();
      return data.team as Team;
    },
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete team');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Team deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleExpressInterest = async () => {
    if (!user || userType !== 'company') {
      toast.error('Only companies can express interest in teams');
      return;
    }

    try {
      // For now, just update local state and show success
      setHasExpressedInterest(true);
      toast.success('Interest expressed successfully!');
    } catch (error) {
      toast.error('Failed to express interest');
    }
  };

  const handleDeleteTeam = () => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      deleteTeamMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Team not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The team profile you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <div className="mt-6">
          <Link href="/app/teams" className="btn-primary">
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const isCompanyUser = userType === 'company';
  const isTeamOwner = user?.id === team.createdBy;
  const avgExperience = team.members.reduce((sum, member) => sum + member.experience, 0) / team.members.length;
  const allSkills = [...new Set(team.members.flatMap(member => member.skills))];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-blue-600 flex items-center justify-center">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    {team.name}
                    {team.openToLiftout && (
                      <CheckBadgeIconSolid className="h-6 w-6 text-green-500 ml-2" title="Open to liftout opportunities" />
                    )}
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      team.openToLiftout ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {team.openToLiftout ? 'Available for Liftout' : 'Not Available'}
                    </span>
                    {team.cohesionScore > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {team.cohesionScore}% Team Cohesion
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg mb-4">{team.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  <span>{team.size} members</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  <span>{team.location}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{avgExperience.toFixed(1)} avg years exp</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-2" />
                  <span>{team.industry}</span>
                </div>
              </div>

              {team.achievements.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Key Achievements</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {team.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="ml-6 flex flex-col space-y-2">
              {isCompanyUser && (
                <>
                  <button
                    onClick={handleExpressInterest}
                    disabled={hasExpressedInterest}
                    className={`btn-primary flex items-center ${
                      hasExpressedInterest ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {hasExpressedInterest ? (
                      <HeartIconSolid className="h-4 w-4 mr-2" />
                    ) : (
                      <HeartIcon className="h-4 w-4 mr-2" />
                    )}
                    {hasExpressedInterest ? 'Interest Expressed' : 'Express Interest'}
                  </button>
                  <button className="btn-secondary flex items-center">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Message Team
                  </button>
                </>
              )}

              {isTeamOwner && (
                <>
                  <Link href={`/app/teams/${teamId}/edit`} className="btn-secondary flex items-center">
                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                    Edit Team
                  </Link>
                  <Link href={`/app/teams/${teamId}/verification`} className="btn-secondary flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                    Verification
                  </Link>
                  <button
                    onClick={handleDeleteTeam}
                    disabled={deleteTeamMutation.isPending}
                    className="btn-danger flex items-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    {deleteTeamMutation.isPending ? 'Deleting...' : 'Delete Team'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Members */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
                {isTeamOwner && (
                  <Link href={`/app/teams/${teamId}/members`} className="btn-sm btn-secondary flex items-center">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Manage Members
                  </Link>
                )}
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {team.members.map((member, index) => (
                  <div key={member.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {member.experience} years experience
                          </p>
                        </div>
                        {isTeamOwner && (
                          <div className="flex space-x-2">
                            <button className="text-sm text-primary-600 hover:text-primary-700">
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                            <button className="text-sm text-red-600 hover:text-red-700">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.skills.slice(0, 4).map((skill, skillIndex) => (
                          <span 
                            key={skillIndex} 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{member.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Skills */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Team Skills & Expertise</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Team Metrics</h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Team Size</span>
                <span className="text-sm font-medium">{team.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Experience</span>
                <span className="text-sm font-medium">{avgExperience.toFixed(1)} years</span>
              </div>
              {team.cohesionScore > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Team Cohesion</span>
                  <span className="text-sm font-medium">{team.cohesionScore}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Skills Diversity</span>
                <span className="text-sm font-medium">{allSkills.length} skills</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Industry</span>
                <span className="text-sm font-medium">{team.industry}</span>
              </div>
            </div>
          </div>

          {/* Compensation */}
          {(isCompanyUser || isTeamOwner) && (
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Compensation
                </h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Range</span>
                  <span className="text-sm font-medium">{team.compensation.range}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Equity</span>
                  <span className="text-sm font-medium">{team.compensation.equity ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Benefits</span>
                  <span className="text-sm font-medium">{team.compensation.benefits}</span>
                </div>
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Availability
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  team.openToLiftout ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {team.openToLiftout ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-sm text-gray-600">Timeline</span>
                <p className="text-sm font-medium mt-1">{team.availability}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profile Info</h2>
            </div>
            <div className="px-6 py-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{new Date(team.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{new Date(team.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}