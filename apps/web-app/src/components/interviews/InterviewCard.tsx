'use client';

import React, { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface Interview {
  id: string;
  teamId: string;
  teamName: string;
  opportunityId: string;
  opportunityTitle: string;
  scheduledAt: string;
  format: string;
  duration: number;
  location?: string;
  notes?: string;
  status: string;
}

interface InterviewCardProps {
  interview: Interview;
  viewType: 'company' | 'team';
}

export function InterviewCard({ interview, viewType }: InterviewCardProps) {
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const cancelInterview = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/interviews/${interview.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel interview');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      setShowMenu(false);
    },
  });

  const scheduledDate = new Date(interview.scheduledAt);
  const isUpcoming = scheduledDate > new Date();
  const isPast = scheduledDate < new Date();
  const isToday = scheduledDate.toDateString() === new Date().toDateString();

  const formatDate = (date: Date) => {
    if (isToday) return 'Today';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getFormatIcon = () => {
    switch (interview.format) {
      case 'video':
        return <VideoCameraIcon className="h-4 w-4" />;
      case 'in-person':
        return <BuildingOfficeIcon className="h-4 w-4" />;
      case 'phone':
        return <PhoneIcon className="h-4 w-4" />;
      default:
        return <VideoCameraIcon className="h-4 w-4" />;
    }
  };

  const getStatusBadge = () => {
    if (isPast) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          Completed
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
          Today
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-navy/10 text-navy">
        Upcoming
      </span>
    );
  };

  return (
    <>
      <div className={`card p-5 ${isToday ? 'ring-2 ring-success' : ''} ${isPast ? 'opacity-75' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-text-primary">
              {viewType === 'company' ? interview.teamName : interview.opportunityTitle}
            </h3>
            <p className="text-sm text-text-tertiary">
              {viewType === 'company' ? `For: ${interview.opportunityTitle}` : `With: ${interview.teamName}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {isUpcoming && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-lg hover:bg-bg-alt text-text-tertiary"
                >
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </button>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-8 z-20 w-40 bg-bg-surface border border-border rounded-lg shadow-lg py-1">
                      <button
                        onClick={() => {
                          setShowReschedule(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-alt flex items-center gap-2"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Reschedule
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this interview?')) {
                            cancelInterview.mutate();
                          }
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <CalendarIcon className="h-4 w-4 text-text-tertiary" />
              <span className={isToday ? 'text-success font-medium' : ''}>
                {formatDate(scheduledDate)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <ClockIcon className="h-4 w-4 text-text-tertiary" />
              <span>{formatTime(scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span className="text-text-tertiary">({interview.duration} min)</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            {getFormatIcon()}
            <span className="capitalize">{interview.format}</span>
            {interview.location && (
              <>
                <span className="text-text-tertiary mx-1">•</span>
                <MapPinIcon className="h-4 w-4 text-text-tertiary" />
                <span className="truncate">{interview.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        {interview.notes && (
          <div className="mb-4 p-3 bg-bg-alt rounded-lg">
            <p className="text-xs font-medium text-text-tertiary mb-1">Notes:</p>
            <p className="text-sm text-text-secondary">{interview.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isUpcoming && interview.location && interview.format === 'video' && (
            <a
              href={interview.location}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-primary inline-flex items-center justify-center text-sm py-2"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1.5" />
              Join Meeting
            </a>
          )}
          {isPast && (
            <div className="flex-1 text-center text-sm text-text-tertiary py-2">
              Interview completed
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showReschedule && (
        <RescheduleModal
          interview={interview}
          onClose={() => setShowReschedule(false)}
        />
      )}
    </>
  );
}

interface RescheduleModalProps {
  interview: Interview;
  onClose: () => void;
}

function RescheduleModal({ interview, onClose }: RescheduleModalProps) {
  const queryClient = useQueryClient();
  const [scheduledAt, setScheduledAt] = useState(interview.scheduledAt.slice(0, 16));
  const [format, setFormat] = useState(interview.format);
  const [duration, setDuration] = useState(interview.duration.toString());
  const [location, setLocation] = useState(interview.location || '');
  const [notes, setNotes] = useState(interview.notes || '');

  const reschedule = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/interviews/${interview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledAt: new Date(scheduledAt).toISOString(),
          format,
          duration: parseInt(duration),
          location: location || undefined,
          notes: notes || undefined,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reschedule interview');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      toast.success('Interview rescheduled successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-bg-surface rounded-xl shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Reschedule Interview</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-bg-elevated text-text-tertiary hover:text-text-primary"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-navy"
              >
                <option value="video">Video Call</option>
                <option value="in-person">In Person</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-navy"
              >
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Location / Meeting Link
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., https://zoom.us/... or Office address"
              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any notes or preparation instructions..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-navy resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            onClick={() => reschedule.mutate()}
            disabled={reschedule.isPending}
            className="btn-primary px-4 py-2 text-sm"
          >
            {reschedule.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
