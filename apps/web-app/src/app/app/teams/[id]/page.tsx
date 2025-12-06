'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  CheckBadgeIcon as CheckBadgeIconSolid,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';
import { DeleteTeamModal } from '@/components/teams/DeleteTeamModal';
import { TeamPostingStatus } from '@/components/teams/TeamPostingStatus';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: number;
  skills: string[];
}

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
  members: TeamMember[];
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

export default function TeamProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { userData } = useAuth();
  const teamId = params?.id as string;
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: team, isLoading, refetch } = useQuery<Team | null>({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch team');
      }
      const data = await response.json();
      return data.team;
    },
    enabled: !!teamId,
  });

  const handleExpressInterest = async () => {
    if (!userData || userData.type !== 'company') {
      toast.error('Only companies can express interest in teams');
      return;
    }

    try {
      const response = await fetch('/api/applications/eoi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toType: 'team',
          toId: teamId,
          message: `Interest in team ${team?.name}`,
          interestLevel: 'high',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to express interest');
      }

      setHasExpressedInterest(true);
      toast.success('Interest expressed. The team will be notified.');
      refetch();
    } catch (error) {
      console.error('Express interest error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to express interest');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-text-tertiary" />
        <h3 className="mt-2 text-sm font-medium text-text-primary">Team not found</h3>
        <p className="mt-1 text-sm text-text-tertiary">The team profile you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const isCompanyUser = userData?.type === 'company';
  const isTeamOwner = userData?.id === team.createdBy;

  // Collect all unique skills from team members
  const allSkills = [...new Set(team.members.flatMap(member => member.skills))];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Team Profile</h1>
        <p className="page-subtitle">Detailed team information and members.</p>
      </div>

      {/* Header Section */}
      <div className="card">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary flex items-center">
                    {team.name}
                    {team.cohesionScore >= 90 && (
                      <CheckBadgeIconSolid className="h-6 w-6 text-navy ml-2" title="High cohesion team" />
                    )}
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      team.openToLiftout
                        ? 'bg-success-light text-success-dark'
                        : 'bg-gold-100 text-gold-800'
                    }`}>
                      {team.openToLiftout ? 'Open to Opportunities' : 'Not Currently Available'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-50 text-navy-800">
                      {team.industry}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-text-secondary text-lg mb-4">{team.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text-secondary">
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  <span>{team.size} members</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  <span>{team.location}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  <span>{team.yearsWorking} years together</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-2" />
                  <span>{team.cohesionScore}% cohesion</span>
                </div>
              </div>
            </div>

            {isCompanyUser && (
              <div className="ml-6 flex flex-col space-y-2">
                <button
                  onClick={handleExpressInterest}
                  disabled={hasExpressedInterest}
                  className={`btn-primary min-h-12 flex items-center ${hasExpressedInterest ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {hasExpressedInterest ? (
                    <HeartIconSolid className="h-5 w-5 mr-2" />
                  ) : (
                    <HeartIcon className="h-5 w-5 mr-2" />
                  )}
                  {hasExpressedInterest ? 'Interest expressed' : 'Express interest'}
                </button>
                <button
                  className="btn-outline min-h-12 flex items-center"
                  onClick={() => router.push(`/app/messages?team=${teamId}`)}
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Message team
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Members */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-text-primary">Team members</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-bg-elevated flex items-center justify-center">
                      <span className="text-sm font-medium text-text-secondary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-text-primary">{member.name}</h3>
                        {member.role.toLowerCase().includes('lead') && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-navy-50 text-navy-800">
                            Team Lead
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{member.role}</p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {member.experience} years experience
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-bg-alt text-text-primary">
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-bg-alt text-text-tertiary">
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

          {/* Performance Metrics */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Performance Metrics
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-navy">{team.successfulProjects}</div>
                  <div className="text-sm text-text-secondary">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{team.clientSatisfaction}%</div>
                  <div className="text-sm text-text-secondary">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-600">{team.cohesionScore}%</div>
                  <div className="text-sm text-text-secondary">Team Cohesion</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {team.achievements.length > 0 && (
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-medium text-text-primary flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2" />
                  Key Achievements
                </h2>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-3">
                  {team.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary">Quick Stats</h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Team Size</span>
                <span className="text-sm font-medium">{team.size} members</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Years Together</span>
                <span className="text-sm font-medium">{team.yearsWorking} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Cohesion Score</span>
                <span className="text-sm font-medium">{team.cohesionScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Projects Completed</span>
                <span className="text-sm font-medium">{team.successfulProjects}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary">Team Skills</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-navy-50 text-navy-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Industry */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary">Industry</h2>
            </div>
            <div className="px-6 py-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-light text-success-dark">
                {team.industry}
              </span>
            </div>
          </div>

          {/* Compensation */}
          {isCompanyUser && (
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-medium text-text-primary flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Compensation Expectations
                </h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Salary Range</span>
                  <span className="text-sm font-medium">{team.compensation.range}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Equity Interest</span>
                  <span className="text-sm font-medium">{team.compensation.equity ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Benefits</span>
                  <span className="text-sm font-medium">{team.compensation.benefits}</span>
                </div>
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Availability
              </h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  team.openToLiftout
                    ? 'bg-success-light text-success-dark'
                    : 'bg-gold-100 text-gold-800'
                }`}>
                  {team.openToLiftout ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div>
                <span className="text-sm text-text-secondary">Notes</span>
                <p className="text-sm font-medium mt-1">{team.availability}</p>
              </div>
            </div>
          </div>

          {/* Team Posting Status - Only for team owners */}
          <TeamPostingStatus teamId={teamId} isTeamOwner={isTeamOwner} />

          {/* Danger Zone - Only for team owners */}
          {isTeamOwner && (
            <div className="card border-error/20">
              <div className="px-6 py-4 border-b border-error/20">
                <h2 className="text-lg font-medium text-error">Danger zone</h2>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-text-secondary mb-4">
                  Once you delete a team, there is no going back. Please be certain.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-outline min-h-10 text-error border-error hover:bg-error/10 flex items-center"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete team
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Team Modal */}
      <DeleteTeamModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        teamId={teamId}
        teamName={team.name}
      />
    </div>
  );
}
