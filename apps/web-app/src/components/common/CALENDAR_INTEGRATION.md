# Calendar Integration System

A comprehensive calendar scheduling system for Liftout that enables meeting scheduling across negotiation, due diligence, and integration dashboards.

## Overview

The calendar integration consists of three main components:

1. **API Endpoint** (`/api/calendar/schedule`) - Backend service for creating meetings and sending invitations
2. **Utility Functions** (`/lib/calendar.ts`) - ICS file generation and calendar provider integration
3. **UI Component** (`ScheduleMeetingModal`) - Reusable modal for scheduling meetings

## Features

- Generate ICS calendar files
- Send email invitations with calendar attachments
- Support for multiple attendees
- Video call link integration
- 30-minute reminder notifications
- Download calendar files without sending emails
- Validation for past dates and email addresses

## Quick Start

### Basic Usage

```tsx
import { ScheduleMeetingModal } from '@/components/common/ScheduleMeetingModal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Schedule Meeting
      </button>

      <ScheduleMeetingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => console.log('Meeting scheduled!')}
      />
    </>
  );
}
```

### With Pre-filled Data

```tsx
<ScheduleMeetingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTitle="Negotiation Call - TechCorp"
  defaultDescription="Discussion about compensation and role details"
  defaultAttendees={['team-lead@example.com', 'hr@company.com']}
  onSuccess={() => {
    // Update application status
    // Show success toast
    // Refresh data
  }}
/>
```

## API Reference

### POST /api/calendar/schedule

Schedule a meeting and optionally send email invitations.

**Request Body:**

```typescript
{
  title: string;              // Required: Meeting title
  description?: string;        // Optional: Meeting description
  datetime: string;           // Required: ISO 8601 datetime
  duration: number;           // Required: Duration in minutes (15-480)
  attendees?: string[];       // Optional: Email addresses
  location?: string;          // Optional: Physical location
  meetingLink?: string;       // Optional: Video call URL
  sendInvites?: boolean;      // Optional: Send email invites (default: false)
}
```

**Response:**

```typescript
{
  success: boolean;
  meeting: {
    title: string;
    description?: string;
    datetime: string;
    duration: number;
    location?: string;
    meetingLink?: string;
    attendees: string[];
  };
  icsContent: string;         // ICS file content
  emailResults?: Array<{      // Only if sendInvites=true
    email: string;
    success: boolean;
    error?: string;
  }>;
}
```

**Example:**

```typescript
const response = await fetch('/api/calendar/schedule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Team Kickoff Meeting',
    datetime: '2025-12-15T14:00:00Z',
    duration: 60,
    attendees: ['alice@example.com', 'bob@example.com'],
    meetingLink: 'https://zoom.us/j/123456789',
    sendInvites: true,
  }),
});

const data = await response.json();
```

## Utility Functions

### `generateICS(event: CalendarEvent): string`

Generate ICS file content from a calendar event.

```typescript
import { generateICS } from '@/lib/calendar';

const ics = generateICS({
  title: 'My Meeting',
  description: 'Meeting description',
  startTime: new Date('2025-12-15T14:00:00Z'),
  endTime: new Date('2025-12-15T15:00:00Z'),
  location: 'Conference Room A',
  attendees: [{ email: 'user@example.com' }],
  reminder: 30, // 30 minutes before
});
```

### `downloadMeetingICS(meeting: MeetingDetails, filename?: string): void`

Download an ICS file for a meeting.

```typescript
import { downloadMeetingICS } from '@/lib/calendar';

downloadMeetingICS({
  title: 'Team Sync',
  datetime: new Date('2025-12-15T14:00:00Z'),
  duration: 30,
  attendees: ['team@example.com'],
}, 'team-sync.ics');
```

### `meetingToCalendarEvent(meeting: MeetingDetails): CalendarEvent`

Convert meeting details to a calendar event object.

```typescript
import { meetingToCalendarEvent } from '@/lib/calendar';

const event = meetingToCalendarEvent({
  title: 'Interview',
  datetime: new Date(),
  duration: 60,
  meetingLink: 'https://zoom.us/j/123',
});
```

## Component Props

### ScheduleMeetingModal

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Whether the modal is open |
| `onClose` | `() => void` | Yes | Callback when modal closes |
| `onSuccess` | `() => void` | No | Callback after successful scheduling |
| `defaultTitle` | `string` | No | Pre-fill meeting title |
| `defaultDescription` | `string` | No | Pre-fill meeting description |
| `defaultAttendees` | `string[]` | No | Pre-fill attendee emails |

## Use Cases

### 1. Negotiation Dashboard

Schedule calls between companies and teams to discuss offers, compensation, and terms.

