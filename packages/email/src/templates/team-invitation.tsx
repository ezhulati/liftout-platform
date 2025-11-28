import { Button, Link, Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, styles } from './layout';

interface TeamInvitationTemplateProps {
  inviterName: string;
  teamName: string;
  invitationUrl: string;
  personalMessage?: string;
  expiresIn?: string;
}

export function TeamInvitationTemplate({
  inviterName = 'Alex',
  teamName = 'Engineering Team',
  invitationUrl = 'https://liftout.com/app/teams/join?token=xxx',
  personalMessage,
  expiresIn = '7 days',
}: TeamInvitationTemplateProps) {
  return (
    <EmailLayout
      preview={`${inviterName} invited you to join ${teamName} on Liftout`}
    >
      <Text style={styles.heading}>You've been invited to join a team!</Text>

      <Text style={styles.paragraph}>
        <strong>{inviterName}</strong> has invited you to join{' '}
        <strong>{teamName}</strong> on Liftout, the team hiring marketplace.
      </Text>

      {personalMessage && (
        <Section style={styles.card}>
          <Text
            style={{
              ...styles.paragraph,
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            "{personalMessage}"
          </Text>
          <Text
            style={{
              ...styles.mutedText,
              margin: '8px 0 0',
              textAlign: 'right',
            }}
          >
            — {inviterName}
          </Text>
        </Section>
      )}

      <Text style={styles.paragraph}>
        As a team on Liftout, you can:
      </Text>

      <Section style={{ paddingLeft: '16px' }}>
        <Text style={{ ...styles.paragraph, margin: '8px 0' }}>
          ✓ Showcase your collective skills and achievements
        </Text>
        <Text style={{ ...styles.paragraph, margin: '8px 0' }}>
          ✓ Discover opportunities seeking intact teams
        </Text>
        <Text style={{ ...styles.paragraph, margin: '8px 0' }}>
          ✓ Move together with people you already work well with
        </Text>
        <Text style={{ ...styles.paragraph, margin: '8px 0' }}>
          ✓ Negotiate as a team for better outcomes
        </Text>
      </Section>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={invitationUrl} style={styles.button}>
          Join {teamName}
        </Button>
      </Section>

      <Hr style={styles.hr} />

      <Text style={styles.mutedText}>
        This invitation will expire in <strong>{expiresIn}</strong>. If you
        don't want to join this team, you can simply ignore this email.
      </Text>

      <Text style={styles.mutedText}>
        If the button doesn't work, copy and paste this link into your browser:
      </Text>
      <Text
        style={{
          ...styles.mutedText,
          wordBreak: 'break-all',
          fontSize: '12px',
        }}
      >
        <Link href={invitationUrl} style={styles.link}>
          {invitationUrl}
        </Link>
      </Text>
    </EmailLayout>
  );
}

export default TeamInvitationTemplate;
