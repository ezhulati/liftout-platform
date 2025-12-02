import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Contact form recipient
const CONTACT_EMAIL = 'enrizhulati@gmail.com';
const FROM_EMAIL = process.env.EMAIL_FROM || process.env.EMAIL_FROM_ADDRESS || 'Liftout <noreply@liftout.com>';

// Initialize Resend lazily to avoid build-time errors
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  inquiryType: string;
  subject: string;
  message: string;
}

const inquiryTypeLabels: Record<string, string> = {
  company: 'Company looking to acquire teams',
  team: 'Team exploring opportunities',
  general: 'General inquiry',
  partnership: 'Partnership opportunity',
  press: 'Press & media',
};

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email to contact recipient
    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: data.email,
      subject: `[Liftout Contact] ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1e3a5f; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 140px;">Name:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                    <a href="mailto:${data.email}" style="color: #1e3a5f;">${data.email}</a>
                  </td>
                </tr>
                ${data.company ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Company:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.company}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Inquiry Type:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${inquiryTypeLabels[data.inquiryType] || data.inquiryType}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Subject:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.subject}</td>
                </tr>
              </table>

              <div style="margin-top: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #1e3a5f;">Message:</h3>
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #1e3a5f;">
                  <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
                </div>
              </div>

              <div style="margin-top: 25px; text-align: center;">
                <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}"
                   style="display: inline-block; background: #1e3a5f; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
                  Reply to ${data.name}
                </a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>This email was sent from the Liftout contact form.</p>
              <p>Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send contact email:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error processing contact form:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
