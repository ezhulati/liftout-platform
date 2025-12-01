import { Button, Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, styles } from './layout';

interface InterviewScheduledTemplateProps {
  teamName: string;
  opportunityTitle: string;
  companyName: string;
  scheduledDate: string;
  scheduledTime: string;
  duration?: string;
  format?: 'video' | 'phone' | 'in_person';
  meetingLink?: string;
  location?: string;
  notes?: string;
  applicationUrl: string;
}

const formatLabels: Record<string, string> = {
  video: 'Video Call',
  phone: 'Phone Call',
  in_person: 'In Person',
};

export function InterviewScheduledTemplate({
  teamName = 'Engineering Team',
  opportunityTitle = 'Senior Engineering Team',
  companyName = 'TechCorp',
  scheduledDate = 'January 15, 2025',
  scheduledTime = '2:00 PM EST',
  duration = '1 hour',
  format = 'video',
  meetingLink,
  location,
  notes,
  applicationUrl = 'https://liftout.com/app/applications',
}: InterviewScheduledTemplateProps) {
  return (
    <EmailLayout
      preview={`Interview scheduled with ${companyName} for ${scheduledDate}`}
    >
      <Text style={{ ...styles.heading, textAlign: 'center' }}>
        📅 Interview Scheduled!
      </Text>

      <Section
        style={{
          ...styles.card,
          borderLeft: `4px solid #8b5cf6`,
        }}
      >
        <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
          <strong>{opportunityTitle}</strong>
        </Text>
        <Text style={{ ...styles.mutedText, margin: 0 }}>
          at {companyName}
        </Text>
      </Section>

      <Text style={styles.paragraph}>
        Hi {teamName},
      </Text>

      <Text style={styles.paragraph}>
        Great news! {companyName} has scheduled an interview with your team for
        the <strong>{opportunityTitle}</strong> opportunity.
      </Text>

      <Section
        style={{
          ...styles.card,
          backgroundColor: '#f5f3ff',
          borderLeft: '4px solid #8b5cf6',
        }}
      >
        <Text style={{ ...styles.paragraph, margin: '0 0 12px', fontWeight: '600' }}>
          Interview Details
        </Text>
        <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
          📆 <strong>Date:</strong> {scheduledDate}
        </Text>
        <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
          🕐 <strong>Time:</strong> {scheduledTime}
        </Text>
        {duration && (
          <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
            ⏱️ <strong>Duration:</strong> {duration}
          </Text>
        )}
        <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
          📍 <strong>Format:</strong> {formatLabels[format] || format}
        </Text>
        {location && (
          <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
            🏢 <strong>Location:</strong> {location}
          </Text>
        )}
      </Section>

      {meetingLink && format === 'video' && (
        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Button
            href={meetingLink}
            style={{
              ...styles.button,
              backgroundColor: '#8b5cf6',
            }}
          >
            Join Video Call
          </Button>
        </Section>
      )}

      {notes && (
        <>
          <Hr style={styles.hr} />
          <Text style={{ ...styles.paragraph, fontWeight: '600' }}>
            Notes from {companyName}:
          </Text>
          <Section style={styles.card}>
            <Text style={{ ...styles.paragraph, margin: 0 }}>
              {notes}
            </Text>
          </Section>
        </>
      )}

      <Text style={styles.paragraph}>
        <strong>Tips for your interview:</strong>
      </Text>
      <Section style={styles.card}>
        <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
          • Review the opportunity details and prepare relevant examples
        </Text>
        <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
          • Highlight your team's collaborative achievements
        </Text>
        <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
          • Prepare questions about the company culture and integration process
        </Text>
        <Text style={{ ...styles.paragraph, margin: 0 }}>
          • Test your video/audio setup if it's a video call
        </Text>
      </Section>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={applicationUrl} style={styles.button}>
          View Interview Details
        </Button>
      </Section>

      <Text style={styles.mutedText}>
        If you need to reschedule, please contact {companyName} through the
        platform as soon as possible.
      </Text>
    </EmailLayout>
  );
}

export default InterviewScheduledTemplate;
