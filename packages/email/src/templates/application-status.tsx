import { Button, Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, styles } from './layout';

interface ApplicationStatusTemplateProps {
  teamName: string;
  opportunityTitle: string;
  companyName: string;
  newStatus: string;
  message?: string;
  applicationsUrl: string;
}

const statusConfig: Record<
  string,
  { emoji: string; title: string; color: string }
> = {
  reviewing: {
    emoji: '👀',
    title: 'Your application is being reviewed',
    color: '#3b82f6',
  },
  interviewing: {
    emoji: '🎯',
    title: 'Interview requested!',
    color: '#8b5cf6',
  },
  accepted: {
    emoji: '🎉',
    title: 'Congratulations! Your application was accepted',
    color: '#10b981',
  },
  rejected: {
    emoji: '📋',
    title: 'Application update',
    color: '#6b7280',
  },
  submitted: {
    emoji: '✓',
    title: 'Application received',
    color: '#3b82f6',
  },
};

export function ApplicationStatusTemplate({
  teamName = 'Engineering Team',
  opportunityTitle = 'Senior Engineering Team',
  companyName = 'TechCorp',
  newStatus = 'reviewing',
  message,
  applicationsUrl = 'https://liftout.com/app/applications',
}: ApplicationStatusTemplateProps) {
  const config = statusConfig[newStatus] || statusConfig.submitted;

  return (
    <EmailLayout
      preview={`${config.title} - ${opportunityTitle} at ${companyName}`}
    >
      <Text style={{ ...styles.heading, textAlign: 'center' }}>
        {config.emoji} {config.title}
      </Text>

      <Section
        style={{
          ...styles.card,
          borderLeft: `4px solid ${config.color}`,
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

      {newStatus === 'reviewing' && (
        <Text style={styles.paragraph}>
          Great news! {companyName} has reviewed your application and is
          interested in learning more about your team. They're currently
          evaluating candidates and will be in touch soon.
        </Text>
      )}

      {newStatus === 'interviewing' && (
        <Text style={styles.paragraph}>
          Exciting news! {companyName} would like to schedule an interview with
          your team. Check your dashboard for available time slots or wait for
          them to reach out with scheduling details.
        </Text>
      )}

      {newStatus === 'accepted' && (
        <>
          <Text style={styles.paragraph}>
            We're thrilled to let you know that {companyName} has accepted your
            team for the {opportunityTitle} opportunity! This is a significant
            milestone in your liftout journey.
          </Text>
          <Text style={styles.paragraph}>
            The next steps will involve finalizing terms and preparing for your
            transition. {companyName} will reach out with more details.
          </Text>
        </>
      )}

      {newStatus === 'rejected' && (
        <Text style={styles.paragraph}>
          Thank you for your interest in the {opportunityTitle} position at{' '}
          {companyName}. After careful consideration, they've decided to move
          forward with other candidates for this opportunity.
        </Text>
      )}

      {message && (
        <>
          <Hr style={styles.hr} />
          <Text style={{ ...styles.paragraph, fontWeight: '600' }}>
            Message from {companyName}:
          </Text>
          <Section style={styles.card}>
            <Text style={{ ...styles.paragraph, fontStyle: 'italic', margin: 0 }}>
              "{message}"
            </Text>
          </Section>
        </>
      )}

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={applicationsUrl} style={styles.button}>
          View Application Details
        </Button>
      </Section>

      {newStatus === 'rejected' && (
        <Text style={styles.mutedText}>
          Don't be discouraged! There are many other opportunities on Liftout
          that could be a great fit for your team. Keep exploring and applying.
        </Text>
      )}
    </EmailLayout>
  );
}

export default ApplicationStatusTemplate;
