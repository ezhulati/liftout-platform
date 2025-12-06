import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get attachments for a conversation with download URLs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get('attachmentId');

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: id,
        userId: session.user.id,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
    }

    // Get messages with attachments
    const messages = await prisma.message.findMany({
      where: {
        conversationId: id,
        attachments: { not: '[]' },
      },
      select: {
        id: true,
        attachments: true,
        createdAt: true,
        sender: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse and collect all attachments
    const allAttachments: Array<{
      id: string;
      messageId: string;
      name: string;
      type: string;
      size: number;
      url: string;
      uploadedBy: string;
      uploadedAt: string;
    }> = [];

    for (const message of messages) {
      const attachments = message.attachments as Array<{
        id?: string;
        name: string;
        type?: string;
        size?: number;
        url: string;
      }>;

      if (Array.isArray(attachments)) {
        for (const attachment of attachments) {
          allAttachments.push({
            id: attachment.id || `${message.id}-${attachment.name}`,
            messageId: message.id,
            name: attachment.name,
            type: attachment.type || 'application/octet-stream',
            size: attachment.size || 0,
            url: attachment.url,
            uploadedBy: message.sender ? `${message.sender.firstName} ${message.sender.lastName}`.trim() : 'Unknown',
            uploadedAt: message.createdAt.toISOString(),
          });
        }
      }
    }

    // If specific attachment requested, return download info
    if (attachmentId) {
      const attachment = allAttachments.find(
        (a) => a.id === attachmentId || a.name === attachmentId
      );

      if (!attachment) {
        return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
      }

      // In a real implementation, you might generate a signed URL here
      return NextResponse.json({
        attachment,
        downloadUrl: attachment.url,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      });
    }

    return NextResponse.json({
      attachments: allAttachments,
      total: allAttachments.length,
    });
  } catch (error) {
    console.error('Get attachments error:', error);
    return NextResponse.json(
      { error: 'Failed to get attachments' },
      { status: 500 }
    );
  }
}
