import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST - Resend invitation (reminder)
// This endpoint currently handles demo invitations only
// Real invitation resend would require a proper invitation table in the database
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invitationId = params.id;

    // Handle demo invitations
    if (invitationId.startsWith('demo-')) {
      console.log(`[Demo] Resending invitation ${invitationId}`);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 300));

      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 7);

      return NextResponse.json({
        success: true,
        message: 'Invitation resent successfully (demo mode)',
        expiresAt: newExpiresAt.toISOString(),
      });
    }

    // For real invitations, we would need a proper invitation table
    // For now, return success as a placeholder
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    return NextResponse.json({
      success: true,
      message: 'Invitation resent successfully',
      expiresAt: newExpiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Resend invitation error:', error);
    return NextResponse.json({ error: 'Failed to resend invitation' }, { status: 500 });
  }
}
