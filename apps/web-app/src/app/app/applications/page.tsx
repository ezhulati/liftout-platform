'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PlusIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useApplications } from '@/hooks/useApplications';
import { useSession } from 'next-auth/react';
import { InterviewScheduler } from '@/components/interviews';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getStatusColor(status: string) {
  switch (status) {
    case 'submitted':
      return 'badge-primary';
    case 'under_review':
      return 'badge-warning';
    case 'interview_scheduled':
      return 'badge-primary';
    case 'offer_made':
      return 'badge-success';
    case 'accepted':
      return 'badge-success';
    case 'rejected':
      return 'badge-error';
    default:
      return 'badge-secondary';
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
  const [showInterviews, setShowInterviews] = useState(true);

  // Memoize applications array to prevent unnecessary re-renders
  const applications = useMemo(() => {
    return applicationsData?.data || [];
  }, [applicationsData?.data]);

  // Transform applications with scheduled interviews into Interview format
  const interviews = useMemo(() => {
    return applications
      .filter((app: any) => app.interviewScheduledAt)
      .map((app: any) => ({
        id: `interview-${app.id}`,
        applicationId: app.id,
        teamId: app.team?.id || '',
        teamName: app.team?.name || 'Team',
        opportunityTitle: app.opportunity?.title || 'Opportunity',
        scheduledAt: app.interviewScheduledAt,
        duration: 60,
        format: 'video' as const,
        status: app.status === 'interview_scheduled' ? 'scheduled' as const : 'confirmed' as const,
        interviewers: [],
        notes: app.interviewNotes,
      }));
  }, [applications]);

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
              <div className="h-16 w-16 skeleton rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 skeleton rounded w-48 mb-2"></div>
                <div className="h-3 skeleton rounded w-64 mb-2"></div>
                <div className="h-3 skeleton rounded w-32"></div>
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

        {/* Empty state - Practical UI */}
        <div className="text-center py-12">
          <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <DocumentTextIcon className="h-7 w-7 text-text-tertiary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">
            {isCompanyUser ? 'No applications yet' : 'No applications submitted'}
          </h3>
          <p className="mt-2 text-base font-normal text-text-secondary max-w-md mx-auto leading-relaxed">
            {isCompanyUser
              ? 'Teams will appear here when they express interest in your liftout opportunities.'
              : 'Start by browsing liftout opportunities and expressing interest in ones that match your team.'
            }
          </p>
          {!isCompanyUser && (
            <div className="mt-6">
              <Link href="/app/opportunities" className="btn-primary min-h-12 inline-flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Browse opportunities
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header - Practical UI: bold headings, regular body */}
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

      {/* Interviews Section */}
      {interviews.length > 0 && (
        <div className="card">
          <button
            onClick={() => setShowInterviews(!showInterviews)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-alt transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-navy" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-bold text-text-primary">
                  Upcoming Interviews
                </h2>
                <p className="text-sm text-text-secondary">
                  {interviews.length} interview{interviews.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>
            </div>
            {showInterviews ? (
              <ChevronUpIcon className="h-5 w-5 text-text-tertiary" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-text-tertiary" />
            )}
          </button>
          {showInterviews && (
            <div className="px-6 pb-6">
              <InterviewScheduler
                interviews={interviews}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      )}

      {/* Applications list - Practical UI cards */}
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="card hover:shadow-md hover:border-navy/30 transition-all duration-base">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-navy-50 flex items-center justify-center text-navy">
                    {getStatusIcon(application.status)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-text-primary">
                      {application.opportunity?.title || 'Opportunity'}
                    </h3>
                    <span className={classNames(
                      'badge text-xs',
                      getStatusColor(application.status)
                    )}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center text-sm font-normal text-text-tertiary mb-3 gap-x-4 gap-y-1">
                    <span className="font-bold text-text-secondary">{application.opportunity?.company?.name || 'Company'}</span>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Applied {formatDistanceToNow(new Date(application.submittedAt), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="text-sm font-normal text-text-secondary leading-relaxed">
                    <p className="line-clamp-2">
                      <span className="font-bold">Team:</span> {application.team?.name || 'Team'}
                    </p>
                    {application.coverLetter && (
                      <p className="line-clamp-2 mt-1">
                        <span className="font-bold">Cover Letter:</span> {application.coverLetter}
                      </p>
                    )}
                  </div>

                  {/* Interview info if scheduled */}
                  {application.interviewScheduledAt && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="text-sm font-bold text-text-primary mb-1">Interview Scheduled</h4>
                      <p className="text-sm font-normal text-text-tertiary">
                        {formatDistanceToNow(new Date(application.interviewScheduledAt), { addSuffix: true })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 flex-shrink-0">
                <Link
                  href={`/app/applications/${application.id}`}
                  className="btn-outline min-h-12 flex items-center"
                >
                  <EyeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  View details
                </Link>

                {isCompanyUser && application.status === 'submitted' && (
                  <div className="flex gap-2">
                    <button className="btn-outline min-h-12 text-success hover:bg-success-light">
                      Review
                    </button>
                    <button className="btn-outline min-h-12 text-error hover:bg-error-light">
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
