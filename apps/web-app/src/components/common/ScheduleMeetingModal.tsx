'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { downloadMeetingICS, type MeetingDetails } from '@/lib/calendar';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultAttendees?: string[];
}

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  meetingLink: string;
  attendees: string;
  sendInvites: boolean;
}

export function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTitle = '',
  defaultDescription = '',
  defaultAttendees = [],
}: ScheduleMeetingModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: defaultTitle,
    description: defaultDescription,
    date: '',
    time: '',
    duration: 60,
    location: '',
    meetingLink: '',
    attendees: defaultAttendees.join(', '),
    sendInvites: false,
  });

  const [downloadOnly, setDownloadOnly] = useState(false);

  const scheduleMeeting = useMutation({
    mutationFn: async (data: FormData) => {
      // Combine date and time
      const datetime = new Date(`${data.date}T${data.time}`);

      const payload = {
        title: data.title,
        description: data.description || undefined,
        datetime: datetime.toISOString(),
        duration: data.duration,
        location: data.location || undefined,
        meetingLink: data.meetingLink || undefined,
        attendees: data.attendees
          ? data.attendees.split(',').map(email => email.trim()).filter(Boolean)
          : undefined,
        sendInvites: data.sendInvites,
      };

      const response = await fetch('/api/calendar/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to schedule meeting');
      }

      return response.json();
    },
    onSuccess: (result) => {
      // If download only, trigger download
      if (downloadOnly) {
        const datetime = new Date(`${formData.date}T${formData.time}`);
        const meeting: MeetingDetails = {
          title: formData.title,
          description: formData.description || undefined,
          datetime,
          duration: formData.duration,
          location: formData.location || undefined,
          meetingLink: formData.meetingLink || undefined,
          attendees: formData.attendees
            ? formData.attendees.split(',').map(email => email.trim()).filter(Boolean)
            : undefined,
        };
        downloadMeetingICS(meeting, `${formData.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        location: '',
        meetingLink: '',
        attendees: '',
        sendInvites: false,
      });
      setDownloadOnly(false);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent, downloadMode: boolean = false) => {
    e.preventDefault();
    setDownloadOnly(downloadMode);
    scheduleMeeting.mutate(formData);
  };

  // Get min date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Get min time (if selected date is today)
  const getMinTime = () => {
    if (formData.date === minDate) {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    return '00:00';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-surface rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-bg-surface z-10">
          <div>
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-navy" />
              Schedule Meeting
            </h3>
            <p className="text-sm text-text-secondary">Create a calendar event and send invitations</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary p-1 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Meeting Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Negotiation Kick-off Call"
              className="input-field"
              required
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={minDate}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                min={getMinTime()}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              Duration *
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="input-field"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
              <option value={240}>4 hours</option>
            </select>
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
              <VideoCameraIcon className="h-4 w-4" />
              Meeting Link (Optional)
            </label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              placeholder="https://zoom.us/j/... or Google Meet link"
              className="input-field"
            />
            <p className="text-xs text-text-tertiary mt-1">
              Video call link (Zoom, Google Meet, Microsoft Teams, etc.)
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4" />
              Location (Optional)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Conference Room A or 123 Main St"
              className="input-field"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
              <DocumentTextIcon className="h-4 w-4" />
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add agenda, discussion topics, or other details..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5 flex items-center gap-1.5">
              <UsersIcon className="h-4 w-4" />
              Attendees (Optional)
            </label>
            <input
              type="text"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              placeholder="email1@example.com, email2@example.com"
              className="input-field"
            />
            <p className="text-xs text-text-tertiary mt-1">
              Comma-separated email addresses
            </p>
          </div>

          {/* Send Invites Checkbox */}
          {formData.attendees && (
            <div className="bg-bg-alt p-4 rounded-lg border border-border">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendInvites}
                  onChange={(e) => setFormData({ ...formData, sendInvites: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-border text-navy focus:ring-navy"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">
                    Send email invitations
                  </div>
                  <div className="text-xs text-text-tertiary mt-0.5">
                    Attendees will receive an email with meeting details and a calendar attachment
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Error Message */}
          {scheduleMeeting.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {scheduleMeeting.error.message}
            </div>
          )}

          {/* Success Message */}
          {scheduleMeeting.isSuccess && !downloadOnly && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Meeting scheduled successfully!
              {formData.sendInvites && ' Invitations have been sent.'}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
              disabled={scheduleMeeting.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={scheduleMeeting.isPending || !formData.title || !formData.date || !formData.time}
              className="flex-1 btn-outline inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download .ics
            </button>
            <button
              type="submit"
              disabled={scheduleMeeting.isPending || !formData.title || !formData.date || !formData.time}
              className="flex-1 btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scheduleMeeting.isPending ? (
                'Scheduling...'
              ) : (
                <>
                  {formData.sendInvites && formData.attendees ? (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4" />
                      Schedule & Send
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="h-4 w-4" />
                      Schedule Meeting
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
