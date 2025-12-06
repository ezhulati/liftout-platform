import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateICS, meetingToCalendarEvent, type MeetingDetails } from '@/lib/calendar';
import { Resend } from 'resend';

// Lazy-initialize Resend client
let resendClient: Resend | null = null;
const getResend = () => {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured - emails will be skipped');
      return null;
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
};

const FROM_EMAIL = process.env.EMAIL_FROM || 'Liftout <noreply@liftout.com>';

interface ScheduleMeetingRequest {
  title: string;
  description?: string;
  datetime: string;
  duration: number;
  attendees?: string[];
  location?: string;
  meetingLink?: string;
  sendInvites?: boolean;
}

/**
 * POST /api/calendar/schedule
 * Schedule a meeting and optionally send calendar invitations
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ScheduleMeetingRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.datetime || !body.duration) {
      return NextResponse.json(
        { error: 'Missing required fields: title, datetime, duration' },
        { status: 400 }
      );
    }

    // Validate duration
    if (body.duration < 15 || body.duration > 480) {
      return NextResponse.json(
        { error: 'Duration must be between 15 and 480 minutes' },
        { status: 400 }
      );
    }

    // Parse and validate datetime
    const datetime = new Date(body.datetime);
    if (isNaN(datetime.getTime())) {
      return NextResponse.json(
        { error: 'Invalid datetime format' },
        { status: 400 }
      );
    }

    // Check if datetime is in the past
    if (datetime < new Date()) {
      return NextResponse.json(
        { error: 'Cannot schedule meetings in the past' },
        { status: 400 }
      );
    }

    // Validate email addresses
    if (body.attendees && body.attendees.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = body.attendees.filter(email => !emailRegex.test(email));
      if (invalidEmails.length > 0) {
        return NextResponse.json(
          { error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Build meeting details
    const meetingDetails: MeetingDetails = {
      title: body.title,
      description: body.description,
      datetime,
      duration: body.duration,
      location: body.location,
      meetingLink: body.meetingLink,
      attendees: body.attendees,
      organizerName: session.user.name || undefined,
      organizerEmail: session.user.email || undefined,
    };

    // Generate ICS file content
    const event = meetingToCalendarEvent(meetingDetails);
    const icsContent = generateICS(event);

    // Send email invitations if requested
    let emailResults: Array<{ email: string; success: boolean; error?: string }> = [];

    if (body.sendInvites && body.attendees && body.attendees.length > 0) {
      const resend = getResend();

      if (resend) {
        // Send individual emails with calendar attachment
        emailResults = await Promise.all(
          body.attendees.map(async (attendeeEmail) => {
            try {
              const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: attendeeEmail,
                subject: `Meeting Invitation: ${body.title}`,
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Meeting Invitation</h1>
                      </div>
                      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
                        <p style="font-size: 16px;">Hi,</p>
                        <p style="font-size: 16px; margin-bottom: 20px;">
                          <strong>${session.user.name || 'Someone'}</strong> has invited you to a meeting on Liftout.
                        </p>

                        <div style="background: #f5f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                          <p style="font-weight: 600; margin: 0 0 15px 0; color: #333; font-size: 18px;">${body.title}</p>
                          <p style="margin: 0 0 8px 0;">📆 <strong>When:</strong> ${datetime.toLocaleString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            timeZoneName: 'short'
                          })}</p>
                          <p style="margin: 0 0 8px 0;">⏱️ <strong>Duration:</strong> ${body.duration} minutes</p>
                          ${body.location ? `<p style="margin: 0 0 8px 0;">📍 <strong>Location:</strong> ${body.location}</p>` : ''}
                          ${body.meetingLink ? `
                            <p style="margin: 0 0 8px 0;">🔗 <strong>Meeting Link:</strong></p>
                            <a href="${body.meetingLink}" style="color: #667eea; word-break: break-all;">${body.meetingLink}</a>
                          ` : ''}
                        </div>

                        ${body.description ? `
                          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="font-weight: 600; margin: 0 0 10px 0; color: #333;">Description:</p>
                            <p style="margin: 0; color: #666; white-space: pre-wrap;">${body.description}</p>
                          </div>
                        ` : ''}

                        ${body.meetingLink ? `
                          <div style="text-align: center; margin: 30px 0;">
                            <a href="${body.meetingLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                              Join Meeting
                            </a>
                          </div>
                        ` : ''}

                        <p style="font-size: 14px; color: #666; margin-top: 25px;">
                          A calendar invitation is attached to this email. Add it to your calendar to receive reminders.
                        </p>
                      </div>
                      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                        <p>&copy; ${new Date().getFullYear()} Liftout. All rights reserved.</p>
                      </div>
                    </body>
                  </html>
                `,
                attachments: [
                  {
                    filename: 'meeting.ics',
                    content: Buffer.from(icsContent).toString('base64'),
                    contentType: 'text/calendar; charset=utf-8; method=REQUEST',
                  },
                ],
              });

              if (error) {
                console.error(`Failed to send invitation to ${attendeeEmail}:`, error);
                return { email: attendeeEmail, success: false, error: error.message };
              }

              return { email: attendeeEmail, success: true };
            } catch (err) {
              console.error(`Error sending invitation to ${attendeeEmail}:`, err);
              return {
                email: attendeeEmail,
                success: false,
                error: err instanceof Error ? err.message : 'Unknown error',
              };
            }
          })
        );
      } else {
        console.log('[Email skipped] RESEND_API_KEY not configured');
        emailResults = body.attendees.map(email => ({
          email,
          success: false,
          error: 'Email service not configured',
        }));
      }
    }

    // Return meeting details and email results
    return NextResponse.json({
      success: true,
      meeting: {
        title: body.title,
        description: body.description,
        datetime: datetime.toISOString(),
        duration: body.duration,
        location: body.location,
        meetingLink: body.meetingLink,
        attendees: body.attendees || [],
      },
      icsContent,
      emailResults: emailResults.length > 0 ? emailResults : undefined,
    });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    return NextResponse.json(
      { error: 'Failed to schedule meeting' },
      { status: 500 }
    );
  }
}
