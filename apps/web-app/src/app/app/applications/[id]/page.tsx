'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  teamId: string;
  teamName: string;
  status: 'pending' | 'under_review' | 'interview' | 'offer' | 'accepted' | 'rejected' | 'withdrawn';
  appliedAt: string;
  updatedAt: string;
  coverLetter?: string;
  notes?: string;
  interviewDate?: string;
  feedback?: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Pending Review',
    color: 'bg-navy-50 text-navy-800',
    icon: <ClockIcon className="h-5 w-5" />,
  },
  submitted: {
    label: 'Submitted',
    color: 'bg-navy-50 text-navy-800',
    icon: <DocumentTextIcon className="h-5 w-5" />,
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-gold-100 text-gold-700',
    icon: <EyeIcon className="h-5 w-5" />,
  },
  reviewing: {
    label: 'Reviewing',
    color: 'bg-gold-100 text-gold-700',
    icon: <EyeIcon className="h-5 w-5" />,
  },
  interview: {
    label: 'Interview Scheduled',
    color: 'bg-navy-100 text-navy-700',
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  interviewing: {
    label: 'Interview Scheduled',
    color: 'bg-navy-100 text-navy-700',
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  interview_scheduled: {
    label: 'Interview Scheduled',
    color: 'bg-navy-100 text-navy-700',
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  offer: {
    label: 'Offer Made',
    color: 'bg-success-light text-success',
    icon: <CheckCircleIcon className="h-5 w-5" />,
  },
  offer_made: {
    label: 'Offer Made',
    color: 'bg-success-light text-success',
    icon: <CheckCircleIcon className="h-5 w-5" />,
  },
  accepted: {
    label: 'Accepted',
    color: 'bg-success-light text-success',
    icon: <CheckCircleIcon className="h-5 w-5" />,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-error-light text-error',
    icon: <XCircleIcon className="h-5 w-5" />,
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'bg-text-tertiary/20 text-text-secondary',
    icon: <XCircleIcon className="h-5 w-5" />,
  },
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const isCompanyUser = session?.user?.userType === 'company';

  const fetchApplication = useCallback(async () => {
    if (!params?.id) return;
    try {
      const response = await fetch(`/api/applications/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch application');
      }
      const data = await response.json();
      setApplication(data.application);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      fetchApplication();
    }
  }, [params?.id, fetchApplication]);

  const handleWithdraw = async () => {
    if (!application) return;

    setWithdrawing(true);
    try {
      const response = await fetch(`/api/applications/${application.id}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw application');
      }

      toast.success('Application withdrawn successfully');
      setShowWithdrawModal(false);
      router.push('/app/applications');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-bg-surface p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Application Not Found</h1>
          <p className="text-text-secondary mb-6">
            The application you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/app/applications"
            className="btn-primary min-h-12 inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to applications
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[application.status] || statusConfig.pending;
  const canWithdraw = ['pending', 'submitted', 'under_review', 'reviewing'].includes(application.status);

  return (
    <div className="min-h-screen bg-bg-surface">
      <div className="max-w-6xl mx-auto p-6">
        {/* Back Navigation */}
        <Link
          href="/app/applications"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-navy transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Applications
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-bg-elevated rounded-lg border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BuildingOffice2Icon className="w-8 h-8 text-navy" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">{application.opportunityTitle}</h1>
                    <p className="text-text-secondary text-lg">{application.company}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-border">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-text-tertiary" />
                  <div>
                    <p className="text-xs text-text-tertiary">Team</p>
                    <p className="text-sm font-medium text-text-primary">{application.teamName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-text-tertiary" />
                  <div>
                    <p className="text-xs text-text-tertiary">Applied</p>
                    <p className="text-sm font-medium text-text-primary">
                      {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-text-tertiary" />
                  <div>
                    <p className="text-xs text-text-tertiary">Last Updated</p>
                    <p className="text-sm font-medium text-text-primary">
                      {formatDistanceToNow(new Date(application.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div className="bg-bg-elevated rounded-lg border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DocumentTextIcon className="w-5 h-5 text-navy" />
                  <h2 className="text-lg font-semibold text-text-primary">Cover Letter</h2>
                </div>
                <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                  {application.coverLetter}
                </p>
              </div>
            )}

            {/* Interview Details */}
            {application.interviewDate && (
              <div className="bg-bg-elevated rounded-lg border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="w-5 h-5 text-success" />
                  <h2 className="text-lg font-semibold text-text-primary">Interview Scheduled</h2>
                </div>
                <div className="bg-success-light rounded-lg p-4">
                  <p className="text-success font-medium">
                    {format(new Date(application.interviewDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-success/80 text-sm mt-1">
                    {format(new Date(application.interviewDate), 'h:mm a')}
                  </p>
                </div>
                {application.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-text-tertiary mb-1">Interview Notes</p>
                    <p className="text-text-secondary">{application.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Feedback */}
            {application.feedback && (
              <div className="bg-bg-elevated rounded-lg border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-navy" />
                  <h2 className="text-lg font-semibold text-text-primary">Feedback</h2>
                </div>
                <p className="text-text-secondary whitespace-pre-wrap">{application.feedback}</p>
              </div>
            )}

            {/* Internal Notes (Company View) */}
            {isCompanyUser && application.notes && !application.interviewDate && (
              <div className="bg-bg-elevated rounded-lg border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DocumentTextIcon className="w-5 h-5 text-gold" />
                  <h2 className="text-lg font-semibold text-text-primary">Internal Notes</h2>
                </div>
                <p className="text-text-secondary whitespace-pre-wrap">{application.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-bg-elevated rounded-lg border border-border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Actions</h3>

              {/* Status Timeline */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text-primary mb-3">Application Status</h4>
                <div className={`p-4 rounded-lg ${status.color}`}>
                  <div className="flex items-center gap-2">
                    {status.icon}
                    <span className="font-medium">{status.label}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* View Opportunity */}
                <Link
                  href={`/app/opportunities/${application.opportunityId}`}
                  className="btn-outline min-h-12 w-full flex items-center justify-center gap-2"
                >
                  <BriefcaseIcon className="w-5 h-5" />
                  View Opportunity
                </Link>

                {/* Message Company */}
                <button
                  onClick={() => toast.success('Messaging feature coming soon!')}
                  className="btn-outline min-h-12 w-full flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Message {isCompanyUser ? 'Team' : 'Company'}
                </button>

                {/* Withdraw (Team only, only if status allows) */}
                {!isCompanyUser && canWithdraw && (
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="btn-outline min-h-12 w-full flex items-center justify-center gap-2 text-error hover:bg-error-light hover:border-error"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    Withdraw Application
                  </button>
                )}

                {/* Company Actions */}
                {isCompanyUser && application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => toast.success('Review feature coming soon!')}
                      className="btn-primary min-h-12 w-full"
                    >
                      Start Review
                    </button>
                    <button
                      onClick={() => toast.success('Decline feature coming soon!')}
                      className="btn-outline min-h-12 w-full text-error hover:bg-error-light"
                    >
                      Decline
                    </button>
                  </>
                )}

                {isCompanyUser && ['under_review', 'reviewing'].includes(application.status) && (
                  <>
                    <button
                      onClick={() => toast.success('Interview scheduling coming soon!')}
                      className="btn-primary min-h-12 w-full"
                    >
                      Schedule Interview
                    </button>
                    <button
                      onClick={() => toast.success('Decline feature coming soon!')}
                      className="btn-outline min-h-12 w-full text-error hover:bg-error-light"
                    >
                      Decline
                    </button>
                  </>
                )}

                {isCompanyUser && application.status === 'interview' && (
                  <button
                    onClick={() => toast.success('Offer feature coming soon!')}
                    className="btn-primary min-h-12 w-full"
                  >
                    Make Offer
                  </button>
                )}
              </div>

              {/* Important Dates */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-text-primary mb-3">Timeline</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Applied</span>
                    <span className="text-text-secondary">
                      {format(new Date(application.appliedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Last Update</span>
                    <span className="text-text-secondary">
                      {format(new Date(application.updatedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {application.interviewDate && (
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Interview</span>
                      <span className="text-success font-medium">
                        {format(new Date(application.interviewDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elevated rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-error-light flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-error" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Withdraw Application?</h2>
                <p className="text-text-secondary text-sm">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-text-secondary mb-6">
              Are you sure you want to withdraw your application for <strong>{application.opportunityTitle}</strong> at <strong>{application.company}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="btn-outline min-h-12"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="btn-primary min-h-12 bg-error hover:bg-error/90 disabled:opacity-50"
              >
                {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
