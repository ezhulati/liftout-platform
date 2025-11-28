import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

// Brand colors
const colors = {
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  secondary: '#14b8a6',
  text: '#1f2937',
  textMuted: '#6b7280',
  background: '#f9fafb',
  white: '#ffffff',
  border: '#e5e7eb',
};

// Styles
const main: React.CSSProperties = {
  backgroundColor: colors.background,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: colors.white,
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header: React.CSSProperties = {
  padding: '24px 48px',
  textAlign: 'center' as const,
};

const logo: React.CSSProperties = {
  margin: '0 auto',
};

const content: React.CSSProperties = {
  padding: '0 48px',
};

const footer: React.CSSProperties = {
  padding: '24px 48px 0',
  textAlign: 'center' as const,
};

const footerText: React.CSSProperties = {
  color: colors.textMuted,
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 8px',
};

const footerLink: React.CSSProperties = {
  color: colors.textMuted,
  fontSize: '12px',
  textDecoration: 'underline',
};

const hr: React.CSSProperties = {
  borderColor: colors.border,
  margin: '24px 0',
};

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src="https://liftout.com/logo.png"
              width="140"
              height="40"
              alt="Liftout"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={hr} />
            <Text style={footerText}>
              Liftout - The Team Hiring Marketplace
            </Text>
            <Text style={footerText}>
              <Link href="https://liftout.com/privacy" style={footerLink}>
                Privacy Policy
              </Link>
              {' • '}
              <Link href="https://liftout.com/terms" style={footerLink}>
                Terms of Service
              </Link>
              {' • '}
              <Link href="https://liftout.com/app/settings/notifications" style={footerLink}>
                Email Preferences
              </Link>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Liftout. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Shared component styles for use in templates
export const styles = {
  heading: {
    color: colors.text,
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '32px',
    margin: '0 0 16px',
  } as React.CSSProperties,

  paragraph: {
    color: colors.text,
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 16px',
  } as React.CSSProperties,

  mutedText: {
    color: colors.textMuted,
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 16px',
  } as React.CSSProperties,

  button: {
    backgroundColor: colors.primary,
    borderRadius: '8px',
    color: colors.white,
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '100%',
    padding: '14px 28px',
    textDecoration: 'none',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  secondaryButton: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    color: colors.text,
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '100%',
    padding: '12px 24px',
    textDecoration: 'none',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  link: {
    color: colors.primary,
    textDecoration: 'underline',
  } as React.CSSProperties,

  card: {
    backgroundColor: colors.background,
    borderRadius: '8px',
    padding: '20px',
    margin: '16px 0',
  } as React.CSSProperties,

  hr: {
    borderColor: colors.border,
    margin: '24px 0',
  } as React.CSSProperties,

  colors,
};
