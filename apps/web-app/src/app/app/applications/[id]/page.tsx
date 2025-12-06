'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import {
  useApplication,
  useUpdateApplicationStatus,
  useScheduleInterview,
  useMakeOffer,
  useWithdrawApplication,
  useRespondToOffer
} from '@/hooks/useApplications';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

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
  const router = useRouter();
  const { data: session } = useSession();
  const { data: application, isLoading, error } = useApplication(id);

  // Mutation hooks
  const updateStatus = useUpdateApplicationStatus();
  const scheduleInterview = useScheduleInterview();
  const makeOffer = useMakeOffer();
  const withdrawApplication = useWithdrawApplication();
  const respondToOffer = useRespondToOffer();

  // Modal states
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showOfferResponseModal, setShowOfferResponseModal] = useState(false);
  const [offerResponseType, setOfferResponseType] = useState<'accept' | 'decline'>('accept');

  // Form states for modals
  const [interviewData, setInterviewData] = useState({
    scheduledAt: '',
    format: 'video',
    duration: '60',
    meetingLink: '',
    notes: '',
  });
  const [offerData, setOfferData] = useState({
    compensation: '',
    startDate: '',
    equity: '',
    benefits: '',
    terms: '',
  });
  const [declineReason, setDeclineReason] = useState('');
  const [offerResponseMessage, setOfferResponseMessage] = useState('');

  // Action handlers
  const handleMoveToReview = async () => {
    try {
      await updateStatus.mutateAsync({
        applicationId: id,
        status: 'reviewing',
      });
      toast.success('Application moved to review');
    } catch (err) {
      toast.error('Failed to update application status');
    }
  };

  const handleDecline = async () => {
    try {
      await updateStatus.mutateAsync({
        applicationId: id,
        status: 'rejected',
        rejectionReason: declineReason,
      });
      toast.success('Application declined');
      setShowDeclineModal(false);
    } catch (err) {
      toast.error('Failed to decline application');
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewData.scheduledAt) {
      toast.error('Please select a date and time');
      return;
    }
    try {
      await scheduleInterview.mutateAsync({
        applicationId: id,
        scheduledAt: new Date(interviewData.scheduledAt).toISOString(),
        notes: interviewData.notes,
      });
      toast.success('Interview scheduled successfully');
      setShowInterviewModal(false);
    } catch (err) {
      toast.error('Failed to schedule interview');
    }
  };

  const handleMakeOffer = async () => {
    if (!offerData.terms) {
      toast.error('Please provide offer terms');
      return;
    }
    try {
      await makeOffer.mutateAsync({
        applicationId: id,
        terms: offerData.terms,
        compensation: offerData.compensation,
        startDate: offerData.startDate,
      });
      toast.success('Offer sent successfully');
      setShowOfferModal(false);
    } catch (err) {
      toast.error('Failed to send offer');
    }
  };

  const handleWithdraw = async () => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await withdrawApplication.mutateAsync(id);
      toast.success('Application withdrawn');
      router.push('/app/applications');
    } catch (err) {
      toast.error('Failed to withdraw application');
    }
  };

  const handleSendMessage = () => {
    // Navigate to messages with context
    router.push(`/app/messages?applicationId=${id}`);
  };

  const handleRespondToOffer = async () => {
    try {
      await respondToOffer.mutateAsync({
        applicationId: id,
        accept: offerResponseType === 'accept',
        message: offerResponseMessage || undefined,
      });
      toast.success(offerResponseType === 'accept' ? 'Offer accepted!' : 'Offer declined');
      setShowOfferResponseModal(false);
      setOfferResponseMessage('');
    } catch (err) {
      toast.error('Failed to respond to offer');
    }
  };

  const openOfferResponse = (type: 'accept' | 'decline') => {
    setOfferResponseType(type);
    setShowOfferResponseModal(true);
  };

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

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Application</h1>
        <p className="page-subtitle">Review and manage application status.</p>
      </div>

      {/* Header */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-text-primary">
            {application.opportunity?.title || 'Application'}
          </h2>
        </div>
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
          <span className={classNames(
            'badge px-3 py-1 text-xs font-medium ml-auto',
            getStatusColor(application.status)
          )}>
            {formatStatus(application.status)}
          </span>
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

          {/* Offer Details */}
          {application.offerMadeAt && application.offerDetails && (
            <div className="card border-l-4 border-success">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-success-light flex items-center justify-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-text-primary">Offer Received</h2>
                    {application.status === 'accepted' && (
                      <span className="badge bg-success-light text-success px-3 py-1">Accepted</span>
                    )}
                    {application.status === 'rejected' && (
                      <span className="badge bg-error-light text-error px-3 py-1">Declined</span>
                    )}
                  </div>
                  <p className="text-sm text-text-tertiary mb-4">
                    Received {formatDistanceToNow(new Date(application.offerMadeAt), { addSuffix: true })}
                  </p>

                  {(() => {
                    const offer = application.offerDetails as Record<string, string | undefined> | null;
                    if (!offer) return null;
                    return (
                      <>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {offer.compensation && (
                            <div>
                              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Compensation</p>
                              <p className="text-text-primary font-semibold">{offer.compensation}</p>
                            </div>
                          )}
                          {offer.startDate && (
                            <div>
                              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Start Date</p>
                              <p className="text-text-primary font-semibold">
                                {format(new Date(offer.startDate), 'MMMM d, yyyy')}
                              </p>
                            </div>
                          )}
                          {offer.equity && (
                            <div>
                              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Equity</p>
                              <p className="text-text-primary font-semibold">{offer.equity}</p>
                            </div>
                          )}
                          {offer.benefits && (
                            <div>
                              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Benefits</p>
                              <p className="text-text-primary font-semibold">{offer.benefits}</p>
                            </div>
                          )}
                        </div>

                        {offer.terms && (
                          <div className="bg-bg-alt rounded-lg p-4 mb-4">
                            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">Terms</p>
                            <p className="text-text-secondary text-sm whitespace-pre-wrap">
                              {offer.terms}
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {/* Accept/Decline buttons for team users who haven't responded yet */}
                  {!isCompanyUser && !application.finalDecisionAt && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => openOfferResponse('accept')}
                        className="btn-primary flex-1 justify-center"
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Accept Offer
                      </button>
                      <button
                        onClick={() => openOfferResponse('decline')}
                        className="btn-outline flex-1 justify-center text-error hover:bg-error-light"
                      >
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Decline Offer
                      </button>
                    </div>
                  )}

                  {/* Show response if already responded */}
                  {application.finalDecisionAt && application.responseMessage && (
                    <div className="bg-bg-alt rounded-lg p-4 mt-4">
                      <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">Response Message</p>
                      <p className="text-text-secondary text-sm">{application.responseMessage}</p>
                    </div>
                  )}
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
              <button
                onClick={handleSendMessage}
                className="btn-primary w-full justify-center"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Send Message
              </button>

              {/* Team user actions */}
              {!isCompanyUser && application.status === 'submitted' && (
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawApplication.isPending}
                  className="btn-outline w-full justify-center text-error hover:bg-error-light disabled:opacity-50"
                >
                  {withdrawApplication.isPending ? 'Withdrawing...' : 'Withdraw Application'}
                </button>
              )}

              {/* Company user actions based on status */}
              {isCompanyUser && application.status === 'submitted' && (
                <>
                  <button
                    onClick={handleMoveToReview}
                    disabled={updateStatus.isPending}
                    className="btn-outline w-full justify-center text-success hover:bg-success-light disabled:opacity-50"
                  >
                    {updateStatus.isPending ? 'Updating...' : 'Move to Review'}
                  </button>
                  <button
                    onClick={() => setShowDeclineModal(true)}
                    className="btn-outline w-full justify-center text-error hover:bg-error-light"
                  >
                    Decline
                  </button>
                </>
              )}

              {isCompanyUser && application.status === 'reviewing' && (
                <>
                  <button
                    onClick={() => setShowInterviewModal(true)}
                    className="btn-outline w-full justify-center text-navy hover:bg-navy-50"
                  >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => setShowDeclineModal(true)}
                    className="btn-outline w-full justify-center text-error hover:bg-error-light"
                  >
                    Decline
                  </button>
                </>
              )}

              {isCompanyUser && application.status === 'interviewing' && (
                <>
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="btn-primary w-full justify-center"
                  >
                    <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                    Make Offer
                  </button>
                  <button
                    onClick={() => setShowInterviewModal(true)}
                    className="btn-outline w-full justify-center text-navy hover:bg-navy-50"
                  >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Schedule Another Interview
                  </button>
                  <button
                    onClick={() => setShowDeclineModal(true)}
                    className="btn-outline w-full justify-center text-error hover:bg-error-light"
                  >
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

      {/* Interview Scheduling Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Schedule Interview</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={interviewData.scheduledAt}
                  onChange={(e) => setInterviewData({ ...interviewData, scheduledAt: e.target.value })}
                  className="input w-full"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Format
                </label>
                <select
                  value={interviewData.format}
                  onChange={(e) => setInterviewData({ ...interviewData, format: e.target.value })}
                  className="input w-full"
                >
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Duration
                </label>
                <select
                  value={interviewData.duration}
                  onChange={(e) => setInterviewData({ ...interviewData, duration: e.target.value })}
                  className="input w-full"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Meeting Link (optional)
                </label>
                <input
                  type="url"
                  value={interviewData.meetingLink}
                  onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Notes for the team (optional)
                </label>
                <textarea
                  value={interviewData.notes}
                  onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                  placeholder="Any preparation notes or agenda items..."
                  rows={3}
                  className="input w-full"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInterviewModal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                disabled={scheduleInterview.isPending}
                className="btn-primary flex-1"
              >
                {scheduleInterview.isPending ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Make Offer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Compensation
                </label>
                <input
                  type="text"
                  value={offerData.compensation}
                  onChange={(e) => setOfferData({ ...offerData, compensation: e.target.value })}
                  placeholder="$500,000 total package"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={offerData.startDate}
                  onChange={(e) => setOfferData({ ...offerData, startDate: e.target.value })}
                  className="input w-full"
                  min={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Equity (optional)
                </label>
                <input
                  type="text"
                  value={offerData.equity}
                  onChange={(e) => setOfferData({ ...offerData, equity: e.target.value })}
                  placeholder="0.5% - 1.0%"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Benefits (optional)
                </label>
                <input
                  type="text"
                  value={offerData.benefits}
                  onChange={(e) => setOfferData({ ...offerData, benefits: e.target.value })}
                  placeholder="Health, dental, 401k match..."
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Offer Terms *
                </label>
                <textarea
                  value={offerData.terms}
                  onChange={(e) => setOfferData({ ...offerData, terms: e.target.value })}
                  placeholder="Detailed offer terms and conditions..."
                  rows={4}
                  className="input w-full"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowOfferModal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeOffer}
                disabled={makeOffer.isPending}
                className="btn-primary flex-1"
              >
                {makeOffer.isPending ? 'Sending...' : 'Send Offer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Decline Application</h3>
            <p className="text-text-secondary mb-4">
              Are you sure you want to decline this application? This action cannot be undone.
            </p>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Reason (optional)
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Provide feedback for the team..."
                rows={3}
                className="input w-full"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                disabled={updateStatus.isPending}
                className="btn-primary flex-1 bg-error hover:bg-error/90"
              >
                {updateStatus.isPending ? 'Declining...' : 'Decline Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Response Modal */}
      {showOfferResponseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">
              {offerResponseType === 'accept' ? 'Accept Offer' : 'Decline Offer'}
            </h3>
            <p className="text-text-secondary mb-4">
              {offerResponseType === 'accept'
                ? 'Are you sure you want to accept this offer? This will notify the company of your decision.'
                : 'Are you sure you want to decline this offer? This action cannot be undone.'}
            </p>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Message (optional)
              </label>
              <textarea
                value={offerResponseMessage}
                onChange={(e) => setOfferResponseMessage(e.target.value)}
                placeholder={
                  offerResponseType === 'accept'
                    ? 'Thank you for the offer! We are excited to join...'
                    : 'Thank you for the opportunity. We have decided to...'
                }
                rows={3}
                className="input w-full"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowOfferResponseModal(false);
                  setOfferResponseMessage('');
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleRespondToOffer}
                disabled={respondToOffer.isPending}
                className={`btn-primary flex-1 ${
                  offerResponseType === 'decline' ? 'bg-error hover:bg-error/90' : ''
                }`}
              >
                {respondToOffer.isPending
                  ? 'Submitting...'
                  : offerResponseType === 'accept'
                  ? 'Accept Offer'
                  : 'Decline Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
