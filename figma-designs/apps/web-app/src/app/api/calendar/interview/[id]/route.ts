import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface CalendarEvent {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  url?: string;
}

/**
 * Format date for ICS file (YYYYMMDDTHHMMSSZ format)
 */
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
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
 * Generate ICS file content
 */
function generateICS(event: CalendarEvent): string {
  const uid = generateUID();
  const now = formatICSDate(new Date());
  const start = formatICSDate(event.startTime);
  const end = formatICSDate(event.endTime);

  const ics = [
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

  // Add 30-minute reminder
  ics.push('BEGIN:VALARM');
  ics.push('ACTION:DISPLAY');
  ics.push(`DESCRIPTION:${escapeICSText(event.title)} starts soon`);
  ics.push('TRIGGER:-PT30M');
  ics.push('END:VALARM');

  ics.push('STATUS:CONFIRMED');
  ics.push('END:VEVENT');
  ics.push('END:VCALENDAR');

  return ics.join('\r\n');
}

// GET /api/calendar/interview/[id] - Generate ICS file for interview
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the application with interview details
    const application = await prisma.teamApplication.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Check if interview is scheduled
    if (!application.interviewScheduledAt) {
      return NextResponse.json(
        { error: 'No interview scheduled for this application' },
        { status: 400 }
      );
    }

    // Calculate end time
    const startTime = new Date(application.interviewScheduledAt);
    const duration = application.interviewDuration || 60; // Default 60 minutes
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    // Build description
    let description = `Interview for ${application.opportunity.title}\n\n`;
    description += `Team: ${application.team.name}\n`;
    description += `Company: ${application.opportunity.company.name}\n`;
    description += `Format: ${application.interviewFormat || 'Video Call'}\n`;
    description += `Duration: ${duration} minutes\n`;

    if (application.interviewMeetingLink) {
      description += `\nMeeting Link: ${application.interviewMeetingLink}\n`;
    }

    if (application.interviewNotes) {
      description += `\nNotes:\n${application.interviewNotes}\n`;
    }

    description += '\n---\nScheduled via Liftout (liftout.io)';

    // Build location
    const location = application.interviewMeetingLink || application.interviewLocation || 'TBD';

    // Generate ICS content
    const event: CalendarEvent = {
      title: `Interview: ${application.team.name} - ${application.opportunity.company.name}`,
      description,
      startTime,
      endTime,
      location,
      url: application.interviewMeetingLink || undefined,
    };

    const icsContent = generateICS(event);

    // Return ICS file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="interview-${id}.ics"`,
      },
    });
  } catch (error) {
    console.error('Error generating ICS file:', error);
    return NextResponse.json(
      { error: 'Failed to generate calendar file' },
      { status: 500 }
    );
  }
}
