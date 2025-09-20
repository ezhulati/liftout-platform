'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/lib/services/teamService';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  CheckBadgeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  EyeIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LinkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  CheckBadgeIcon as CheckBadgeIconSolid,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';

const verificationStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const availabilityColors = {
  available: 'bg-green-100 text-green-800',
  selective: 'bg-yellow-100 text-yellow-800',
  not_available: 'bg-red-100 text-red-800',
};

export default function TeamProfilePage() {
  const params = useParams();
  const { userData } = useAuth();
  const teamId = params.id as string;
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);

  const { data: team, isLoading, refetch } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const team = await teamService.getTeamById(teamId);
      if (team && userData?.type === 'company') {
        // Increment view count for company users
        await teamService.incrementViewCount(teamId);
      }
      return team;
    },
    enabled: !!teamId,
  });

  const handleExpressInterest = async () => {
    if (!userData || userData.type !== 'company') {
      toast.error('Only companies can express interest in teams');
      return;
    }

    try {
      await teamService.expressInterest(teamId, userData.id);
      setHasExpressedInterest(true);
      toast.success('Interest expressed successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to express interest');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Team not found</h3>
        <p className="mt-1 text-sm text-gray-500">The team profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  const isCompanyUser = userData?.type === 'company';
  const isTeamLead = userData?.id === team.leaderId;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    {team.name}
                    {team.verification.status === 'verified' && (
                      <CheckBadgeIconSolid className="h-6 w-6 text-blue-500 ml-2" />
                    )}
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verificationStatusColors[team.verification.status]}`}>
                      {team.verification.status === 'verified' ? 'Verified Team' : `Verification ${team.verification.status}`}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${availabilityColors[team.availability.status]}`}>
                      {team.availability.status.replace('_', ' ')}
                    </span>
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
                  <span>{team.location.primary} {team.location.remote && '(Remote)'}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  <span>{team.dynamics.yearsWorkingTogether} years together</span>
                </div>
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  <span>{team.viewCount} profile views</span>
                </div>
              </div>
            </div>

            {isCompanyUser && (
              <div className="ml-6 flex flex-col space-y-2">
                <button
                  onClick={handleExpressInterest}
                  disabled={hasExpressedInterest}
                  className={`btn-primary flex items-center ${hasExpressedInterest ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        {member.verified && (
                          <CheckBadgeIconSolid className="h-4 w-4 text-blue-500" />
                        )}
                        {member.role === 'lead' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Team Lead
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{member.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {member.yearsExperience} years experience • 
                        Joined team {formatDistanceToNow(member.joinedTeamDate, { addSuffix: true })}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.specializations.slice(0, 3).map((spec) => (
                          <span key={spec} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Performance Metrics
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{team.performanceMetrics.projectsCompleted}</div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{team.performanceMetrics.successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{team.performanceMetrics.clientSatisfactionScore}/10</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{team.performanceMetrics.clientRetentionRate}%</div>
                  <div className="text-sm text-gray-600">Client Retention</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{team.performanceMetrics.timeToDelivery}</div>
                  <div className="text-sm text-gray-600">Avg. Delivery (days)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">${team.performanceMetrics.averageProjectValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Avg. Project Value</div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          {team.portfolioItems.length > 0 && (
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2" />
                  Portfolio & Case Studies
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {team.portfolioItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      {item.client && (
                        <p className="text-xs text-gray-500 mt-2">Client: {item.client}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-gray-500">{item.duration}</span>
                        {item.value && (
                          <span className="text-sm font-medium text-green-600">
                            ${item.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {item.outcomes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Key Outcomes:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {item.outcomes.map((outcome, idx) => (
                              <li key={idx}>• {outcome}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Testimonials */}
          {team.testimonials.length > 0 && (
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Client Testimonials</h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {team.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <blockquote className="text-gray-700 italic mb-2">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {testimonial.clientName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {testimonial.clientTitle} at {testimonial.clientCompany}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Stats</h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="text-sm font-medium">{team.viewCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Interest Expressions</span>
                <span className="text-sm font-medium">{team.expressionsOfInterest}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Opportunities</span>
                <span className="text-sm font-medium">{team.activeOpportunities}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Team Cohesion</span>
                <span className="text-sm font-medium">{team.dynamics.cohesionScore}/10</span>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Specializations</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {team.specializations.map((spec) => (
                  <span key={spec} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Industries */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Industries</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {team.industry.map((ind) => (
                  <span key={ind} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Compensation */}
          {isCompanyUser && (
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Compensation Expectations
                </h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Team Range</span>
                  <span className="text-sm font-medium">
                    {team.compensationExpectations.currency} {team.compensationExpectations.totalTeamValue.min.toLocaleString()} - {team.compensationExpectations.totalTeamValue.max.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Structure</span>
                  <span className="text-sm font-medium">{team.compensationExpectations.structure.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Negotiable</span>
                  <span className="text-sm font-medium">{team.compensationExpectations.negotiable ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification Status */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Verification
              </h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verificationStatusColors[team.verification.status]}`}>
                  {team.verification.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Documents</span>
                <span className="text-sm font-medium">{team.verification.documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">References</span>
                <span className="text-sm font-medium">{team.verification.references.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Background Checks</span>
                <span className="text-sm font-medium">{team.verification.backgroundChecks.length}</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Availability
              </h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${availabilityColors[team.availability.status]}`}>
                  {team.availability.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Timeline</span>
                <p className="text-sm font-medium mt-1">{team.availability.timeline}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Liftout Readiness</span>
                <p className="text-sm font-medium mt-1">{team.liftoutHistory.liftoutReadiness.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}