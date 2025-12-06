/**
 * Example usage of ScheduleMeetingModal component
 *
 * This file demonstrates how to integrate the calendar scheduling
 * functionality across different dashboards in the Liftout platform.
 */

'use client';

import React, { useState } from 'react';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

// ============================================
// Example 1: Negotiation Dashboard
// ============================================

export function NegotiationDashboardExample() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Example: Company negotiating with a team
  const companyName = 'TechCorp';
  const teamName = 'Engineering Dream Team';
  const teamMemberEmails = ['alice@example.com', 'bob@example.com', 'charlie@example.com'];

  return (
    <div>
      <button
        onClick={() => setIsScheduleOpen(true)}
        className="btn-primary"
      >
        Schedule Negotiation Call
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccess={() => {
          console.log('Meeting scheduled successfully!');
          // Refresh negotiations data, show toast, etc.
        }}
        defaultTitle={`${companyName} - ${teamName} Negotiation Call`}
        defaultDescription={`Discussion about:\n- Compensation packages\n- Role expectations\n- Team structure\n- Start dates and transition timeline`}
        defaultAttendees={teamMemberEmails}
      />
    </div>
  );
}

// ============================================
// Example 2: Due Diligence Dashboard
// ============================================

export function DueDiligenceDashboardExample() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Example: Scheduling reference check calls
  const candidateName = 'Sarah Chen';
  const referenceName = 'John Smith';
  const referenceEmail = 'john.smith@previouscompany.com';

  return (
    <div>
      <button
        onClick={() => setIsScheduleOpen(true)}
        className="btn-primary"
      >
        Schedule Reference Call
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultTitle={`Reference Check - ${candidateName} (${referenceName})`}
        defaultDescription={`Reference check discussion for ${candidateName}.\n\nTopics to cover:\n- Work performance and skills\n- Team collaboration\n- Leadership capabilities\n- Areas for growth`}
        defaultAttendees={[referenceEmail]}
      />
    </div>
  );
}

// ============================================
// Example 3: Integration/Onboarding Dashboard
// ============================================

export function IntegrationDashboardExample() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Example: Post-offer integration planning
  const teamMembers = [
    'sarah@newcompany.com',
    'alex@newcompany.com',
    'jordan@newcompany.com',
  ];

  return (
    <div>
      <button
        onClick={() => setIsScheduleOpen(true)}
        className="btn-primary"
      >
        Schedule Onboarding Kickoff
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccess={() => {
          console.log('Onboarding meeting scheduled!');
        }}
        defaultTitle="Team Onboarding Kickoff - Engineering"
        defaultDescription={`Welcome and onboarding session for the new engineering team.\n\nAgenda:\n- Company overview and culture\n- Team introductions\n- Systems and tools walkthrough\n- First week schedule\n- Q&A`}
        defaultAttendees={teamMembers}
      />
    </div>
  );
}

// ============================================
// Example 4: Application Detail Page
// ============================================

export function ApplicationDetailExample() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Example: Scheduling an interview from application detail
  const applicationId = 'app_123';
  const teamName = 'Product Team Alpha';
  const companyName = 'StartupXYZ';
  const interviewerEmail = 'hiring-manager@startupxyz.com';
  const teamLeadEmail = 'team-lead@example.com';

  return (
    <div>
      <button
        onClick={() => setIsScheduleOpen(true)}
        className="btn-primary"
      >
        Schedule Interview
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccess={() => {
          console.log('Interview scheduled!');
          // Update application status, send notifications, etc.
        }}
        defaultTitle={`Interview: ${teamName} - ${companyName}`}
        defaultDescription={`Initial interview for the liftout opportunity.\n\nInterview format: Video call\n\nPlease prepare:\n- Overview of your team's work history\n- Examples of successful projects\n- Questions about the role and company`}
        defaultAttendees={[interviewerEmail, teamLeadEmail]}
      />
    </div>
  );
}

// ============================================
// Example 5: Messages/Conversations
// ============================================

export function MessagesExample() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Example: Quick meeting scheduling from conversation
  const conversationParticipants = ['user1@example.com', 'user2@example.com'];

  return (
    <div>
      <button
        onClick={() => setIsScheduleOpen(true)}
        className="text-sm text-navy hover:underline flex items-center gap-1"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Schedule a call
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultTitle="Follow-up Discussion"
        defaultAttendees={conversationParticipants}
      />
    </div>
  );
}

// ============================================
// Example 6: Standalone Calendar Button
// ============================================

export function StandaloneCalendarButton() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsScheduleOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-dark transition-colors"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Schedule Meeting
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccess={() => {
          // Handle success - maybe show a toast notification
          alert('Meeting scheduled! Calendar invitation sent.');
        }}
      />
    </>
  );
}

// ============================================
// Example 7: Integration with TypeScript Types
// ============================================

interface Application {
  id: string;
  teamName: string;
  opportunityTitle: string;
  companyName: string;
  teamMembers: Array<{ email: string; name: string }>;
}

export function TypedApplicationExample({ application }: { application: Application }) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const handleScheduleSuccess = async () => {
    // Update application status in database
    await fetch(`/api/applications/${application.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'interviewing' }),
    });

    setIsScheduleOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsScheduleOpen(true)} className="btn-primary">
        Schedule Interview
      </button>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccess={handleScheduleSuccess}
        defaultTitle={`${application.teamName} - ${application.companyName} Interview`}
        defaultDescription={`Interview for: ${application.opportunityTitle}`}
        defaultAttendees={application.teamMembers.map(m => m.email)}
      />
    </div>
  );
}