```tsx
<ScheduleMeetingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTitle={`${companyName} - ${teamName} Negotiation Call`}
  defaultDescription="Discussion about compensation packages and role expectations"
  defaultAttendees={teamMemberEmails}
/>
```

### 2. Due Diligence Dashboard

Schedule reference checks, background verification calls, and team interviews.

```tsx
<ScheduleMeetingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTitle={`Reference Check - ${candidateName}`}
  defaultDescription="Reference check discussion"
  defaultAttendees={[referenceEmail]}
/>
```

### 3. Integration/Onboarding Dashboard

Schedule onboarding sessions, team introductions, and training calls.

```tsx
<ScheduleMeetingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTitle="Team Onboarding Kickoff"
  defaultDescription="Welcome session with company overview and Q&A"
  defaultAttendees={newTeamMemberEmails}
/>
```

### 4. Application Detail Page

Schedule interviews directly from team applications.

```tsx
<ScheduleMeetingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTitle={`Interview: ${teamName} - ${companyName}`}
  defaultAttendees={[interviewerEmail, teamLeadEmail]}
  onSuccess={async () => {
    // Update application status to "interviewing"
    await updateApplicationStatus(applicationId, 'interviewing');
  }}
/>
```

### 5. Messages/Conversations

Quick meeting scheduling from conversation threads.

```tsx
<button onClick={() => setScheduleOpen(true)}>
  Schedule a call
</button>

<ScheduleMeetingModal
  isOpen={scheduleOpen}
  onClose={() => setScheduleOpen(false)}
  defaultAttendees={conversationParticipants}
/>
```

## Email Integration

The system automatically sends email invitations with:

- Meeting details (title, date, time, duration)
- Location or meeting link
- Calendar attachment (ICS file)
- Join meeting button (if video link provided)
- Automatic 30-minute reminder

**Email template includes:**
- Responsive HTML design
- Liftout branding
- Meeting information card
- Optional description section
- Join meeting CTA button
- Calendar file attachment

## Validation

The API endpoint validates:

- **Required fields**: title, datetime, duration
- **Duration**: Between 15 and 480 minutes
- **Datetime**: Must be in the future
- **Email addresses**: Valid format check
- **Meeting link**: Optional URL validation

## Error Handling

```typescript
try {
  const response = await fetch('/api/calendar/schedule', {
    method: 'POST',
    body: JSON.stringify(meetingData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to schedule:', error.error);
  }
} catch (err) {
  console.error('Network error:', err);
}
```

## Best Practices

1. **Always validate dates**: Ensure selected dates are in the future
2. **Provide context**: Include meeting description for better clarity
3. **Email validation**: Validate email addresses before submission
4. **Success callbacks**: Use `onSuccess` to update application state
5. **Error handling**: Display user-friendly error messages
6. **Loading states**: Show loading indicators during API calls

## Technical Details

### ICS File Format

The system generates RFC 5545-compliant ICS files with:

- VCALENDAR version 2.0
- VEVENT with unique UID
- DTSTAMP, DTSTART, DTEND
- SUMMARY, DESCRIPTION, LOCATION
- ORGANIZER and ATTENDEE fields
- VALARM for 30-minute reminder
- STATUS: CONFIRMED

### Calendar Provider Support

Generated ICS files work with:

- Google Calendar
- Microsoft Outlook
- Apple Calendar
- Yahoo Calendar
- Any RFC 5545-compliant calendar app

## Environment Variables

Required for email functionality:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=Liftout <noreply@liftout.com>
```

If `RESEND_API_KEY` is not configured, the system will:
- Still generate ICS files
- Allow downloads
- Skip email sending (with console warning)

## Examples

See [ScheduleMeetingModal.example.tsx](./ScheduleMeetingModal.example.tsx) for complete integration examples across different dashboards.

## Testing

```bash
# Test API endpoint
curl -X POST https://liftout.com/api/calendar/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Meeting",
    "datetime": "2025-12-15T14:00:00Z",
    "duration": 60,
    "attendees": ["test@example.com"],
    "sendInvites": true
  }'
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support for downloads and email

## Future Enhancements

Potential future improvements:

- [ ] Recurring meetings support
- [ ] Calendar provider OAuth integration
- [ ] Meeting templates
- [ ] Timezone selection
- [ ] Meeting reminder customization
- [ ] Video call provider integration (Zoom, Meet, Teams)
- [ ] Attendee availability checking
- [ ] Meeting notes and agenda builder
- [ ] Post-meeting feedback collection

## Support

For issues or questions:
- Check existing implementation in `/api/calendar/schedule/route.ts`
- Review utility functions in `/lib/calendar.ts`
- See example usage in `ScheduleMeetingModal.example.tsx`
