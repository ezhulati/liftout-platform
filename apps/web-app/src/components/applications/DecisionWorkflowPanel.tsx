'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { Badge, Button } from '@/components/ui';
import toast from 'react-hot-toast';

// Decision stages in order
const PIPELINE_STAGES = [
  { id: 'submitted', label: 'Submitted', icon: DocumentTextIcon },
  { id: 'reviewing', label: 'Under Review', icon: EyeIcon },
  { id: 'interviewing', label: 'Interview', icon: CalendarIcon },
  { id: 'offer', label: 'Offer', icon: CurrencyDollarIcon },
  { id: 'accepted', label: 'Accepted', icon: CheckCircleIcon },
] as const;

type StageId = typeof PIPELINE_STAGES[number]['id'];

interface DecisionAction {
  id: string;
  type: 'status_change' | 'note_added' | 'interview_scheduled' | 'offer_made' | 'feedback_given';
  fromStatus?: string;
  toStatus?: string;
  note?: string;
  performedBy: {
    id: string;
    name: string;
  };
  performedAt: string;
  metadata?: Record<string, any>;
}

interface DecisionWorkflowPanelProps {
  applicationId: string;
  currentStatus: string;
  teamName: string;
  opportunityTitle: string;
  isCompanyUser: boolean;
  decisionHistory?: DecisionAction[];
  onStatusChange?: (newStatus: string, note?: string) => Promise<void>;
  onScheduleInterview?: (data: { date: string; format: string; notes?: string }) => Promise<void>;
  onMakeOffer?: (data: { compensation: string; startDate: string; equity?: string; notes?: string }) => Promise<void>;
  onAddNote?: (note: string) => Promise<void>;
}

function getStageIndex(status: string): number {
  const statusToStage: Record<string, StageId> = {
    pending: 'submitted',
    submitted: 'submitted',
    under_review: 'reviewing',
    reviewing: 'reviewing',
    interview: 'interviewing',
    interviewing: 'interviewing',
    interview_scheduled: 'interviewing',
    offer: 'offer',
    offer_made: 'offer',
    accepted: 'accepted',
    rejected: 'submitted', // Shows as failed at submitted stage
    withdrawn: 'submitted',
  };
  const stage = statusToStage[status] || 'submitted';
  return PIPELINE_STAGES.findIndex(s => s.id === stage);
}

function isTerminalStatus(status: string): boolean {
  return ['accepted', 'rejected', 'withdrawn'].includes(status);
}

