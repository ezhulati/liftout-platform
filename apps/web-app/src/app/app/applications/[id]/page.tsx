'use client';

import { use } from 'react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { useApplication } from '@/hooks/useApplications';
import { useSession } from 'next-auth/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getStatusColor(status: string) {
  switch (status) {
    case 'submitted':
      return 'bg-navy-50 text-navy-800';
    case 'under_review':
    case 'reviewing':
      return 'bg-gold-100 text-gold-700';
    case 'interview_scheduled':
    case 'interviewing':
      return 'bg-navy-100 text-navy-700';
    case 'offer_made':
    case 'accepted':
      return 'bg-success-light text-success';
    case 'rejected':
      return 'bg-error-light text-error';
    default:
      return 'bg-bg-alt text-text-primary';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'submitted':
      return <DocumentTextIcon className="h-5 w-5" />;
    case 'under_review':
    case 'reviewing':
      return <EyeIcon className="h-5 w-5" />;
    case 'interview_scheduled':
    case 'interviewing':
      return <CalendarIcon className="h-5 w-5" />;
    case 'offer_made':
    case 'accepted':
      return <CheckCircleIcon className="h-5 w-5" />;
    case 'rejected':
      return <XCircleIcon className="h-5 w-5" />;
    default:
      return <DocumentTextIcon className="h-5 w-5" />;
  }
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { data: application, isLoading, error } = useApplication(id);

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-bg-elevated rounded animate-pulse"></div>
          <div className="h-6 w-48 bg-bg-elevated rounded animate-pulse"></div>
        </div>
        <div className="card animate-pulse">
          <div className="h-8 w-64 bg-bg-elevated rounded mb-4"></div>
          <div className="h-4 w-full bg-bg-elevated rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-bg-elevated rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="space-y-6">
        <Link
          href="/app/applications"
          className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Applications
        </Link>
        <div className="card text-center py-12">
          <DocumentTextIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">Application not found</h3>
          <p className="text-text-secondary">
            This application may have been removed or you don't have access to view it.
          </p>
        </div>
      </div>
    );
  }

  const isCompanyUser = session.user.userType === 'company';

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/app/applications"
        className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Applications
      </Link>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-navy-50 flex items-center justify-center text-navy">
              {getStatusIcon(application.status)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                {application.opportunity?.title || 'Opportunity'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-text-secondary">
                <div className="flex items-center gap-1">
                  <BuildingOfficeIcon className="h-4 w-4" />
                  <span>{application.opportunity?.company?.name || 'Company'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>{application.team?.name || 'Team'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>Applied {application.submittedAt ? formatDistanceToNow(new Date(application.submittedAt), { addSuffix: true }) : 'recently'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={classNames(
              'badge px-4 py-2 text-sm font-medium',
              getStatusColor(application.status)
            )}>
              {formatStatus(application.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Application Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="card">
              <h2 className="text-lg font-bold text-text-primary mb-4">Cover Letter</h2>
              <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                {application.coverLetter}
              </p>
            </div>
          )}

          {/* Team Fit */}
          {application.teamFitExplanation && (
            <div className="card">
              <h2 className="text-lg font-bold text-text-primary mb-4">Why We're a Great Fit</h2>
              <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                {application.teamFitExplanation}
              </p>
            </div>
          )}

          {/* Questions */}
          {application.questionsForCompany && (
            <div className="card">
              <h2 className="text-lg font-bold text-text-primary mb-4">Questions for the Company</h2>
              <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                {application.questionsForCompany}
              </p>
            </div>
          )}

          {/* Interview Info */}
          {application.interviewScheduledAt && (
            <div className="card border-l-4 border-navy">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-navy-50 flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary mb-1">Interview Scheduled</h2>
                  <p className="text-text-secondary">
                    {format(new Date(application.interviewScheduledAt), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                  </p>
                  <p className="text-sm text-text-tertiary mt-1">
                    {formatDistanceToNow(new Date(application.interviewScheduledAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Info */}
          <div className="card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Team</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center">
                <UserGroupIcon className="h-5 w-5 text-navy" />
              </div>
              <div>
                <p className="font-medium text-text-primary">{application.team?.name || 'Team'}</p>
                <p className="text-sm text-text-tertiary">{application.team?.size || 0} members</p>
              </div>
            </div>
            {application.team?.description && (
              <p className="text-sm text-text-secondary line-clamp-3">
                {application.team.description}
              </p>
            )}
            <Link
              href={`/app/teams/${application.teamId}`}
              className="btn-outline w-full mt-4 justify-center"
            >
              View Team Profile
            </Link>
          </div>

          {/* Opportunity Info */}
          <div className="card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Opportunity</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-gold-100 flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-gold-700" />
              </div>
              <div>
                <p className="font-medium text-text-primary">{application.opportunity?.company?.name || 'Company'}</p>
                <p className="text-sm text-text-tertiary">{application.opportunity?.title || 'Opportunity'}</p>
              </div>
            </div>
            <Link
              href={`/app/opportunities/${application.opportunityId}`}
              className="btn-outline w-full mt-4 justify-center"
            >
              View Opportunity
            </Link>
          </div>

          {/* Actions */}
          <div className="card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="btn-primary w-full justify-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Send Message
              </button>
              {!isCompanyUser && application.status === 'submitted' && (
                <button className="btn-outline w-full justify-center text-error hover:bg-error-light">
                  Withdraw Application
                </button>
              )}
              {isCompanyUser && application.status === 'submitted' && (
                <>
                  <button className="btn-outline w-full justify-center text-success hover:bg-success-light">
                    Move to Review
                  </button>
                  <button className="btn-outline w-full justify-center text-error hover:bg-error-light">
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-navy-50 flex items-center justify-center flex-shrink-0">
                  <DocumentTextIcon className="h-4 w-4 text-navy" />
                </div>
                <div>
                  <p className="font-medium text-text-primary text-sm">Application Submitted</p>
                  <p className="text-xs text-text-tertiary">
                    {application.submittedAt ? format(new Date(application.submittedAt), 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
              {application.reviewedAt && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <EyeIcon className="h-4 w-4 text-gold-700" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary text-sm">Under Review</p>
                    <p className="text-xs text-text-tertiary">
                      {format(new Date(application.reviewedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              )}
              {application.interviewScheduledAt && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                    <CalendarIcon className="h-4 w-4 text-navy-700" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary text-sm">Interview Scheduled</p>
                    <p className="text-xs text-text-tertiary">
                      {format(new Date(application.interviewScheduledAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
