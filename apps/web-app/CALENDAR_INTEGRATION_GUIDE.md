# Calendar Integration Quick Start Guide

This guide shows you how to add meeting scheduling to any part of the Liftout platform.

## Installation (Already Complete)

The calendar integration system is already installed and includes:

- ✅ `/api/calendar/schedule` - API endpoint for scheduling meetings
- ✅ `/lib/calendar.ts` - Utility functions for ICS generation
- ✅ `/components/common/ScheduleMeetingModal.tsx` - Reusable modal component
- ✅ `/lib/email/index.ts` - Email service with calendar invitations

## Quick Integration (3 Steps)

### Step 1: Import the Component

```tsx
import { ScheduleMeetingModal } from '@/components/common/ScheduleMeetingModal';
```

### Step 2: Add State Management

```tsx
const [isScheduleOpen, setIsScheduleOpen] = useState(false);
```

### Step 3: Add to Your Component

```tsx
<button onClick={() => setIsScheduleOpen(true)} className="btn-primary">
  Schedule Meeting
</button>

<ScheduleMeetingModal
  isOpen={isScheduleOpen}
  onClose={() => setIsScheduleOpen(false)}
  onSuccess={() => {
    // Optional: Update your state, show toast, etc.
    console.log('Meeting scheduled!');
  }}
/>
```

## Pre-filled Examples

### Negotiation Call

```tsx
<ScheduleMeetingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTitle="Negotiation Discussion - Engineering Team"
  defaultDescription="Discussion topics:\n- Compensation packages\n- Role expectations\n- Timeline"
  defaultAttendees={['team-lead@example.com', 'hr@company.com']}
/>
```

### Interview Scheduling

```tsx
<ScheduleMeetingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTitle={`Interview: ${teamName} - ${companyName}`}
  defaultAttendees={interviewerEmails}
  onSuccess={async () => {
    // Update application status
    await updateApplicationStatus('interviewing');
  }}
/>
```

### Reference Check

```tsx
<ScheduleMeetingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTitle={`Reference Check - ${candidateName}`}
  defaultAttendees={[referenceEmail]}
/>
```

## Real-World Integration Points

### 1. Application Detail Page

**Location**: `/app/applications/[id]/page.tsx`

```tsx
export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const { data: application } = useQuery({
    queryKey: ['application', params.id],
    queryFn: () => fetchApplication(params.id),
  });

  return (
    <div>
      {/* Existing application details */}

      <button onClick={() => setIsScheduleOpen(true)} className="btn-primary">
        Schedule Interview
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultTitle={`Interview: ${application.teamName} - ${application.companyName}`}
        defaultAttendees={application.teamMembers.map(m => m.email)}
        onSuccess={async () => {
          await fetch(`/api/applications/${params.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'interviewing' }),
          });
        }}
      />
    </div>
  );
}
```

### 2. Negotiation Dashboard

**Location**: `/app/negotiations/page.tsx`

```tsx
export default function NegotiationsDashboard() {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <div>
      {negotiations.map(negotiation => (
        <div key={negotiation.id}>
          {/* Deal details */}
          <button
            onClick={() => {
              setSelectedDeal(negotiation);
              setIsScheduleOpen(true);
            }}
            className="btn-primary"
          >
            Schedule Call
          </button>
        </div>
      ))}

      {selectedDeal && (
        <ScheduleMeetingModal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setSelectedDeal(null);
          }}
          defaultTitle={`${selectedDeal.companyName} - ${selectedDeal.teamName} Negotiation`}
          defaultAttendees={selectedDeal.stakeholderEmails}
        />
      )}
    </div>
  );
}
```

### 3. Due Diligence Dashboard

**Location**: `/app/due-diligence/page.tsx`

```tsx
export default function DueDiligenceDashboard() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);

  return (
    <div>
      {references.map(reference => (
        <div key={reference.id}>
          {/* Reference details */}
          <button
            onClick={() => {
              setSelectedReference(reference);
              setIsScheduleOpen(true);
            }}
          >
            Schedule Call
          </button>
        </div>
      ))}

      {selectedReference && (
        <ScheduleMeetingModal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setSelectedReference(null);
          }}
          defaultTitle={`Reference Check - ${selectedReference.candidateName}`}
          defaultAttendees={[selectedReference.email]}
          defaultDescription="Reference check discussion to verify work history and performance"
        />
      )}
    </div>
  );
}
```

### 4. Integration/Onboarding Dashboard

**Location**: `/app/integration/page.tsx`

```tsx
export default function IntegrationDashboard() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const { data: newTeam } = useQuery({ queryKey: ['new-team'], queryFn: fetchNewTeam });

  return (
    <div>
      <h1>Welcome New Team!</h1>

      <button onClick={() => setIsScheduleOpen(true)} className="btn-primary">
        Schedule Onboarding Kickoff
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultTitle="Team Onboarding Kickoff"
        defaultDescription="Welcome session:\n- Company overview\n- Team introductions\n- Systems walkthrough\n- Q&A"
        defaultAttendees={newTeam?.members.map(m => m.email) || []}
      />
    </div>
  );
}
```

### 5. Messages/Conversation View

**Location**: `/app/messages/page.tsx`

```tsx
export default function MessagesPage() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const { data: conversation } = useQuery({ queryKey: ['conversation'], queryFn: fetchConversation });

  return (
    <div>
      {/* Message thread */}

      <button
        onClick={() => setIsScheduleOpen(true)}
        className="text-sm text-navy hover:underline flex items-center gap-1"
      >
        <CalendarIcon className="h-4 w-4" />
        Schedule a call
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultAttendees={conversation?.participants.map(p => p.email) || []}
      />
    </div>
  );
}
```

## Using the API Directly

If you need more control, you can call the API directly:

```typescript
async function scheduleCustomMeeting() {
  try {
    const response = await fetch('/api/calendar/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Team Sync',
        datetime: '2025-12-15T14:00:00Z',
        duration: 60,
        attendees: ['alice@example.com', 'bob@example.com'],
        meetingLink: 'https://zoom.us/j/123456789',
        sendInvites: true,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Meeting scheduled:', data);
    }
  } catch (error) {
    console.error('Failed to schedule:', error);
  }
}
```

## Downloading ICS Files Programmatically

```typescript
import { downloadMeetingICS } from '@/lib/calendar';

