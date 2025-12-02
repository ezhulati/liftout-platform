/**
 * Calendar Integration Utilities for Liftout
 * Supports ICS file generation and Google Calendar link creation
 */

export interface CalendarEvent {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  organizer?: {
    name: string;
    email: string;
  };
  attendees?: Array<{
    name?: string;
    email: string;
  }>;
  url?: string;
  reminder?: number; // minutes before event
}

export interface InterviewDetails {
  applicationId: string;
  teamName: string;
  companyName: string;
  opportunityTitle: string;
  scheduledAt: Date;
  duration: number; // in minutes
  format: 'video' | 'in_person' | 'phone';
  location?: string;
  meetingLink?: string;
  participants?: string[];
  notes?: string;
  organizerEmail?: string;
  attendeeEmails?: string[];
}

/**
 * Format date for ICS file (YYYYMMDDTHHMMSSZ format)
 */
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Format date for Google Calendar (YYYYMMDDTHHMMSS format)
 */
function formatGoogleCalendarDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z/, 'Z');
}

/**
 * Escape special characters for ICS format
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate a unique ID for the calendar event
 */
function generateUID(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@liftout.io`;
}

/**
 * Generate ICS file content for a calendar event
 */
export function generateICS(event: CalendarEvent): string {
  const uid = generateUID();
  const now = formatICSDate(new Date());
  const start = formatICSDate(event.startTime);
  const end = formatICSDate(event.endTime);

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Liftout//Interview Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
  ];

  if (event.location) {
    ics.push(`LOCATION:${escapeICSText(event.location)}`);
  }

  if (event.url) {
    ics.push(`URL:${event.url}`);
  }

  if (event.organizer) {
    ics.push(`ORGANIZER;CN=${escapeICSText(event.organizer.name)}:mailto:${event.organizer.email}`);
  }

  if (event.attendees) {
    event.attendees.forEach(attendee => {
      const cn = attendee.name ? `CN=${escapeICSText(attendee.name)};` : '';
      ics.push(`ATTENDEE;${cn}RSVP=TRUE:mailto:${attendee.email}`);
    });
  }

  // Add reminder
  if (event.reminder) {
    ics.push('BEGIN:VALARM');
    ics.push('ACTION:DISPLAY');
    ics.push(`DESCRIPTION:${escapeICSText(event.title)} starts soon`);
    ics.push(`TRIGGER:-PT${event.reminder}M`);
    ics.push('END:VALARM');
  }

  ics.push('STATUS:CONFIRMED');
  ics.push('END:VEVENT');
  ics.push('END:VCALENDAR');

  return ics.join('\r\n');
}

/**
 * Convert interview details to a calendar event
 */
export function interviewToCalendarEvent(interview: InterviewDetails): CalendarEvent {
  const endTime = new Date(interview.scheduledAt);
  endTime.setMinutes(endTime.getMinutes() + interview.duration);

  const formatLabel = {
    video: 'Video Call',
    in_person: 'In-Person',
    phone: 'Phone Call',
  }[interview.format];

  const locationText = interview.format === 'video' && interview.meetingLink
    ? interview.meetingLink
    : interview.location || (interview.format === 'phone' ? 'Phone' : 'TBD');

  let description = `Interview for ${interview.opportunityTitle}\n\n`;
  description += `Team: ${interview.teamName}\n`;
  description += `Company: ${interview.companyName}\n`;
  description += `Format: ${formatLabel}\n`;
  description += `Duration: ${interview.duration} minutes\n`;

  if (interview.meetingLink) {
    description += `\nMeeting Link: ${interview.meetingLink}\n`;
  }

  if (interview.participants?.length) {
    description += `\nParticipants:\n${interview.participants.map(p => `- ${p}`).join('\n')}\n`;
  }

  if (interview.notes) {
    description += `\nNotes:\n${interview.notes}\n`;
  }

  description += '\n---\nScheduled via Liftout (liftout.io)';

  return {
    title: `Interview: ${interview.teamName} - ${interview.companyName}`,
    description,
    startTime: new Date(interview.scheduledAt),
    endTime,
    location: locationText,
    url: interview.meetingLink,
    reminder: 30, // 30 minute reminder
    attendees: interview.attendeeEmails?.map(email => ({ email })),
  };
}

/**
 * Download ICS file for an interview
 */
export function downloadInterviewICS(interview: InterviewDetails, filename?: string): void {
  const event = interviewToCalendarEvent(interview);
  const icsContent = generateICS(event);

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `interview-${interview.applicationId}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate Google Calendar event creation URL
 */
export function generateGoogleCalendarURL(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams();

  params.set('action', 'TEMPLATE');
  params.set('text', event.title);
  params.set('details', event.description);
  params.set('dates', `${formatGoogleCalendarDate(event.startTime)}/${formatGoogleCalendarDate(event.endTime)}`);

  if (event.location) {
    params.set('location', event.location);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Open Google Calendar to add interview
 */
export function openGoogleCalendar(interview: InterviewDetails): void {
  const event = interviewToCalendarEvent(interview);
  const url = generateGoogleCalendarURL(event);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Generate Outlook calendar URL
 */
export function generateOutlookCalendarURL(event: CalendarEvent): string {
  const baseUrl = 'https://outlook.live.com/calendar/0/action/compose';
  const params = new URLSearchParams();

  params.set('subject', event.title);
  params.set('body', event.description);
  params.set('startdt', event.startTime.toISOString());
  params.set('enddt', event.endTime.toISOString());

  if (event.location) {
    params.set('location', event.location);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Open Outlook calendar to add interview
 */
export function openOutlookCalendar(interview: InterviewDetails): void {
  const event = interviewToCalendarEvent(interview);
  const url = generateOutlookCalendarURL(event);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Generate Yahoo Calendar URL
 */
export function generateYahooCalendarURL(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.yahoo.com';
  const params = new URLSearchParams();

  params.set('v', '60');
  params.set('title', event.title);
  params.set('desc', event.description);
  params.set('st', formatGoogleCalendarDate(event.startTime));
  params.set('et', formatGoogleCalendarDate(event.endTime));

  if (event.location) {
    params.set('in_loc', event.location);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Check if the calendar event is in the past
 */
export function isEventPast(startTime: Date): boolean {
  return new Date(startTime) < new Date();
}

/**
 * Format interview time for display
 */
export function formatInterviewTime(date: Date, duration: number): string {
  const startTime = new Date(date);
  const endTime = new Date(date);
  endTime.setMinutes(endTime.getMinutes() + duration);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };

  const start = startTime.toLocaleString('en-US', options);
  const endTimeStr = endTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${start} - ${endTimeStr}`;
}

/**
 * Get time until interview
 */
export function getTimeUntilInterview(date: Date): string {
  const now = new Date();
  const interviewDate = new Date(date);
  const diff = interviewDate.getTime() - now.getTime();

  if (diff < 0) {
    return 'Past';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
