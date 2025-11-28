// Stub email functions - replace with actual implementation later
import { logger } from '../utils/logger';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendVerificationEmail(params: {
  to: string;
  firstName: string;
  verificationToken: string;
}): Promise<EmailResult> {
  logger.info(`[EMAIL STUB] Send verification email to ${params.to}`);
  return { success: true, messageId: 'stub' };
}

export async function sendPasswordResetEmail(params: {
  to: string;
  firstName: string;
  resetToken: string;
}): Promise<EmailResult> {
  logger.info(`[EMAIL STUB] Send password reset email to ${params.to}`);
  return { success: true, messageId: 'stub' };
}

export async function sendWelcomeEmail(params: {
  to: string;
  firstName: string;
  userType: 'individual' | 'company';
}): Promise<EmailResult> {
  logger.info(`[EMAIL STUB] Send welcome email to ${params.to}`);
  return { success: true, messageId: 'stub' };
}

export async function sendTeamInvitationEmail(params: {
  to: string;
  firstName: string;
  inviterName: string;
  teamName: string;
  role: string;
  personalMessage?: string;
  expiresIn?: string;
}): Promise<EmailResult> {
  logger.info(`[EMAIL STUB] Send team invitation email to ${params.to} for team ${params.teamName}`);
  return { success: true, messageId: 'stub' };
}

export async function sendApplicationStatusEmail(params: {
  to: string;
  firstName: string;
  teamName: string;
  opportunityTitle: string;
  companyName: string;
  status: 'reviewing' | 'interviewing' | 'accepted' | 'rejected';
  message?: string;
}): Promise<EmailResult> {
  logger.info(`[EMAIL STUB] Send application status (${params.status}) email to ${params.to}`);
  return { success: true, messageId: 'stub' };
}

export async function sendNewMessageEmail(params: {
  to: string;
  senderName: string;
  conversationSubject: string;
  messagePreview: string;
  conversationId: string;
}): Promise<EmailResult> {
  logger.info(`[EMAIL STUB] Send new message notification to ${params.to}`);
  return { success: true, messageId: 'stub' };
}
