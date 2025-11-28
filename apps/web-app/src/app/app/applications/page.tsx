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
      return 'bg-navy-50 text-blue-800';
    case 'under_review':
      return 'bg-gold-100 text-yellow-800';
    case 'interview_scheduled':
      return 'bg-purple-100 text-purple-800';
    case 'offer_made':
      return 'bg-success-light text-success-dark';
    case 'accepted':
      return 'bg-success-light text-success-dark';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-bg-alt text-text-primary';
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
  const { data: applicationsData, isLoading, error } = useApplications();
  const applications = applicationsData?.data || [];

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
              <div className="h-16 w-16 bg-bg-elevated rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-bg-elevated rounded w-48 mb-2"></div>
                <div className="h-3 bg-bg-elevated rounded w-64 mb-2"></div>
                <div className="h-3 bg-bg-elevated rounded w-32"></div>
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
          <DocumentTextIcon className="mx-auto h-12 w-12 text-text-tertiary" />
          <h3 className="mt-2 text-sm font-medium text-text-primary">
            {isCompanyUser ? 'No applications yet' : 'No applications submitted'}
          </h3>
          <p className="mt-1 text-sm text-text-tertiary">
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
                    <h3 className="text-lg font-medium text-text-primary">
                      {application.opportunity?.title || 'Opportunity'}
                    </h3>
                    <span className={classNames(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(application.status)
                    )}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-text-tertiary mb-3 space-x-4">
                    <span className="font-medium">{application.opportunity?.company?.name || 'Company'}</span>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Applied {formatDistanceToNow(new Date(application.submittedAt), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="text-sm text-text-secondary">
                    <p className="line-clamp-2">
                      <span className="font-medium">Team:</span> {application.team?.name || 'Team'}
                    </p>
                    {application.coverLetter && (
                      <p className="line-clamp-2 mt-1">
                        <span className="font-medium">Cover Letter:</span> {application.coverLetter}
                      </p>
                    )}
                  </div>

                  {/* Interview info if scheduled */}
                  {application.interviewScheduledAt && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="text-sm font-medium text-text-primary mb-2">Interview Scheduled</h4>
                      <p className="text-xs text-text-tertiary">
                        {formatDistanceToNow(new Date(application.interviewScheduledAt), { addSuffix: true })}
                      </p>
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
                    <button className="btn-secondary text-success hover:text-green-700">
                      Review
                    </button>
                    <button className="btn-secondary text-error hover:text-red-700">
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