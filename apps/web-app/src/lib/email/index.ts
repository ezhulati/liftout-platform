import { Resend } from 'resend';

// Lazy-initialize Resend client to avoid build-time errors
let resendClient: Resend | null = null;
const getResend = () => {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured - emails will be skipped');
      return null;
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
};

// From email address - use a verified domain in production
const FROM_EMAIL = process.env.EMAIL_FROM || 'Liftout <noreply@liftout.com>';
const APP_URL = process.env.NEXTAUTH_URL || 'https://liftout.netlify.app';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================
// TEAM INVITATION EMAILS
// ============================================

export async function sendTeamInvitationEmail(params: {
  to: string;
  inviterName: string;
  teamName: string;
  invitationId: string;
  message?: string;
}): Promise<EmailResult> {
  const { to, inviterName, teamName, invitationId, message } = params;
  const invitationUrl = `${APP_URL}/app/invitations/${invitationId}`;

  try {
    const resend = getResend();
    if (!resend) {
      console.log(`[Email skipped] Team invitation to ${to}`);
      return { success: true, messageId: 'skipped-no-api-key' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${inviterName} invited you to join ${teamName} on Liftout`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                <strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> on Liftout.
              </p>
              ${message ? `
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
                  <p style="font-style: italic; margin: 0; color: #555;">"${message}"</p>
                </div>
              ` : ''}
              <p style="font-size: 14px; color: #666; margin-bottom: 25px;">
                Liftout is a platform that connects high-performing teams with companies looking to acquire proven talent. By joining this team, you'll be part of a group that can explore new opportunities together.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  View Invitation
                </a>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
                This invitation expires in 7 days. If you didn't expect this email, you can safely ignore it.
              </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Liftout. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send team invitation email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending team invitation email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================
// APPLICATION STATUS EMAILS
// ============================================

export async function sendApplicationStatusEmail(params: {
  to: string;
  recipientName: string;
  teamName: string;
  opportunityTitle: string;
  companyName: string;
  status: 'submitted' | 'reviewing' | 'interviewing' | 'accepted' | 'rejected';
  message?: string;
  applicationId: string;
}): Promise<EmailResult> {
  const { to, recipientName, teamName, opportunityTitle, companyName, status, message, applicationId } = params;
  const applicationUrl = `${APP_URL}/app/applications/${applicationId}`;

  const statusConfig = {
    submitted: {
      subject: `Application submitted for ${opportunityTitle}`,
      heading: 'Application Received',
      color: '#3b82f6',
      body: `Your team "${teamName}" has successfully submitted an application for the ${opportunityTitle} opportunity at ${companyName}.`
    },
    reviewing: {
      subject: `${companyName} is reviewing your application`,
      heading: 'Application Under Review',
      color: '#f59e0b',
      body: `Great news! ${companyName} has started reviewing "${teamName}'s" application for the ${opportunityTitle} position.`
    },
    interviewing: {
      subject: `Interview scheduled for ${opportunityTitle}`,
      heading: 'Interview Stage',
      color: '#8b5cf6',
      body: `Congratulations! ${companyName} would like to interview "${teamName}" for the ${opportunityTitle} opportunity.`
    },
    accepted: {
      subject: `Congratulations! Your application was accepted`,
      heading: 'Application Accepted!',
      color: '#10b981',
      body: `Amazing news! ${companyName} has accepted "${teamName}'s" application for the ${opportunityTitle} position. This is a major milestone in your liftout journey.`
    },
    rejected: {
      subject: `Update on your application to ${companyName}`,
      heading: 'Application Update',
      color: '#6b7280',
      body: `Thank you for "${teamName}'s" interest in the ${opportunityTitle} opportunity at ${companyName}. After careful consideration, they've decided to move forward with other candidates.`
    }
  };

  const config = statusConfig[status];

  try {
    const resend = getResend();
    if (!resend) {
      console.log(`[Email skipped] Application status to ${to}`);
      return { success: true, messageId: 'skipped-no-api-key' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: config.subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: ${config.color}; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">${config.heading}</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px;">Hi ${recipientName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">${config.body}</p>
              ${message ? `
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${config.color}; margin-bottom: 20px;">
                  <p style="font-weight: 600; margin: 0 0 10px 0; color: #555;">Message from ${companyName}:</p>
                  <p style="margin: 0; color: #666;">${message}</p>
                </div>
              ` : ''}
              <div style="text-align: center; margin: 30px 0;">
                <a href="${applicationUrl}" style="display: inline-block; background: ${config.color}; color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  View Application
                </a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Liftout. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send application status email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending application status email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================
// NEW MESSAGE NOTIFICATION EMAIL
// ============================================

export async function sendNewMessageEmail(params: {
  to: string;
  recipientName: string;
  senderName: string;
  messagePreview: string;
  conversationId: string;
  conversationSubject?: string;
}): Promise<EmailResult> {
  const { to, recipientName, senderName, messagePreview, conversationId, conversationSubject } = params;
  const conversationUrl = `${APP_URL}/app/messages?conversation=${conversationId}`;

  try {
    const resend = getResend();
    if (!resend) {
      console.log(`[Email skipped] New message to ${to}`);
      return { success: true, messageId: 'skipped-no-api-key' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `New message from ${senderName}${conversationSubject ? `: ${conversationSubject}` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1f2937; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Message</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px;">Hi ${recipientName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                You have a new message from <strong>${senderName}</strong> on Liftout.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #1f2937; margin-bottom: 20px;">
                <p style="margin: 0; color: #555;">${messagePreview.length > 200 ? messagePreview.slice(0, 200) + '...' : messagePreview}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${conversationUrl}" style="display: inline-block; background: #1f2937; color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  View Conversation
                </a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>You're receiving this because you have email notifications enabled.</p>
              <p>&copy; ${new Date().getFullYear()} Liftout. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send new message email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending new message email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================
// EXPRESSION OF INTEREST EMAIL
// ============================================

export async function sendExpressionOfInterestEmail(params: {
  to: string;
  recipientName: string;
  interestedPartyName: string;
  interestedPartyType: 'team' | 'company';
  targetName: string;
  message?: string;
  interestId: string;
}): Promise<EmailResult> {
  const { to, recipientName, interestedPartyName, interestedPartyType, targetName, message, interestId } = params;
  const interestUrl = `${APP_URL}/app/interests/${interestId}`;

  const isCompanyInterested = interestedPartyType === 'company';
  const subject = isCompanyInterested
    ? `${interestedPartyName} is interested in ${targetName}`
    : `${interestedPartyName} is interested in your opportunity`;

  try {
    const resend = getResend();
    if (!resend) {
      console.log(`[Email skipped] Expression of interest to ${to}`);
      return { success: true, messageId: 'skipped-no-api-key' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Interest!</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px;">Hi ${recipientName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                Great news! <strong>${interestedPartyName}</strong> has expressed interest in ${isCompanyInterested ? `your team "${targetName}"` : 'your liftout opportunity'}.
              </p>
              ${message ? `
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
                  <p style="font-weight: 600; margin: 0 0 10px 0; color: #555;">Their message:</p>
                  <p style="margin: 0; color: #666;">${message}</p>
                </div>
              ` : ''}
              <p style="font-size: 14px; color: #666; margin-bottom: 25px;">
                This could be the start of a great liftout opportunity. Review the details and respond to move the conversation forward.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${interestUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  View Details
                </a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Liftout. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send expression of interest email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending expression of interest email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================
// PASSWORD RESET EMAIL
// ============================================

export async function sendPasswordResetEmail(params: {
  to: string;
  recipientName: string;
  resetToken: string;
}): Promise<EmailResult> {
  const { to, recipientName, resetToken } = params;
  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`;

  try {
    const resend = getResend();
    if (!resend) {
      console.log(`[Email skipped] Password reset to ${to}`);
      return { success: true, messageId: 'skipped-no-api-key' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Reset your Liftout password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #dc2626; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px;">Hi ${recipientName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: #dc2626; color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 25px;">
                This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </p>
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                If the button doesn't work, copy and paste this URL into your browser:<br>
                <span style="color: #666; word-break: break-all;">${resetUrl}</span>
              </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Liftout. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending password reset email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================
// EMAIL VERIFICATION EMAIL
// ============================================

export async function sendVerificationEmail(params: {
  to: string;
  recipientName: string;
  verificationToken: string;
}): Promise<EmailResult> {
  const { to, recipientName, verificationToken } = params;
  const verifyUrl = `${APP_URL}/auth/verify-email?token=${verificationToken}`;

  try {
    const resend = getResend();
    if (!resend) {
      console.log(`[Email skipped] Verification to ${to}`);
      return { success: true, messageId: 'skipped-no-api-key' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Verify your Liftout email address',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Liftout!</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px;">Hi ${recipientName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thanks for signing up! Please verify your email address to get started with Liftout.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 25px;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Liftout. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending verification email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================
// WELCOME EMAIL
// ============================================

export async function sendWelcomeEmail(params: {
  to: string;
  recipientName: string;
  userType: 'individual' | 'company';
}): Promise<EmailResult> {
  const { to, recipientName, userType } = params;
  const dashboardUrl = `${APP_URL}/app/dashboard`;

  const isTeamUser = userType === 'individual';

  try {
    const resend = getResend();
    if (!resend) {
      console.log(`[Email skipped] Welcome to ${to}`);
      return { success: true, messageId: 'skipped-no-api-key' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to Liftout, ${recipientName}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Liftout!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">The platform for strategic team acquisition</p>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px;">Hi ${recipientName},</p>
              <p style="font-size: 16px; margin-bottom: 25px;">
                ${isTeamUser
                  ? "We're excited to have you join Liftout! You're now part of a platform that connects high-performing teams with companies looking for proven talent."
                  : "Welcome to Liftout! You now have access to a curated marketplace of high-performing teams ready for their next chapter."
                }
              </p>

              <h2 style="font-size: 18px; color: #333; margin-bottom: 15px;">Get Started:</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                ${isTeamUser ? `
                  <p style="margin: 0 0 10px 0;"><strong>1.</strong> Complete your profile to stand out</p>
                  <p style="margin: 0 0 10px 0;"><strong>2.</strong> Create or join a team</p>
                  <p style="margin: 0 0 10px 0;"><strong>3.</strong> Browse liftout opportunities</p>
                  <p style="margin: 0;"><strong>4.</strong> Apply to opportunities that match your team</p>
                ` : `
                  <p style="margin: 0 0 10px 0;"><strong>1.</strong> Set up your company profile</p>
                  <p style="margin: 0 0 10px 0;"><strong>2.</strong> Post your first liftout opportunity</p>
                  <p style="margin: 0 0 10px 0;"><strong>3.</strong> Browse verified teams</p>
                  <p style="margin: 0;"><strong>4.</strong> Express interest in teams that match your needs</p>
                `}
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Go to Dashboard
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 25px;">
                Need help? Reply to this email or visit our help center. We're here to support your liftout journey.
              </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Liftout. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending welcome email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================
// ACCOUNT DELETION CONFIRMATION EMAIL
// ============================================

export async function sendAccountDeletionEmail(params: {
  to: string;
  recipientName: string;
}): Promise<EmailResult> {
  const { to, recipientName } = params;

  try {
    const resend = getResend();
    if (!resend) {
      console.log(`[Email skipped] Account deletion to ${to}`);
      return { success: true, messageId: 'skipped-no-api-key' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Your Liftout account has been deleted',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #6b7280; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Account Deleted</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px;">Hi ${recipientName},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                This email confirms that your Liftout account has been successfully deleted as requested.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #333;">What's been removed:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #666;">
                  <li>Your profile information</li>
                  <li>Team memberships</li>
                  <li>Application history</li>
                  <li>Messages and conversations</li>
                  <li>All associated data</li>
                </ul>
              </div>
              <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                If you didn't request this deletion or believe this was done in error, please contact our support team immediately.
              </p>
              <p style="font-size: 14px; color: #666;">
                We're sorry to see you go. If you ever want to return, you're welcome to create a new account at any time.
              </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Liftout. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send account deletion email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending account deletion email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Export all functions
export const emailService = {
  sendTeamInvitationEmail,
  sendApplicationStatusEmail,
  sendNewMessageEmail,
  sendExpressionOfInterestEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendAccountDeletionEmail,
};
