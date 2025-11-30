'use client';

import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  CalendarIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import {
  downloadInterviewICS,
  openGoogleCalendar,
  openOutlookCalendar,
  generateYahooCalendarURL,
  InterviewDetails,
  isEventPast,
  formatInterviewTime,
  getTimeUntilInterview,
} from '@/lib/calendar';

interface AddToCalendarButtonProps {
  interview: InterviewDetails;
  variant?: 'primary' | 'secondary' | 'compact';
  showTimeInfo?: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function AddToCalendarButton({
  interview,
  variant = 'secondary',
  showTimeInfo = false,
}: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isPast = isEventPast(interview.scheduledAt);

  const handleGoogleCalendar = () => {
    openGoogleCalendar(interview);
    setIsOpen(false);
  };

  const handleOutlookCalendar = () => {
    openOutlookCalendar(interview);
    setIsOpen(false);
  };

  const handleYahooCalendar = () => {
    const url = generateYahooCalendarURL({
      title: `Interview: ${interview.teamName} - ${interview.companyName}`,
      description: `Interview for ${interview.opportunityTitle}`,
      startTime: new Date(interview.scheduledAt),
      endTime: new Date(new Date(interview.scheduledAt).getTime() + interview.duration * 60000),
      location: interview.location || interview.meetingLink,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleDownloadICS = () => {
    downloadInterviewICS(interview);
    setIsOpen(false);
  };

  if (isPast) {
    return null;
  }

  const buttonStyles = {
    primary: 'bg-navy text-white hover:bg-navy-600',
    secondary: 'bg-bg-alt text-text-primary hover:bg-bg-elevated border border-border',
    compact: 'text-text-secondary hover:text-navy hover:bg-bg-alt',
  };

  return (
    <div className="relative inline-block text-left">
      {showTimeInfo && (
        <div className="text-sm text-text-secondary mb-2">
          <p className="font-medium">{formatInterviewTime(interview.scheduledAt, interview.duration)}</p>
          <p className="text-text-tertiary">
            In {getTimeUntilInterview(interview.scheduledAt)}
          </p>
        </div>
      )}

      <Menu as="div" className="relative">
        <Menu.Button
          className={classNames(
            'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2',
            variant === 'compact' ? 'px-2 py-1.5 text-sm' : 'px-4 py-2.5 min-h-12',
            buttonStyles[variant]
          )}
        >
          <CalendarIcon className="h-5 w-5" />
          <span className={variant === 'compact' ? 'sr-only sm:not-sr-only' : ''}>
            Add to Calendar
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-bg-surface shadow-lg ring-1 ring-border focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleGoogleCalendar}
                    className={classNames(
                      'flex w-full items-center gap-3 px-4 py-3 text-left text-base',
                      active ? 'bg-bg-alt text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm4.5 17.25h-9v-1.5h9v1.5zm0-3h-9v-1.5h9v1.5zm0-3h-9v-1.5h9v1.5zm0-3h-9V6.75h9v1.5z"/>
                    </svg>
                    Google Calendar
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleOutlookCalendar}
                    className={classNames(
                      'flex w-full items-center gap-3 px-4 py-3 text-left text-base',
                      active ? 'bg-bg-alt text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.152-.354.228-.59.228h-8.08v-7.5l3.195 2.188 1.22-.938V7.387l-1.22.938-4.287-2.938V5.33h8.08c.236 0 .432.076.59.228.158.152.238.346.238.576v1.253zM14.092 5.33v6.357L7.98 7.387h6.112zM0 7.387l7.98 5.738v7.545H.828c-.236 0-.432-.076-.59-.228C.08 20.29 0 20.096 0 19.865V7.387z"/>
                    </svg>
                    Outlook
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleYahooCalendar}
                    className={classNames(
                      'flex w-full items-center gap-3 px-4 py-3 text-left text-base',
                      active ? 'bg-bg-alt text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.6 18H8.4v-2.4h7.2V18zm0-3.6H8.4v-2.4h7.2v2.4zm0-3.6H8.4V8.4h7.2v2.4z"/>
                    </svg>
                    Yahoo Calendar
                  </button>
                )}
              </Menu.Item>

              <div className="border-t border-border my-1" />

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleDownloadICS}
                    className={classNames(
                      'flex w-full items-center gap-3 px-4 py-3 text-left text-base',
                      active ? 'bg-bg-alt text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    Download .ics file
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

// Simple calendar icon button for inline use
export function AddToCalendarIconButton({
  interview,
}: {
  interview: InterviewDetails;
}) {
  const isPast = isEventPast(interview.scheduledAt);

  if (isPast) {
    return null;
  }

  return (
    <AddToCalendarButton
      interview={interview}
      variant="compact"
    />
  );
}

// Interview card with calendar integration
export function InterviewCard({
  interview,
  onJoinMeeting,
}: {
  interview: InterviewDetails;
  onJoinMeeting?: () => void;
}) {
  const isPast = isEventPast(interview.scheduledAt);
  const timeUntil = getTimeUntilInterview(interview.scheduledAt);

  const formatLabel = {
    video: 'Video Call',
    in_person: 'In-Person',
    phone: 'Phone Call',
  }[interview.format];

  return (
    <div className={classNames(
      'rounded-xl border p-6',
      isPast ? 'border-border bg-bg-alt opacity-75' : 'border-border bg-bg-surface'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={classNames(
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
              isPast ? 'bg-gray-100 text-gray-600' : 'bg-navy-100 text-navy-700'
            )}>
              {isPast ? 'Past' : timeUntil}
            </span>
            <span className="text-xs text-text-tertiary">{formatLabel}</span>
          </div>

          <h3 className="text-lg font-semibold text-text-primary truncate">
            {interview.opportunityTitle}
          </h3>

          <p className="text-base text-text-secondary mt-1">
            {interview.companyName} • Team: {interview.teamName}
          </p>

          <p className="text-sm text-text-tertiary mt-2">
            {formatInterviewTime(interview.scheduledAt, interview.duration)}
          </p>

          {interview.location && (
            <p className="text-sm text-text-tertiary mt-1">
              📍 {interview.location}
            </p>
          )}

          {interview.participants && interview.participants.length > 0 && (
            <p className="text-sm text-text-tertiary mt-1">
              👥 {interview.participants.join(', ')}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {!isPast && (
            <>
              <AddToCalendarButton interview={interview} variant="secondary" />

              {interview.meetingLink && onJoinMeeting && (
                <button
                  onClick={onJoinMeeting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-12 bg-navy text-white rounded-lg font-medium hover:bg-navy-600 transition-colors"
                >
                  Join Meeting
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {interview.notes && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-text-tertiary">Notes:</p>
          <p className="text-sm text-text-secondary mt-1">{interview.notes}</p>
        </div>
      )}
    </div>
  );
}
