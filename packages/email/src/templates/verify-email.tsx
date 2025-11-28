import { Button, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, styles } from './layout';

interface VerifyEmailTemplateProps {
  firstName: string;
  verificationUrl: string;
}

export function VerifyEmailTemplate({
  firstName = 'there',
  verificationUrl = 'https://liftout.com/auth/verify-email?token=xxx',
}: VerifyEmailTemplateProps) {
  return (
    <EmailLayout preview="Verify your email address to get started with Liftout">
      <Text style={styles.heading}>Verify your email address</Text>

      <Text style={styles.paragraph}>Hi {firstName},</Text>

      <Text style={styles.paragraph}>
        Thanks for signing up for Liftout! Please verify your email address to
        complete your registration and start connecting with teams and
        opportunities.
      </Text>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={verificationUrl} style={styles.button}>
          Verify Email Address
        </Button>
      </Section>

      <Text style={styles.mutedText}>
        This link will expire in 24 hours. If you didn't create a Liftout
        account, you can safely ignore this email.
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
        <Link href={verificationUrl} style={styles.link}>
          {verificationUrl}
        </Link>
      </Text>
    </EmailLayout>
  );
}

export default VerifyEmailTemplate;