function handleDownloadCalendar() {
  downloadMeetingICS({
    title: 'Team Meeting',
    datetime: new Date('2025-12-15T14:00:00Z'),
    duration: 60,
    meetingLink: 'https://zoom.us/j/123',
  }, 'team-meeting.ics');
}
```

## Testing Checklist

- [ ] Modal opens when button is clicked
- [ ] Form validates required fields (title, date, time)
- [ ] Cannot select past dates/times
- [ ] Email validation works for attendees field
- [ ] "Download .ics" button generates calendar file
- [ ] "Schedule & Send" sends email invitations
- [ ] Success callback fires after scheduling
- [ ] Modal closes after successful submission
- [ ] Error messages display correctly

## Common Patterns

### Pattern 1: Schedule from Table Row

```tsx
<tr>
  <td>{application.teamName}</td>
  <td>
    <button onClick={() => openScheduleModal(application)}>
      Schedule
    </button>
  </td>
</tr>
```

### Pattern 2: Schedule from Detail View

```tsx
<div className="flex gap-2">
  <button className="btn-primary">Accept</button>
  <button onClick={() => setIsScheduleOpen(true)}>Schedule Interview</button>
</div>
```

### Pattern 3: Schedule from Dropdown Menu

```tsx
<DropdownMenu>
  <DropdownItem onClick={() => setIsScheduleOpen(true)}>
    <CalendarIcon className="h-4 w-4" />
    Schedule Meeting
  </DropdownItem>
</DropdownMenu>
```

## Troubleshooting

### Modal doesn't open
- Check that `isOpen` state is being set to `true`
- Verify component is imported correctly

### Email not sending
- Check `RESEND_API_KEY` in environment variables
- Verify attendees have valid email addresses
- Check console for error messages

### ICS file not downloading
- Check browser console for errors
- Verify meeting data is valid
- Test in different browser

### Validation errors
- Ensure date is in the future
- Check duration is between 15-480 minutes
- Verify email addresses are valid format

## Need Help?

- See complete examples: `/components/common/ScheduleMeetingModal.example.tsx`
- Read full documentation: `/components/common/CALENDAR_INTEGRATION.md`
- API implementation: `/app/api/calendar/schedule/route.ts`
- Utility functions: `/lib/calendar.ts`
