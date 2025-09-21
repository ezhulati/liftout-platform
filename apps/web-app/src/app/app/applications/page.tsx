'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useApplications } from '@/hooks/useApplications';
import { useSession } from 'next-auth/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getStatusColor(status: string) {
  switch (status) {
    case 'submitted':
      return 'bg-blue-100 text-blue-800';
    case 'under_review':
      return 'bg-yellow-100 text-yellow-800';
    case 'interview_scheduled':
      return 'bg-purple-100 text-purple-800';
    case 'offer_made':
      return 'bg-green-100 text-green-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'submitted':
      return <DocumentTextIcon className="h-5 w-5" />;
    case 'under_review':
      return <EyeIcon className="h-5 w-5" />;
    case 'interview_scheduled':
      return <ClockIcon className="h-5 w-5" />;
    case 'offer_made':
    case 'accepted':
      return <CheckCircleIcon className="h-5 w-5" />;
    case 'rejected':
      return <XCircleIcon className="h-5 w-5" />;
    default:
      return <DocumentTextIcon className="h-5 w-5" />;
  }
}

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const { data: applications = [], isLoading, error } = useApplications();

  if (!session) {
    return null;
  }

  const isCompanyUser = session.user.userType === 'company';

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

  if (!applications || applications.length === 0) {
    return (
      <div className="space-y-6">
        {/* Page header */}
        <div className="page-header">
          <h1 className="page-title">
            {isCompanyUser ? 'Application Management' : 'My Applications'}
          </h1>
          <p className="page-subtitle">
            {isCompanyUser 
              ? 'Review and manage team applications to your liftout opportunities'
              : 'Track your team\'s expressions of interest and application status'
            }
          </p>
        </div>

        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {isCompanyUser ? 'No applications yet' : 'No applications submitted'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isCompanyUser 
              ? 'Teams will appear here when they express interest in your liftout opportunities.'
              : 'Start by browsing liftout opportunities and expressing interest in ones that match your team.'
            }
          </p>
          {!isCompanyUser && (
            <div className="mt-6">
              <Link href="/app/opportunities" className="btn-primary">
                <PlusIcon className="h-4 w-4 mr-2" />
                Browse Opportunities
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">
          {isCompanyUser ? 'Application Management' : 'My Applications'}
        </h1>
        <p className="page-subtitle">
          {isCompanyUser 
            ? 'Review and manage team applications to your liftout opportunities'
            : 'Track your team\'s expressions of interest and application status'
          }
        </p>
      </div>

      {/* Applications list */}
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                    {getStatusIcon(application.status)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {/* In a real app, we'd fetch opportunity details */}
                      Strategic FinTech Analytics Team
                    </h3>
                    <span className={classNames(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(application.status)
                    )}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <span className="font-medium">Goldman Sachs Technology</span>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Applied {formatDistanceToNow(new Date(application.submittedAt), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="line-clamp-2">
                      <span className="font-medium">Team Lead:</span> {application.teamLead.name} ({application.teamLead.role})
                    </p>
                    <p className="line-clamp-2 mt-1">
                      <span className="font-medium">Availability:</span> {application.availabilityTimeline}
                    </p>
                  </div>

                  {/* Timeline for submitted applications */}
                  {application.timeline && application.timeline.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Application Timeline</h4>
                      <div className="space-y-2">
                        {application.timeline.slice(0, 3).map((event, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-500">
                            <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                            <span>{event.note}</span>
                            <span className="ml-2">
                              {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                            </span>
                            {event.actor && (
                              <span className="ml-2 text-gray-400">by {event.actor}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-6">
                <Link
                  href={`/app/applications/${application.id}`}
                  className="btn-secondary flex items-center"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Details
                </Link>
                
                {isCompanyUser && application.status === 'submitted' && (
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-green-600 hover:text-green-700">
                      Review
                    </button>
                    <button className="btn-secondary text-red-600 hover:text-red-700">
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}