import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { InterestStatus } from '@prisma/client';

// POST /api/applications/eoi/[eoiId]/respond - Respond to an expression of interest
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eoiId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { eoiId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { response, message } = body;

    if (!response || !['accepted', 'declined'].includes(response)) {
      return NextResponse.json(
        { error: 'Response must be "accepted" or "declined"' },
        { status: 400 }
      );
    }

    // Find the EOI
    const eoi = await prisma.expressionOfInterest.findUnique({
      where: { id: eoiId },
    });

    if (!eoi) {
      return NextResponse.json(
        { error: 'Expression of interest not found' },
        { status: 404 }
      );
    }

    // Verify user is the recipient (toId)
    if (eoi.toId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Map response to status
    const newStatus = response === 'accepted'
      ? InterestStatus.accepted
      : InterestStatus.declined;

    // Update the EOI
    const updated = await prisma.expressionOfInterest.update({
      where: { id: eoiId },
      data: {
        status: newStatus,
        respondedAt: new Date(),
        metadata: {
          ...(typeof eoi.metadata === 'object' ? eoi.metadata : {}),
          responseMessage: message,
          respondedBy: session.user.id,
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // If accepted, optionally create a conversation
    if (response === 'accepted') {
      // Create a conversation between the parties
      await prisma.conversation.create({
        data: {
          subject: `Follow-up on Expression of Interest`,
          interestId: eoiId,
          participants: {
            create: [
              { userId: eoi.fromId, role: 'participant' },
              { userId: eoi.toId, role: 'participant' },
            ],
          },
        },
      });
    }

    return NextResponse.json({
      eoi: {
        id: updated.id,
        status: updated.status,
        respondedAt: updated.respondedAt?.toISOString(),
        sender: {
          id: updated.sender.id,
          name: `${updated.sender.firstName || ''} ${updated.sender.lastName || ''}`.trim() || updated.sender.email,
        },
      },
      message: `Expression of interest ${response}`,
    });
  } catch (error) {
    console.error('Error responding to EOI:', error);
    return NextResponse.json(
      { error: 'Failed to respond to expression of interest', details: String(error) },
      { status: 500 }
    );
  }
}
