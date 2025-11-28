import { Resend } from 'resend';
import { render } from '@react-email/components';
import { VerifyEmailTemplate } from './templates/verify-email';
import { PasswordResetTemplate } from './templates/password-reset';
import { TeamInvitationTemplate } from './templates/team-invitation';
import { WelcomeTemplate } from './templates/welcome';
import { ApplicationStatusTemplate } from './templates/application-status';
import { NewMessageTemplate } from './templates/new-message';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const EMAIL_FROM = process.env.EMAIL_FROM_ADDRESS || 'Liftout <noreply@liftout.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://liftout.com';

// Types
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

// Base email send function
export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      tags: options.tags,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Email send exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

// ============================================
// Typed Email Functions
// ============================================

/**
 * Send email verification email
 */
export async function sendVerificationEmail(params: {
  to: string;
  firstName: string;
  verificationToken: string;
}): Promise<EmailResult> {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${params.verificationToken}`;

  const html = await render(
    VerifyEmailTemplate({
      firstName: params.firstName,
      verificationUrl,
    })
  );

  return sendEmail({
    to: params.to,
    subject: 'Verify your Liftout account',
    html,
    tags: [{ name: 'category', value: 'verification' }],
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: {
  to: string;
  firstName: string;
  resetToken: string;
}): Promise<EmailResult> {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${params.resetToken}`;

  const html = await render(
    PasswordResetTemplate({
      firstName: params.firstName,
      resetUrl,
    })
  );

  return sendEmail({
    to: params.to,
    subject: 'Reset your Liftout password',
    html,
    tags: [{ name: 'category', value: 'password-reset' }],
  });
}

/**
 * Send team invitation email
 */
export async function sendTeamInvitationEmail(params: {
  to: string;
  firstName: string;
  inviterName: string;
  teamName: string;
  role: string;
  personalMessage?: string;
  expiresIn?: string;
}): Promise<EmailResult> {
  // The invitee is already a user, so we link to the dashboard where they can accept
  const invitationUrl = `${APP_URL}/app/teams`;

  const html = await render(
    TeamInvitationTemplate({
      inviterName: params.inviterName,
      teamName: params.teamName,
      invitationUrl,
      personalMessage: params.personalMessage,
      expiresIn: params.expiresIn || '7 days',
    })
  );

  return sendEmail({
    to: params.to,
    subject: `${params.inviterName} invited you to join ${params.teamName} on Liftout`,
    html,
    tags: [{ name: 'category', value: 'team-invitation' }],
  });
}

/**
 * Send welcome email after registration
 */
export async function sendWelcomeEmail(params: {
  to: string;
  firstName: string;
  userType: 'individual' | 'company';
}): Promise<EmailResult> {
  const dashboardUrl = `${APP_URL}/app/dashboard`;

  const html = await render(
    WelcomeTemplate({
      firstName: params.firstName,
      userType: params.userType,
      dashboardUrl,
    })
  );

  return sendEmail({
    to: params.to,
    subject: 'Welcome to Liftout - Let\'s get started!',
    html,
    tags: [{ name: 'category', value: 'welcome' }],
  });
}

/**
 * Send application status update email
 */
export async function sendApplicationStatusEmail(params: {
  to: string;
  firstName: string;
  teamName: string;
  opportunityTitle: string;
  companyName: string;
  status: 'reviewing' | 'interviewing' | 'accepted' | 'rejected';
  message?: string;
}): Promise<EmailResult> {
  const applicationsUrl = `${APP_URL}/app/applications`;

  const html = await render(
    ApplicationStatusTemplate({
      teamName: params.teamName,
      opportunityTitle: params.opportunityTitle,
      companyName: params.companyName,
      newStatus: params.status,
      message: params.message,
      applicationsUrl,
    })
  );

  const statusText = params.status === 'accepted'
    ? 'Great news!'
    : params.status === 'rejected'
      ? 'Update on your application'
      : 'Application status update';

  return sendEmail({
    to: params.to,
    subject: `${statusText} - ${params.opportunityTitle} at ${params.companyName}`,
    html,
    tags: [{ name: 'category', value: 'application-status' }],
  });
}

/**
 * Send new message notification email
 */
export async function sendNewMessageEmail(params: {
  to: string;
  senderName: string;
  conversationSubject: string;
  messagePreview: string;
  conversationId: string;
}): Promise<EmailResult> {
  const conversationUrl = `${APP_URL}/app/messages?id=${params.conversationId}`;

  const html = await render(
    NewMessageTemplate({
      senderName: params.senderName,
      conversationSubject: params.conversationSubject,
      messagePreview: params.messagePreview,
      conversationUrl,
    })
  );

  return sendEmail({
    to: params.to,
    subject: `New message from ${params.senderName}: ${params.conversationSubject}`,
    html,
    tags: [{ name: 'category', value: 'new-message' }],
  });
}

// Export all templates for preview
export * from './templates/verify-email';
export * from './templates/password-reset';
export * from './templates/team-invitation';
export * from './templates/welcome';
export * from './templates/application-status';
export * from './templates/new-message';