export function DecisionWorkflowPanel({
  applicationId,
  currentStatus,
  teamName,
  opportunityTitle,
  isCompanyUser,
  decisionHistory = [],
  onStatusChange,
  onScheduleInterview,
  onMakeOffer,
  onAddNote,
}: DecisionWorkflowPanelProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Interview form state
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewFormat, setInterviewFormat] = useState('video');
  const [interviewNotes, setInterviewNotes] = useState('');

  // Offer form state
  const [offerCompensation, setOfferCompensation] = useState('');
  const [offerEquity, setOfferEquity] = useState('');
  const [offerStartDate, setOfferStartDate] = useState('');
  const [offerNotes, setOfferNotes] = useState('');

  const currentStageIndex = getStageIndex(currentStatus);
  const isRejected = currentStatus === 'rejected';
  const isWithdrawn = currentStatus === 'withdrawn';
  const isTerminal = isTerminalStatus(currentStatus);

  const handleAction = async (action: () => Promise<void>) => {
    setActionLoading(true);
    try {
      await action();
    } catch (error) {
      toast.error('Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !onAddNote) return;
    await handleAction(async () => {
      await onAddNote(noteText);
      setNoteText('');
      setShowNoteInput(false);
      toast.success('Note added');
    });
  };

  const handleScheduleInterview = async () => {
    if (!interviewDate || !onScheduleInterview) return;
    await handleAction(async () => {
      await onScheduleInterview({
        date: interviewDate,
        format: interviewFormat,
        notes: interviewNotes,
      });
      setShowInterviewForm(false);
      setInterviewDate('');
      setInterviewNotes('');
      toast.success('Interview scheduled');
    });
  };

  const handleMakeOffer = async () => {
    if (!offerCompensation || !offerStartDate || !onMakeOffer) return;
    await handleAction(async () => {
      await onMakeOffer({
        compensation: offerCompensation,
        startDate: offerStartDate,
        equity: offerEquity,
        notes: offerNotes,
      });
      setShowOfferForm(false);
      toast.success('Offer sent');
    });
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-navy" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Decision Workflow</h3>
              <p className="text-xs text-text-tertiary">
                {teamName} → {opportunityTitle}
              </p>
            </div>
          </div>
          {isTerminal && (
            <Badge
              variant={isRejected ? 'error' : isWithdrawn ? 'default' : 'success'}
              size="sm"
            >
              {isRejected ? 'Rejected' : isWithdrawn ? 'Withdrawn' : 'Accepted'}
            </Badge>
          )}
        </div>
      </div>

      {/* Pipeline Progress */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          {PIPELINE_STAGES.map((stage, index) => {
            const StageIcon = stage.icon;
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isPending = index > currentStageIndex;
            const isFailedHere = (isRejected || isWithdrawn) && isCurrent;

            return (
              <React.Fragment key={stage.id}>
                {/* Stage Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                      isFailedHere
                        ? 'bg-error-light'
                        : isCompleted
                        ? 'bg-success'
                        : isCurrent
                        ? 'bg-navy'
                        : 'bg-bg-elevated border-2 border-border'
                    }`}
                  >
                    {isFailedHere ? (
                      <XCircleIcon className="h-5 w-5 text-error" />
                    ) : isCompleted ? (
                      <CheckCircleSolidIcon className="h-5 w-5 text-white" />
                    ) : (
                      <StageIcon
                        className={`h-5 w-5 ${
                          isCurrent ? 'text-white' : 'text-text-tertiary'
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      isFailedHere
                        ? 'text-error font-medium'
                        : isCurrent
                        ? 'text-navy font-medium'
                        : isCompleted
                        ? 'text-success'
                        : 'text-text-tertiary'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < PIPELINE_STAGES.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStageIndex
                        ? 'bg-success'
                        : 'bg-border'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Actions Section */}
      {isCompanyUser && !isTerminal && (
        <div className="px-6 py-4 border-t border-border">
          <h4 className="text-sm font-medium text-text-primary mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            {/* Show relevant actions based on current status */}
            {['pending', 'submitted'].includes(currentStatus) && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onStatusChange?.('reviewing', 'Started review process')}
                  disabled={actionLoading}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Start Review
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange?.('rejected', 'Application declined')}
                  disabled={actionLoading}
                  className="text-error hover:bg-error-light"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </>
            )}

            {['under_review', 'reviewing'].includes(currentStatus) && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowInterviewForm(true)}
                  disabled={actionLoading}
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Schedule Interview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange?.('rejected', 'Application declined after review')}
                  disabled={actionLoading}
                  className="text-error hover:bg-error-light"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </>
            )}

            {['interview', 'interviewing', 'interview_scheduled'].includes(currentStatus) && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowOfferForm(true)}
                  disabled={actionLoading}
                >
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  Make Offer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInterviewForm(true)}
                  disabled={actionLoading}
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange?.('rejected', 'Not proceeding after interview')}
                  disabled={actionLoading}
                  className="text-error hover:bg-error-light"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </>
            )}

            {['offer', 'offer_made'].includes(currentStatus) && (
              <div className="w-full text-center py-4 text-text-secondary text-sm">
                <ClockIcon className="h-5 w-5 inline mr-2" />
                Awaiting team response to offer
              </div>
            )}

            {/* Always show add note option */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNoteInput(true)}
              disabled={actionLoading}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </div>
        </div>
      )}

      {/* Note Input */}
      {showNoteInput && (
        <div className="px-6 py-4 border-t border-border bg-bg-alt">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note about this application..."
            className="input-field w-full min-h-[80px] mb-3"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNoteInput(false);
                setNoteText('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddNote}
              disabled={!noteText.trim() || actionLoading}
            >
              Save Note
            </Button>
          </div>
        </div>
      )}

      {/* Interview Form */}
      {showInterviewForm && (
        <div className="px-6 py-4 border-t border-border bg-bg-alt">
          <h4 className="text-sm font-medium text-text-primary mb-3">Schedule Interview</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="input-field w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Format</label>
                <select
                  value={interviewFormat}
                  onChange={(e) => setInterviewFormat(e.target.value)}
                  className="input-field w-full text-sm"
                >
                  <option value="video">Video Call</option>
                  <option value="in_person">In Person</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Notes (optional)</label>
              <textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="Meeting link, location, or other details..."
                className="input-field w-full text-sm min-h-[60px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowInterviewForm(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleScheduleInterview}
                disabled={!interviewDate || actionLoading}
              >
                Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Form */}
      {showOfferForm && (
        <div className="px-6 py-4 border-t border-border bg-bg-alt">
          <h4 className="text-sm font-medium text-text-primary mb-3">Make Offer</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Compensation</label>
                <input
                  type="text"
                  value={offerCompensation}
                  onChange={(e) => setOfferCompensation(e.target.value)}
                  placeholder="$200,000 - $250,000"
                  className="input-field w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Equity (optional)</label>
                <input
                  type="text"
                  value={offerEquity}
                  onChange={(e) => setOfferEquity(e.target.value)}
                  placeholder="0.5% - 1%"
                  className="input-field w-full text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Proposed Start Date</label>
              <input
                type="date"
                value={offerStartDate}
                onChange={(e) => setOfferStartDate(e.target.value)}
                className="input-field w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Notes (optional)</label>
              <textarea
                value={offerNotes}
                onChange={(e) => setOfferNotes(e.target.value)}
                placeholder="Additional offer details..."
                className="input-field w-full text-sm min-h-[60px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowOfferForm(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleMakeOffer}
                disabled={!offerCompensation || !offerStartDate || actionLoading}
              >
                Send Offer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Decision History */}
      {decisionHistory.length > 0 && (
        <div className="border-t border-border">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-6 py-3 flex items-center justify-between hover:bg-bg-alt transition-colors"
          >
            <span className="text-sm font-medium text-text-primary">
              Decision History ({decisionHistory.length})
            </span>
            {showHistory ? (
              <ChevronUpIcon className="h-4 w-4 text-text-tertiary" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-text-tertiary" />
            )}
          </button>

          {showHistory && (
            <div className="px-6 pb-4">
              <div className="space-y-3">
                {decisionHistory.map((action) => (
                  <DecisionHistoryItem key={action.id} action={action} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DecisionHistoryItem({ action }: { action: DecisionAction }) {
  const getActionIcon = () => {
    switch (action.type) {
      case 'status_change':
        return action.toStatus === 'rejected' ? (
          <XCircleIcon className="h-4 w-4 text-error" />
        ) : (
          <ArrowRightIcon className="h-4 w-4 text-navy" />
        );
      case 'interview_scheduled':
        return <CalendarIcon className="h-4 w-4 text-navy" />;
      case 'offer_made':
        return <CurrencyDollarIcon className="h-4 w-4 text-success" />;
      case 'note_added':
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-text-tertiary" />;
      default:
        return <DocumentTextIcon className="h-4 w-4 text-text-tertiary" />;
    }
  };

  const getActionText = () => {
    switch (action.type) {
      case 'status_change':
        return `Status changed${action.fromStatus ? ` from ${action.fromStatus}` : ''} to ${action.toStatus}`;
      case 'interview_scheduled':
        return 'Interview scheduled';
      case 'offer_made':
        return 'Offer extended';
      case 'note_added':
        return 'Note added';
      case 'feedback_given':
        return 'Feedback provided';
      default:
        return 'Action taken';
    }
  };

  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="h-6 w-6 rounded-full bg-bg-elevated flex items-center justify-center flex-shrink-0 mt-0.5">
        {getActionIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-primary">{getActionText()}</span>
          <span className="text-xs text-text-tertiary">
            {format(new Date(action.performedAt), 'MMM d, h:mm a')}
          </span>
        </div>
        {action.note && (
          <p className="text-text-secondary text-xs mt-0.5">{action.note}</p>
        )}
        <p className="text-text-tertiary text-xs mt-0.5">
          by {action.performedBy.name}
        </p>
      </div>
    </div>
  );
}

export default DecisionWorkflowPanel;
