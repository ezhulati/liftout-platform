import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendReferenceRequestEmail, sendReferenceFollowUpEmail } from '@/lib/email';
import { z } from 'zod';

const referenceRequestSchema = z.object({
  referenceName: z.string().min(1),
  referenceEmail: z.string().email(),
  teamName: z.string().min(1),
  teamLeadName: z.string().min(1),
  companyName: z.string().min(1),
  message: z.string().optional(),
});

const followUpSchema = z.object({
  referenceId: z.string().uuid(),
  referenceName: z.string().min(1),
  referenceEmail: z.string().email(),
  teamName: z.string().min(1),
  teamLeadName: z.string().min(1),
  companyName: z.string().min(1),
  daysSinceRequest: z.number().min(1),
});

// POST - Send a reference request email
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'follow_up') {
      // Handle follow-up request
      const parsed = followUpSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid request', details: parsed.error.errors },
          { status: 400 }
        );
      }

      const { referenceId, referenceName, referenceEmail, teamName, teamLeadName, companyName, daysSinceRequest } = parsed.data;

      const result = await sendReferenceFollowUpEmail({
        to: referenceEmail,
        referenceName,
        teamName,
        teamLeadName,
        companyName,
        referenceId,
        daysSinceRequest,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to send follow-up email' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'Follow-up email sent successfully',
      });
    }

    // Handle initial reference request
    const parsed = referenceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { referenceName, referenceEmail, teamName, teamLeadName, companyName, message } = parsed.data;

    // Generate a reference ID (in production, this would be stored in the database)
    const referenceId = crypto.randomUUID();

    const result = await sendReferenceRequestEmail({
      to: referenceEmail,
      referenceName,
      teamName,
      teamLeadName,
      companyName,
      referenceId,
      message,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send reference request email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      referenceId,
      messageId: result.messageId,
      message: 'Reference request sent successfully',
    });
  } catch (error) {
    console.error('Reference request error:', error);
    return NextResponse.json(
      { error: 'Failed to process reference request' },
      { status: 500 }
    );
  }
}
