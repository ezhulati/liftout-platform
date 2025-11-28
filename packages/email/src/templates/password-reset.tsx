import { Button, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, styles } from './layout';

interface PasswordResetTemplateProps {
  firstName: string;
  resetUrl: string;
}

export function PasswordResetTemplate({
  firstName = 'there',
  resetUrl = 'https://liftout.com/auth/reset-password?token=xxx',
}: PasswordResetTemplateProps) {
  return (
    <EmailLayout preview="Reset your Liftout password">
      <Text style={styles.heading}>Reset your password</Text>

      <Text style={styles.paragraph}>Hi {firstName},</Text>

      <Text style={styles.paragraph}>
        We received a request to reset your Liftout password. Click the button
        below to create a new password.
      </Text>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={resetUrl} style={styles.button}>
          Reset Password
        </Button>
      </Section>

      <Section style={styles.card}>
        <Text style={{ ...styles.mutedText, margin: 0 }}>
          <strong>Security tip:</strong> Liftout will never ask for your
          password via email. If you didn't request this reset, please ignore
          this email and your password will remain unchanged.
        </Text>
      </Section>

      <Text style={styles.mutedText}>
        This link will expire in 1 hour for security reasons.
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
        <Link href={resetUrl} style={styles.link}>
          {resetUrl}
        </Link>
      </Text>
    </EmailLayout>
  );
}

export default PasswordResetTemplate;
