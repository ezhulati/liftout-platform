'use client';

import React, { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay, parseISO, isAfter, isBefore } from 'date-fns';
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Badge, Button, Skeleton, EmptyState } from '@/components/ui';
import toast from 'react-hot-toast';

type InterviewFormat = 'video' | 'in_person' | 'phone';
type InterviewStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

interface Interviewer {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface Interview {
  id: string;
  applicationId: string;
  teamId: string;
  teamName: string;
  opportunityTitle: string;
  scheduledAt: string;
  duration: number; // in minutes
  format: InterviewFormat;
  location?: string;
  meetingLink?: string;
  status: InterviewStatus;
  interviewers: Interviewer[];
  notes?: string;
  feedback?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface InterviewSchedulerProps {
  interviews: Interview[];
  isLoading?: boolean;
  onScheduleInterview?: (data: {
    applicationId: string;
    scheduledAt: string;
    duration: number;
    format: InterviewFormat;
    location?: string;
    meetingLink?: string;
    interviewers: string[];
    notes?: string;
  }) => Promise<void>;
  onUpdateInterview?: (interviewId: string, data: Partial<Interview>) => Promise<void>;
  onCancelInterview?: (interviewId: string, reason?: string) => Promise<void>;
  onConfirmInterview?: (interviewId: string) => Promise<void>;
  availableSlots?: TimeSlot[];
  availableInterviewers?: Interviewer[];
}

const FORMAT_CONFIG = {
  video: { icon: VideoCameraIcon, label: 'Video Call', color: 'text-navy' },
  in_person: { icon: BuildingOfficeIcon, label: 'In Person', color: 'text-success' },
  phone: { icon: PhoneIcon, label: 'Phone Call', color: 'text-gold-600' },
};

const STATUS_CONFIG: Record<InterviewStatus, { label: string; variant: 'default' | 'info' | 'success' | 'warning' | 'error' }> = {
  scheduled: { label: 'Scheduled', variant: 'info' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  completed: { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'error' },
  rescheduled: { label: 'Rescheduled', variant: 'warning' },
};

const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export function InterviewScheduler({
  interviews,
  isLoading,
  onScheduleInterview,
  onUpdateInterview,
  onCancelInterview,
  onConfirmInterview,
  availableSlots = [],
  availableInterviewers = [],
}: InterviewSchedulerProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [view, setView] = useState<'week' | 'list'>('week');

  // Generate week days
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  // Group interviews by date
  const interviewsByDate = useMemo(() => {
    const grouped: Record<string, Interview[]> = {};
    interviews.forEach(interview => {
      const date = format(parseISO(interview.scheduledAt), 'yyyy-MM-dd');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(interview);
    });
    return grouped;
  }, [interviews]);

  // Upcoming interviews
  const upcomingInterviews = useMemo(() => {
    const now = new Date();
    return interviews
      .filter(i => isAfter(parseISO(i.scheduledAt), now) && i.status !== 'cancelled')
      .sort((a, b) => parseISO(a.scheduledAt).getTime() - parseISO(b.scheduledAt).getTime());
  }, [interviews]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const handleConfirm = async (interview: Interview) => {
    if (!onConfirmInterview) return;
    try {
      await onConfirmInterview(interview.id);
      toast.success('Interview confirmed');
    } catch {
      toast.error('Failed to confirm interview');
    }
  };

  const handleCancel = async (interview: Interview) => {
    if (!onCancelInterview) return;
    const reason = window.prompt('Reason for cancellation (optional):');
    try {
      await onCancelInterview(interview.id, reason || undefined);
      toast.success('Interview cancelled');
    } catch {
      toast.error('Failed to cancel interview');
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="p-4 border-b border-border">
          <Skeleton variant="text" width="200px" />
        </div>
        <div className="p-4 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height="150px" className="rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Interview Schedule</h2>
          <p className="text-sm text-text-tertiary">
            {upcomingInterviews.length} upcoming interview{upcomingInterviews.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-bg-elevated rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'week' ? 'bg-navy text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'list' ? 'bg-navy text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              List
            </button>
          </div>
          {onScheduleInterview && (
            <Button variant="primary" size="sm" onClick={() => setShowScheduleModal(true)}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Schedule Interview
            </Button>
          )}
        </div>
      </div>

      {/* Week View */}
      {view === 'week' && (
        <div className="card overflow-hidden">
          {/* Week Navigation */}
          <div className="px-4 py-3 border-b border-border bg-bg-alt flex items-center justify-between">
            <button
              onClick={handlePrevWeek}
              className="p-1 rounded-md hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className="font-medium text-text-primary">
              {format(currentWeekStart, 'MMMM d')} - {format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
            </span>
            <button
              onClick={handleNextWeek}
              className="p-1 rounded-md hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 divide-x divide-border">
            {weekDays.map(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayInterviews = interviewsByDate[dateKey] || [];
              const isToday = isSameDay(day, new Date());
              const isPast = isBefore(day, new Date()) && !isToday;

              return (
                <div
                  key={dateKey}
                  className={`min-h-[200px] ${isPast ? 'bg-bg-alt opacity-60' : ''}`}
                >
                  {/* Day Header */}
                  <div className={`p-2 text-center border-b border-border ${isToday ? 'bg-navy-50' : ''}`}>
                    <p className="text-xs text-text-tertiary uppercase">
                      {format(day, 'EEE')}
                    </p>
                    <p className={`text-lg font-semibold ${isToday ? 'text-navy' : 'text-text-primary'}`}>
                      {format(day, 'd')}
                    </p>
                  </div>

                  {/* Interviews */}
                  <div className="p-2 space-y-2">
                    {dayInterviews.map(interview => {
                      const formatConfig = FORMAT_CONFIG[interview.format];
                      const FormatIcon = formatConfig.icon;
                      const statusConfig = STATUS_CONFIG[interview.status];

                      return (
                        <button
                          key={interview.id}
                          onClick={() => setSelectedInterview(interview)}
                          className="w-full text-left p-2 rounded-lg bg-bg-surface border border-border hover:border-navy hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start gap-2">
                            <FormatIcon className={`h-4 w-4 mt-0.5 ${formatConfig.color}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-text-primary truncate">
                                {interview.teamName}
                              </p>
                              <p className="text-xs text-text-tertiary">
                                {format(parseISO(interview.scheduledAt), 'h:mm a')}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {dayInterviews.length === 0 && !isPast && (
                      <p className="text-xs text-text-tertiary text-center py-4">
                        No interviews
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="card">
          {upcomingInterviews.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<CalendarIcon className="w-12 h-12" />}
                title="No upcoming interviews"
                description="Schedule an interview to get started"
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {upcomingInterviews.map(interview => {
                const formatConfig = FORMAT_CONFIG[interview.format];
                const FormatIcon = formatConfig.icon;
                const statusConfig = STATUS_CONFIG[interview.status];

                return (
                  <div key={interview.id} className="p-4 hover:bg-bg-alt transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-lg bg-bg-elevated flex items-center justify-center`}>
                          <FormatIcon className={`h-5 w-5 ${formatConfig.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-text-primary">{interview.teamName}</h3>
                            <Badge variant={statusConfig.variant} size="sm">
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-text-secondary mb-2">
                            {interview.opportunityTitle}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-tertiary">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {format(parseISO(interview.scheduledAt), 'EEEE, MMMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="h-3.5 w-3.5" />
                              {format(parseISO(interview.scheduledAt), 'h:mm a')} ({interview.duration} min)
                            </span>
                            <span className="flex items-center gap-1">
                              <UserGroupIcon className="h-3.5 w-3.5" />
                              {interview.interviewers.length} interviewer{interview.interviewers.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {interview.status === 'scheduled' && onConfirmInterview && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConfirm(interview)}
                          >
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                        )}
                        {interview.status !== 'cancelled' && interview.status !== 'completed' && onCancelInterview && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(interview)}
                            className="text-error hover:bg-error-light"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onConfirm={onConfirmInterview ? () => handleConfirm(selectedInterview) : undefined}
          onCancel={onCancelInterview ? () => handleCancel(selectedInterview) : undefined}
        />
      )}
    </div>
  );
}

interface InterviewDetailModalProps {
  interview: Interview;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function InterviewDetailModal({ interview, onClose, onConfirm, onCancel }: InterviewDetailModalProps) {
  const formatConfig = FORMAT_CONFIG[interview.format];
  const FormatIcon = formatConfig.icon;
  const statusConfig = STATUS_CONFIG[interview.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-bg-surface rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Interview Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-bg-elevated text-text-tertiary hover:text-text-primary"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Team Info */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-navy-50 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-navy" />
            </div>
            <div>
              <h4 className="font-medium text-text-primary">{interview.teamName}</h4>
              <p className="text-sm text-text-secondary">{interview.opportunityTitle}</p>
              <Badge variant={statusConfig.variant} size="sm" className="mt-1">
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-text-tertiary">Date & Time</p>
              <p className="text-sm font-medium text-text-primary">
                {format(parseISO(interview.scheduledAt), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-text-secondary">
                {format(parseISO(interview.scheduledAt), 'h:mm a')} ({interview.duration} minutes)
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-tertiary">Format</p>
              <div className="flex items-center gap-2">
                <FormatIcon className={`h-4 w-4 ${formatConfig.color}`} />
                <span className="text-sm font-medium text-text-primary">{formatConfig.label}</span>
              </div>
              {interview.location && (
                <p className="text-sm text-text-secondary">{interview.location}</p>
              )}
              {interview.meetingLink && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-navy hover:underline"
                >
                  Join Meeting
                </a>
              )}
            </div>
          </div>

          {/* Interviewers */}
          <div>
            <p className="text-xs text-text-tertiary mb-2">Interviewers</p>
            <div className="space-y-2">
              {interview.interviewers.map(interviewer => (
                <div key={interviewer.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-bg-elevated flex items-center justify-center">
                    <span className="text-xs font-medium text-text-secondary">
                      {interviewer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{interviewer.name}</p>
                    <p className="text-xs text-text-tertiary">{interviewer.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {interview.notes && (
            <div>
              <p className="text-xs text-text-tertiary mb-2">Notes</p>
              <p className="text-sm text-text-secondary bg-bg-alt rounded-lg p-3">
                {interview.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          {interview.status === 'scheduled' && onConfirm && (
            <Button variant="primary" size="sm" onClick={onConfirm}>
              <CheckIcon className="h-4 w-4 mr-1" />
              Confirm Interview
            </Button>
          )}
          {interview.status !== 'cancelled' && interview.status !== 'completed' && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-error border-error hover:bg-error-light"
            >
              Cancel Interview
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterviewScheduler;
